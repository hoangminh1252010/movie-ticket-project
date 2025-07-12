import React, { useEffect, useState } from "react";
import TopWeekItem from "./TopWeekItem";
import axios from "axios";

const TopWeek = () => {
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/movies/now-playing");
        setNowPlayingMovies(response.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải danh sách phim đang chiếu");
        setLoading(false);
      }
    };
    fetchNowPlayingMovies();
  }, []);

  const topMovies = nowPlayingMovies.slice(0, 10);

  if (loading) {
    return (
      <div className="overflow-x-auto bg-black hide-scrollbar scroll-smooth py-10">
        <div className="w-max flex text-white items-center px-[100px] gap-[30px]">
          <div className="w-[200px]">
            <h2 className="text-2xl mb-4 font-bold">Nổi bật tuần này</h2>
            <p className="mb-6 text-gray-400 text-[14px]">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-x-auto bg-black hide-scrollbar scroll-smooth py-10">
        <div className="w-max flex text-white items-center px-[100px] gap-[30px]">
          <div className="w-[200px]">
            <h2 className="text-2xl mb-4 font-bold">Nổi bật tuần này</h2>
            <p className="mb-6 text-red-400 text-[14px]">Lỗi: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-black hide-scrollbar scroll-smooth py-10">
      <div className="w-max flex text-white items-center px-[100px] gap-[30px]">
        <div className="w-[200px]">
          <h2 className="text-2xl mb-4 font-bold">Nổi bật tuần này</h2>
          <p className="mb-6 text-gray-400 text-[14px]">
            Hãy cùng khám phá những bộ phim đã làm dậy sóng cộng đồng phim thủ
            trong những ngày qua nhé
          </p>
          <button className="text-sm bg-[#BE1238] text-white py-1 px-3 rounded hover:bg-[#9F0F2F] mx-auto">
            Chi tiết &gt;
          </button>
        </div>
        {topMovies.length > 0 ? (
          topMovies.map((movie, index) => (
            <div className="flex" key={movie.id || index}>
              <p className="text-[160px] translate-x-6 bottom-2 h-64 font-bold text-white opacity-50">
                {index + 1}
              </p>
              <TopWeekItem movie={movie} />
            </div>
          ))
        ) : (
          <div className="text-white">Không có phim nào</div>
        )}
      </div>
    </div>
  );
};

export default TopWeek;
