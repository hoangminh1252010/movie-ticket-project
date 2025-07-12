import React from "react";
import Card from "./Card";

const sections = [
  {
    title: "Đồ ăn & Thức uống",
    items: [
      {
        img: "src/images/food.png",
        title: "FOOD AND DRINK",
        desc: "Tại rạp phim Neko Cinema không chỉ là nơi tận hưởng những bộ phim đỉnh cao, mà còn phục vụ nhiều món ăn và thức uống độc đáo, không cần phải lo “buồn miệng” khi đang xem phim nữa nè. Ice blended mát lạnh cùng smoothie bổ dưỡng hay hương trà thơm ngon hòa quyện với vị sữa béo ngậy cùng trân châu ngon mê ly? Nhiều combo tiết kiệm cùng giá cả hợp lý, Neko Cinema là nơi hợp lý cho những buổi giải trí cùng bạn, hẹn hò cùng người yêu.",
      },
    ],
  },
  {
    title: "Dịch vụ tiện ích",
    items: [
      {
        img: "src/images/dichvu.png",
        title: "GAME XU VUI NHỘN SC'GAME",
        desc: "Khu vui chơi dành cho những bạn nhỏ năng động theo cùng. Với diện tích hơn 800m2, sức chứa hơn 400 bé và hơn 60 trò chơi hấp dẫn, đầy màu sắc. SC’Kidzone là địa điểm lý tưởng để gia đình vui chơi cùng con yêu. ",
      },
      {
        img: "src/images/soidong.png",
        title: "KHU VỰC SÔI ĐỘNG SC'KIDZONE",
        desc: "Khu vui chơi dành cho những bạn nhỏ năng động theo cùng. Với diện tích hơn 800m2, sức chứa hơn 400 bé và hơn 60 trò chơi hấp dẫn, đầy màu sắc. SC’Kidzone là địa điểm lý tưởng để gia đình vui chơi cùng con yêu. ",
      },
      {
        img: "src/images/bowling.png",
        title: "HỆ THỐNG SC'BOWLING",
        desc: "SÂN CHƠI giải trí, vận động lành mạnh PHÙ HỢP VỚI MỌI LỨA TUỔI. Với hệ thống đường chơi hiện đại và ánh sáng lung linh, SC'bowling là nơi lý tưởng để  cùng gia đình và bạn bè tận hưởng những khoảnh khắc thú vị. Bạn có thể thể hiện tài năng bowling của mình hoặc đơn giản chỉ là thư giãn, tận hưởng không khí sôi động và âm nhạc phát sóng từ những đồng loa mạnh mẽ.",
      },
    ],
  },
  {
    title: "Công nghệ phòng chiếu",
    items: [
      {
        img: "src/images/3d.png",
        title: "CÔNG NGHỆ 3D",
        desc: "CÔNG NGHỆ 3D so với công nghệ chiếu phim 2D Digital công nghệ 3D Digital cho phép khán giả cảm nhận thêm chiều sâu của hình ảnh, giúp cho không gian điện ảnh trở nên sống động như không gian thực mà chúng ta đang sống. Phim 3D được quay từ tối thiểu hai máy cùng một lúc, từ hai góc nhìn khác nhau tương ứng với hoạt động của hai mắt người. Khi xem phim khán giả sẽ cần đeo kính 3D để lọc hình ảnh cho mỗi mắt, khi qua não bộ sẽ chập lại tạo thành hình ảnh không gian ba chiều. Các phòng chiếu phim 3D Digital này đều sử dụng màn hình tráng bạc để giảm thiểu lượng hao hụt ánh sáng một cách tối đa.",
      },
      {
        img: "src/images/sweet.png",
        title: "SWEETBOX",
        desc: "Với nỗ lực không ngừng mang đến cho người yêu phim Việt Nam trải nghiệm điện ảnh tốt nhất, SEACAT mang đến loại ghế đôi SWEETBOX cực kỳ độc đáo và mới lạ. SWEETBOX được đặt ở hàng ghế cuối cùng trong phòng chiếu. Với vách ngăn cao cũng như sự khéo léo trong thiết kế giấu đi tay gác chính giữa giúp cho đôi bạn càng thêm gần gũi và ấm áp, tạo không gian hoàn hảo cho các cặp đôi. ",
      },
      {
        img: "src/images/maychieu.png",
        title: "MÁY CHIẾU OPTIMA",
        desc: "Được thiết kế cho các phòng chiếu phim, máy chiếu Optoma cung cấp hình ảnh chất lượng kỹ thuật số 4K đỉnh cao. Công nghệ laser cung cấp khả năng tái tạo màu sắc chính xác, trung thực với 90% độ phủ gam màu Rec.709 và 75% độ phủ DCI-P3 – hoàn hảo để tái tạo trải nghiệm màn hình lớn.",
      },
    ],
  },
];

function Section() {
  return (
    <section className="space-y-12 mt-10">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <h1 className="text-left font-bold uppercase pl-10 text-white mb-20 text-2xl underline underline-offset-8 decoration-3 pt-12">
            {section.title}
          </h1>

          <div className="space-y-12">
            {section.items.map((item, itemIndex) => (
              <Card key={itemIndex} {...item} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
export default Section;
