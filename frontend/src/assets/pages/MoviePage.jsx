import React, { useState, useEffect } from "react";
import { FaFilter, FaSearch, FaStar } from "react-icons/fa";
import { BiCalendar } from "react-icons/bi";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import {
  getMovies,
  getUpcomingMovies,
  getNowPlayingMovies,
} from "../../api/movieApi";
import { useNavigate } from "react-router-dom";

const MoviePage = () => {
  const [selectedGenre, setSelectedGenre] = useState("Tất cả");
  const [filterType, setFilterType] = useState("now-playing");
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch movies based on filter type
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        let endpoint;

        switch (filterType) {
          case "upcoming":
            endpoint = "/movies/upcoming";
            response = await getUpcomingMovies();
            break;
          case "now-playing":
            endpoint = "/movies/now-playing";
            response = await getNowPlayingMovies();
            break;
          default:
            endpoint = "/movies";
            response = await getMovies();
        }

        if (response.error) {
          console.error("API returned error:", response.error);
          setError(response.error.message);
        } else {
          console.log("Response data:", response.data);
          console.log("Response data type:", typeof response.data);
          console.log(
            "Response data length:",
            response.data ? response.data.length : "null"
          );

          setMovies(response.data || []);
        }
      } catch (err) {
        console.error("=== MOVIEPAGE ERROR ===");
        console.error("Error type:", typeof err);
        console.error("Error message:", err.message);
        console.error("Full error:", err);
        console.error("Error stack:", err.stack);

        setError("Có lỗi xảy ra khi tải danh sách phim");
      } finally {
        setLoading(false);
        console.log("=== MOVIEPAGE DEBUG: fetchMovies completed ===");
      }
    };

    fetchMovies();
  }, [filterType]);

  // Get unique genres from movies
  const genres = [
    "Tất cả",
    ...Array.from(new Set(movies.map((movie) => movie.tags).flat())),
  ];

  // Filter movies
  const filteredMovies = movies.filter((movie) => {
    const matchesGenre =
      selectedGenre === "Tất cả" || movie.tags?.includes(selectedGenre);
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesGenre && matchesSearch;
  });

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const MovieCard = ({ movie }) => (
    <div
      className="group cursor-pointer"
      onClick={() => handleMovieClick(movie.id)}
    >
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-[#be1238]/50 transition-all duration-300 hover:transform hover:scale-105">
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={
              movie.posterURL || movie.thumbnailURL || "/placeholder-movie.jpg"
            }
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.src = "/placeholder-movie.jpg";
            }}
          />
          {/* Age Rating Badge */}
          {movie.ageRestriction && (
            <div className="absolute top-3 left-3 bg-[#be1238] text-white px-2 py-1 rounded-md text-xs font-bold">
              {movie.ageRestriction}
            </div>
          )}
          {/* Duration Badge */}
          {movie.filmDuration && (
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs">
              {movie.filmDuration} phút
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <button className="w-full bg-[#be1238] text-white py-2 rounded-lg font-medium hover:bg-[#a00e2e] transition-colors">
                Xem chi tiết
              </button>
            </div>
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-4 h-[168px]">
          <h3 className="text-white font-bold text-base mb-2 line-clamp-2 group-hover:text-[#be1238] transition-colors">
            {movie.title}
          </h3>

          {/* Tags */}
          {movie.tags && movie.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {movie.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                >
                  {tag}
                </span>
              ))}
              {movie.tags.length > 2 && (
                <span className="text-gray-400 text-xs">
                  +{movie.tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Release Date */}
          <div className="flex items-center text-gray-400 text-sm mb-2">
            <BiCalendar className="mr-1" />
            <span>Khởi chiếu: {formatDate(movie.releaseDate)}</span>
          </div>

          {/* Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center text-yellow-400">
              <FaStar className="mr-1 text-xs" />
              <span className="text-sm font-medium">8.0</span>
            </div>
            <span className="text-gray-400 text-sm">
              {movie.format || "2D"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black">
      <NavBar />

      {/* Header Section */}
      <div className="relative pt-16 bg-gradient-to-b from-gray-900 to-black">
        <div className="container mx-auto px-4 md:px-[100px]">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent mb-4">
              Danh Sách Phim
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[#BE1238] to-[#ff4757] mx-auto rounded-full mb-4"></div>
            <p className="text-gray-400 text-md max-w-2xl mx-auto">
              Khám phá những bộ phim mới nhất và hay nhất tại Neko Cinema
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-[100px] py-12">
        {/* Filter Section */}
        <div className="mb-8">
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button
              onClick={() => setFilterType("now-playing")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                filterType === "now-playing"
                  ? "bg-[#be1238] text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Phim đang chiếu
            </button>
            <button
              onClick={() => setFilterType("upcoming")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                filterType === "upcoming"
                  ? "bg-[#be1238] text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Phim sắp chiếu
            </button>
            <button
              onClick={() => setFilterType("all")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                filterType === "all"
                  ? "bg-[#be1238] text-white shadow-lg"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Tất cả phim
            </button>
          </div>

          {/* Search and Genre Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm phim..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-xl border border-gray-700 focus:border-[#be1238] focus:outline-none transition-colors"
              />
            </div>

            {/* Genre Filter */}
            <div className="flex items-center gap-3">
              <FaFilter className="text-gray-400" />
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="bg-gray-800 text-white border border-gray-700 px-4 py-3 rounded-xl focus:border-[#be1238] focus:outline-none min-w-[150px]"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-gray-400">
            Hiển thị {filteredMovies.length} kết quả
            {searchTerm && ` cho "${searchTerm}"`}
            {selectedGenre !== "Tất cả" && ` trong thể loại "${selectedGenre}"`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#be1238]"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-20">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#be1238] text-white px-6 py-3 rounded-xl hover:bg-[#a00e2e] transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Movies Grid */}
        {!loading && !error && (
          <>
            {filteredMovies.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">
                  Không tìm thấy phim nào phù hợp
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {filteredMovies.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MoviePage;
