import React from "react";
import {
  FaTag,
  FaClock,
  FaUsers,
  FaTicketAlt,
  FaArrowRight,
  FaStar,
} from "react-icons/fa";

const Promotion = ({ promotion }) => {
  const promotions = [
    {
      id: 1,
      title: "C'STUDENT – 45K CHO HỌC SINH SINH VIÊN",
      subtitle: "Ưu đãi đặc biệt cho học sinh, sinh viên",
      price: "45K/2D",
      originalPrice: "75K",
      discount: "40%",
      icon: FaUsers,
      tag: "STUDENT",
      conditions: [
        "HSSV xuất trình thẻ HSSV hoặc CCCD có xác nhận dưới 22 tuổi",
        "Giảm giá vào việc xem xuất trình thẻ giáo viên",
        "Áp dụng từ thứ 2 tới thứ 6 tại mọi rạp Neko Cinema",
      ],
      limitations: [
        "Mỗi lần mua được một vé",
        "Không áp dụng cho các ngày lễ, Tết",
        "Không áp dụng suất chiếu có phụ thu từ nhà phát hành phim",
      ],
      image: "/PromotionPage/giamgia.jpg",
      color: "from-blue-600 to-purple-600",
    },
    {
      id: 2,
      title: "C'MEMBER – HAPPY MEMBER'S DAY",
      subtitle: "Thành viên vui vẻ - Giá cả hạnh phúc",
      price: "45K/2D",
      originalPrice: "75K",
      discount: "40%",
      icon: FaStar,
      tag: "MEMBER",
      conditions: [
        "Khách hàng là thành viên C'FRIEND hoặc CVIP của Neko Cinema",
        "Áp dụng vào thứ 4 hàng tuần",
        "Áp dụng tại App/Website hoặc mua trực tiếp tại rạp",
      ],
      limitations: [
        "Giảm thêm 10% cho chủ thẻ C'FRIEND",
        "Giảm thêm 15% cho chủ thẻ C'VIP",
        "Áp dụng cho cả bắp nước",
      ],
      image: "/PromotionPage/magiam.jpg",
      color: "from-green-600 to-teal-600",
    },
    {
      id: 3,
      title: "C'TEN – HAPPY HOUR",
      subtitle: "Giờ vàng - Giá sốc 45K",
      price: "45K/2D",
      originalPrice: "75K",
      discount: "40%",
      icon: FaClock,
      tag: "HAPPY HOUR",
      conditions: [
        "Áp dụng cho suất chiếu trước 10h sáng",
        "Áp dụng cho suất chiếu sau 10h tối",
        "Khách hàng là thành viên C'FRIEND hoặc CVIP",
      ],
      limitations: [
        "Áp dụng tại App/Website hoặc mua trực tiếp tại rạp",
        "Không áp dụng cho các ngày lễ/tết",
        "Giá 58K cho định dạng 3D",
      ],
      image: "/PromotionPage/thuhai.jpg",
      color: "from-orange-600 to-red-600",
    },
  ];

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-black text-white min-h-screen relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-[#BE1238] rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 border border-[#ff4757] rounded-full"></div>
        <div className="absolute top-40 right-40 w-16 h-16 bg-[#BE1238] rounded-full blur-xl"></div>
        <div className="absolute bottom-40 left-40 w-12 h-12 bg-[#ff4757] rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 px-[100px] pt-16 pb-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Khuyến Mãi
            </h1>
          </div>

          <div className="w-24 h-1 bg-gradient-to-r from-[#BE1238] to-[#ff4757] mx-auto rounded-full mb-4"></div>

          <p className="text-gray-300 text-md max-w-2xl mx-auto leading-relaxed">
            Những ưu đãi hấp dẫn và chương trình khuyến mãi đặc biệt tại Neko
            Cinema
          </p>
        </div>

        {/* Promotions List */}
        <div className="space-y-8">
          {promotions.map((promo, index) => (
            <div
              key={promo.id}
              className="group"
              style={{
                animationDelay: `${index * 0.2}s`,
                animation: "fadeInUp 0.8s ease-out forwards",
              }}
            >
              <div className="bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-black/50 backdrop-blur-lg rounded-xl border border-gray-700/50 hover:border-[#BE1238]/50 transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-[#BE1238]/10">
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Image Section */}
                  <div className="relative overflow-hidden">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="w-full h-64 lg:h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent"></div>

                    {/* Discount Badge */}
                    <div className="absolute top-4 left-4">
                      <div className="bg-gradient-to-r from-[#BE1238] to-[#ff4757] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                        -{promo.discount}
                      </div>
                    </div>

                    {/* Tag Badge */}
                    <div className="absolute top-4 right-4">
                      <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                        <promo.icon className="text-[#BE1238] text-xs" />
                        {promo.tag}
                      </div>
                    </div>

                    {/* Price Overlay */}
                    <div className="absolute bottom-4 left-4">
                      <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-[#BE1238]">
                            {promo.price}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            {promo.originalPrice}
                          </span>
                        </div>
                        <p className="text-xs text-gray-300 mt-1">Giá ưu đãi</p>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h2 className="text-xl font-bold mb-2 text-white group-hover:text-[#BE1238] transition-colors duration-300">
                        {promo.title}
                      </h2>

                      {/* Subtitle */}
                      <p className="text-gray-400 text-base mb-4 italic">
                        {promo.subtitle}
                      </p>

                      {/* Conditions */}
                      <div className="mb-4">
                        <h3 className="text-base font-semibold mb-2 text-[#ff4757] flex items-center gap-2">
                          <FaTicketAlt className="text-xs" />
                          Điều kiện áp dụng:
                        </h3>
                        <ul className="space-y-1">
                          {promo.conditions.map((condition, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-gray-300"
                            >
                              <div className="w-1.5 h-1.5 bg-[#BE1238] rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-xs">{condition}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Limitations */}
                      <div className="mb-6">
                        <h3 className="text-base font-semibold mb-2 text-[#ff4757] flex items-center gap-2">
                          <FaClock className="text-xs" />
                          Lưu ý:
                        </h3>
                        <ul className="space-y-1">
                          {promo.limitations.map((limitation, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-gray-300"
                            >
                              <div className="w-1.5 h-1.5 bg-[#ff4757] rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-xs">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className="bg-gradient-to-r from-[#BE1238] to-[#ff4757] hover:from-[#ff4757] hover:to-[#BE1238] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#BE1238]/25 group/btn relative overflow-hidden">
                      <span className="relative z-10 flex items-center justify-center gap-2 text-sm">
                        <FaTicketAlt className="text-sm" />
                        Đặt Vé Ngay
                        <FaArrowRight className="text-sm group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </span>
                      <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-br from-gray-800/50 via-gray-900/50 to-black/50 backdrop-blur-lg rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-xl font-bold mb-3 text-white">
              Có câu hỏi về chương trình khuyến mãi?
            </h3>
            <p className="text-gray-400 mb-4 text-sm">
              Liên hệ với chúng tôi để được tư vấn chi tiết về các ưu đãi hiện
              có
            </p>
            <div className="flex justify-center gap-3">
              <button className="bg-gray-700 hover:bg-[#BE1238] text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm">
                Hotline: 028 174 2003
              </button>
              <button className="border border-gray-600 hover:border-[#BE1238] text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm">
                Email: contact@nekocinema.com
              </button>
            </div>
          </div>
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
