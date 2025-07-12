import React from "react";
import { TbArmchair } from "react-icons/tb";
import {
  PiNumberCircleOneThin,
  PiNumberCircleThreeThin,
  PiNumberCircleTwoThin,
} from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  createBooking,
  getBookingsByShowtimeId,
} from "../../../api/bookingApi";

const PickSeat = ({ movie, selectedShowtime }) => {
  const { user, isAuthenticated } = useAuth();
  const chairCount8 = Array(8).fill(null);
  const colNumbers = Array.from({ length: 17 }, (_, i) => i + 1);
  const [showFood, setShowFood] = React.useState(false);
  const [popcornCount, setPopcornCount] = React.useState(1);
  const [drinkCount, setDrinkCount] = React.useState(1);
  const popcornPrice = 40000;
  const drinkPrice = 20000;
  const [isBooking, setIsBooking] = React.useState(false);

  const [selectedSeats, setSelectedSeats] = React.useState([]);
  const [bookedSeats, setBookedSeats] = React.useState([]);

  React.useEffect(() => {
    if (!selectedShowtime) {
      setBookedSeats([]);
      return;
    }
    // Lấy danh sách ghế đã đặt từ API
    getBookingsByShowtimeId(selectedShowtime.id)
      .then((res) => {
        // Giả sử API trả về mảng các booking, mỗi booking có seatNames là mảng ghế
        const allSeats = (res.data || []).flatMap(
          (booking) => booking.seatNames || []
        );
        setBookedSeats(allSeats);
      })
      .catch((err) => {
        console.error("Lỗi lấy ghế đã đặt:", err);
        setBookedSeats([]);
      });
  }, [selectedShowtime]);

  const handleSelectSeat = (rowLabel, seatIndex, isDouble = false) => {
    const seatsToAdd = isDouble
      ? [`${rowLabel}${seatIndex}`, `${rowLabel}${seatIndex + 1}`]
      : [`${rowLabel}${seatIndex + 1}`];

    setSelectedSeats((prev) => {
      const alreadySelected = seatsToAdd.every((s) => prev.includes(s));

      if (alreadySelected) {
        // Bỏ chọn cả hai nếu đã chọn
        return prev.filter((s) => !seatsToAdd.includes(s));
      } else {
        // Thêm cả hai
        return [...prev, ...seatsToAdd.filter((s) => !prev.includes(s))];
      }
    });
  };

  const handleSelectSeatPair = (seat1, seat2) => {
    setSelectedSeats((prev) => {
      const alreadySelected = prev.includes(seat1) && prev.includes(seat2);

      if (alreadySelected) {
        return prev.filter((s) => s !== seat1 && s !== seat2);
      } else {
        return [...prev, ...[seat1, seat2].filter((s) => !prev.includes(s))];
      }
    });
  };

  const countSeatTypes = (selectedSeats) => {
    let singleSeats = 0;
    let doubleSeats = 0;
    const counted = new Set();

    selectedSeats.forEach((seat) => {
      // Nếu ghế đôi nằm ở hàng L
      if (seat.startsWith("L")) {
        // Kiểm tra cặp đôi của ghế đó
        const seatNum = parseInt(seat.slice(1));
        const pair = seatNum % 2 === 0 ? seatNum - 1 : seatNum + 1;
        const pairId = `L${pair}`;

        // Nếu cả cặp đều đã được chọn và chưa đếm rồi
        if (
          selectedSeats.includes(pairId) &&
          !counted.has(seat) &&
          !counted.has(pairId)
        ) {
          doubleSeats += 1;
          counted.add(seat);
          counted.add(pairId);
        }
      } else {
        singleSeats += 1;
      }
    });

    return { singleSeats, doubleSeats };
  };

  const { singleSeats, doubleSeats } = countSeatTypes(selectedSeats);

  const navigate = useNavigate();
  const handleThanhToan = () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ghế!");
      return;
    }
    navigate("/purchase", {
      state: {
        movie, // object phim
        selectedSeats, // mảng ghế đã chọn
        totalPrice:
          doubleSeats * 95000 +
          singleSeats * 45000 +
          (showFood ? popcornCount * popcornPrice : 0), // tính tổng tiền
        // ... các thông tin khác nếu cần
      },
    });
  };

  const handleClick = async () => {
    if (selectedSeats.length === 0) {
      alert("Vui lòng chọn ít nhất một ghế!");
      return;
    }

    if (!isAuthenticated || !user) {
      alert("Vui lòng đăng nhập để đặt vé!");
      navigate("/login");
      return;
    }

    if (!selectedShowtime) {
      alert("Vui lòng chọn suất chiếu trước khi đặt vé!");
      return;
    }

    try {
      setIsBooking(true);

      // Tạo booking data với showtime ID thực
      const bookingData = {
        userId: user.id,
        showtimeId: selectedShowtime.id,
        seatNames: selectedSeats,
      };

      console.log("Creating booking with data:", bookingData);

      // Gọi API tạo booking
      const response = await createBooking(bookingData);

      if (response.error) {
        throw new Error(response.error.message || "Không thể tạo booking");
      }

      if (response.data.success) {
        console.log("Booking created successfully:", response.data.booking);

        // Chuyển sang trang thanh toán với thông tin booking
        navigate("/purchase", {
          state: {
            movie,
            showtime: selectedShowtime,
            selectedSeats,
            popcornCount,
            drinkCount,
            popcornTotal: popcornCount * popcornPrice,
            drinkTotal: drinkCount * drinkPrice,
            totalPrice:
              doubleSeats * 95000 +
              singleSeats * 45000 +
              (showFood ? popcornCount * popcornPrice : 0) +
              (showFood ? drinkCount * drinkPrice : 0),
            bookingId: response.data.booking.id,
          },
        });
      } else {
        throw new Error(response.data.message || "Không thể tạo booking");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert(error.message || "Có lỗi xảy ra khi đặt vé. Vui lòng thử lại.");
    } finally {
      setIsBooking(false);
    }
  };

  const renderRow = (rowLabel, count) => {
    return (
      <tr key={rowLabel}>
        <th className="w-[24px] text-white text-[14px] font-medium text-center">
          {rowLabel}
        </th>
        {Array(count)
          .fill(null)
          .map((_, index) => {
            const seatId = `${rowLabel}${index + 1}`;
            const isSelected = selectedSeats.includes(seatId);
            const isBooked = bookedSeats.includes(seatId);
            return (
              <td
                key={index}
                onClick={() => !isBooked && handleSelectSeat(rowLabel, index)}
                style={{ cursor: isBooked ? "not-allowed" : "pointer" }}
              >
                <div className="flex justify-center items-center h-[28px] w-[28px] group">
                  <TbArmchair
                    className={`text-[24px] transition-all duration-300 group-hover:scale-110 ${
                      isBooked
                        ? "text-gray-500"
                        : isSelected
                        ? "text-[#be1238] drop-shadow-lg"
                        : "text-gray-300 group-hover:text-[#be1238]"
                    }`}
                  />
                </div>
              </td>
            );
          })}
      </tr>
    );
  };

  // Show message if no showtime selected
  const showNoShowtimeMessage = !selectedShowtime;

  return (
    <div className="bg-black min-h-screen">
      {/* Main Container with 100px padding */}
      <div className="mx-auto px-4 md:px-[100px] py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-white text-3xl font-bold mb-2">
            Chọn ghế của bạn
          </h1>
          <p className="text-gray-400 text-lg">Vui lòng chọn ghế mong muốn</p>
          {!selectedShowtime && (
            <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
              <p className="text-yellow-300 text-sm">
                ⬆️ Vui lòng chọn ngày, giờ và rạp chiếu ở phía trên trước khi
                chọn ghế
              </p>
            </div>
          )}
          {selectedShowtime && (
            <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-300 text-sm">
                ✅ Đã chọn suất chiếu: {selectedShowtime.roomName} -{" "}
                {new Date(selectedShowtime.showTime).toLocaleString("vi-VN")}
              </p>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[350px_1fr] gap-12 max-w-[1400px] mx-auto">
          {/* Seat Selection Section - Main Area */}
          <div className="xl:order-2">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
              {/* Legend */}
              <div className="flex justify-center gap-8 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-gray-500 rounded-sm"></div>
                  <span className="text-gray-300 text-sm">Đã được chọn</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#be1238] rounded-sm"></div>
                  <span className="text-gray-300 text-sm">Ghế bạn chọn</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#ffffff] rounded-sm"></div>
                  <span className="text-gray-300 text-sm">Ghế trống</span>
                </div>
              </div>

              {/* Screen */}
              <div className="mb-12 flex justify-center">
                <div className="relative">
                  <img
                    src="/MovieDetail/screen.png"
                    alt="Màn hình rạp"
                    className="w-[500px] max-w-full h-auto"
                    style={{
                      filter: "drop-shadow(0 8px 32px rgba(255, 223, 51, 0.3))",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/20 to-transparent pointer-events-none"></div>
                </div>
              </div>

              {/* Seat Map */}
              <div className="overflow-x-auto">
                <div className="min-w-[600px] mx-auto">
                  <table className="w-full border-separate border-spacing-1">
                    <thead>
                      <tr>
                        <th className="w-[24px]"></th>
                        {colNumbers.map((num) => (
                          <th
                            key={num}
                            className="text-gray-400 text-xs font-normal w-[28px] pb-2"
                          >
                            {num}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {renderRow("A", 15)}
                      {renderRow("B", 17)}
                      {renderRow("C", 17)}
                      {renderRow("D", 15)}
                      {/* Lối đi */}
                      <tr>
                        <td colSpan={18} className="h-6"></td>
                      </tr>
                      {renderRow("E", 15)}
                      {renderRow("F", 15)}
                      {renderRow("G", 17)}
                      {renderRow("H", 17)}
                      {renderRow("I", 17)}
                      {renderRow("K", 17)}

                      {/* Hàng ghế đôi VIP */}
                      <tr>
                        <td colSpan={18} className="h-6"></td>
                      </tr>
                      <tr>
                        <th className="w-[24px] text-white text-[14px] font-medium text-center">
                          L
                        </th>
                        {chairCount8.map((_, index) => {
                          const seat1 = `L${index * 2 + 1}`;
                          const seat2 = `L${index * 2 + 2}`;
                          const isSelected =
                            selectedSeats.includes(seat1) &&
                            selectedSeats.includes(seat2);
                          const isBooked =
                            bookedSeats.includes(seat1) ||
                            bookedSeats.includes(seat2);

                          return (
                            <td key={index} colSpan={2}>
                              <div
                                className="flex justify-center items-center h-[28px] cursor-pointer group"
                                onClick={() =>
                                  !isBooked &&
                                  handleSelectSeatPair(seat1, seat2)
                                }
                                style={{
                                  cursor: isBooked ? "not-allowed" : "pointer",
                                }}
                              >
                                <div className="flex gap-0.5">
                                  <TbArmchair
                                    className={`text-[24px] transition-all duration-300 group-hover:scale-110 ${
                                      isSelected
                                        ? "text-[#be1238] drop-shadow-lg"
                                        : isBooked
                                        ? "text-gray-500"
                                        : "text-yellow-400 group-hover:text-[#be1238]"
                                    }`}
                                  />
                                  <TbArmchair
                                    className={`text-[24px] transition-all duration-300 group-hover:scale-110 ${
                                      isSelected
                                        ? "text-[#be1238] drop-shadow-lg"
                                        : isBooked
                                        ? "text-gray-500"
                                        : "text-yellow-400 group-hover:text-[#be1238]"
                                    }`}
                                  />
                                </div>
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* VIP Section Label */}
              <div className="text-center mt-4">
                <span className="inline-block bg-yellow-400/20 text-yellow-400 px-4 py-1 rounded-full text-sm font-medium">
                  Ghế đôi VIP - Hàng L
                </span>
              </div>
            </div>
          </div>

          {/* Ticket Summary Section - Sidebar */}
          <div className="xl:order-1">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800 sticky top-24">
              <h2 className="text-white text-xl font-semibold mb-6 text-center">
                Thông tin đặt vé
              </h2>

              {/* Selected Seats */}
              <div className="mb-6">
                <h3 className="text-gray-300 text-sm font-medium mb-3">
                  Ghế đã chọn
                </h3>
                <div className="min-h-[60px] p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                  {selectedSeats.length === 0 ? (
                    <p className="text-gray-500 text-sm italic text-center">
                      Chưa chọn ghế nào
                    </p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedSeats.map((seat) => (
                        <span
                          key={seat}
                          className="inline-block bg-[#be1238] text-white px-3 py-1 rounded-md text-sm font-medium"
                        >
                          {seat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-gray-300">
                  <span className="text-sm">Ghế thường ({singleSeats})</span>
                  <span className="font-medium">
                    {(singleSeats * 45000).toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <div className="flex justify-between items-center text-gray-300">
                  <span className="text-sm">Ghế VIP đôi ({doubleSeats})</span>
                  <span className="font-medium">
                    {(doubleSeats * 95000).toLocaleString("vi-VN")}₫
                  </span>
                </div>
                {showFood && (
                  <>
                    {/* Dòng bắp */}
                    <div className="flex justify-between items-center text-gray-300 mt-2">
                      <span className="text-sm">Bắp</span>
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            setPopcornCount((c) => Math.max(0, c - 1))
                          }
                          className="px-2 py-1 bg-gray-700 rounded-l disabled:opacity-50"
                          disabled={popcornCount === 0}
                        >
                          -
                        </button>
                        <span className="px-3">{popcornCount}</span>
                        <button
                          onClick={() => setPopcornCount((c) => c + 1)}
                          className="px-2 py-1 bg-gray-700 rounded-r"
                        >
                          +
                        </button>
                        <span className="ml-3">
                          {(popcornCount * popcornPrice).toLocaleString(
                            "vi-VN"
                          )}
                          ₫
                        </span>
                      </div>
                    </div>
                    {/* Dòng nước */}
                    <div className="flex justify-between items-center text-gray-300 mt-2">
                      <span className="text-sm">Nước</span>
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            setDrinkCount((c) => Math.max(0, c - 1))
                          }
                          className="px-2 py-1 bg-gray-700 rounded-l disabled:opacity-50"
                          disabled={drinkCount === 0}
                        >
                          -
                        </button>
                        <span className="px-3">{drinkCount}</span>
                        <button
                          onClick={() => setDrinkCount((c) => c + 1)}
                          className="px-2 py-1 bg-gray-700 rounded-r"
                        >
                          +
                        </button>
                        <span className="ml-3">
                          {(drinkCount * drinkPrice).toLocaleString("vi-VN")}₫
                        </span>
                      </div>
                    </div>
                  </>
                )}
                <hr className="border-gray-700" />
                <div className="flex justify-between items-center text-white text-lg font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-[#be1238]">
                    {(
                      doubleSeats * 95000 +
                      singleSeats * 45000 +
                      (showFood ? popcornCount * popcornPrice : 0) +
                      (showFood ? drinkCount * drinkPrice : 0)
                    ).toLocaleString("vi-VN")}
                    ₫
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* <button
                  type="button"
                  className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-600"
                >
                  + Thêm bắp nước

                </button> */}

                <button
                  type="button"
                  className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border border-gray-600"
                  onClick={() => setShowFood(true)}
                >
                  + Thêm bắp nước
                </button>
                <button
                  type="button"
                  className={`w-full px-4 py-3 rounded-lg text-sm font-bold transition-all duration-200 ${
                    selectedSeats.length === 0 || isBooking || !selectedShowtime
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-[#be1238] hover:bg-[#a00e2e] text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                  }`}
                  onClick={handleClick}
                  disabled={
                    selectedSeats.length === 0 || isBooking || !selectedShowtime
                  }
                >
                  {isBooking ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang đặt vé...
                    </div>
                  ) : !selectedShowtime ? (
                    "Vui lòng chọn suất chiếu"
                  ) : selectedSeats.length === 0 ? (
                    "Vui lòng chọn ghế"
                  ) : (
                    `Thanh toán (${selectedSeats.length} ghế)`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
            <ol className="flex items-center justify-center space-x-8">
              <li className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full shadow-lg">
                  <PiNumberCircleOneThin className="text-2xl text-white" />
                </div>
                <div className="ml-3">
                  <span className="text-green-400 font-medium">Hoàn thành</span>
                  <p className="text-gray-400 text-sm">Chọn thông tin</p>
                </div>
              </li>

              <div className="h-1 w-16 bg-[#be1238] rounded"></div>

              <li className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-[#be1238] rounded-full shadow-lg">
                  <PiNumberCircleTwoThin className="text-2xl text-white" />
                </div>
                <div className="ml-3">
                  <span className="text-[#be1238] font-bold">
                    Đang thực hiện
                  </span>
                  <p className="text-white text-sm font-medium">Chọn ghế</p>
                </div>
              </li>

              <div className="h-1 w-16 bg-gray-600 rounded"></div>

              <li className="flex items-center opacity-50">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-600 rounded-full">
                  <PiNumberCircleThreeThin className="text-2xl text-gray-400" />
                </div>
                <div className="ml-3">
                  <span className="text-gray-500 font-medium">Tiếp theo</span>
                  <p className="text-gray-500 text-sm">Thanh toán</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickSeat;
