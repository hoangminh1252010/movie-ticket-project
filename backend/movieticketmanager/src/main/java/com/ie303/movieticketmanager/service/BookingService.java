package com.ie303.movieticketmanager.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ie303.movieticketmanager.dto.BookingRequest;
import com.ie303.movieticketmanager.dto.BookingResponse;
import com.ie303.movieticketmanager.model.Booking;
import com.ie303.movieticketmanager.repository.BookingRepository;
import com.ie303.movieticketmanager.repository.UserRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private OrderService orderService;
    @Autowired
    private EmailService emailService;
    @Autowired
    private UserRepository userRepository;
    public BookingResponse createBooking(BookingRequest request) {
        try {
            // Validate input
            if (request.getUserId() == null || request.getUserId().isEmpty()) {
                return new BookingResponse(false, "User ID không được để trống");
            }
            
            if (request.getShowtimeId() == null || request.getShowtimeId().isEmpty()) {
                return new BookingResponse(false, "Showtime ID không được để trống");
            }
            
            if (request.getSeatNames() == null || request.getSeatNames().isEmpty()) {
                return new BookingResponse(false, "Danh sách ghế không được để trống");
            }

            // Kiểm tra xem ghế đã được đặt chưa
            List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
                request.getShowtimeId(), 
                request.getSeatNames()
            );
            
            if (!conflictingBookings.isEmpty()) {
                return new BookingResponse(false, "Một số ghế đã được đặt. Vui lòng chọn ghế khác.");
            }

            // Tạo booking mới
            Booking booking = new Booking(
                request.getUserId(),
                request.getShowtimeId(),
                request.getSeatNames()
            );

            Booking savedBooking = bookingRepository.save(booking);

            // Tạo response
            BookingResponse.BookingInfo bookingInfo = new BookingResponse.BookingInfo(
                savedBooking.getId(),
                savedBooking.getUserId(),
                savedBooking.getShowtimeId(),
                savedBooking.getSeatNames(),
                savedBooking.getStatus(),
                savedBooking.getBookingTime(),
                savedBooking.getUpdatedAt()
            );

            return new BookingResponse(true, "Đặt vé thành công", bookingInfo);

        } catch (Exception e) {
            return new BookingResponse(false, "Lỗi hệ thống: " + e.getMessage());
        }
    }

    public BookingResponse getBookingById(String bookingId) {
        try {
            Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
            
            if (!bookingOpt.isPresent()) {
                return new BookingResponse(false, "Không tìm thấy booking");
            }

            Booking booking = bookingOpt.get();
            BookingResponse.BookingInfo bookingInfo = new BookingResponse.BookingInfo(
                booking.getId(),
                booking.getUserId(),
                booking.getShowtimeId(),
                booking.getSeatNames(),
                booking.getStatus(),
                booking.getBookingTime(),
                booking.getUpdatedAt()
            );

            return new BookingResponse(true, "Lấy thông tin booking thành công", bookingInfo);

        } catch (Exception e) {
            return new BookingResponse(false, "Lỗi hệ thống: " + e.getMessage());
        }
    }

    public List<Booking> getBookingsByUserId(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getBookingsByShowtimeId(String showtimeId) {
        return bookingRepository.findByShowtimeId(showtimeId);
    }

    public BookingResponse updateBookingStatus(String bookingId, String status) {
        try {
            Optional<Booking> bookingOpt = bookingRepository.findById(bookingId);
            
            if (!bookingOpt.isPresent()) {
                return new BookingResponse(false, "Không tìm thấy booking");
            }

            Booking booking = bookingOpt.get();
            booking.setStatus(status); // This also updates updatedAt automatically
            
            Booking savedBooking = bookingRepository.save(booking);

            // Nếu status là success thì chuyển sang Order
            if ("success".equals(status)) {
                com.ie303.movieticketmanager.model.Order order = new com.ie303.movieticketmanager.model.Order();
                order.setUserId(booking.getUserId());
                order.setShowtimeId(booking.getShowtimeId());
                order.setSeatNames(booking.getSeatNames());
                order.setOrderTime(new java.util.Date());
                order.setBookingId(booking.getId());
                orderService.saveOrder(order);

                // Gửi email xác nhận vé cho user
                com.ie303.movieticketmanager.model.User user = userRepository.findById(booking.getUserId()).orElse(null);
                if (user != null && user.getEmail() != null && !user.getEmail().isEmpty()) {
                    String userEmail = user.getEmail();
                    String subject = "Xác nhận đặt vé thành công - NekoCinema";
                    String htmlContent = "<div style='font-family:sans-serif; color:#222;'>"
                        + "<h2 style='color:#be1238;'>NekoCinema - Xác nhận đặt vé thành công</h2>"
                        + "<p>Chào <b>" + user.getName() + "</b>,</p>"
                        + "<p>Bạn đã đặt vé thành công tại <b>NekoCinema</b>!</p>"
                        + "<ul style='background:#f8f8f8; padding:16px; border-radius:8px;'>"
                        + "<li><b>Mã booking:</b> <span style='color:#be1238;'>" + booking.getId() + "</span></li>"
                        + "<li><b>Ghế:</b> " + String.join(", ", booking.getSeatNames()) + "</li>"
                        + "<li><b>Ngày đặt:</b> " + booking.getBookingTime() + "</li>"
                        + "</ul>"
                        + "<p>Cảm ơn bạn đã sử dụng dịch vụ của <b>NekoCinema</b>!</p>"
                        + "<hr style='margin:24px 0;'/>"
                        + "<div style='font-size:12px; color:#888;'>Đây là email tự động, vui lòng không trả lời.</div>"
                        + "</div>";
                    try {
                        emailService.sendTicketEmailHtml(userEmail, subject, htmlContent);
                    } catch (Exception mailEx) {
                        System.err.println("Lỗi gửi email xác nhận vé: " + mailEx.getMessage());
                    }
                }
            }
            


            BookingResponse.BookingInfo bookingInfo = new BookingResponse.BookingInfo(
                savedBooking.getId(),
                savedBooking.getUserId(),
                savedBooking.getShowtimeId(),
                savedBooking.getSeatNames(),
                savedBooking.getStatus(),
                savedBooking.getBookingTime(),
                savedBooking.getUpdatedAt()
            );

            return new BookingResponse(true, "Cập nhật trạng thái booking thành công", bookingInfo);
            
        } catch (Exception e) {
            return new BookingResponse(false, "Lỗi hệ thống: " + e.getMessage());
        }
    }

    public BookingResponse cancelBooking(String bookingId) {
        return updateBookingStatus(bookingId, "cancelled");
    }

    public BookingResponse confirmBooking(String bookingId) {
        return updateBookingStatus(bookingId, "confirmed");
    }
} 