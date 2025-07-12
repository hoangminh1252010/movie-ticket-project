import React from "react";
import { RiMovie2Fill } from "react-icons/ri";
import { useUpcomingMovies } from "../../../hooks/useUpcomingMovies";
import { useNavigate } from "react-router-dom";

const UpComing = () => {
  const { upcomingMovies, loading, error } = useUpcomingMovies();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa rõ";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      return "Chưa rõ";
    }
  };

  const displayMovies = upcomingMovies.slice(0, 5);

  const placeholderMovies = Array.from(
    { length: 5 - displayMovies.length },
    (_, index) => ({
      id: `placeholder-${index}`,
      title: "Phim sắp chiếu",
      releaseDate: "2024-12-31T00:00:00",
      thumbnailURL: "/default-thumbnail.jpg",
      filmDescription: "Thông tin phim sẽ được cập nhật sớm...",
      isPlaceholder: true,
    })
  );
  const moviesToShow = [...displayMovies, ...placeholderMovies];

  const handleMovieClick = (movie) => {
    if (!movie.isPlaceholder && movie.id) {
      navigate(`/movie/${movie.id}`);
    }
  };

  if (loading) {
    return (
      <div className="bg-black text-white w-full px-[100px] pb-10">
        <h1 className="text-2xl font-bold mb-5">Siêu phẩm sắp ra mắt</h1>
        <div className="text-gray-400">Đang tải phim sắp chiếu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white w-full px-[100px] pb-10">
        <h1 className="text-2xl font-bold mb-5">Siêu phẩm sắp ra mắt</h1>
        <div className="text-red-400 text-center py-10">
          <div>Lỗi khi tải dữ liệu: {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white w-full px-[100px] pb-10">
      <h1 className="text-2xl font-bold mb-5">Siêu phẩm sắp ra mắt</h1>

      {upcomingMovies.length === 0 && (
        <div className="text-gray-400 text-center py-10">
          Hiện tại chưa có phim sắp chiếu nào
        </div>
      )}

      <div className="grid grid-cols-1 gap-x-12 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Phim đầu tiên - Layout nhỏ */}
        {moviesToShow[0] && (
          <div
            className={`flex flex-col justify-between ${
              !moviesToShow[0].isPlaceholder
                ? "cursor-pointer hover:opacity-80 transition-opacity"
                : "opacity-50"
            }`}
            onClick={() => handleMovieClick(moviesToShow[0])}
          >
            <img
              src={moviesToShow[0].thumbnailURL || "/default-thumbnail.jpg"}
              alt={moviesToShow[0].title}
              className="w-full h-[160px] object-cover rounded-md mb-[2px]"
              onError={(e) => {
                e.target.src = "/default-poster.jpg";
              }}
            />
            <h3 className="text-[14px] font-semibold leading-snug">
              {moviesToShow[0].title?.toUpperCase() || "PHIM SẮP CHIẾU"}
            </h3>
            <div className="text-[12px] text-white flex items-center gap-[4px]">
              <RiMovie2Fill />
              {formatDate(moviesToShow[0].releaseDate)}
            </div>
          </div>
        )}

        {/* Phim thứ 2 - Layout lớn với description */}
        {moviesToShow[1] && (
          <div
            className={`flex flex-col justify-between row-span-2 ${
              !moviesToShow[1].isPlaceholder
                ? "cursor-pointer hover:opacity-80 transition-opacity"
                : "opacity-50"
            }`}
            onClick={() => handleMovieClick(moviesToShow[1])}
          >
            <img
              src={moviesToShow[1].thumbnailURL || "/default-thumbnail.jpg"}
              alt={moviesToShow[1].title}
              className="w-full h-[300px] object-cover rounded-md mb-[2px]"
              onError={(e) => {
                e.target.src = "/default-poster.jpg";
              }}
            />
            <h3 className="text-[14px] font-bold leading-snug">
              Suất chiếu đặc biệt:
              <span className="text-[#BE1238]"> {moviesToShow[1].title}</span>
            </h3>
            <div className="text-[14px] text-white font-normal flex items-center gap-[4px]">
              <RiMovie2Fill />
              {formatDate(moviesToShow[1].releaseDate)}
            </div>
            <p className="text-[12px] line-clamp-4">
              {moviesToShow[1].filmDescription ||
                "Thông tin phim sẽ được cập nhật sớm..."}
            </p>
          </div>
        )}

        {/* 3 phim còn lại - Layout nhỏ */}
        {moviesToShow.slice(2, 5).map((movie, index) => (
          <div
            key={movie.id || index}
            className={`flex flex-col justify-between ${
              !movie.isPlaceholder
                ? "cursor-pointer hover:opacity-80 transition-opacity"
                : "opacity-50"
            }`}
            onClick={() => handleMovieClick(movie)}
          >
            <img
              src={movie.thumbnailURL || "/default-thumbnail.jpg"}
              alt={movie.title}
              className="w-full h-[160px] object-cover rounded-md mb-[2px]"
              onError={(e) => {
                e.target.src = "/default-poster.jpg";
              }}
            />
            <h3 className="text-[14px] font-semibold leading-snug">
              {movie.title?.toUpperCase() || "PHIM SẮP CHIẾU"}
            </h3>
            <div className="text-[12px] text-white font-normal flex items-center gap-[4px]">
              <RiMovie2Fill />
              {formatDate(movie.releaseDate)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default UpComing;
