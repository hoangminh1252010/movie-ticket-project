import React, { useState, useEffect } from "react";
import TicketInfo from "../components/TicketPage/TicketInfo";
import ActionButtons from "../components/TicketPage/ActionButtons";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { getCinemaById } from "../../api/cinemaApi";

const TicketPage = () => {
  const [cinemaInfo, setCinemaInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Debug: Log toàn bộ location object INSIDE component
  useEffect(() => {
    console.log("=== TICKET PAGE DEBUG ===");
    console.log("Full location object:", location);
    console.log("Location pathname:", location.pathname);
    console.log("Location search:", location.search);
    console.log("Location state:", location.state);
    console.log("Location state type:", typeof location.state);
  }, [location]);

  const handleHomeClick = () => {
    navigate("/");
    console.log("Navigate to home");
  };

  const handleDownloadClick = () => {
    // logic tải vé PDF hoặc QR sau này
    console.log("Download ticket");
  };

  const {
    movie,
    showtime,
    selectedSeats,
    popcornCount,
    popcornTotal,
    drinkTotal,
    drinkCount,
    totalPrice,
    bookingId,
  } = location.state || {};

  // Debug: Log từng giá trị
  useEffect(() => {
    console.log("=== EXTRACTED VALUES ===");
    console.log("Movie:", movie);
    console.log("Showtime:", showtime);
    console.log("Selected seats:", selectedSeats);
    console.log("Popcorn count:", popcornCount);
    console.log("Drink count:", drinkCount);
    console.log("Total price:", totalPrice);
    console.log("Booking ID:", bookingId);
  }, [
    movie,
    showtime,
    selectedSeats,
    popcornCount,
    drinkCount,
    totalPrice,
    bookingId,
  ]);

  // Demo data để test giao diện khi không có real data
  const demoData = {
    movie: { title: "Demo Movie - Spider-Man" },
    showtime: {
      showTime: new Date().toISOString(),
      roomName: "Room 1",
      cinemaId: 1,
    },
    selectedSeats: ["A1", "A2"],
    popcornCount: 2,
    drinkCount: 1,
    popcornTotal: 80000,
    drinkTotal: 20000,
    totalPrice: 200000,
    bookingId: "DEMO123",
  };

  // Sử dụng data thật nếu có, nếu không dùng demo data
  const displayData = location.state
    ? {
        movie: movie || demoData.movie,
        showtime: showtime || demoData.showtime,
        selectedSeats: selectedSeats || demoData.selectedSeats,
        popcornCount: popcornCount || demoData.popcornCount,
        drinkCount: drinkCount || demoData.drinkCount,
        popcornTotal: popcornTotal || demoData.popcornTotal,
        drinkTotal: drinkTotal || demoData.drinkTotal,
        totalPrice: totalPrice || demoData.totalPrice,
        bookingId: bookingId || demoData.bookingId,
      }
    : demoData;

  useEffect(() => {
    console.log("=== DISPLAY DATA ===");
    console.log("Display data:", displayData);
  }, [displayData]);

  // Kiểm tra xem có data không - CHỈ show error nếu hoàn toàn không có gì
  if (!location.state && process.env.NODE_ENV === "production") {
    return (
      <div className="bg-[#000000] min-h-screen">
        <NavBar />
        <div className="bg-[#1e293b] max-w-md mx-auto my-10 p-6 rounded-xl shadow-lg">
          <div className="text-center text-white">
            <h2 className="text-xl font-bold mb-4">Không có thông tin vé</h2>
            <p className="text-gray-400 mb-6">
              Vui lòng đặt vé trước để xem thông tin.
            </p>
            <button
              onClick={handleHomeClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Về trang chủ
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Load cinema information khi component mount
  useEffect(() => {
    const loadCinemaInfo = async () => {
      if (!displayData.showtime?.cinemaId) {
        setLoading(false);
        return;
      }

      try {
        console.log(
          "🎬 Loading cinema info for:",
          displayData.showtime.cinemaId
        );
        const response = await getCinemaById(displayData.showtime.cinemaId);

        if (response.error) {
          console.error("Error loading cinema:", response.error);
        } else {
          setCinemaInfo(response.data);
          console.log("✅ Cinema info loaded:", response.data);
        }
      } catch (error) {
        console.error("Error loading cinema:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCinemaInfo();
  }, [displayData.showtime?.cinemaId]);

  // Format ngày giờ chiếu
  const formatShowDateTime = (showTimeString) => {
    if (!showTimeString) return "Chưa có thông tin";

    const date = new Date(showTimeString);
    const dateStr = date.toLocaleDateString("vi-VN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const timeStr = date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateStr} - ${timeStr}`;
  };

  const BANK_CODE = "MB"; // Mã ngân hàng (VCB = Vietcombank, TCB = Techcombank, BIDV, ...). Xem thêm mã tại https://vietqr.net/
  const ACCOUNT_NUMBER = "0906480043";
  const addInfo = `thanhtoan_${displayData.movie.title.replace(/\s/g, "")}`;
  const vietQRUrl = `https://img.vietqr.io/image/${BANK_CODE}-${ACCOUNT_NUMBER}-compact2.jpg?amount=${displayData.totalPrice}&addInfo=${addInfo}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <NavBar />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-[#BE1238] rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-[#ff4757] rounded-full"></div>
        <div className="absolute top-40 right-40 w-16 h-16 bg-[#BE1238] rounded-full blur-xl"></div>
        <div className="absolute bottom-40 left-40 w-12 h-12 bg-[#ff4757] rounded-full blur-xl"></div>
      </div>

      {/* Debug banner - chỉ hiển thị trong development */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/30 text-center py-2 relative z-10">
          <p className="text-yellow-300 text-sm">
            🔧 DEBUG MODE:{" "}
            {location.state ? "Data từ navigation" : "Sử dụng demo data"}
          </p>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative z-10 text-center text-white pt-8 pb-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
          💳 Thông Tin Đặt Vé
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-[#BE1238] to-[#ff4757] mx-auto rounded-full"></div>
      </div>

      {/* Main Ticket Container */}
      <div className="relative z-10 max-w-lg mx-auto px-4 pb-12">
        <div className="bg-gradient-to-b from-[#1f1f1f] to-[#0f0f0f] rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Header với logo */}
          <div className="bg-gradient-to-r from-[#BE1238] to-[#ff4757] p-6 text-center relative">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-white mb-2">
                NEKO CINEMA
              </h2>
              <p className="text-gray-200 text-sm">
                Xác nhận đặt vé | Booking Confirmation
              </p>
            </div>

            {/* Decorative cuts */}
            <div className="absolute -bottom-3 left-8 w-6 h-6 bg-black rounded-full"></div>
            <div className="absolute -bottom-3 right-8 w-6 h-6 bg-black rounded-full"></div>
          </div>

          {/* Payment Status */}
          <div className="px-6 py-4 bg-yellow-500/10 border-b border-yellow-500/30">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-yellow-400 font-semibold">
                Chờ thanh toán
              </span>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="px-6 py-8 text-center bg-white/5 border-b border-gray-700">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-lg">
              <img
                src={vietQRUrl}
                alt="QR Code Thanh Toán"
                width={180}
                height={180}
                className="rounded-lg"
              />
            </div>
            <p className="text-gray-400 text-sm mt-4">
              <strong className="text-white">Quét mã QR để thanh toán</strong>
              <br />
              Chuyển khoản theo số tiền hiển thị bên dưới
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="p-8 text-center text-white">
              <div className="inline-flex items-center space-x-2 text-[#BE1238]">
                <div className="w-6 h-6 border-2 border-[#BE1238] border-t-transparent rounded-full animate-spin"></div>
                <span>Đang tải thông tin vé...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Ticket Information */}
              <div className="p-6">
                <TicketInfo
                  movie={displayData.movie?.title || "Chưa có thông tin"}
                  cinema={cinemaInfo?.name || "Chưa có thông tin"}
                  dateTime={formatShowDateTime(displayData.showtime?.showTime)}
                  room={displayData.showtime?.roomName || "Chưa có thông tin"}
                  seats={
                    displayData.selectedSeats?.join(", ") || "Chưa chọn ghế"
                  }
                  price={
                    displayData.totalPrice
                      ? `${displayData.totalPrice.toLocaleString()}đ`
                      : "0đ"
                  }
                  popcornCount={displayData.popcornCount || 0}
                  drinkCount={displayData.drinkCount || 0}
                  popcornTotal={displayData.popcornTotal || 0}
                  drinkTotal={displayData.drinkTotal || 0}
                />
              </div>

              {/* Booking ID */}
              {displayData.bookingId && (
                <div className="px-6 pb-4">
                  <div className="bg-gradient-to-r from-[#2b2b2b] to-[#1f1f1f] p-4 rounded-xl border border-gray-600">
                    <div className="text-center">
                      <p className="text-gray-400 text-sm mb-1">Mã booking</p>
                      <p className="text-white font-mono text-lg font-bold tracking-wider">
                        {displayData.bookingId}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="p-6 bg-[#1a1a1a] border-t border-gray-700">
                <ActionButtons
                  onHomeClick={handleHomeClick}
                  onDownloadClick={handleDownloadClick}
                />
              </div>
            </>
          )}

          {/* Decorative bottom cuts */}
          <div className="relative">
            <div className="absolute -top-3 left-8 w-6 h-6 bg-black rounded-full"></div>
            <div className="absolute -top-3 right-8 w-6 h-6 bg-black rounded-full"></div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="mt-6 bg-[#1f1f1f] rounded-2xl p-4 border border-gray-700">
          <div className="text-center text-gray-400 text-sm">
            <p className="mb-2">
              💡 <strong className="text-white">Hướng dẫn thanh toán:</strong>
            </p>
            <ul className="text-left space-y-1 text-xs">
              <li>• Quét mã QR bằng app ngân hàng của bạn</li>
              <li>• Chuyển khoản đúng số tiền hiển thị</li>
              <li>• Sau khi thanh toán thành công, vé sẽ được gửi về email</li>
              <li>• Liên hệ hotline nếu cần hỗ trợ: 1900-xxxx</li>
            </ul>
          </div>
        </div>

        {/* Status Animation */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 text-yellow-400">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Chờ thanh toán...</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TicketPage;
