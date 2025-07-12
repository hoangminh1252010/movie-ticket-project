import React from "react";
import { FaStar } from "react-icons/fa";

const MovieCover = ({ movie }) => {
  if (!movie) {
    return (
      <div className="text-white overflow-x-hidden relative mb-10 mt-20">
        <div className="px-4 md:px-[100px] pt-10 pb-20 flex gap-5">
          <div className="flex-shrink-0 w-[180px] h-[270px] shadow-lg bg-gray-800 animate-pulse"></div>
          <section className="flex-1 ml-2">
            <div className="h-8 bg-gray-800 rounded mb-2 w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-800 rounded mb-5 w-1/2 animate-pulse"></div>
            <div className="flex gap-4 mb-5">
              <div className="h-10 bg-gray-800 rounded w-16 animate-pulse"></div>
              <div className="h-10 bg-gray-800 rounded w-16 animate-pulse"></div>
            </div>
            <div className="h-6 bg-gray-800 rounded w-32 animate-pulse"></div>
          </section>
        </div>
      </div>
    );
  }

  const getPosterImage = () => {
    return (
      movie.posterURL ||
      movie.thumbnailURL ||
      "https://via.placeholder.com/180x270?text=No+Image"
    );
  };

  const getAgeRating = () => {
    return movie.ageRestriction || "13+";
  };

  const getFormat = () => {
    return movie.format || "2D";
  };

  const getRating = () => {
    return movie.rating || "8.0";
  };

  const getReviewCount = () => {
    return movie.reviewCount || "1.2K";
  };

  return (
    <div className="text-white overflow-x-hidden relative mb-10 mt-20">
      <div className="px-4 md:px-[100px] pt-10 pb-20 flex gap-5">
        <div className="flex-shrink-0 w-[180px] h-[270px] shadow-lg">
          <img
            src={getPosterImage()}
            alt={`Movie poster of ${movie.title || "Unknown Movie"}`}
            className="w-full h-full object-cover"
            width="180"
            height="270"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/180x270?text=No+Image";
            }}
          />
        </div>
        <section className="flex-1 ml-2">
          <h1
            lang="vi"
            className="text-[20px] md:text-[28px] font-bold leading-tight mb-1"
          >
            {movie.title?.toUpperCase() || "TÊN PHIM KHÔNG XÁC ĐỊNH"}
          </h1>
          <p
            lang="en"
            className="text-[14px] md:text-[16px] font-medium text-[#6a7a8a] uppercase mb-5"
          >
            {movie.englishName || movie.title || "UNKNOWN MOVIE"}
          </p>
          <div className="flex gap-4 mb-5">
            <div
              aria-label={`Format ${getFormat()}`}
              className="border-2 border-[#be1238] text-[#be1238] text-[14px] md:text-[18px] font-medium px-3 md:px-5 py-1 min-w-[50px] md:min-w-[70px] text-center select-none cursor-default"
            >
              {getFormat()}
            </div>
            <div
              aria-label={`Age rating ${getAgeRating()}`}
              className="border-2 border-[#be1238] text-[#be1238] text-[14px] md:text-[18px] font-medium px-3 md:px-5 py-1 min-w-[50px] md:min-w-[70px] text-center select-none cursor-default"
            >
              {getAgeRating()}
            </div>
          </div>
          <div
            aria-label={`Movie rating ${getRating()} out of 10 with ${getReviewCount()} reviews`}
            className="flex items-center gap-1 font-bold text-[16px] md:text-[20px]"
          >
            <FaStar className="text-yellow-400" />
            <span>{getRating()}</span>
            <span className="font-normal text-[10px] md:text-[12px]">
              /10 · {getReviewCount()}
            </span>
            <span
              lang="vi"
              className="font-bold text-[8px] md:text-[10px] ml-1"
            >
              Đánh Giá
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MovieCover;
