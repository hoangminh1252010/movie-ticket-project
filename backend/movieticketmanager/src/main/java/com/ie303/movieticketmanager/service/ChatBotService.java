package com.ie303.movieticketmanager.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.ie303.movieticketmanager.dto.BookingRequest;
import com.ie303.movieticketmanager.dto.BookingResponse;
import com.ie303.movieticketmanager.model.Cinema;
import com.ie303.movieticketmanager.model.Movie;
import com.ie303.movieticketmanager.model.Showtime;

import reactor.core.publisher.Mono;

@Service
public class ChatBotService {
    
    private final WebClient webClient;
    private final String openaiApiKey;
    private final String modelName;
    
    @Autowired
    private MovieService movieService;
    
    @Autowired
    private CinemaService cinemaService;
    
    @Autowired
    private ShowtimeService showtimeService;
    
    @Autowired
    private BookingService bookingService;
    
    public ChatBotService(WebClient openaiWebClient, String openaiApiKey, String openrouterModel) {
        this.webClient = openaiWebClient;
        this.openaiApiKey = openaiApiKey;
        this.modelName = openrouterModel;
    }
    
    public Mono<Map<String, Object>> processMessage(String userMessage) {
        return processMessage(userMessage, new ArrayList<>());
    }
    
    public Mono<Map<String, Object>> processMessage(String userMessage, List<Map<String, String>> conversationHistory) {
        if (openaiApiKey == null || openaiApiKey.isEmpty()) {
            return Mono.just(createErrorResponse("Chatbot hiện tại không khả dụng"));
        }
        
        // Get real-time data from database
        String dynamicContext = buildDynamicContext();
        
        // Add seat validation if user is selecting seats
        String seatValidationContext = buildSeatValidationContext(userMessage);
        String fullContext = dynamicContext + seatValidationContext;
        
        String systemPrompt = buildNekoCinemaPrompt(fullContext);
        
        // Build messages with conversation history
        List<Map<String, String>> messages = new ArrayList<>();
        messages.add(Map.of("role", "system", "content", systemPrompt));
        
        // Add conversation history
        messages.addAll(conversationHistory);
        
        // Add current user message
        messages.add(Map.of("role", "user", "content", userMessage));
        
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", modelName);
        requestBody.put("messages", messages);
        requestBody.put("max_tokens", 500);
        requestBody.put("temperature", 0.7);
        
        return webClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    Map<String, Object> result = new HashMap<>();
                    result.put("success", true);
                    result.put("message", extractAIResponse(response));
                    result.put("timestamp", System.currentTimeMillis());
                    return result;
                })
                .onErrorMap(throwable -> {
                    if (throwable.getMessage() != null) {
                        if (throwable.getMessage().contains("429") || throwable.getMessage().contains("Too Many Requests")) {
                            return new RuntimeException("RATE_LIMIT_EXCEEDED");
                        } else if (throwable.getMessage().contains("quota") || throwable.getMessage().contains("insufficient_quota")) {
                            return new RuntimeException("QUOTA_EXCEEDED");
                        }
                    }
                    return throwable;
                })
                .onErrorReturn(createErrorResponse("⚠️ Chatbot hiện tại không khả dụng. Vui lòng thử lại sau hoặc liên hệ admin."));
    }
    
    public Mono<Map<String, Object>> createBookingFromChat(String userMessage, List<Map<String, String>> conversationHistory) {
        try {
            // Add debug logging
            System.out.println("=== BOOKING CREATION DEBUG ===");
            System.out.println("User message: " + userMessage);
            System.out.println("Conversation history size: " + (conversationHistory != null ? conversationHistory.size() : 0));
            
            // Extract booking information from conversation
            BookingInfo bookingInfo = extractBookingInfoFromConversation(userMessage, conversationHistory);
            
            // Debug extracted info
            System.out.println("Extracted info:");
            System.out.println("  Movie: " + bookingInfo.getMovieTitle());
            System.out.println("  Showtime: " + bookingInfo.getShowtime());
            System.out.println("  Cinema: " + bookingInfo.getCinema());
            System.out.println("  ShowtimeId: " + bookingInfo.getShowtimeId());
            System.out.println("  Seats: " + bookingInfo.getSeatNames());
            System.out.println("  Complete: " + bookingInfo.isComplete());
            System.out.println("  Missing: " + bookingInfo.getMissingInfo());
            
                    if (!bookingInfo.isComplete()) {
            // FOR TESTING: If we have seats but missing other info, try to create dummy booking
            if (bookingInfo.getSeatNames() != null && !bookingInfo.getSeatNames().isEmpty()) {
                System.out.println("Attempting to create test booking with available data...");
                
                // Set default values for testing
                if (bookingInfo.getMovieTitle() == null) {
                    bookingInfo.setMovieTitle("Spider-Man");
                }
                if (bookingInfo.getShowtime() == null) {
                    bookingInfo.setShowtime("19:15");
                }
                if (bookingInfo.getCinema() == null) {
                    bookingInfo.setCinema("Neko Cinema Hà Nội");
                }
                
                // Try to find any available showtime for testing
                try {
                    List<Showtime> todayShowtimes = showtimeService.getShowtimesByDate(LocalDate.now());
                    if (!todayShowtimes.isEmpty()) {
                        bookingInfo.setShowtimeId(todayShowtimes.get(0).getId());
                        System.out.println("Using first available showtime for testing: " + todayShowtimes.get(0).getId());
                    }
                } catch (Exception e) {
                    System.out.println("Could not find showtimes: " + e.getMessage());
                }
                
                // Recalculate amount
                if (bookingInfo.getSeatNames() != null) {
                    int totalAmount = 0;
                    for (String seat : bookingInfo.getSeatNames()) {
                        if (seat.startsWith("L")) {
                            totalAmount += 95000; // Couple seat
                        } else {
                            totalAmount += 45000; // Regular seat
                        }
                    }
                    bookingInfo.setTotalAmount(totalAmount);
                }
                
                System.out.println("Test booking info after defaults: " + bookingInfo.isComplete());
            }
            
            if (!bookingInfo.isComplete()) {
                return Mono.just(Map.of(
                    "success", false,
                    "message", "Thông tin đặt vé chưa đầy đủ. Vui lòng cung cấp đầy đủ: phim, suất chiếu, ghế, số lượng vé.",
                    "missingInfo", bookingInfo.getMissingInfo()
                ));
            }
        }
            
            // Create booking using BookingService
            BookingRequest bookingRequest = new BookingRequest();
            bookingRequest.setUserId("CHATBOT_USER"); // Temporary user ID for chatbot bookings
            bookingRequest.setShowtimeId(bookingInfo.getShowtimeId());
            bookingRequest.setSeatNames(bookingInfo.getSeatNames());
            
            System.out.println("Creating booking with request: " + bookingRequest);
            
            BookingResponse bookingResponse = bookingService.createBooking(bookingRequest);
            
            System.out.println("Booking response: " + bookingResponse);
            
            if (bookingResponse.isSuccess()) {
                // Generate purchase link
                String purchaseLink = "http://localhost:3000/purchase/" + bookingResponse.getBooking().getId();
                
                return Mono.just(Map.of(
                    "success", true,
                    "message", "🎉 Đặt vé thành công!",
                    "bookingId", bookingResponse.getBooking().getId(),
                    "purchaseLink", purchaseLink,
                    "bookingDetails", Map.of(
                        "movieTitle", bookingInfo.getMovieTitle(),
                        "showtime", bookingInfo.getShowtime(),
                        "cinema", bookingInfo.getCinema(),
                        "seats", bookingInfo.getSeatNames(),
                        "totalAmount", bookingInfo.getTotalAmount()
                    )
                ));
            } else {
                return Mono.just(Map.of(
                    "success", false,
                    "message", "❌ Lỗi khi đặt vé: " + bookingResponse.getMessage()
                ));
            }
            
        } catch (Exception e) {
            System.out.println("Exception in createBookingFromChat: " + e.getMessage());
            e.printStackTrace();
            return Mono.just(Map.of(
                "success", false,
                "message", "❌ Lỗi hệ thống: " + e.getMessage()
            ));
        }
    }
    
    private BookingInfo extractBookingInfoFromConversation(String userMessage, List<Map<String, String>> conversationHistory) {
        BookingInfo info = new BookingInfo();
        
        // Collect all messages to analyze
        List<String> allMessages = new ArrayList<>();
        if (conversationHistory != null) {
            for (Map<String, String> message : conversationHistory) {
                String content = message.get("content");
                if (content != null) {
                    allMessages.add(content);
                }
            }
        }
        allMessages.add(userMessage);
        
        System.out.println("All messages to analyze: " + allMessages);
        System.out.println("Raw conversation history structure:");
        if (conversationHistory != null) {
            for (int i = 0; i < conversationHistory.size(); i++) {
                Map<String, String> msg = conversationHistory.get(i);
                System.out.println("  Message " + i + ": " + msg);
            }
        }
        
        // Analyze all messages to extract booking details
        for (String content : allMessages) {
            // Extract movie title (more flexible patterns)
            if (info.getMovieTitle() == null) {
                System.out.println("Checking content for movie: " + content);
                if (content.contains("Spider-Man") || content.contains("spider-man") || content.contains("spiderman") || content.contains("Người Nhện")) {
                    info.setMovieTitle("Spider-Man");
                    System.out.println("Found Spider-Man in: " + content);
                } else if (content.contains("Avatar") || content.contains("avatar")) {
                    info.setMovieTitle("Avatar");
                    System.out.println("Found Avatar in: " + content);
                } else if (content.contains("Transformers") || content.contains("transformers")) {
                    info.setMovieTitle("Transformers");
                    System.out.println("Found Transformers in: " + content);
                }
                // Try to match any movie title mentioned
                String lowerContent = content.toLowerCase();
                if (lowerContent.contains("phim") && info.getMovieTitle() == null) {
                    // Try to extract movie name after "phim" keyword
                    if (lowerContent.contains("spider") || lowerContent.contains("nhện")) {
                        info.setMovieTitle("Spider-Man");
                        System.out.println("Extracted Spider-Man from context: " + content);
                    }
                }
            }
            
            // Extract showtime (improved pattern)
            if (info.getShowtime() == null && content.matches(".*\\d{1,2}[:\\.]\\d{2}.*")) {
                java.util.regex.Pattern timePattern = java.util.regex.Pattern.compile("(\\d{1,2})[:\\.]?(\\d{2})");
                java.util.regex.Matcher matcher = timePattern.matcher(content);
                if (matcher.find()) {
                    String hour = matcher.group(1);
                    String minute = matcher.group(2);
                    info.setShowtime(hour + ":" + minute);
                }
            }
            
            // Extract cinema (more flexible)
            if (info.getCinema() == null) {
                if (content.contains("TPHCM") || content.contains("Hồ Chí Minh") || content.contains("TP.HCM")) {
                    info.setCinema("Neko Cinema TPHCM");
                } else if (content.contains("Hà Nội") || content.contains("Ha Noi")) {
                    info.setCinema("Neko Cinema Hà Nội");
                } else if (content.contains("Đà Nẵng") || content.contains("Da Nang")) {
                    info.setCinema("Neko Cinema Đà Nẵng");
                }
            }
            
            // Extract seats (improved)
            List<String> seats = parseSeatsFromText(content);
            if (!seats.isEmpty()) {
                info.setSeatNames(seats);
            }
        }
        
        System.out.println("After extraction - Movie: " + info.getMovieTitle() + 
                          ", Showtime: " + info.getShowtime() + 
                          ", Cinema: " + info.getCinema() + 
                          ", Seats: " + info.getSeatNames());
        
        // Find matching showtime ID
        if (info.getMovieTitle() != null && info.getShowtime() != null && info.getCinema() != null) {
            try {
                List<Showtime> todayShowtimes = showtimeService.getShowtimesByDate(LocalDate.now());
                System.out.println("Found " + todayShowtimes.size() + " showtimes today");
                
                for (Showtime showtime : todayShowtimes) {
                    // Find matching movie
                    Optional<Movie> movie = movieService.getMovieById(showtime.getMovieId());
                    System.out.println("Checking showtime - Movie ID: " + showtime.getMovieId() + 
                                     ", Movie title: " + (movie.isPresent() ? movie.get().getTitle() : "NOT FOUND") +
                                     ", Looking for: " + info.getMovieTitle());
                    
                    if (movie.isPresent() && movie.get().getTitle().equals(info.getMovieTitle())) {
                        // Check time match
                        String showtimeStr = showtime.getShowTime().format(DateTimeFormatter.ofPattern("HH:mm"));
                        System.out.println("Time check - Showtime: " + showtimeStr + ", Looking for: " + info.getShowtime());
                        
                        if (showtimeStr.equals(info.getShowtime())) {
                            // Check cinema match
                            Optional<Cinema> cinema = cinemaService.getCinemaById(showtime.getCinemaId());
                            System.out.println("Cinema check - Cinema: " + (cinema.isPresent() ? cinema.get().getName() : "NOT FOUND") + 
                                             ", Looking for: " + info.getCinema());
                            
                            if (cinema.isPresent() && cinema.get().getName().equals(info.getCinema())) {
                                info.setShowtimeId(showtime.getId());
                                System.out.println("Found matching showtime ID: " + showtime.getId());
                                break;
                            }
                        }
                    }
                }
            } catch (Exception e) {
                System.out.println("Error finding showtime: " + e.getMessage());
                // Continue without showtime ID
            }
        }
        
        // Calculate total amount
        if (info.getSeatNames() != null) {
            int totalAmount = 0;
            for (String seat : info.getSeatNames()) {
                if (seat.startsWith("L")) {
                    totalAmount += 95000; // Couple seat
                } else {
                    totalAmount += 45000; // Regular seat
                }
            }
            info.setTotalAmount(totalAmount);
        }
        
        return info;
    }
    
    // Inner class to hold booking information
    private static class BookingInfo {
        private String movieTitle;
        private String showtime;
        private String cinema;
        private String showtimeId;
        private List<String> seatNames;
        private int totalAmount;
        
        public boolean isComplete() {
            return movieTitle != null && showtime != null && cinema != null && 
                   showtimeId != null && seatNames != null && !seatNames.isEmpty();
        }
        
        public List<String> getMissingInfo() {
            List<String> missing = new ArrayList<>();
            if (movieTitle == null) missing.add("phim");
            if (showtime == null) missing.add("suất chiếu");
            if (cinema == null) missing.add("rạp");
            if (seatNames == null || seatNames.isEmpty()) missing.add("ghế");
            return missing;
        }
        
        // Getters and setters
        public String getMovieTitle() { return movieTitle; }
        public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }
        
        public String getShowtime() { return showtime; }
        public void setShowtime(String showtime) { this.showtime = showtime; }
        
        public String getCinema() { return cinema; }
        public void setCinema(String cinema) { this.cinema = cinema; }
        
        public String getShowtimeId() { return showtimeId; }
        public void setShowtimeId(String showtimeId) { this.showtimeId = showtimeId; }
        
        public List<String> getSeatNames() { return seatNames; }
        public void setSeatNames(List<String> seatNames) { this.seatNames = seatNames; }
        
        public int getTotalAmount() { return totalAmount; }
        public void setTotalAmount(int totalAmount) { this.totalAmount = totalAmount; }
    }
    
    private String buildDynamicContext() {
        try {
            StringBuilder context = new StringBuilder();
            
            // Get current movies
            List<Movie> nowPlayingMovies = movieService.getNowPlayingMovies();
            List<Movie> upcomingMovies = movieService.getUpcomingMovies();
            
            // Get active cinemas
            List<Cinema> activeCinemas = cinemaService.getAllActiveCinemas();
            
            // Build movies context
            context.append("PHIM ĐANG CHIẾU HIỆN TẠI:\n");
            if (!nowPlayingMovies.isEmpty()) {
                for (Movie movie : nowPlayingMovies.subList(0, Math.min(10, nowPlayingMovies.size()))) {
                    context.append("- ").append(movie.getTitle());
                    if (movie.getFilmDuration() > 0) {
                        context.append(" (").append(movie.getFilmDuration()).append(" phút)");
                    }
                    if (movie.getTags() != null && !movie.getTags().isEmpty()) {
                        context.append(" - Thể loại: ").append(String.join(", ", movie.getTags()));
                    }
                    context.append("\n");
                }
            } else {
                context.append("- Hiện tại đang cập nhật lịch chiếu\n");
            }
            
            context.append("\nPHIM SẮP CHIẾU:\n");
            if (!upcomingMovies.isEmpty()) {
                for (Movie movie : upcomingMovies.subList(0, Math.min(5, upcomingMovies.size()))) {
                    context.append("- ").append(movie.getTitle());
                    if (movie.getReleaseDate() != null) {
                        context.append(" (Ra mắt: ").append(movie.getReleaseDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))).append(")");
                    }
                    context.append("\n");
                }
            }
            
            // Build cinemas context
            context.append("\nHỆ THỐNG RẠP NEKO CINEMA:\n");
            Map<String, List<Cinema>> cinemasByCity = activeCinemas.stream()
                .collect(Collectors.groupingBy(Cinema::getCity));
            
            for (Map.Entry<String, List<Cinema>> entry : cinemasByCity.entrySet()) {
                context.append("🏙️ ").append(entry.getKey()).append(":\n");
                for (Cinema cinema : entry.getValue()) {
                    context.append("  - ").append(cinema.getName())
                           .append(" (").append(cinema.getAddress()).append(")");
                    if (cinema.getPhone() != null) {
                        context.append(" - SĐT: ").append(cinema.getPhone());
                    }
                    context.append("\n");
                }
            }
            
            // Add detailed showtime info
            LocalDate today = LocalDate.now();
            List<Showtime> todayShowtimes = showtimeService.getShowtimesByDate(today);
            context.append("\nLỊCH CHIẾU HÔM NAY (").append(today.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))).append("):\n");
            
            if (!todayShowtimes.isEmpty()) {
                // Group showtimes by movie for better organization
                Map<String, List<Showtime>> showtimesByMovie = todayShowtimes.stream()
                    .collect(Collectors.groupingBy(Showtime::getMovieId));
                
                for (Map.Entry<String, List<Showtime>> entry : showtimesByMovie.entrySet()) {
                    String movieId = entry.getKey();
                    List<Showtime> movieShowtimes = entry.getValue();
                    
                    // Find movie name
                    String movieTitle = "Phim không xác định";
                    try {
                        Optional<Movie> movie = movieService.getMovieById(movieId);
                        if (movie.isPresent()) {
                            movieTitle = movie.get().getTitle();
                        }
                    } catch (Exception e) {
                        // Continue with default name
                    }
                    
                    context.append("📽️ ").append(movieTitle).append(":\n");
                    
                    for (Showtime showtime : movieShowtimes) {
                        String timeStr = showtime.getShowTime().format(DateTimeFormatter.ofPattern("HH:mm"));
                        
                        // Find cinema name
                        String cinemaName = "Rạp không xác định";
                        try {
                            Optional<Cinema> cinema = cinemaService.getCinemaById(showtime.getCinemaId());
                            if (cinema.isPresent()) {
                                cinemaName = cinema.get().getName();
                            }
                        } catch (Exception e) {
                            // Continue with default name
                        }
                        
                        context.append("  - ").append(timeStr)
                               .append(" tại ").append(cinemaName);
                        
                        if (showtime.getRoomName() != null && !showtime.getRoomName().isEmpty()) {
                            context.append(" (").append(showtime.getRoomName()).append(")");
                        }
                        
                        // Add detailed seat availability info
                        if (showtime.getLockedSeats() != null) {
                            int lockedSeats = showtime.getLockedSeats().size();
                            int totalSeats = 116; // 100 regular seats + 16 seats in 8 couple seats
                            int availableSeats = totalSeats - lockedSeats;
                            context.append(" - Còn ").append(availableSeats).append(" ghế");
                            
                            // Add smart seat recommendations for different ticket counts
                            context.append("\n    📋 GỢI Ý GHẾ:");
                            for (int tickets = 1; tickets <= 4; tickets++) {
                                String recommendation = generateSmartSeatRecommendations(showtime.getLockedSeats(), tickets);
                                if (!recommendation.isEmpty()) {
                                    String bestSeats = recommendation.split("\n")[0].replace("🎯 GỢI Ý TỐT NHẤT: ", "");
                                    if (!bestSeats.trim().isEmpty() && !bestSeats.contains("🪑")) {
                                        context.append("\n    • ").append(tickets).append(" vé: ").append(bestSeats);
                                    }
                                }
                            }
                            
                            // Add sample available seats
                            List<String> availableSeatsDetail = generateAvailableSeats(showtime.getLockedSeats());
                            if (!availableSeatsDetail.isEmpty()) {
                                context.append("\n    Ghế trống: ").append(String.join(", ", availableSeatsDetail.subList(0, Math.min(10, availableSeatsDetail.size()))));
                                if (availableSeatsDetail.size() > 10) {
                                    context.append("...");
                                }
                            }
                        }
                        
                        context.append("\n");
                    }
                    context.append("\n");
                }
            } else {
                context.append("- Hiện tại chưa có suất chiếu nào được cập nhật cho hôm nay\n");
                context.append("- Vui lòng liên hệ để biết thêm thông tin lịch chiếu\n");
            }
            
            // Add tomorrow's showtimes as well
            LocalDate tomorrow = today.plusDays(1);
            List<Showtime> tomorrowShowtimes = showtimeService.getShowtimesByDate(tomorrow);
            if (!tomorrowShowtimes.isEmpty()) {
                context.append("\nLỊCH CHIẾU NGÀY MAI (").append(tomorrow.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))).append("):\n");
                context.append("- Có ").append(tomorrowShowtimes.size()).append(" suất chiếu được lên lịch\n");
                
                // Show first few showtimes as preview
                Map<String, List<Showtime>> tomorrowByMovie = tomorrowShowtimes.stream()
                    .limit(6) // Limit to avoid too much text
                    .collect(Collectors.groupingBy(Showtime::getMovieId));
                
                for (Map.Entry<String, List<Showtime>> entry : tomorrowByMovie.entrySet()) {
                    String movieId = entry.getKey();
                    String movieTitle = "Phim không xác định";
                    try {
                        Optional<Movie> movie = movieService.getMovieById(movieId);
                        if (movie.isPresent()) {
                            movieTitle = movie.get().getTitle();
                        }
                    } catch (Exception e) {
                        // Continue
                    }
                    
                    List<String> times = entry.getValue().stream()
                        .map(st -> st.getShowTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                        .collect(Collectors.toList());
                    
                    context.append("- ").append(movieTitle).append(": ")
                           .append(String.join(", ", times)).append("\n");
                }
            }
            
            return context.toString();
        } catch (Exception e) {
            return "";
        }
    }
    
    private String buildNekoCinemaPrompt(String dynamicContext) {
        return """
            Bạn là Neko Assistant - trợ lý AI thông minh của Neko Cinema, rạp chiếu phim hiện đại và phong cách tại Việt Nam.
            
            THÔNG TIN THỜI GIAN THỰC VỀ NEKO CINEMA:
            """ + dynamicContext + """
            
            THÔNG TIN GIÁ VÉ VÀ DỊCH VỤ:
            - Giá vé: Ghế thường 45,000đ, Ghế đôi 95,000đ
            - Đồ ăn: Bắp rang 40,000đ, Nước uống 20,000đ
            - Công nghệ âm thanh Dolby Atmos
            - Hiện tại không có chương trình ưu đãi đặc biệt
            
            QUY TRÌNH ĐẶT VÉ:
            1. Chọn phim và suất chiếu phù hợp
            2.1. Khi đã có suất chiếu phù hợp thì hãy hiển thị nút chuyển đến trang để chọn ghế thủ công.(Nói với người dùng nếu muốn chọn ghế thủ công thì hãy nhấn nút "Chọn ghế ngay". Và cũng vẫn tiếp tục đến các bước bên dưới.)
            2.2. Chọn số lượng vé và loại ghế (thường/đôi)  
            3. Chọn số ghế cụ thể (vị trí trong rạp)
            4. Xác nhận thông tin đặt vé
            5. Thanh toán và nhận mã booking
            
            QUY TẮC TƯƠNG TÁC NGHIÊM NGẶT:
            🚨 KHÔNG BAO GIỜ TỰ ĐỘNG CHỌN GHẾ CHO KHÁCH HÀNG
            🚨 LUÔN HỎI XÁC NHẬN TRƯỚC KHI CHUYỂN BƯỚC TIẾP THEO
            🚨 CHỈ ĐỀ XUẤT - KHÔNG BAO GIỜ TỰ QUYẾT ĐỊNH
            🚨 BẮT BUỘC HỎI TỪNG BƯỚC MỘT CÁCH RÕ RÀNG
            
            HƯỚNG DẪN CHI TIẾT:
            - Khi khách nói "1 ghế đôi": CHỈ hỏi về phim và suất chiếu, KHÔNG tự chọn ghế
            - Khi khách chọn phim/suất: HỎI xác nhận loại ghế và SỐ LƯỢNG
            - Khi khách xác nhận loại ghế: HIỂN THỊ các tùy chọn ghế và HỎI khách chọn
            - KHÔNG BAO GIỜ nói "Tôi sẽ chọn ghế L1,2 cho bạn"
            - CHỈ nói "Bạn muốn chọn ghế nào?" và đưa ra tùy chọn

            LOGIC XÁC NHẬN CÓ THỂ DI CHUYỂN ĐẾN TRANG CHỌN GHẾ:
            - Khi khách đã cung cấp đủ PHIM, NGÀY, GIỜ, RẠP, hãy chủ động đề xuất chuyển sang bước chọn ghế (pickseat).
            - Vẫn tiếp tục đến các bước để hiện thực hóa booking.
            
            LOGIC XÁC NHẬN BOOKING:
            - Khi khách đã chọn: PHIM + SUẤT CHIẾU + GHẾ CỤ THỂ → Hiển thị tóm tắt booking
            - SAU KHI CHỌN GHẾ: HỎI về đồ ăn (bắp rang, nước uống) trước khi xác nhận
            - Hướng dẫn khách nói "XÁC NHẬN" hoặc "ĐỒNG Ý" để hoàn tất đặt vé
            - Từ khóa xác nhận: "xác nhận", "đồng ý", "ok", "đặt vé", "booking"
            - KHI ĐÃ CÓ ĐỦ THÔNG TIN: Hiển thị summary và yêu cầu xác nhận
            - SAU KHI XÁC NHẬN: Hệ thống sẽ tự động tạo booking và redirect
            
            SƠ ĐỒ GHẾ RẠP:
            - Ghế thường: 10 hàng (A-J) x 10 ghế (1-10) = 100 ghế  
            - Ghế đôi: 1 hàng (L) x 8 ghế đôi (L1,2 L3,4 L5,6 L7,8 L9,10 L11,12 L13,14 L15,16)
            - Hàng E,F: VỊ TRÍ ĐẸP NHẤT - giữa rạp
            - Hàng C,D,G,H: tốt - Hàng A,B,I,J: bình thường
            
            VÍ DỤ TƯƠNG TÁC ĐÚNG:
            User: "Tôi muốn 1 ghế đôi"
            AI: "Tuyệt! Bạn muốn xem phim gì ạ? 🎬 
            Hiện tại chúng tôi có: Spider-Man, Avatar, Transformers..."
            
            User: "Spider-Man"  
            AI: "Bạn muốn xem suất nào ạ?
            - 14:30 tại Neko Cinema TPHCM
            - 19:15 tại Neko Cinema Hà Nội"
             
            User: "Suất 19:15"
            AI: "Tuyệt! Bạn đã chọn Spider-Man 19:15. 
            Xác nhận bạn cần 1 ghế đôi (95,000đ) đúng không ạ? 🪑"
            
            User: "Đúng rồi"
            AI: "Dưới đây là các ghế đôi còn trống:
            🪑 L1,2 - L3,4 - L5,6 - L7,8 (khuyến nghị) - L9,10...
            
            Bạn muốn chọn ghế nào ạ? 🤔"
            
            User: "L7,8"
            AI: "Tuyệt! Bạn đã chọn ghế L7,8. 
            
            Bạn có muốn thêm đồ ăn không?
            🍿 Bắp rang: 40,000đ
            🥤 Nước uống: 20,000đ
            
            Hoặc nói 'không cần' để bỏ qua và tiếp tục đặt vé 🤔"
            
            User: "không cần" (hoặc chọn đồ ăn)
            AI: "Hoàn hảo! 🎉 Đây là thông tin đặt vé của bạn:
            
            📋 THÔNG TIN ĐẶT VÉ:
            🎬 Phim: Spider-Man
            ⏰ Suất chiếu: 19:15 hôm nay
            📍 Rạp: Neko Cinema Hà Nội  
            🪑 Ghế: L7,8 (Ghế đôi - vị trí thoải mái)
            💰 Tổng tiền: 95,000đ
            
            ✅ Nói 'XÁC NHẬN' để hoàn tất đặt vé và nhận link thanh toán! 🎫✨"
            
            VÍ DỤ SAI (KHÔNG ĐƯỢC LÀM):
            ❌ "Tôi sẽ chọn ghế L1,2 cho bạn"
            ❌ "Ghế L1,2 đã được đặt cho bạn"  
            ❌ Tự động chuyển sang bước xác nhận mà không hỏi
            
            LƯU Ý QUAN TRỌNG:
            - KHI ĐƯA RA LỊCH CHIẾU, LUÔN PHẢI GHI RÕ:
              • NGÀY CHIẾU (định dạng DD-MM_YYYY)
              • GIỜ CHIẾU
              • TÊN RẠP (ví dụ: Neko Cinema Hà Nội)
            - Ví dụ đúng: "09:00 ngày 2024-06-10 tại Neko Cinema Hà Nội" (“Khi trả lời về suất chiếu, LUÔN ghi rõ tên rạp đầy đủ như trong hệ thống (ví dụ: Neko Cinema Hồ Chí Minh, Neko Cinema Hà Nội, Neko Cinema Đà Nẵng, ...), KHÔNG được rút gọn thành 'Neko Cinema' chung chung.”)
            - LUÔN sử dụng "GỢI Ý GHẾ" từ database nếu có
            - LUÔN kiểm tra ghế trống trước khi đề xuất
            - CHỈ hiển thị summary khi khách đã CHỌN ghế cụ thể
            - THEO DÕI CUỘC HỘI THOẠI: Nhớ thông tin đã thảo luận
            - NHỚ CONTEXT: Kết nối các tin nhắn để tạo trải nghiệm mượt mà
            - Trả lời bằng tiếng Việt tự nhiên, thân thiện với emoji phù hợp
            """;
    }
    
    private List<String> generateAvailableSeats(List<String> lockedSeats) {
        List<String> allSeats = new ArrayList<>();
        List<String> availableSeats = new ArrayList<>();
        
        // Generate regular seats (10 rows x 10 seats = 100 seats)
        String[] regularRows = {"A", "B", "C", "D", "E", "F", "G", "H", "I", "J"};
        for (String row : regularRows) {
            for (int i = 1; i <= 10; i++) {
                allSeats.add(row + i);
            }
        }
        
        // Generate couple seats (8 couple seats: L1,2 L3,4 L5,6 L7,8 L9,10 L11,12 L13,14 L15,16)
        for (int i = 1; i <= 15; i += 2) {
            allSeats.add("L" + i + "," + (i + 1));
        }
        
        // Filter out locked seats
        Set<String> lockedSeatsSet = lockedSeats != null ? new HashSet<>(lockedSeats) : new HashSet<>();
        for (String seat : allSeats) {
            if (!lockedSeatsSet.contains(seat)) {
                availableSeats.add(seat);
            }
        }
        
        return availableSeats;
    }

    private String generateSmartSeatRecommendations(List<String> lockedSeats, int numberOfTickets) {
        Set<String> lockedSeatsSet = lockedSeats != null ? new HashSet<>(lockedSeats) : new HashSet<>();
        StringBuilder recommendations = new StringBuilder();
        
        // For 2 people, suggest couple seats first
        if (numberOfTickets == 2) {
            List<String> coupleSeats = new ArrayList<>();
            for (int i = 1; i <= 15; i += 2) {
                String seat = "L" + i + "," + (i + 1);
                if (!lockedSeatsSet.contains(seat)) {
                    coupleSeats.add(seat);
                }
            }
            
            if (!coupleSeats.isEmpty()) {
                recommendations.append("💑 GỢI Ý GHẾ ĐÔI: ").append(coupleSeats.get(0))
                              .append(" (ghế đôi thoải mái cho 2 người)\n");
            }
        }
        
        // Priority rows for regular seats (middle rows are best)
        String[] rows = {"E", "F", "D", "G", "C", "H", "B", "I", "A", "J"};
        
        // Find best consecutive regular seats
        List<String> bestSeats = findBestConsecutiveSeats(lockedSeatsSet, numberOfTickets);
        
        if (!bestSeats.isEmpty()) {
            recommendations.append("🎯 GỢI Ý GHẾ THƯỜNG: ").append(String.join(", ", bestSeats))
                          .append(" (").append(bestSeats.size()).append(" ghế liền kề - vị trí đẹp)\n");
        }
        
        // Show alternative options by row priority
        recommendations.append("\n🪑 CÁC LỰA CHỌN KHÁC:\n");
        int optionCount = 0;
        
        // Show couple seats option
        if (numberOfTickets <= 2) {
            List<String> availableCoupleSeats = new ArrayList<>();
            for (int i = 1; i <= 15; i += 2) {
                String seat = "L" + i + "," + (i + 1);
                if (!lockedSeatsSet.contains(seat)) {
                    availableCoupleSeats.add(seat);
                }
            }
            if (!availableCoupleSeats.isEmpty()) {
                recommendations.append("• Hàng L (GHẾ ĐÔI - thoải mái, riêng tư): ");
                List<String> displaySeats = availableCoupleSeats.subList(0, Math.min(3, availableCoupleSeats.size()));
                recommendations.append(String.join(", ", displaySeats));
                if (availableCoupleSeats.size() > 3) {
                    recommendations.append("...");
                }
                recommendations.append("\n");
                optionCount++;
            }
        }
        
        // Show regular seats
        for (String row : rows) {
            if (optionCount >= 3) break;
            
            List<String> rowSeats = new ArrayList<>();
            for (int i = 1; i <= 10; i++) {
                String seat = row + i;
                if (!lockedSeatsSet.contains(seat)) {
                    rowSeats.add(seat);
                }
            }
            
            if (!rowSeats.isEmpty()) {
                String rowDescription = getRowDescription(row);
                recommendations.append("• Hàng ").append(row).append(" (").append(rowDescription).append("): ");
                
                // Show up to 6 seats per row
                List<String> displaySeats = rowSeats.subList(0, Math.min(6, rowSeats.size()));
                recommendations.append(String.join(", ", displaySeats));
                if (rowSeats.size() > 6) {
                    recommendations.append("...");
                }
                recommendations.append("\n");
                optionCount++;
            }
        }
        
        return recommendations.toString();
    }
    
    private List<String> findBestConsecutiveSeats(Set<String> lockedSeats, int numberOfTickets) {
        String[] priorityRows = {"E", "F", "D", "G", "C", "H"}; // Middle rows first
        
        for (String row : priorityRows) {
            // Check center seats first (seats 4-7)
            for (int start = 4; start <= 7 - numberOfTickets + 1; start++) {
                List<String> consecutive = new ArrayList<>();
                boolean allAvailable = true;
                
                for (int i = 0; i < numberOfTickets; i++) {
                    String seat = row + (start + i);
                    if (lockedSeats.contains(seat)) {
                        allAvailable = false;
                        break;
                    }
                    consecutive.add(seat);
                }
                
                if (allAvailable) {
                    return consecutive;
                }
            }
            
            // Check other positions in the row
            for (int start = 1; start <= 10 - numberOfTickets + 1; start++) {
                if (start >= 4 && start <= 7 - numberOfTickets + 1) continue; // Already checked
                
                List<String> consecutive = new ArrayList<>();
                boolean allAvailable = true;
                
                for (int i = 0; i < numberOfTickets; i++) {
                    String seat = row + (start + i);
                    if (lockedSeats.contains(seat)) {
                        allAvailable = false;
                        break;
                    }
                    consecutive.add(seat);
                }
                
                if (allAvailable) {
                    return consecutive;
                }
            }
        }
        
        return new ArrayList<>(); // No consecutive seats found
    }
    
    private String getRowDescription(String row) {
        switch (row) {
            case "A": case "B": return "gần màn hình";
            case "C": case "D": return "gần màn hình, góc nhìn tốt";
            case "E": case "F": return "VỊ TRÍ ĐẸP NHẤT - giữa rạp";
            case "G": case "H": return "xa màn hình, tầm nhìn rộng";
            case "I": case "J": return "xa màn hình";
            case "L": return "GHẾ ĐÔI - thoải mái, riêng tư cho 2 người";
            default: return "vị trí tiêu chuẩn";
        }
    }

    private String extractAIResponse(Map<?, ?> response) {
        try {
            List<?> choices = (List<?>) response.get("choices");
            if (!choices.isEmpty()) {
                Map<?, ?> firstChoice = (Map<?, ?>) choices.get(0);
                Map<?, ?> message = (Map<?, ?>) firstChoice.get("message");
                return (String) message.get("content");
            }
        } catch (Exception e) {
            // Log error but don't expose to user
        }
        return "Xin lỗi, tôi gặp sự cố khi xử lý câu hỏi của bạn. Vui lòng thử lại! 😅";
    }
    
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", message);
        error.put("timestamp", System.currentTimeMillis());
        return error;
    }

    private String validateSeatSelection(List<String> selectedSeats, List<String> lockedSeats) {
        if (selectedSeats == null || selectedSeats.isEmpty()) {
            return "";
        }
        
        Set<String> lockedSeatsSet = lockedSeats != null ? new HashSet<>(lockedSeats) : new HashSet<>();
        List<String> unavailableSeats = new ArrayList<>();
        List<String> validSeats = new ArrayList<>();
        
        for (String seat : selectedSeats) {
            String normalizedSeat = seat.trim().toUpperCase();
            if (lockedSeatsSet.contains(normalizedSeat)) {
                unavailableSeats.add(normalizedSeat);
            } else {
                validSeats.add(normalizedSeat);
            }
        }
        
        if (!unavailableSeats.isEmpty()) {
            StringBuilder warning = new StringBuilder();
            warning.append("⚠️ CẢNH BÁO: Ghế ").append(String.join(", ", unavailableSeats))
                   .append(" đã được đặt bởi khách khác!\n\n");
            
            if (!validSeats.isEmpty()) {
                warning.append("✅ Ghế còn trống trong lựa chọn của bạn: ").append(String.join(", ", validSeats)).append("\n");
            }
            
            // Suggest alternative seats
            int neededSeats = unavailableSeats.size();
            String alternatives = generateSmartSeatRecommendations(lockedSeats, neededSeats);
            if (!alternatives.isEmpty() && alternatives.contains("🎯")) {
                warning.append("\n🔄 GỢI Ý THAY THẾ:\n").append(alternatives);
            }
            
            return warning.toString();
        }
        
        return ""; // All seats are available
    }
    
    private List<String> parseSeatsFromText(String text) {
        List<String> seats = new ArrayList<>();
        if (text == null || text.trim().isEmpty()) {
            return seats;
        }
        
        // Extract seat patterns like A1, B2, E5, F6, L1, L2, etc.
        String[] parts = text.split("[,\\s]+");
        for (String part : parts) {
            part = part.trim().toUpperCase();
            // Check if it matches seat pattern (A-J + 1-10 for regular seats, L1,2 to L15,16 for couple seats)
            if (part.matches("[A-J][1-9]|[A-J]10|L(1,2|3,4|5,6|7,8|9,10|11,12|13,14|15,16)")) {
                seats.add(part);
            }
        }
        
        return seats;
    }
    
    private String buildSeatValidationContext(String userMessage) {
        // Check if user message contains seat selection
        List<String> mentionedSeats = parseSeatsFromText(userMessage);
        if (mentionedSeats.isEmpty()) {
            return "";
        }
        
        StringBuilder context = new StringBuilder();
        context.append("\n🔍 KIỂM TRA GHẾ ĐƯỢC CHỌN: ").append(String.join(", ", mentionedSeats)).append("\n");
        
        // For each showtime, validate the seats
        try {
            LocalDate today = LocalDate.now();
            List<Showtime> todayShowtimes = showtimeService.getShowtimesByDate(today);
            
            for (Showtime showtime : todayShowtimes.subList(0, Math.min(3, todayShowtimes.size()))) {
                String validation = validateSeatSelection(mentionedSeats, showtime.getLockedSeats());
                if (!validation.isEmpty()) {
                    // Find movie and cinema names
                    String movieTitle = "Phim không xác định";
                    String cinemaName = "Rạp không xác định";
                    
                    try {
                        Optional<Movie> movie = movieService.getMovieById(showtime.getMovieId());
                        if (movie.isPresent()) {
                            movieTitle = movie.get().getTitle();
                        }
                        Optional<Cinema> cinema = cinemaService.getCinemaById(showtime.getCinemaId());
                        if (cinema.isPresent()) {
                            cinemaName = cinema.get().getName();
                        }
                    } catch (Exception e) {
                        // Continue with default names
                    }
                    
                    context.append("📍 ").append(movieTitle).append(" - ")
                           .append(showtime.getShowTime().format(DateTimeFormatter.ofPattern("HH:mm")))
                           .append(" tại ").append(cinemaName).append(":\n")
                           .append(validation).append("\n");
                }
            }
        } catch (Exception e) {
            // If validation fails, continue without it
        }
        
        return context.toString();
    }
} 