import React, { useState, useRef, useEffect } from "react";
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaChevronDown,
  FaMicrophone,
  FaStop,
} from "react-icons/fa";
import { HiOutlineEmojiHappy } from "react-icons/hi";
import MovieChatCard from "./MovieChatCard";
import { useBooking } from "../../context/BookingContext";
import { useNavigate } from "react-router-dom";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Xin chào! Tôi là trợ lý AI của Neko Cinema. Tôi có thể giúp bạn tìm phim, đặt vé, hoặc trả lời các câu hỏi về rạp chiếu. Meo meo meo ?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { setBooking } = useBooking();
  const navigate = useNavigate();
  const [canGoToPickSeat, setCanGoToPickSeat] = useState(false);
  const [pickSeatInfo, setPickSeatInfo] = useState(null);

  const quickReplies = [
    "Phim gì đang chiếu?",
    "Giá vé như thế nào?",
    "Ưu đãi hiện tại",
    "Địa chỉ rạp chiếu",
    "Đặt vé online",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const isBookingConfirmation = (message) => {
    const lowerMessage = message.toLowerCase();
    return (
      lowerMessage.includes("xác nhận") ||
      lowerMessage.includes("đồng ý") ||
      lowerMessage.includes("ok") ||
      lowerMessage.includes("được") ||
      (lowerMessage.includes("có") &&
        (lowerMessage.includes("đặt") || lowerMessage.includes("book")))
    );
  };

  const extractBookingInfoFromChat = (conversationHistory) => {
    const info = {
      movie: null,
      movieId: null,
      showtime: null,
      cinema: null,
      seats: null,
      date: null,
    };

    // Analyze all messages to extract info
    if (conversationHistory) {
      for (const message of conversationHistory) {
        const content = message.content?.toLowerCase() || "";

        // Extract movie
        if (!info.movie) {
          if (
            content.includes("spider-man") ||
            content.includes("spider man") ||
            content.includes("người nhện")
          ) {
            info.movie = "Spider-Man";
            info.movieId = "1"; // Assume Spider-Man has ID 1
          } else if (content.includes("avatar")) {
            info.movie = "Avatar";
            info.movieId = "2";
          } else if (content.includes("transformers")) {
            info.movie = "Transformers";
            info.movieId = "3";
          }
        }

        // Extract showtime
        if (!info.showtime) {
          const timeMatch = content.match(/(\d{1,2})[:\.](\d{2})/);
          if (timeMatch) {
            info.showtime = `${timeMatch[1]}:${timeMatch[2]}`;
          }
        }

        // Extract cinema
        if (!info.cinema) {
          if (
            content.includes("tphcm") ||
            content.includes("hồ chí minh") ||
            content.includes("tp.hcm")
          ) {
            info.cinema = "TPHCM";
          } else if (content.includes("hà nội") || content.includes("ha noi")) {
            info.cinema = "Hà Nội";
          } else if (
            content.includes("đà nẵng") ||
            content.includes("da nang")
          ) {
            info.cinema = "Đà Nẵng";
          }
        }

        // Extract seats
        if (!info.seats) {
          const seatMatch = content.match(/[a-l]\d+/gi);
          if (seatMatch) {
            info.seats = seatMatch;
          }
        }

        // Extract date
        if (!info.date) {
          const dateMatch = content.match(/\d{4}-\d{2}-\d{2}/);
          if (dateMatch) {
            info.date = dateMatch[0];
          }
        }
      }
    }

    return info;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    try {
      // Prepare conversation history (exclude the initial greeting message and current message)
      const conversationHistory = messages
        .slice(1) // Skip initial greeting message
        .filter(
          (msg) =>
            msg.sender !== "bot" ||
            !msg.text.includes("Xin chào! Tôi là trợ lý AI")
        ) // Extra safety
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        }));

      // Check if this is a booking confirmation
      if (isBookingConfirmation(currentMessage)) {
        console.log("=== BOOKING CONFIRMATION DETECTED ===");
        console.log("User message:", currentMessage);
        console.log("Conversation history:", conversationHistory);

        // Extract basic info from conversation for PickSeat pre-fill
        const extractedInfo = extractBookingInfoFromChat(conversationHistory);
        console.log("Extracted info for PickSeat:", extractedInfo);

        // Nếu đã có đủ info (phim, ngày, giờ, rạp)
        if (
          extractedInfo.movieId &&
          extractedInfo.showtime &&
          extractedInfo.cinema &&
          extractedInfo.date
        ) {
          setBooking({
            selectedMovie: extractedInfo.movieId,
            selectedTime: extractedInfo.showtime,
            selectedCinema: extractedInfo.cinema,
            selectedDate: extractedInfo.date,
          });
          setPickSeatInfo({
            movieId: extractedInfo.movieId,
            showtime: extractedInfo.showtime,
            cinema: extractedInfo.cinema,
            date: extractedInfo.date,
          });
          setCanGoToPickSeat(true);
        } else {
          setCanGoToPickSeat(false);
        }

        const botResponse = {
          id: Date.now() + 1,
          text: `🎬 Tuyệt! Tôi hiểu bạn muốn đặt vé xem phim.

💡 **Để đặt vé thành công**, bạn cần:
• Chọn ngày & suất chiếu cụ thể
• Xem sơ đồ ghế trống thời gian thực  
• Chọn ghế trên seat map trực quan

🚀 Tôi sẽ đưa bạn đến **trang đặt vé chính thức** để có trải nghiệm tốt nhất!

${extractedInfo.movie ? `🎯 Phim bạn quan tâm: **${extractedInfo.movie}**` : ""}

👆 Nhấn nút bên dưới để đến trang đặt vé!`,
          sender: "bot",
          timestamp: new Date(),
          type: "redirect_to_booking",
          extractedInfo: extractedInfo,
        };

        setMessages((prev) => [...prev, botResponse]);
        setIsTyping(false);
        return;
      }

      // Call regular chat API
      const response = await fetch("http://localhost:8080/api/chatbot/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
          conversationHistory: conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const botResponse = {
        id: Date.now() + 1,
        text: data.success
          ? data.message
          : "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.",
        sender: "bot",
        timestamp: new Date(),
        type: data.type || "text",
        movies: data.movies || null,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Chatbot API error:", error);

      // Fallback to local response if API fails
      const fallbackResponse = generateBotResponse(currentMessage);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text:
            "⚠️ Kết nối AI gặp sự cố, đang sử dụng chế độ offline:\n\n" +
            fallbackResponse,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateBotResponse = (userInput) => {
    const input = userInput.toLowerCase();

    if (input.includes("phim") || input.includes("chiếu")) {
      return "Hiện tại Neko Cinema đang chiếu nhiều bộ phim hot như: Transformers, Avatar, Spider-Man và nhiều phim khác. Bạn có thể xem lịch chiếu chi tiết tại trang 'Lịch Chiếu' hoặc tôi có thể hỗ trợ tìm suất chiếu phù hợp với bạn.";
    } else if (input.includes("giá") || input.includes("vé")) {
      return "Giá vé tại Neko Cinema:\n• Ghế thường: 45,000đ\n• Ghế đôi: 95,000đ\n\nĐồ ăn:\n• Bắp rang: 40,000đ\n• Nước uống: 20,000đ";
    } else if (input.includes("ưu đãi") || input.includes("khuyến mãi")) {
      return "Hiện tại Neko Cinema không có chương trình ưu đãi đặc biệt. Chúng tôi luôn duy trì giá vé hợp lý để phục vụ tốt nhất cho khách hàng.";
    } else if (input.includes("địa chỉ") || input.includes("rạp")) {
      return "📍 Hệ thống rạp Neko Cinema:\n• Neko Cinema TPHCM: 123 Nguyễn Huệ, Q.1\n• Neko Cinema Hà Nội: 456 Hoàng Kiếm, Q. Hoàn Kiếm\n• Neko Cinema Đà Nẵng: 789 Hàn Market, Q. Hải Châu\n\nTất cả rạp đều có đầy đủ tiện nghi hiện đại và công nghệ âm thanh Dolby Atmos.";
    } else if (input.includes("đặt vé") || input.includes("booking")) {
      return "🎫 Để đặt vé, bạn có thể:\n1. Đặt online qua website/app\n2. Đặt trực tiếp tại quầy\n3. Gọi hotline: 1900-xxxx\n\nBạn muốn tôi hướng dẫn đặt vé online không? Tôi có thể giúp bạn chọn phim và suất chiếu phù hợp.";
    } else {
      return "Cảm ơn bạn đã liên hệ! Tôi có thể hỗ trợ bạn về:\n• Thông tin phim đang chiếu\n• Giá vé và dịch vụ\n• Đặt vé online\n• Địa chỉ rạp chiếu\n• Các dịch vụ khác\n\nBạn có câu hỏi cụ thể nào không?";
    }
  };

  const handleQuickReply = (reply) => {
    setInputMessage(reply);
    setTimeout(() => handleSendMessage(), 100);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    // Lấy thông tin mới nhất từ toàn bộ hội thoại
    const conversationHistory = messages
      .slice(1)
      .filter(
        (msg) =>
          msg.sender !== "bot" ||
          !msg.text.includes("Xin chào! Tôi là trợ lý AI")
      )
      .map((msg) => ({
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.text,
      }));
    const extractedInfo = extractBookingInfoFromChat(conversationHistory);
    if (
      extractedInfo.movieId &&
      extractedInfo.showtime &&
      extractedInfo.cinema &&
      extractedInfo.date
    ) {
      setBooking({
        selectedMovie: extractedInfo.movieId,
        selectedTime: extractedInfo.showtime,
        selectedCinema: extractedInfo.cinema,
        selectedDate: extractedInfo.date,
      });
      setPickSeatInfo({
        movieId: extractedInfo.movieId,
        showtime: extractedInfo.showtime,
        cinema: extractedInfo.cinema,
        date: extractedInfo.date,
      });
      setCanGoToPickSeat(true);
    } else {
      setCanGoToPickSeat(false);
    }
    // eslint-disable-next-line
  }, [messages]);

  return (
    <>
      {/* Enhanced Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group"
        >
          <div className="relative">
            {/* Main Button */}
            <div className="bg-gradient-to-br from-[#BE1238] via-[#d91448] to-[#ff4757] p-1 rounded-full shadow-2xl hover:shadow-[0_0_40px_rgba(190,18,56,0.6)] transition-all duration-500 transform hover:scale-110">
              <div className="bg-gradient-to-br from-white/10 to-transparent p-2 rounded-full">
                <img
                  src="/ChatBox/nekAI.jpg"
                  alt="Neko AI"
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/50 group-hover:border-white transition-all duration-300"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextElementSibling.style.display = "block";
                  }}
                />
                <FaRobot className="text-3xl text-white hidden" />
              </div>
            </div>

            {/* Notification Badge */}
            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-[#ff4757] to-[#ff6b7a] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-lg">
              <span className="font-bold">!</span>
            </div>

            {/* Pulse Animation */}
            <div className="absolute inset-0 rounded-full bg-[#BE1238] opacity-20 animate-ping"></div>
          </div>
        </button>
      )}

      {/* Enhanced Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] backdrop-blur-xl bg-gradient-to-b from-black/90 via-gray-900/95 to-black/90 rounded-3xl shadow-2xl border border-white/10 flex flex-col overflow-hidden">
          {/* Enhanced Header */}
          <div className="relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#BE1238] via-[#d91448] to-[#ff4757]"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fill-rule=evenodd%3E%3Cg fill=%23ffffff fill-opacity=0.1%3E%3Ccircle cx=30 cy=30 r=2/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

            <div className="relative p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 rounded-full p-0.5 backdrop-blur-sm">
                    <img
                      src="/ChatBox/nekAI.jpg"
                      alt="Neko AI"
                      className="w-full h-full rounded-full object-cover border border-white/30"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextElementSibling.style.display = "block";
                      }}
                    />
                    <FaRobot className="text-2xl text-white hidden" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">NekAI</h3>
                  <p className="text-sm text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    Trợ lý AI • Đang online
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
                >
                  <FaChevronDown
                    className={`transform transition-transform duration-300 ${
                      isMinimized ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-xl transition-all duration-200"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Enhanced Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent via-black/5 to-black/10">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] ${
                        message.sender === "user"
                          ? "bg-gradient-to-br from-[#BE1238] via-[#d91448] to-[#ff4757] text-white rounded-2xl rounded-br-md shadow-lg shadow-[#BE1238]/20"
                          : "bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm text-white rounded-2xl rounded-bl-md border border-white/10 shadow-xl"
                      } p-4`}
                    >
                      <div className="flex items-start space-x-3">
                        {message.sender === "bot" && (
                          <div className="w-7 h-7 bg-gradient-to-br from-[#BE1238] to-[#ff4757] rounded-full p-0.5 flex-shrink-0 mt-0.5">
                            <img
                              src="/ChatBox/nekAI.jpg"
                              alt="Neko AI"
                              className="w-full h-full rounded-full object-cover border border-white/30"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextElementSibling.style.display =
                                  "block";
                              }}
                            />
                            <FaRobot className="text-white text-sm hidden" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm leading-relaxed whitespace-pre-line">
                            {message.text}
                          </p>

                          {/* Enhanced Movie Cards */}
                          {message.type === "movies" && message.movies && (
                            <div className="mt-3 space-y-2">
                              {message.movies.map((movie) => (
                                <MovieChatCard key={movie.id} movie={movie} />
                              ))}
                            </div>
                          )}

                          <span className="text-xs opacity-60 mt-2 block font-medium">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Enhanced Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm text-white rounded-2xl rounded-bl-md p-4 border border-white/10 shadow-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-7 h-7 bg-gradient-to-br from-[#BE1238] to-[#ff4757] rounded-full p-0.5 flex-shrink-0">
                          <img
                            src="/ChatBox/nekAI.jpg"
                            alt="Neko AI"
                            className="w-full h-full rounded-full object-cover border border-white/30"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.nextElementSibling.style.display =
                                "block";
                            }}
                          />
                          <FaRobot className="text-white text-sm hidden" />
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-[#BE1238] rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-[#BE1238] rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-[#BE1238] rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Enhanced Quick Replies */}
              <div className="px-4 py-3 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  {/* Static Quick Replies */}
                  {quickReplies.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="text-xs bg-gradient-to-r from-gray-800/60 to-gray-900/60 backdrop-blur-sm text-gray-300 px-3 py-2 rounded-full hover:bg-gradient-to-r hover:from-[#BE1238] hover:to-[#ff4757] hover:text-white transition-all duration-300 border border-white/10 hover:border-white/30"
                    >
                      {reply}
                    </button>
                  ))}

                  {/* Dynamic Confirmation Buttons */}
                  {messages.length > 0 &&
                    messages[messages.length - 1].sender === "bot" &&
                    messages[messages.length - 1].text.includes("XÁC NHẬN") && (
                      <>
                        <button
                          onClick={() => handleQuickReply("XÁC NHẬN")}
                          className="text-xs bg-gradient-to-r from-green-600/80 to-green-700/80 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:from-green-500 hover:to-green-600 transition-all duration-300 border border-green-400/30 hover:border-green-300/50 font-semibold"
                        >
                          ✅ XÁC NHẬN ĐẶT VÉ
                        </button>
                        <button
                          onClick={() =>
                            handleQuickReply("Cho tôi xem lại thông tin")
                          }
                          className="text-xs bg-gradient-to-r from-blue-600/80 to-blue-700/80 backdrop-blur-sm text-white px-3 py-2 rounded-full hover:from-blue-500 hover:to-blue-600 transition-all duration-300 border border-blue-400/30 hover:border-blue-300/50"
                        >
                          📋 XEM LẠI
                        </button>
                        <button
                          onClick={() =>
                            handleQuickReply("Tôi muốn đổi ghế khác")
                          }
                          className="text-xs bg-gradient-to-r from-yellow-600/80 to-yellow-700/80 backdrop-blur-sm text-white px-3 py-2 rounded-full hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 border border-yellow-400/30 hover:border-yellow-300/50"
                        >
                          🔄 ĐỔI GHẾ
                        </button>
                      </>
                    )}

                  {/* Redirect to Booking Buttons */}
                  {messages.length > 0 &&
                    messages[messages.length - 1].sender === "bot" &&
                    messages[messages.length - 1].type ===
                      "redirect_to_booking" && (
                      <>
                        <button
                          onClick={() => {
                            const lastMessage = messages[messages.length - 1];
                            const extractedInfo = lastMessage.extractedInfo;
                            console.log(
                              "Booking button clicked with info:",
                              extractedInfo
                            );

                            // Redirect to movie detail page or movie list
                            let targetUrl = "/moviepage"; // Default: movie list

                            if (extractedInfo.movieId) {
                              // Direct to specific movie
                              targetUrl = `/movie/${extractedInfo.movieId}`;
                            } else if (extractedInfo.movie) {
                              // Search for movie in movie list
                              targetUrl = `/moviepage?search=${encodeURIComponent(
                                extractedInfo.movie
                              )}`;
                            }

                            console.log("Navigating to:", targetUrl);
                            window.location.href = targetUrl;
                          }}
                          className="text-xs bg-gradient-to-r from-[#BE1238] to-[#ff4757] backdrop-blur-sm text-white px-4 py-2 rounded-full hover:from-[#d91448] hover:to-[#ff6b7a] transition-all duration-300 border border-[#BE1238]/30 hover:border-[#BE1238]/50 font-semibold"
                        >
                          🎬 ĐI ĐẶT VÉ NGAY
                        </button>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="text-xs bg-gradient-to-r from-gray-600/80 to-gray-700/80 backdrop-blur-sm text-white px-3 py-2 rounded-full hover:from-gray-500 hover:to-gray-600 transition-all duration-300 border border-gray-400/30 hover:border-gray-300/50"
                        >
                          📱 ĐÓNG CHAT
                        </button>
                      </>
                    )}
                </div>
              </div>

              {/* Enhanced Input Area */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-end space-x-3">
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleSendMessage()
                      }
                      placeholder="Nhập tin nhắn..."
                      className="w-full bg-gray-800/50 backdrop-blur-sm text-white rounded-2xl px-4 py-3 pr-12 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#BE1238] focus:border-[#BE1238] transition-all duration-300"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#BE1238] transition-colors duration-300">
                      <HiOutlineEmojiHappy />
                    </button>
                  </div>

                  <button
                    onClick={toggleRecording}
                    className={`p-3 rounded-2xl transition-all duration-300 ${
                      isRecording
                        ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30"
                        : "bg-gray-800/50 backdrop-blur-sm text-gray-400 hover:text-[#BE1238] border border-white/10 hover:border-[#BE1238]"
                    }`}
                  >
                    {isRecording ? <FaStop /> : <FaMicrophone />}
                  </button>

                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    className="bg-gradient-to-r from-[#BE1238] to-[#ff4757] text-white p-3 rounded-2xl hover:shadow-lg hover:shadow-[#BE1238]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                  >
                    <FaPaperPlane />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Chọn ghế ngay */}
          {canGoToPickSeat && pickSeatInfo && (
            <div className="flex justify-center mt-2">
              <button
                onClick={() => navigate(`/pickseat/${pickSeatInfo.movieId}`)}
                className="text-xs bg-gradient-to-r from-[#BE1238] to-[#ff4757] backdrop-blur-sm text-white px-4 py-2 rounded-full hover:from-[#d91448] hover:to-[#ff6b7a] transition-all duration-300 border border-[#BE1238]/30 hover:border-[#BE1238]/50 font-semibold"
              >
                🎬 CHỌN GHẾ NGAY
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;
