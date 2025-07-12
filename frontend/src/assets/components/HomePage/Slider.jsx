import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Background slider sẽ sử dụng dữ liệu từ API thay vì hardcode

const Slider = () => {
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNowPlayingMovies = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/movies/now-playing"
        );
        setNowPlayingMovies(response.data);
        setLoading(false);
      } catch (err) {
        setError("Không thể tải danh sách phim đang chiếu");
        setLoading(false);
        console.error("Error fetching movies:", err);
      }
    };

    fetchNowPlayingMovies();
  }, []);

  // Format thời lượng phim
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? ` ${mins}m` : ""}`;
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };
  return (
    <div className="relative text-white bg-black h-[700px]">
      {/* Banner Slider */}
      {loading ? (
        <div className="w-full h-[550px] bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Đang tải dữ liệu...</p>
          </div>
        </div>
      ) : error ? (
        <div className="w-full h-[550px] bg-gray-900 flex items-center justify-center">
          <div className="text-center text-red-500">{error}</div>
        </div>
      ) : (
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          className="w-full"
        >
          {nowPlayingMovies.map((movie, i) => (
            <SwiperSlide key={movie.id}>
              <div
                className="w-full h-[550px] bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    movie.thumbnailURL || "/placeholder.jpg"
                  })`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div className="w-full h-full bg-black bg-opacity-60 flex flex-col justify-center px-[100px]">
                  <h1 className="text-3xl font-bold">{movie.title}</h1>
                  <p className="text-xl mt-2 mb-2">
                    {movie.filmDescription || "Mô tả phim"}
                  </p>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-sm bg-yellow-500 text-black px-2 py-1 rounded">
                      {movie.ageRating || "T13"}
                    </span>
                    <span className="text-sm">
                      {formatDuration(movie.filmDuration)}
                    </span>
                  </div>
                  <div className="flex gap-4">
                    <button className="text-sm bg-white text-black px-3 py-1 rounded hover:bg-gray-300">
                      Xem trailer
                    </button>
                    <button
                      className="text-sm bg-[#be1238] text-white px-3 py-1 rounded hover:bg-[#9F0F2F]"
                      onClick={() => handleMovieClick(movie.id)}
                    >
                      Đặt vé ngay
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {/* Now Playing Movies */}
      <div className="relative z-20 -translate-y-[180px] overflow-visible h-[400px]">
        <h2 className="text-center text-2xl font-bold mb-4">Phim đang chiếu</h2>
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
            <p className="mt-4">Đang tải dữ liệu...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : (
          <Swiper
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={5}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            modules={[Autoplay, Pagination]}
            className="mySwiper w-full h-[280px]"
            pagination={{ clickable: true }}
          >
            {nowPlayingMovies.map((movie) => (
              <SwiperSlide
                key={movie.id}
                className="!w-[160px] mx-[72px] transition-transform duration-500 ease-in-out"
              >
                <div
                  className="rounded-xl overflow-hidden relative cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => handleMovieClick(movie.id)}
                >
                  {/* Poster phim */}
                  <img
                    src={movie.posterURL || "/placeholder.jpg"}
                    alt={movie.title}
                    className="w-[160px] h-[240px] object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.jpg";
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
        <style jsx>{`
          .swiper-pagination-bullet {
            background-color: white;
            opacity: 0.4;
          }
          .swiper-pagination-bullet-active {
            background-color: #be1238;
            opacity: 1;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Slider;
