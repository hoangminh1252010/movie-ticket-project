import React from "react";

const UserInfo = () => {
  return (
    <div className="relative w-[1080px] h-[900px] bg-black text-white rounded-[20px] border border-solid p-6">
      <div className="relative w-[790px] h-[765px] bg-[#a5d1e8] rounded-[20px] border border-solid  mx-auto p-6">
        <div className="absolute w-[379px] h-[399px] top-28 left-[390px]">
          <p className="absolute w-[231px] h-10 top-[62px] left-3.5 font-bold text-black text-base">
            Họ và tên: <span className="text-[#3d4964]">Nguyễn Văn A</span>
          </p>

          <div className="absolute w-[291px] h-10 top-[102px] left-3.5">
            <p className="font-bold text-black text-base">
              Ngày sinh: <span className="text-[#3e4964]">18/05/2003</span>
            </p>
            <img className="absolute w-6 h-6 top-[9px] left-[267px]" alt="Edit" src="/Userinfopng/Icon-edit.png" />
          </div>

          <div className="absolute w-[291px] h-10 top-[142px] left-3.5">
            <p className="font-bold text-black text-base">
              CCCD/CMND: <span className="text-[#3e4964]">012345678945</span>
            </p>
            <img className="absolute w-6 h-6 top-[9px] left-[267px]" alt="Edit" src="/Userinfopng/Icon-edit.png" />
          </div>

          <div className="absolute w-[291px] h-10 top-[182px] left-3.5">
            <p className="font-bold text-black text-base">
              Số điện thoại: <span className="text-[#3e4964]">0123456789</span>
            </p>
            <img className="absolute w-6 h-6 top-[9px] left-[267px]" alt="Edit" src="/Userinfopng/Icon-edit.png" />
          </div>

          <div className="absolute w-[291px] h-10 top-[222px] left-3.5">
            <p className="font-bold text-black text-base">
              Email: <span className="text-[#3e4964]">nguyenvana@gmail.com</span>
            </p>
            <img className="absolute w-6 h-6 top-[9px] left-[267px]" alt="Edit" src="/Userinfopng/Icon-edit.png" />
          </div>

          <p className="absolute w-[279px] h-10 top-[262px] left-3.5 font-bold text-black text-base">
            Mã thành viên: <span className="text-[#3e4964]">UID-11678</span>
          </p>

          <p className="absolute w-[279px] h-10 top-[302px] left-3.5 font-bold text-black text-base">
            Điểm tích lũy: <span className="text-[#3e4964]">10</span>
          </p>

          <img className="top-[71px] left-[281px] absolute w-6 h-6" alt="Edit" src="/Userinfopng/Icon-edit.png" />
        </div>

        <div className="absolute w-[125px] h-10 top-[434px] left-[143px] font-bold text-[#044da1] text-base cursor-pointer">
          Đổi ảnh đại diện
        </div>
        <img className="top-[443px] left-[274px] absolute w-6 h-6" alt="Edit" src="/Userinfopng/Icon-edit.png" />

        <div className="absolute w-[322px] h-[54px] top-[54px] left-[254px] font-bold text-black text-[32px]">
          Thông tin tài khoản
        </div>

        <img
          className="absolute w-[225px] h-[225px] top-[199px] left-[99px] object-cover rounded-full border"
          alt="Avatar"
          src="/Userinfopng/Ellipse43.png"
        />

        <div className="absolute w-[645px] h-[162px] top-[531px] left-[72px] bg-[#ddf3ff] rounded-lg">
          <div className="absolute w-[558px] h-[47px] top-[78px] left-10 bg-gray-200 rounded-md flex items-center pl-8">
            <p className="font-bold text-[#0b2447f9] text-base">
              Hiện chưa có giao dịch nào.
            </p>
          </div>
          <div className="absolute top-[18px] left-10 font-bold text-black text-[22px]">
            Giao dịch gần nhất
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
