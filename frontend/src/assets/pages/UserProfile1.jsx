import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { updateUser } from "../../api/userApi"; // THÊM IMPORT
import {
  FaUser,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaEdit,
  FaCamera,
  FaIdCard,
  FaStar,
  FaHistory,
  FaTicketAlt,
  FaCreditCard,
  FaCopy,
  FaCheck,
} from "react-icons/fa";

const UserProfile1 = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [orders, setOrders] = useState([]);
  const [copiedBookingId, setCopiedBookingId] = useState(null);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);

  // Format date từ backend (được cải tiến)
  const formatBirthdate = (birthdate) => {
    if (!birthdate) return "";

    try {
      // Xử lý Date object từ backend
      if (typeof birthdate === "object" && birthdate instanceof Date) {
        return birthdate.toISOString().split("T")[0];
      }

      // Xử lý string ISO từ backend
      if (typeof birthdate === "string") {
        // Nếu có time thì lấy phần date
        if (birthdate.includes("T")) {
          return birthdate.split("T")[0];
        }
        // Nếu đã là YYYY-MM-DD format
        if (birthdate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          return birthdate;
        }
        // Thử parse và format lại
        return new Date(birthdate).toISOString().split("T")[0];
      }

      // Fallback cho các trường hợp khác
      return new Date(birthdate).toISOString().split("T")[0];
    } catch (error) {
      console.error("Error formatting birthdate:", error, birthdate);
      return "";
    }
  };

  // Helper function để truncate member ID
  const truncateMemberId = (id) => {
    if (!id) return "N/A";
    if (id.length <= 12) return id; // Nếu ngắn thì hiển thị full
    return `${id.substring(0, 8)}...${id.substring(id.length - 4)}`;
  };

  // Function để copy member ID
  const copyMemberId = async () => {
    if (!userInfo.memberId) return;

    try {
      await navigator.clipboard.writeText(userInfo.memberId);
      setCopySuccess(true);
      // Reset sau 2 giây
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error("Failed to copy member ID:", error);
      // Fallback cho browsers không support clipboard API
      const textArea = document.createElement("textarea");
      textArea.value = userInfo.memberId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // ✅ KHỞI TẠO STATE KHÔNG GỌI formatBirthdate NGAY
  const [userInfo, setUserInfo] = useState({
    name: "",
    birthDate: "",
    email: "",
    phone: "",
    memberId: "",
    points: 0,
    avatar: "/Userinfopng/Ellipse43.png",
  });

  // ✅ UPDATE STATE KHI USER DATA THAY ĐỔI
  useEffect(() => {
    if (user) {
      const formattedBirthdate = formatBirthdate(user.birthdate);
      setUserInfo({
        name: user.name || "",
        birthDate: formattedBirthdate,
        email: user.email || "",
        phone: user.phone || "",
        memberId: user.id || "",
        points: user.points || 0,
        avatar: user.avatar || "/Userinfopng/Ellipse43.png",
      });
    }
  }, [user]);

  // Fetch orders with better error handling
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        console.log("No user ID available");
        return;
      }
      
      setOrdersLoading(true);
      setOrdersError(null);
      
      try {
        console.log("Fetching orders for user ID:", user.id);
        const response = await fetch(`/api/orders/user/${user.id}`);
        console.log("API Response status:", response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Raw API Response:", data);
        
        // Validate data structure
        if (!Array.isArray(data)) {
          console.error("API did not return an array:", data);
          throw new Error("Invalid data format from API");
        }
        
        // Log each order's structure
        data.forEach((order, index) => {
          console.log(`Order ${index} structure:`, {
            id: order.id,
            bookingId: order.bookingId,
            seatNames: order.seatNames,
            orderTime: order.orderTime
          });
        });
        
        setOrders(data);
      } catch (err) {
        console.error("Detailed error when fetching orders:", err);
        setOrdersError("Không thể tải danh sách vé. Vui lòng thử lại sau.");
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Chuẩn bị data để gửi lên backend
      const updateData = {
        name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        birthdate: userInfo.birthDate ? new Date(userInfo.birthDate) : null,
      };

      const response = await updateUser(user.id, updateData);

      if (response.error) {
        alert("Có lỗi xảy ra: " + response.error.message);
      } else {
        alert("Cập nhật thành công!");
        setIsEditing(false);
        // Optionally refresh user data in context
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Có lỗi xảy ra khi cập nhật");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <NavBar />

      <main
        className="pt-20 pb-10"
        style={{ paddingLeft: "100px", paddingRight: "100px" }}
      >
        <div className="w-full">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Hồ Sơ Cá Nhân
            </h1>
            <p className="text-gray-400">
              Quản lý thông tin và theo dõi hoạt động của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Profile Card - Wider */}
            <div className="lg:col-span-3">
              <div className="bg-[#1f1f1f] rounded-3xl p-8 border border-gray-800 shadow-2xl h-full">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <FaUser className="text-[#be1238]" />
                    Thông Tin Cá Nhân
                  </h2>
                  <button
                    onClick={isEditing ? handleSave : handleEdit}
                    disabled={loading}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                      isEditing
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-[#be1238] hover:bg-red-700 text-white"
                    }`}
                  >
                    <FaEdit />
                    {loading ? "Đang lưu..." : isEditing ? "Lưu" : "Chỉnh sửa"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="text-gray-300 font-medium flex items-center gap-2">
                      <FaUser className="text-[#be1238]" />
                      Họ và tên
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userInfo.name}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, name: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#be1238]"
                      />
                    ) : (
                      <div className="px-4 py-3 rounded-xl bg-black border border-gray-800 text-white">
                        {userInfo.name || "Chưa cập nhật"}
                      </div>
                    )}
                  </div>

                  {/* Birth Date Field */}
                  <div className="space-y-2">
                    <label className="text-gray-300 font-medium flex items-center gap-2">
                      <FaCalendarAlt className="text-[#be1238]" />
                      Ngày sinh
                    </label>
                    {isEditing ? (
                      <input
                        type="date"
                        value={userInfo.birthDate}
                        onChange={(e) =>
                          setUserInfo({
                            ...userInfo,
                            birthDate: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-[#be1238]"
                      />
                    ) : (
                      <div className="px-4 py-3 rounded-xl bg-black border border-gray-800 text-white">
                        {userInfo.birthDate || "Chưa cập nhật"}
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-gray-300 font-medium flex items-center gap-2">
                      <FaEnvelope className="text-[#be1238]" />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={userInfo.email}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, email: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#be1238]"
                      />
                    ) : (
                      <div className="px-4 py-3 rounded-xl bg-black border border-gray-800 text-white">
                        {userInfo.email || "Chưa cập nhật"}
                      </div>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label className="text-gray-300 font-medium flex items-center gap-2">
                      <FaPhone className="text-[#be1238]" />
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={userInfo.phone}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 rounded-xl bg-black border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#be1238]"
                      />
                    ) : (
                      <div className="px-4 py-3 rounded-xl bg-black border border-gray-800 text-white">
                        {userInfo.phone || "Chưa cập nhật"}
                      </div>
                    )}
                  </div>
                </div>
            

<div className="bg-[#1f1f1f] rounded-3xl p-6 border border-gray-800 shadow-2xl mt-8 w-full">
  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
    <FaTicketAlt className="text-[#be1238]" />
    Vé đã mua
  </h3>
  
  {ordersLoading ? (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#be1238]"></div>
      <span className="ml-3 text-gray-400">Đang tải vé...</span>
    </div>
  ) : ordersError ? (
    <div className="text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-900/50">
      {ordersError}
    </div>
  ) : orders.length === 0 ? (
    <div className="text-gray-400 bg-gray-800/20 p-4 rounded-lg border border-gray-700/50">
      Bạn chưa có vé nào.
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {orders.map(order => {
        console.log("Rendering order:", order); // Log each order being rendered
        return (
          <div
            key={order.id || order.bookingId}
            className="bg-gradient-to-br from-[#2d2d2d] to-[#1a1a1a] rounded-xl p-4 border border-[#be1238]/40 shadow-lg relative group transition-transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Mã booking</span>
              <button
                className="text-xs text-[#be1238] hover:underline"
                title="Copy mã booking"
                onClick={() => {
                  navigator.clipboard.writeText(order.bookingId);
                  setCopiedBookingId(order.bookingId);
                  setTimeout(() => setCopiedBookingId(null), 1500);
                }}
              >
                <FaCopy className="inline mr-1" />
                {copiedBookingId === order.bookingId ? "Đã copy!" : "Copy"}
              </button>
            </div>
            <div className="text-lg font-mono font-bold text-white break-all mb-2">
              {order.bookingId || "N/A"}
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <div>
                <span className="text-gray-400">Ghế: </span>
                <span className="text-white font-semibold">
                  {Array.isArray(order.seatNames) ? order.seatNames.join(", ") : "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Ngày đặt: </span>
                <span className="text-white">
                  {order.orderTime ? new Date(order.orderTime).toLocaleString("vi-VN") : "N/A"}
                </span>
              </div>
            </div>
            <div className="absolute inset-0 rounded-xl border-2 border-[#be1238] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        );
      })}
    </div>
  )}
</div>

{/* Mã thành viên */}
<div className="bg-gradient-to-r from-[#be1238]/20 to-red-800/20 rounded-3xl p-6 border border-gray-800 shadow-2xl mt-4 w-full">
  <div className="flex items-center justify-between mb-2">
    <div className="flex items-center gap-3">
      <FaIdCard className="text-[#be1238] text-xl" />
      <span className="text-gray-300 font-medium">Mã thành viên</span>
    </div>
    <button
      onClick={copyMemberId}
      className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-md text-xs transition-colors duration-200"
      title="Copy mã thành viên"
    >
      {copySuccess ? (
        <>
          <FaCheck className="text-green-400" />
          <span className="text-green-400">Copied!</span>
        </>
      ) : (
        <>
          <FaCopy />
          <span>Copy</span>
        </>
      )}
    </button>
  </div>
  <div
    className="text-2xl font-bold text-white cursor-pointer hover:text-gray-300 transition-colors break-all w-full"
    onClick={copyMemberId}
    title={userInfo.memberId || "N/A"}
    style={{ wordBreak: "break-all" }}
  >
    {userInfo.memberId}
  </div>
  {userInfo.memberId && userInfo.memberId.length > 12 && (
    <div className="text-xs text-gray-500 mt-1">
      Click để copy full ID
    </div>
  )}
</div>

             
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                 



                </div>

   
             
              </div>
            </div>

            {/* Avatar & Stats Section - Narrower */}
            <div className="lg:col-span-2 space-y-6">
              {/* Avatar Card */}
              <div className="bg-[#1f1f1f] rounded-3xl p-6 border border-gray-800 shadow-2xl">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <img
                      src={userInfo.avatar}
                      alt="Avatar"
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#be1238]"
                    />
                    <button className="absolute bottom-0 right-0 bg-[#be1238] hover:bg-red-700 text-white p-3 rounded-full transition-colors duration-300">
                      <FaCamera />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {userInfo.name}
                  </h3>
                  <p className="text-gray-400 mb-4">Thành viên VIP</p>

                  <div className="bg-gradient-to-r from-[#be1238]/20 to-red-800/20 rounded-xl p-4 border border-gray-800">
                    <div className="text-sm text-gray-300 mb-1">
                      Cấp độ thành viên
                    </div>
                    <div className="text-lg font-bold text-white">
                      Gold Member
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-[#be1238] to-red-600 h-2 rounded-full"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      75% đến Platinum
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity
              <div className="bg-[#1f1f1f] rounded-3xl p-6 border border-gray-800 shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <FaHistory className="text-[#be1238]" />
                  Hoạt động gần đây
                </h3>

                <div className="space-y-3">
                  <div className="bg-black rounded-lg p-3 border border-gray-800">
                    <div className="text-sm text-gray-400">Đặt vé xem phim</div>
                    <div className="text-white font-medium">Avatar 2</div>
                    <div className="text-xs text-gray-500">2 ngày trước</div>
                  </div>

                  <div className="bg-black rounded-lg p-3 border border-gray-800">
                    <div className="text-sm text-gray-400">Tích điểm</div>
                    <div className="text-[#be1238] font-medium">+50 điểm</div>
                    <div className="text-xs text-gray-500">1 tuần trước</div>
                  </div>

                  <div className="bg-black rounded-lg p-3 border border-gray-800">
                    <div className="text-sm text-gray-400">
                      Cập nhật profile
                    </div>
                    <div className="text-white font-medium">
                      Thông tin cá nhân
                    </div>
                    <div className="text-xs text-gray-500">2 tuần trước</div>
                  </div>
                </div>

                <button className="w-full mt-4 py-2 px-4 bg-[#be1238] hover:bg-red-700 text-white rounded-lg transition-colors duration-300">
                  Xem tất cả
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfile1;
