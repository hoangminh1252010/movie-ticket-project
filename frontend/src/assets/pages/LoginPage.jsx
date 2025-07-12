import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaLock,
  FaEnvelope,
  FaGoogle,
  FaFacebook,
  FaApple,
} from "react-icons/fa";

// Import useAuth
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  // Inside component
  const {
    login: authLogin,
    register: authRegister,
    isLoading: authLoading,
  } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = "Họ tên là bắt buộc";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Xác nhận mật khẩu là bắt buộc";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Replace handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      let result;

      if (isLogin) {
        // Login
        result = await authLogin({
          email: formData.email,
          password: formData.password,
        });
      } else {
        // Register
        result = await authRegister({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || "",
          birthDate: formData.birthDate || "",
        });
      }

      if (result.success) {
        if (isLogin) {
          // Đăng nhập thành công - chuyển về trang chủ
          navigate("/");
        } else {
          // Đăng ký thành công - chuyển về tab đăng nhập
          setIsLogin(true);
          setFormData({
            email: formData.email, // Giữ lại email để user dễ đăng nhập
            password: "",
            confirmPassword: "",
            name: "",
            rememberMe: false,
          });
          setErrors({ submit: result.message, isSuccess: true }); // Hiển thị thông báo thành công
        }
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({ submit: "Đã có lỗi xảy ra. Vui lòng thử lại." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`);
    // Implement social login logic
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#be1238] rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#be1238] rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-lg">
        {/* Main Card */}
        <div className="bg-[#1f1f1f] rounded-3xl p-8 border border-gray-800 shadow-2xl">
          {/* Toggle Buttons */}
          <div className="flex bg-black rounded-2xl p-1 mb-4">
            <button
              onClick={() => {
                setIsLogin(true);
                setErrors({}); // Clear messages when switching tabs
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                isLogin
                  ? "bg-[#be1238] text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setErrors({}); // Clear messages when switching tabs
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                !isLogin
                  ? "bg-[#be1238] text-white shadow-lg"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Đăng ký
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field (only for registration) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-gray-300 font-medium flex items-center gap-2">
                  <FaUser className="text-[#be1238]" />
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl bg-black border ${
                    errors.name ? "border-red-500" : "border-gray-700"
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#be1238] transition-colors`}
                  placeholder="Nhập họ và tên của bạn"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <FaEnvelope className="text-[#be1238]" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-xl bg-black border ${
                  errors.email ? "border-red-500" : "border-gray-700"
                } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#be1238] transition-colors`}
                placeholder="Nhập email của bạn"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-gray-300 font-medium flex items-center gap-2">
                <FaLock className="text-[#be1238]" />
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 pr-12 rounded-xl bg-black border ${
                    errors.password ? "border-red-500" : "border-gray-700"
                  } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#be1238] transition-colors`}
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field (only for registration) */}
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-gray-300 font-medium flex items-center gap-2">
                  <FaLock className="text-[#be1238]" />
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pr-12 rounded-xl bg-black border ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-700"
                    } text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#be1238] transition-colors`}
                    placeholder="Nhập lại mật khẩu"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Remember Me & Forgot Password (only for login) */}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-[#be1238] bg-black border-gray-700 rounded focus:ring-[#be1238] focus:ring-2"
                  />
                  Ghi nhớ đăng nhập
                </label>
                <button
                  type="button"
                  className="text-[#be1238] hover:text-red-400 text-sm font-medium transition-colors"
                >
                  Quên mật khẩu?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-[#be1238] hover:bg-red-700 hover:shadow-lg transform hover:scale-[1.02]"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isLogin ? "Đang đăng nhập..." : "Đang đăng ký..."}
                </div>
              ) : isLogin ? (
                "Đăng nhập"
              ) : (
                "Đăng ký"
              )}
            </button>

            {/* Error/Success Message */}
            {errors.submit && (
              <div
                className={`text-center text-sm rounded-lg p-3 ${
                  errors.isSuccess
                    ? "text-green-500 bg-green-500/10 border border-green-500/30"
                    : "text-red-500 bg-red-500/10 border border-red-500/30"
                }`}
              >
                {errors.submit}
              </div>
            )}
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-4">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-400 text-sm">Hoặc</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <button
              onClick={() => handleSocialLogin("Google")}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-black border border-gray-700 rounded-xl text-white hover:bg-gray-900 transition-colors"
            >
              <FaGoogle className="text-red-500" />
              Tiếp tục với Google
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSocialLogin("Facebook")}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-black border border-gray-700 rounded-xl text-white hover:bg-gray-900 transition-colors"
              >
                <FaFacebook className="text-blue-500" />
                Facebook
              </button>

              <button
                onClick={() => handleSocialLogin("Apple")}
                className="flex items-center justify-center gap-2 py-3 px-4 bg-black border border-gray-700 rounded-xl text-white hover:bg-gray-900 transition-colors"
              >
                <FaApple className="text-white" />
                Apple
              </button>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="text-center mt-6 text-gray-500 text-xs">
          Bằng việc đăng nhập, bạn đồng ý với{" "}
          <button className="text-[#be1238] hover:text-red-400 transition-colors">
            Điều khoản dịch vụ
          </button>{" "}
          và{" "}
          <button className="text-[#be1238] hover:text-red-400 transition-colors">
            Chính sách bảo mật
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
