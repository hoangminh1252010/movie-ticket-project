import React from "react";

// const TicketInfo = ({ movie, cinema, dateTime, room, seats, price }) => {
//   return (
//     <div className="text-white space-y-4">
//       <h2 className="text-xl font-bold uppercase text-center">{movie}</h2>
//       <div className="text-sm grid grid-cols-3 gap-y-2">
//         <p className="text-gray-400">Rạp:</p>
//         <p className="col-span-2">{cinema}</p>

//         <p className="text-gray-400">Ngày chiếu:</p>
//         <p className="col-span-2">{dateTime}</p>

//         <p className="text-gray-400">Số rạp:</p>
//         <p className="col-span-2">{room}</p>

//         <p className="text-gray-400">Chỗ ngồi:</p>
//         <p className="col-span-2">{seats}</p>

//         <p className="text-gray-400">Giá tiền:</p>
//         <p className="col-span-2">{price}</p>
//       </div>
//     </div>

// {/* <div className="ticket-info-grid">
// <div>Rạp:</div><div>{cinemaName}</div>
// <div>Ngày chiếu:</div><div>{showDate}</div>
// <div>Số rạp:</div><div>{room}</div>
// <div>Chỗ ngồi:</div><div>{selectedSeats.join(", ")}</div>
// <div>Bắp:</div><div>{popcornCount} x 40.000đ = {(popcornCount * 40000).toLocaleString()}đ</div>
// <div>Nước:</div><div>{drinkCount} x 20.000đ = {(drinkCount * 20000).toLocaleString()}đ</div>
// <div>Giá tiền:</div><div className="ticket-price">{totalPrice.toLocaleString()}đ</div>
// </div> */}
//   );
// };

// export default TicketInfo;

const TicketInfo = ({
  movie,
  cinema,
  dateTime,
  room,
  seats,
  price,
  popcornCount = 0,
  drinkCount = 0,
  popcornTotal = 0,
  drinkTotal = 0,
}) => {
  return (
    <div className="text-white space-y-6">
      {/* Movie Title */}
      <div className="text-center border-b border-gray-700 pb-4">
        <h2 className="text-xl font-bold text-white mb-2 line-clamp-2">
          {movie}
        </h2>
        <div className="w-16 h-0.5 bg-gradient-to-r from-[#BE1238] to-[#ff4757] mx-auto"></div>
      </div>

      {/* Main Info Grid */}
      <div className="space-y-4">
        {/* Cinema & Room */}
        <div className="flex justify-between items-start py-2 border-b border-gray-800">
          <span className="text-gray-400 text-sm">🏢 Rạp chiếu</span>
          <div className="text-right">
            <p className="text-white font-medium">{cinema}</p>
            <p className="text-gray-300 text-xs">Phòng {room}</p>
          </div>
        </div>

        {/* Date & Time */}
        <div className="flex justify-between items-center py-2 border-b border-gray-800">
          <span className="text-gray-400 text-sm">📅 Ngày & Giờ</span>
          <p className="text-white font-medium text-right">{dateTime}</p>
        </div>

        {/* Seats */}
        <div className="flex justify-between items-center py-2 border-b border-gray-800">
          <span className="text-gray-400 text-sm">🪑 Ghế ngồi</span>
          <p className="text-white font-medium">{seats}</p>
        </div>

        {/* Food & Drinks */}
        {(popcornCount > 0 || drinkCount > 0) && (
          <div className="bg-gray-800/50 rounded-lg p-3 space-y-2">
            <h4 className="text-gray-300 text-sm font-medium mb-2">
              🍿 Combo & Đồ uống
            </h4>

            {popcornCount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Bắp nước ({popcornCount})</span>
                <span className="text-white">
                  {popcornTotal.toLocaleString()}đ
                </span>
              </div>
            )}

            {drinkCount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Nước uống ({drinkCount})</span>
                <span className="text-white">
                  {drinkTotal.toLocaleString()}đ
                </span>
              </div>
            )}
          </div>
        )}

        {/* Total Price */}
        <div className="bg-gradient-to-r from-[#BE1238]/20 to-[#ff4757]/20 rounded-lg p-4 border border-[#BE1238]/30">
          <div className="flex justify-between items-center">
            <span className="text-gray-300 font-medium">💰 Tổng tiền</span>
            <span className="text-2xl font-bold text-white">{price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketInfo;
