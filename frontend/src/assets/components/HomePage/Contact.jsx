import React from "react";
import { IoMdMail } from "react-icons/io";
import { BsFillTelephoneFill } from "react-icons/bs";
import { FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="bg-black text-white flex items-center justify-center px-[200px] pb-10">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="contact-info py-4">
          <h2 className="text-2xl font-bold mb-4">LIÊN HỆ VỚI CHÚNG TÔI</h2>
          <p className="flex items-center mb-2 text-md">
            <IoMdMail className="mr-2" />
            contact@nekocinema.com
          </p>
          <p className="flex items-center mb-2 text-md">
            <BsFillTelephoneFill className="mr-2" /> 028 1742003
          </p>
          <p className="flex items-center text-md">
            <FaMapMarkerAlt className="mr-2" /> Trường Đại học Công nghệ thông
            tin, Linh Trung, Thủ Đức
          </p>
        </div>
        <div class="w-[480px] px-6 py-3 bg-[#1f1f1f] rounded-lg shadow-lg">
          <h2 class="text-xl font-semibold text-[#ffffff] mb-4">
            Thông tin liên hệ
          </h2>
          <form>
            <div class="mb-2">
              <label class="block text-white mb-1 text-[14px]" for="name">
                Họ và tên
              </label>
              <input
                class="text-[14px] h-[32px] w-full px-4 py-2 bg-[#2b2b2b] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE1238] transition duration-300 placeholder-[#aaaaaa]"
                placeholder="Enter your name"
                type="text"
              />
            </div>
            <div class="mb-2">
              <label class="block text-white mb-1 text-[14px]" for="email">
                Email
              </label>
              <input
                class="text-[14px] h-[32px] w-full px-4 py-2 bg-[#2b2b2b] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE1238] transition duration-300 placeholder-[#aaaaaa]"
                placeholder="Enter your email"
                name="email"
                id="email"
                type="email"
              />
            </div>
            <div class="mb-4">
              <label class="block text-white mb-1 text-[14px]" for="message">
                Thông tin bạn muốn truyền tải
              </label>
              <textarea
                class="text-[14px] w-full px-4 py-2 bg-[#2b2b2b] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE1238] transition duration-300  placeholder-[#aaaaaa]"
                rows="3"
                placeholder="Enter your message"
                name="message"
                id="message"
              ></textarea>
            </div>
            <button
              class="w-full bg-[#BE1238] text-white py-2 px-4 rounded-lg hover:bg-[#9F0F2F] transition duration-300 text-[14px]"
              type="submit"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Contact;
