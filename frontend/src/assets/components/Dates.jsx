import React from "react";

const Dates = ({ selectedDate, setSelectedDate }) => {
  // Generate dates starting from today
  const generateDates = () => {
    const today = new Date();
    const dates = [];
    const daysOfWeek = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ];

    // Generate 7 days starting from today
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      const dayName = i === 0 ? "Hôm nay" : daysOfWeek[currentDate.getDay()];
      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = months[currentDate.getMonth()];

      // Format theo chuẩn yyyy-mm-dd
      const year = currentDate.getFullYear();
      const monthNum = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const dayNum = currentDate.getDate().toString().padStart(2, "0");
      const fullDate = `${year}-${monthNum}-${dayNum}`;

      dates.push({
        day: dayName,
        date: day,
        month: month,
        fullDate: fullDate,
      });
    }

    return dates;
  };

  const dates = generateDates();

  return (
    <div className="w-full flex justify-center">
      <div className="flex gap-3 overflow-x-auto pb-4 px-2">
        {dates.map((d, index) => (
          <div
            key={d.fullDate}
            className={`text-center px-4 py-3 rounded-xl cursor-pointer min-w-[90px] transition-all duration-300 transform hover:scale-105 border-2 ${
              selectedDate === d.fullDate
                ? "bg-gradient-to-b from-[#BE1238] to-[#ff4757] text-white font-bold border-[#BE1238] shadow-lg shadow-[#BE1238]/25"
                : "bg-gradient-to-b from-gray-800 to-gray-900 text-white hover:from-gray-700 hover:to-gray-800 border-gray-600 hover:border-[#BE1238]/50"
            }`}
            onClick={() => setSelectedDate(d.fullDate)}
          >
            <div
              className={`text-xs font-medium ${
                selectedDate === d.fullDate ? "text-white" : "text-gray-400"
              }`}
            >
              {d.day}
            </div>
            <div className="text-2xl font-bold my-1">{d.date}</div>
            <div
              className={`text-xs ${
                selectedDate === d.fullDate ? "text-white" : "text-gray-400"
              }`}
            >
              {d.month}
            </div>

            {selectedDate === d.fullDate && (
              <div className="w-4 h-1 bg-white rounded-full mx-auto mt-2"></div>
            )}

            {/* Debug info - sẽ xóa sau */}
            <div className="text-xs text-gray-500 mt-1">{d.fullDate}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dates;
