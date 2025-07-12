import React, { useState } from "react";
import CheckboxGhinhomatkhau from "../components/common/CheckboxGhinhomatkhau";

const SignUpPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    birthDate: "",
    cccd: "",
    phone: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form đăng ký:", form);
    // TODO: validate + gửi API
  };

  return (
    <div className="max-w-[700px] mx-auto mt-10 bg-white rounded-xl p-8 border border-[#be1238]">
      <h1 className="text-3xl font-bold text-center mb-6">Đăng ký</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Họ và tên */}
        <Input
          label="Họ và tên*"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
        />

        {/* Ngày sinh */}
        <Input
          label="Ngày sinh*"
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
          type="date"
        />

        {/* CCCD/CMND */}
        <Input
          label="CCCD/CMND*"
          name="cccd"
          value={form.cccd}
          onChange={handleChange}
        />

        {/* Số điện thoại */}
        <Input
          label="Số điện thoại*"
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        {/* Email */}
        <Input
          label="Email*"
          name="email"
          value={form.email}
          onChange={handleChange}
          type="email"
        />

        {/* Tên đăng nhập */}
        <Input
          label="Tên đăng nhập*"
          name="username"
          value={form.username}
          onChange={handleChange}
        />

        {/* Mật khẩu */}
        <div>
          <Label text="Mật khẩu*" />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border-b border-gray-300 py-2 px-3 text-gray-700 focus:outline-none"
              required
            />
            <img
              src="https://c.animaapp.com/lSnjeCa0/img/eye@2x.png"
              alt="toggle"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 w-6 h-6 cursor-pointer"
            />
          </div>
        </div>

        {/* Xác nhận mật khẩu */}
        <div>
          <Label text="Xác nhận mật khẩu*" />
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border-b border-gray-300 py-2 px-3 text-gray-700 focus:outline-none"
              required
            />
            <img
              src="https://c.animaapp.com/lSnjeCa0/img/eye@2x.png"
              alt="toggle"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-2 top-2 w-6 h-6 cursor-pointer"
            />
          </div>
        </div>

        {/* Đồng ý điều khoản */}
        <div className="flex items-center gap-2 mt-2">
          <CheckboxGhinhomatkhau
            checked={form.agree}
            onClick={() => setForm((prev) => ({ ...prev, agree: !prev.agree }))}
          />
          <span className="text-sm text-[#337ccf]">
            Tôi đã đồng ý với <strong>chính sách</strong> và{" "}
            <strong>điều khoản</strong> của Neko Cinema
          </span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#be1238] hover:bg-[#a3122f] text-white font-medium py-3 rounded-lg transition-all"
        >
          ĐĂNG KÝ
        </button>

        {/* Đã có tài khoản? */}
        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">Bạn đã có tài khoản? </span>
          <a
            href="/login"
            className="text-sm text-[#337ccf] font-medium underline hover:text-[#255ab3] transition-all"
          >
            Đăng nhập
          </a>
        </div>
      </form>
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = "text" }) => (
  <div>
    <Label text={label} />
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full border-b border-gray-300 py-2 px-3 text-gray-700 focus:outline-none"
    />
  </div>
);

const Label = ({ text }) => (
  <label className="block text-sm font-bold text-gray-800 mb-1">{text}</label>
);

export default SignUpPage;
