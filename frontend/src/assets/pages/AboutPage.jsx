import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import React from "react";

const sections = [
  {
    title: "Đồ ăn & Thức uống",
    items: [
      {
        img: "public/AboutPage/food.png",
        title: "FOOD AND DRINK",
        desc: "Tại rạp phim Neko Cinema không chỉ là nơi tận hưởng những bộ phim đỉnh cao, mà còn phục vụ nhiều món ăn và thức uống độc đáo, không cần phải lo buồn miệng khi đang xem phim nữa nè. Ice blended mát lạnh cùng smoothie bổ dưỡng hay hương trà thơm ngon hòa quyện với vị sữa béo ngậy cùng trân châu ngon mê ly?",
      },
    ],
  },
  {
    title: "Dịch vụ tiện ích",
    items: [
      {
        img: "public/AboutPage/dichvu.png",
        title: "GAME XU VUI NHỘN SC'GAME",
        desc: "Khu vui chơi dành cho những bạn nhỏ năng động. Với diện tích hơn 800m2, sức chứa hơn 400 bé và hơn 60 trò chơi hấp dẫn, đầy màu sắc. SC'Kidzone là địa điểm lý tưởng để gia đình vui chơi cùng con yêu.",
      },
      {
        img: "public/AboutPage/soidong.png",
        title: "KHU VỰC SÔI ĐỘNG SC'KIDZONE",
        desc: "Khu vui chơi dành cho những bạn nhỏ năng động. Với diện tích hơn 800m2, sức chứa hơn 400 bé và hơn 60 trò chơi hấp dẫn, đầy màu sắc cho trẻ em.",
      },
      {
        img: "public/AboutPage/bowling.png",
        title: "HỆ THỐNG SC'BOWLING",
        desc: "Sân chơi giải trí, vận động lành mạnh phù hợp với mọi lứa tuổi. Với hệ thống đường chơi hiện đại và ánh sáng lung linh, SC'bowling là nơi lý tưởng để cùng gia đình và bạn bè tận hưởng những khoảnh khắc thú vị.",
      },
    ],
  },
  {
    title: "Công nghệ phòng chiếu",
    items: [
      {
        img: "public/AboutPage/3d.png",
        title: "CÔNG NGHỆ 3D",
        desc: "Công nghệ 3D Digital cho phép khán giả cảm nhận thêm chiều sâu của hình ảnh, giúp cho không gian điện ảnh trở nên sống động như không gian thực. Các phòng chiếu sử dụng màn hình tráng bạc để giảm thiểu hao hụt ánh sáng.",
      },
      {
        img: "public/AboutPage/sweet.png",
        title: "SWEETBOX",
        desc: "Loại ghế đôi SWEETBOX cực kỳ độc đáo và mới lạ. SWEETBOX được đặt ở hàng ghế cuối cùng trong phòng chiếu với vách ngăn cao và thiết kế khéo léo, tạo không gian hoàn hảo cho các cặp đôi.",
      },
      {
        img: "public/AboutPage/maychieu.png",
        title: "MÁY CHIẾU OPTIMA",
        desc: "Máy chiếu Optoma cung cấp hình ảnh chất lượng kỹ thuật số 4K đỉnh cao. Công nghệ laser cung cấp khả năng tái tạo màu sắc chính xác với 90% độ phủ gam màu Rec.709 và 75% độ phủ DCI-P3.",
      },
    ],
  },
];

function AboutPage() {
  return (
    <>
      <NavBar />

      {/* Main content */}
      <div className="bg-black min-h-screen">
        <div className="px-[100px] pt-16 pb-20">
          <div className="space-y-16">
            {sections.map((section, sectionIndex) => (
              <section key={sectionIndex} className="relative">
                {/* Section header */}
                <div className="text-center mb-10">
                  <h2 className="text-2xl sm:text-3xl font-bold uppercase text-white mb-4">
                    {section.title}
                  </h2>
                  {/* Decorative underline - giống như "Đồ ăn & Thức uống" */}
                  <div className="w-24 h-1 bg-gradient-to-r from-[#BE1238] to-[#ff4757] mx-auto rounded-full"></div>
                </div>

                {/* Items container */}
                <div className="space-y-6">
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="group bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-xl overflow-hidden border border-gray-700/50 hover:border-[#be1238]/40 transition-all duration-300"
                    >
                      <div className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                          {/* Image container - smaller size */}
                          <div className="flex-shrink-0 w-full sm:w-64">
                            <div className="relative overflow-hidden rounded-lg">
                              <img
                                src={item.img}
                                alt={item.title}
                                className="w-full h-40 sm:h-48 object-cover transform group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => {
                                  e.target.src = "/placeholder-image.jpg";
                                }}
                              />
                              {/* Subtle overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 space-y-3">
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-[#be1238] transition-colors duration-300">
                                {item.title}
                              </h3>
                              <div className="w-12 h-0.5 bg-[#be1238] rounded-full"></div>
                            </div>

                            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Section separator */}
                {sectionIndex < sections.length - 1 && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-px bg-gradient-to-r from-transparent to-gray-600"></div>
                      <div className="w-1.5 h-1.5 bg-[#be1238] rounded-full"></div>
                      <div className="w-12 h-px bg-gray-600"></div>
                      <div className="w-1.5 h-1.5 bg-[#be1238] rounded-full"></div>
                      <div className="w-6 h-px bg-gradient-to-l from-transparent to-gray-600"></div>
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>
        </div>

        {/* Bottom CTA section - smaller and more compact */}
        <div className="px-[100px] pb-16">
          <div className="text-center bg-gradient-to-r from-gray-900/60 to-gray-800/60 rounded-xl p-6 sm:p-8 border border-gray-700/50">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
              Sẵn sàng trải nghiệm?
            </h3>
            <p className="text-gray-300 mb-6 max-w-xl mx-auto text-sm sm:text-base">
              Đặt vé ngay hôm nay và khám phá thế giới điện ảnh đầy màu sắc tại
              Neko Cinema
            </p>
            <button className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-[#be1238] to-[#ff4757] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-[#be1238]/25 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base">
              <span>Đặt vé ngay</span>
              <svg
                className="w-4 h-4 ml-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default AboutPage;
