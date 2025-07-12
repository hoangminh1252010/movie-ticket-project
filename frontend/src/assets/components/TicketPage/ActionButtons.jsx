import React from "react";
import { FaHome, FaDownload, FaShare, FaPrint } from "react-icons/fa";

const ActionButtons = ({ onHomeClick, onDownloadClick }) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Booking Neko Cinema",
        text: "Đang chờ thanh toán đặt vé tại Neko Cinema!",
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Đã sao chép link booking!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Primary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onDownloadClick}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#BE1238] to-[#ff4757] hover:from-[#ff4757] hover:to-[#BE1238] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
        >
          <FaDownload className="text-sm group-hover:animate-bounce" />
          <span className="text-sm">Lưu QR</span>
        </button>

        <button
          onClick={onHomeClick}
          className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 border border-gray-600 hover:border-gray-500 group"
        >
          <FaHome className="text-sm group-hover:scale-110 transition-transform" />
          <span className="text-sm">Trang chủ</span>
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleShare}
          className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 border border-gray-600 hover:border-gray-500 group"
        >
          <FaShare className="text-xs group-hover:scale-110 transition-transform" />
          <span className="text-xs">Chia sẻ</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-300 border border-gray-600 hover:border-gray-500 group"
        >
          <FaPrint className="text-xs group-hover:scale-110 transition-transform" />
          <span className="text-xs">In QR</span>
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
