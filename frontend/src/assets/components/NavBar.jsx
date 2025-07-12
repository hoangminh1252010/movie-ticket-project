import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NavBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (isAuthenticated) {
      // If logged in, go to profile
      navigate("/profile");
    } else {
      // If not logged in, go to login page
      navigate("/login");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="w-full h-12 bg-gradient-to-r from-black via-gray-900 to-black backdrop-blur-lg bg-opacity-95 text-white shadow-2xl fixed top-0 z-50 transition-all duration-300">
      <div className="w-full px-[100px] h-full flex items-center justify-between">
        {/* Logo Section */}
        <div
          className="flex items-center cursor-pointer group transition-transform duration-300 hover:scale-105"
          onClick={() => handleNavigation("/homepage")}
        >
          <div className="text-2xl font-bold tracking-wider text-transparent bg-gradient-to-r from-[#BE1238] to-[#ff4757] bg-clip-text">
            NekoCinema
          </div>
          <div className="ml-2 w-2 h-2 bg-[#BE1238] rounded-full animate-pulse"></div>
        </div>

        {/* Navigation Menu */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
          {[
            { name: "Trang chủ", path: "/homepage" },
            { name: "Phim", path: "/moviepage" },
            { name: "Lịch chiếu", path: "/movieschedule" },
            { name: "Khuyến mãi", path: "/promotion" },
            { name: "Giới thiệu", path: "/aboutus" },
          ].map((item, index) => (
            <li
              key={index}
              className="relative group cursor-pointer transition-all duration-300"
              onClick={() => item.path !== "#" && handleNavigation(item.path)}
            >
              <span className="uppercase tracking-wide hover:text-[#BE1238] transition-colors duration-300 py-2 px-3 rounded-md hover:bg-gray-800/50">
                {item.name}
              </span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#BE1238] to-[#ff4757] transition-all duration-300 group-hover:w-full"></div>
            </li>
          ))}
        </ul>

        {/* Authentication Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {/* User Profile */}
              <div
                className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-300"
                onClick={handleAuthAction}
              >
                <div className="relative">
                  <img
                    src="/HomePage/card4.png"
                    alt="Avatar"
                    className="w-10 h-10 rounded-full border-2 border-transparent group-hover:border-[#BE1238] transition-all duration-300 object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                </div>
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-[#BE1238] transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-300 hover:text-white px-3 py-2 rounded-lg hover:bg-red-600/20 border border-transparent hover:border-red-600/30 transition-all duration-300 group"
              >
                <svg
                  className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          ) : (
            <button
              onClick={handleAuthAction}
              className="relative overflow-hidden bg-gradient-to-r from-[#BE1238] to-[#ff4757] hover:from-[#ff4757] hover:to-[#BE1238] text-white px-4 py-1.5 rounded-full font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-[#BE1238]/25 group"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg
                  className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                Đăng nhập
              </span>
              <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-800/50 transition-colors duration-300">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default NavBar;
