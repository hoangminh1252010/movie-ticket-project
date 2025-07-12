import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { FaRobot, FaComments, FaHeadset, FaLightbulb } from "react-icons/fa";

const ChatBotDemo = () => {
  const features = [
    {
      icon: FaComments,
      title: "Hỗ trợ 24/7",
      description: "Chatbot luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi",
      color: "from-blue-500 to-purple-600",
    },
    {
      icon: FaHeadset,
      title: "Trả lời thông minh",
      description: "AI hiểu và trả lời các câu hỏi về phim, vé, ưu đãi",
      color: "from-green-500 to-teal-600",
    },
    {
      icon: FaLightbulb,
      title: "Gợi ý phù hợp",
      description: "Đưa ra những gợi ý phim và suất chiếu phù hợp với bạn",
      color: "from-yellow-500 to-orange-600",
    },
  ];

  const sampleQuestions = [
    "Phim gì đang chiếu hôm nay?",
    "Giá vé bao nhiêu?",
    "Có ưu đãi gì không?",
    "Rạp ở đâu?",
    "Làm sao để đặt vé online?",
    "Combo bắp nước giá bao nhiêu?",
    "Có chỗ để xe không?",
    "Suất chiếu cuối là mấy giờ?",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <NavBar />

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-12">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 border border-[#BE1238] rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-[#ff4757] rounded-full"></div>
          <div className="absolute top-40 right-40 w-16 h-16 bg-[#BE1238] rounded-full blur-xl"></div>
        </div>

        <div className="relative z-10 text-center text-white px-[100px]">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-[#BE1238] to-[#ff4757] rounded-full mb-6 p-2">
            <img
              src="/ChatBox/nekAI.jpg"
              alt="Neko AI"
              className="w-full h-full rounded-full object-cover border-2 border-white"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextElementSibling.style.display = "block";
              }}
            />
            <FaRobot className="text-3xl text-white hidden" />
          </div>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
            Neko Assistant
          </h1>

          <div className="w-24 h-1 bg-gradient-to-r from-[#BE1238] to-[#ff4757] mx-auto rounded-full mb-6"></div>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Trợ lý ảo thông minh của Neko Cinema - Luôn sẵn sàng hỗ trợ bạn 24/7
          </p>

          <div className="bg-[#1f1f1f] rounded-2xl p-6 max-w-4xl mx-auto border border-gray-700">
            <p className="text-gray-400 mb-4">
              💡 <strong>Mẹo:</strong> Nhấn vào biểu tượng robot ở góc dưới phải
              để bắt đầu trò chuyện!
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-[100px] py-12">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Tính năng nổi bật
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#1f1f1f] rounded-xl p-6 border border-gray-700 hover:border-[#BE1238]/40 transition-all duration-300 group"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r ${feature.color} rounded-lg mb-4 group-hover:scale-110 transition-transform`}
              >
                <feature.icon className="text-white text-xl" />
              </div>

              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#BE1238] transition-colors">
                {feature.title}
              </h3>

              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Questions */}
      <div className="px-[100px] py-12">
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          Câu hỏi thường gặp
        </h2>

        <p className="text-center text-gray-400 mb-12">
          Bạn có thể hỏi chatbot những câu hỏi như:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
          {sampleQuestions.map((question, index) => (
            <div
              key={index}
              className="bg-[#2b2b2b] rounded-lg p-4 border border-gray-600 hover:border-[#BE1238] transition-all duration-300 cursor-pointer group"
            >
              <p className="text-gray-300 text-sm group-hover:text-white transition-colors">
                "{question}"
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="px-[100px] py-12 text-center">
        <div className="bg-gradient-to-r from-[#1f1f1f] to-[#2b2b2b] rounded-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">
            Sẵn sàng trò chuyện?
          </h2>

          <p className="text-gray-400 mb-6">
            Chatbot Neko Assistant đang chờ để hỗ trợ bạn!
          </p>

          <div className="flex justify-center">
            <div className="bg-gradient-to-r from-[#BE1238] to-[#ff4757] text-white px-6 py-3 rounded-full font-semibold animate-pulse">
              👉 Nhấn vào biểu tượng robot bên dưới để bắt đầu
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChatBotDemo;
