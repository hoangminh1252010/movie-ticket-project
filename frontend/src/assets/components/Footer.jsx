import React from "react";
import { IoMailOutline } from "react-icons/io5";
import { FaPhone, FaClock, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white w-full overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/footer.jpg')] bg-cover bg-center opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent"></div>

      {/* Main Content */}
      <div className="relative z-10 py-12">
        <div className="px-[100px]">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {/* Customer Care Section */}
            <div className="space-y-4">
              <div className="relative">
                <h3 className="text-sm font-bold bg-gradient-to-r from-[#BE1238] to-[#ff4757] py-2 px-4 mb-4 rounded-lg shadow-lg">
                  CHĂM SÓC KHÁCH HÀNG
                </h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                  <FaPhone className="text-[#BE1238] text-sm" />
                  <div>
                    <span className="text-sm text-gray-300">Hotline:</span>
                    <p className="text-white font-semibold">028 174 2003</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                  <FaClock className="text-[#BE1238] text-sm mt-1" />
                  <div>
                    <span className="text-sm text-gray-300">Giờ làm việc:</span>
                    <p className="text-white font-semibold text-sm">
                      8h00-22h00 tất cả các ngày trong tuần
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300">
                  <FaEnvelope className="text-[#BE1238] text-sm" />
                  <div>
                    <span className="text-sm text-gray-300">Email:</span>
                    <p className="text-white font-semibold">
                      contact@nekocinema.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social & App Section */}
            <div className="space-y-6">
              {/* Social Media */}
              <div>
                <h3 className="text-sm font-bold bg-gradient-to-r from-[#BE1238] to-[#ff4757] py-2 px-4 mb-4 rounded-lg shadow-lg">
                  KẾT NỐI VỚI CHÚNG TÔI
                </h3>
                <div className="flex gap-3 justify-start">
                  {[
                    { src: "/fb.svg", alt: "Facebook", size: "h-11" },
                    { src: "/yt.svg", alt: "Youtube", size: "h-11" },
                    { src: "/insta.svg", alt: "Instagram", size: "h-11" },
                    { src: "/zalo.png", alt: "Zalo", size: "h-10" },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className="p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                    >
                      <img
                        className={social.size}
                        src={social.src}
                        alt={social.alt}
                      />
                    </a>
                  ))}
                </div>
              </div>

              {/* Mobile Apps */}
              <div>
                <h3 className="text-sm font-bold bg-gradient-to-r from-[#BE1238] to-[#ff4757] py-2 px-4 mb-4 rounded-lg shadow-lg">
                  ỨNG DỤNG
                </h3>
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="group transform hover:scale-105 transition-all duration-300"
                  >
                    <img
                      alt="App Store"
                      className="w-[120px] rounded-lg shadow-lg group-hover:shadow-xl"
                      src="/as.png"
                    />
                  </a>
                  <a
                    href="#"
                    className="group transform hover:scale-105 transition-all duration-300"
                  >
                    <img
                      alt="Google Play"
                      className="w-[120px] rounded-lg shadow-lg group-hover:shadow-xl"
                      src="/gp.png"
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Policies Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold bg-gradient-to-r from-[#BE1238] to-[#ff4757] py-2 px-4 mb-4 rounded-lg shadow-lg">
                CHÍNH SÁCH VÀ QUY ĐỊNH
              </h3>
              <div className="space-y-2">
                {[
                  "Quy định chung",
                  "Điều khoản giao dịch",
                  "Chính sách bảo mật",
                  "Thông tin công ty",
                ].map((policy, index) => (
                  <a
                    key={index}
                    href="#"
                    className="block text-sm text-gray-300 hover:text-[#BE1238] transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-gray-800/30"
                  >
                    {policy}
                  </a>
                ))}
              </div>
            </div>

            {/* Other Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold bg-gradient-to-r from-[#BE1238] to-[#ff4757] py-2 px-4 mb-4 rounded-lg shadow-lg">
                KHÁC
              </h3>
              <div className="space-y-2">
                {[
                  "Câu Hỏi Thường Gặp",
                  "Hướng Dẫn Đặt Vé Online",
                  "Liên Hệ",
                  "Tuyển Dụng",
                ].map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    className="block text-sm text-gray-300 hover:text-[#BE1238] transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-gray-800/30"
                  >
                    {item}
                  </a>
                ))}
              </div>

              {/* Newsletter Registration */}
              <div className="mt-6">
                <a
                  href="#"
                  className="flex items-center justify-center gap-3 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-[#BE1238] hover:to-[#ff4757] py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                >
                  <IoMailOutline className="text-xl group-hover:animate-bounce" />
                  <span className="text-sm font-medium">ĐĂNG KÍ NHẬN TIN</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700/50">
          <div className="px-[100px] text-center space-y-4">
            {/* Certification Logo */}
            <div className="flex justify-center mb-6">
              <img
                alt="Đã Thông Báo Bộ Công Thương"
                className="h-16 opacity-80 hover:opacity-100 transition-opacity duration-300"
                src="/logo-da-thong-bao-bo-cong-thuong-mau-xanh.png"
              />
            </div>

            {/* Company Information */}
            <div className="space-y-2 text-xs text-gray-400 max-w-4xl mx-auto">
              <p className="font-semibold text-gray-300">
                CÔNG TY CỔ PHẦN GIẢI TRÍ PHÁT HÀNH PHIM - RẠP CHIẾU PHIM NEKO
                CINEMA
              </p>
              <p>ĐỊA CHỈ: 135 LINH TRUNG, PHƯỜNG LINH TRUNG, THỦ ĐỨC, TP.HCM</p>
              <p>
                GIẤY CNĐKDN SỐ: 0309790798, ĐĂNG KÝ LẦN ĐẦU NGÀY 10/11/2023 CẤP
                BỞI SỞ KH&ĐT TP.HCM
              </p>
            </div>

            {/* Copyright */}
            <div className="pt-4">
              <p className="text-sm font-medium text-gray-500">
                2024 © <span className="text-[#BE1238]">NEKOCINEMA</span>. ALL
                RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
