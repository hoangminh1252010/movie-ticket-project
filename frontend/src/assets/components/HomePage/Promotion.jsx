import React from "react";
import { FaArrowRight, FaTag, FaClock } from "react-icons/fa";

const Promotion = () => {
  const promotions = [
    {
      id: 1,
      title: "THỨ 4 45K",
      image: "/HomePage/promotion1.png",
      tag: "HOT DEAL",
      description: "Chỉ 45k cho mọi suất chiếu vào thứ 4",
      discount: "40%",
    },
    {
      id: 2,
      title: "ƯU ĐÃI HỌC SINH, SINH VIÊN",
      image: "/HomePage/promotion2.png",
      tag: "STUDENT",
      description: "Giảm giá đặc biệt cho học sinh, sinh viên",
      discount: "25%",
    },
    {
      id: 3,
      title: "GIỜ VÀNG GIÁ SỐC",
      image: "/HomePage/promotion3.png",
      tag: "LIMITED",
      description: "Giá sốc trong khung giờ vàng",
      discount: "50%",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white px-[100px] pb-10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-[#BE1238] rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-[#ff4757] rounded-full"></div>
        <div className="absolute top-40 right-40 w-16 h-16 bg-[#BE1238] rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <FaTag className="text-[#BE1238] text-xl" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Khuyến mãi
            </h2>
            <FaTag className="text-[#ff4757] text-xl" />
          </div>
          <div className="w-20 h-1 bg-gradient-to-r from-[#BE1238] to-[#ff4757] mx-auto rounded-full"></div>
          <p className="text-gray-400 mt-2 text-base">
            Những ưu đãi hấp dẫn không thể bỏ lỡ
          </p>
        </div>

        {/* Promotions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
          {promotions.map((promo, index) => (
            <div
              key={promo.id}
              className="group relative bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl p-4 w-full max-w-[280px] shadow-2xl hover:shadow-[#BE1238]/20 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 border border-gray-700/50 hover:border-[#BE1238]/50"
              style={{
                animationDelay: `${index * 0.2}s`,
                animation: "fadeInUp 0.8s ease-out forwards",
              }}
            >
              {/* Discount Badge */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-[#BE1238] to-[#ff4757] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform duration-300">
                -{promo.discount}
              </div>

              {/* Tag */}
              <div className="inline-flex items-center gap-1 bg-gray-700/50 px-2 py-1 rounded-full text-xs font-medium text-[#BE1238] mb-3 backdrop-blur-sm">
                <FaClock className="text-xs" />
                {promo.tag}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-center mb-3 text-white group-hover:text-[#BE1238] transition-colors duration-300">
                {promo.title}
              </h3>

              {/* Image Container */}
              <div className="relative overflow-hidden rounded-lg mb-3 shadow-lg">
                <img
                  alt={`Promotion image for ${promo.title}`}
                  className="w-full h-[140px] object-cover group-hover:scale-110 transition-transform duration-500"
                  src={promo.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-[#BE1238]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-xs text-center mb-4 line-clamp-2">
                {promo.description}
              </p>

              {/* Action Button */}
              <button className="w-full bg-gradient-to-r from-[#BE1238] to-[#ff4757] hover:from-[#ff4757] hover:to-[#BE1238] text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#BE1238]/25 group/btn relative overflow-hidden">
                <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
                  Chi tiết
                  <FaArrowRight className="text-xs group-hover/btn:translate-x-1 transition-transform duration-300" />
                </span>
                <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>

              {/* Decorative Elements */}
              <div className="absolute top-3 left-3 w-1.5 h-1.5 bg-[#BE1238] rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-3 right-3 w-2 h-2 border border-[#ff4757] rounded-full opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-[#BE1238] hover:to-[#ff4757] text-white font-medium py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-600 hover:border-transparent group">
            <span className="text-sm">Xem tất cả khuyến mãi</span>
            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Promotion;
