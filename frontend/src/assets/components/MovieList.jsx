import React, { useState, useEffect } from "react";
import { FaClock, FaPlay, FaStar, FaSpinner, FaFilm } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getMovies } from "../../api/movieApi";
import { getShowtimesByDate } from "../../api/showtimeApi";

const MovieList = ({ selectedDate, selectedCinema, onShowtimeClick }) => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch movies and showtimes when component mounts or date changes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch movies
        const moviesResponse = await getMovies();
        if (moviesResponse.error) {
          throw new Error(moviesResponse.error.message);
        }

        // Fetch showtimes for selected date
        const showtimesResponse = await getShowtimesByDate(selectedDate);
        if (showtimesResponse.error) {
          throw new Error(showtimesResponse.error.message);
        }

        const moviesData = moviesResponse.data || [];
        const showtimesData = showtimesResponse.data || [];

        // Test matching
        const testMatches = showtimesData.map((showtime) => {
          const matchingMovie = moviesData.find(
            (movie) => movie.id === showtime.movieId
          );
          return {
            showtimeMovieId: showtime.movieId,
            foundMatch: !!matchingMovie,
            matchingMovieTitle: matchingMovie?.title || "NO MATCH",
          };
        });

        setMovies(moviesData);
        setShowtimes(showtimesData);
        //setMovies(moviesResponse.data || []);
        //setShowtimes(showtimesResponse.data || []);
      } catch (err) {
        setError(err.message);
        // No fallback data - show only real data
        setMovies([]);
        setShowtimes([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);

  // Get showtimes for a specific movie
  const getMovieShowtimes = (movieId) => {
    return showtimes
      .filter(
        (showtime) =>
          showtime.movieId === movieId &&
          !showtime.hidden &&
          (!selectedCinema || showtime.cinemaId === selectedCinema)
      )
      .map((showtime) => {
        const time = new Date(showtime.showTime);
        return time.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      })
      .sort();
  };

  // Format movie duration
  const formatDuration = (duration) => {
    if (typeof duration === "number") {
      return `${duration} phút`;
    }
    return duration || "N/A";
  };

  // Get genre text
  const getGenreText = (movie) => {
    if (movie.tags && movie.tags.length > 0) {
      return movie.tags.join(", ");
    }
    return movie.filmDescription || "Không có thông tin";
  };

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const formatSelectedDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-[#BE1238] mb-4 mx-auto" />
          <p className="text-white">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-400 mb-4">
          <FaFilm className="text-4xl mx-auto mb-4 opacity-50" />
          <p>Có lỗi xảy ra khi tải dữ liệu: {error}</p>
          <p className="text-sm text-gray-400 mt-2">
            Vui lòng kiểm tra kết nối API và thử lại
          </p>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400">
          <FaFilm className="text-4xl mx-auto mb-4 opacity-50" />
          <p>Không có phim nào trong cơ sở dữ liệu</p>
          <p className="text-sm mt-2">Vui lòng thêm phim vào hệ thống</p>
        </div>
      </div>
    );
  }

  // Filter movies that have showtimes for the selected date
  const moviesWithShowtimes = movies.filter((movie) => {
    const movieShowtimes = getMovieShowtimes(movie.id);
    return movieShowtimes.length > 0;
  });

  // Show movies with showtimes, or all movies if no showtimes exist
  const displayMovies =
    moviesWithShowtimes.length > 0 ? moviesWithShowtimes : movies;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {displayMovies.map((movie) => {
        const movieShowtimes = getMovieShowtimes(movie.id);

        return (
          <div
            key={movie.id}
            className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-[#BE1238]/50 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-[#BE1238]/10"
          >
            <div
              className="flex h-full cursor-pointer"
              onClick={() => handleMovieClick(movie.id)}
            >
              {/* Movie Image */}
              <div className="relative w-32 flex-shrink-0">
                <img
                  src={movie.posterURL || "/placeholder-movie.jpg"}
                  alt={movie.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "/placeholder-movie.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 group-hover:from-[#BE1238]/20 group-hover:to-transparent transition-all duration-300"></div>

                {/* Age Rating Badge */}
                <div className="absolute top-2 right-2 bg-[#BE1238] text-white text-xs px-2 py-1 rounded-md font-bold">
                  {movie.ageRestriction || "TBA"}
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-[#BE1238]/80 p-3 rounded-full">
                    <FaPlay className="text-white text-lg ml-1" />
                  </div>
                </div>
              </div>

              {/* Movie Content */}
              <div className="flex flex-col justify-between flex-1 p-4 relative">
                {/* Date Badge */}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md text-center leading-tight">
                  <div>{formatSelectedDate(selectedDate)}</div>
                </div>

                <div className="space-y-2">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-white group-hover:text-[#BE1238] transition-colors duration-300 line-clamp-2 pr-12">
                    {movie.title}
                  </h3>

                  {/* Genre */}
                  <p className="text-sm text-gray-400 italic">
                    {getGenreText(movie)}
                  </p>

                  {/* Movie Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <FaClock className="text-[#BE1238] text-xs" />
                      <span>{formatDuration(movie.filmDuration)}</span>
                    </div>
                  </div>
                </div>

                {/* Showtimes */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FaStar className="text-[#ff4757] text-xs" />
                    <span className="text-xs text-gray-400 font-medium">
                      Suất chiếu:
                    </span>
                  </div>
                  {movieShowtimes.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {movieShowtimes.map((time, index) => (
                        <button
                          key={`${time}-${index}`}
                          className="bg-gradient-to-r from-[#BE1238] to-[#ff4757] hover:from-[#ff4757] hover:to-[#BE1238] text-white px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onShowtimeClick) {
                              const showtimeObj = showtimes.find(
                                (st) =>
                                  st.movieId === movie.id &&
                                  !st.hidden &&
                                  (!selectedCinema ||
                                    st.cinemaId === selectedCinema) &&
                                  new Date(st.showTime).toLocaleTimeString(
                                    "vi-VN",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: false,
                                    }
                                  ) === time
                              );
                              onShowtimeClick({
                                movie,
                                cinemaId:
                                  selectedCinema ||
                                  (showtimeObj && showtimeObj.cinemaId),
                                showtime: showtimeObj,
                                time,
                              });
                            }
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      Chưa có lịch chiếu cho ngày này
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {moviesWithShowtimes.length === 0 && movies.length > 0 && (
        <div className="col-span-full text-center py-4">
          <div className="text-yellow-400">
            <p className="text-sm">
              Có {movies.length} phim trong hệ thống nhưng chưa có lịch chiếu
              cho ngày {formatSelectedDate(selectedDate)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieList;
