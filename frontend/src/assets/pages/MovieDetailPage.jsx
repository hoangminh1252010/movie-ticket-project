import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaPlay, FaHeart } from "react-icons/fa";
import { BiCalendar, BiTime } from "react-icons/bi";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import TrailerPlayer from "../components/MovieDetailPage/TrailerPlayer";
import StarRating from "../components/MovieDetailPage/StarRating";
import { getMovieById, getMovies } from "../../api/movieApi";

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showTrailer, setShowTrailer] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [movieData, setMovieData] = useState(null);
  const [suggestedMovies, setSuggestedMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "Nguyễn Văn A",
      rating: 5,
      comment: "Phim rất hay, diễn viên diễn xuất tốt!",
      date: "2024-01-15",
      likes: 12,
    },
    {
      id: 2,
      user: "Trần Thị B",
      rating: 4,
      comment: "Cốt truyện hấp dẫn, hiệu ứng đẹp mắt.",
      date: "2024-01-14",
      likes: 8,
    },
    {
      id: 3,
      user: "Lê Minh C",
      rating: 4,
      comment: "Phim kinh dị hay, tạo được cảm giá hồi hộp.",
      date: "2024-01-13",
      likes: 15,
    },
  ]);

  // Fetch dữ liệu phim từ API
  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          setError("Không tìm thấy ID phim");
          return;
        }

        // Fetch chi tiết phim
        const movieResponse = await getMovieById(id);
        if (movieResponse.data) {
          setMovieData(movieResponse.data);
        } else {
          setError("Không tìm thấy phim");
          return;
        }

        // Fetch danh sách phim gợi ý (lấy 4 phim khác)
        const moviesResponse = await getMovies();
        if (moviesResponse.data) {
          const filteredMovies = moviesResponse.data
            .filter((movie) => movie.id !== id)
            .slice(0, 4);
          setSuggestedMovies(filteredMovies);
        }
      } catch (error) {
        console.error("Error fetching movie data:", error);
        setError("Có lỗi xảy ra khi tải dữ liệu phim");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim() && userRating > 0) {
      const newComment = {
        id: comments.length + 1,
        user: "Người dùng hiện tại",
        rating: userRating,
        comment: comment.trim(),
        date: new Date().toISOString().split("T")[0],
        likes: 0,
      };
      setComments([newComment, ...comments]);
      setComment("");
      setUserRating(0);
    }
  };

  const handleClick = () => {
    navigate(`/pickseat/${movieData.id}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <NavBar />
        {/* Loading Background */}
        <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-gray-900 to-black -z-10"></div>
        <div className="flex items-center justify-center min-h-screen relative z-10">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-xl">Đang tải thông tin phim...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !movieData) {
    return (
      <div className="min-h-screen bg-black">
        <NavBar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Có lỗi xảy ra</h2>
            <p className="text-lg mb-6">
              {error || "Không tìm thấy thông tin phim"}
            </p>
            <button
              onClick={() => navigate("/moviepage")}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition-colors"
            >
              Quay lại danh sách phim
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />

      {/* Background */}
      <div className="fixed inset-0 w-full h-full" style={{ zIndex: -1000 }}>
        {/* Background Image */}
        <img
          src={movieData.thumbnailURL}
          alt={movieData.title}
          className="w-full h-full object-cover brightness-[0.2]"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-20">
        {/* Movie Header Section */}
        <div className="container mx-auto px-4 md:px-[100px] py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Movie Poster */}
            <div className="flex-shrink-0 w-full lg:w-80">
              <img
                src={movieData.posterURL}
                alt={movieData.title}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>

            {/* Movie Info */}
            <div className="flex-1 text-white">
              <h1 className="text-4xl lg:text-5xl font-bold mb-2">
                {movieData.title}
              </h1>
              <p className="text-xl text-gray-300 mb-4">
                {movieData.title}{" "}
                {/* Backend không có englishTitle, tạm dùng title */}
              </p>

              {/* Rating and Actions */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <FaStar className="text-yellow-400 text-xl" />
                  <span className="text-2xl font-bold">8.0</span>{" "}
                  {/* Tạm thời hard-code */}
                  <span className="text-gray-400">
                    /10 ·{" "}
                    {Math.floor(Math.random() * 5000 + 1000).toLocaleString()}{" "}
                    đánh giá
                  </span>
                </div>
                <button
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                  onClick={handleClick}
                >
                  Đặt vé ngay
                </button>
              </div>

              {/* Movie Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <BiCalendar className="text-gray-400" />
                  <span>
                    Khởi chiếu:{" "}
                    {new Date(movieData.releaseDate).toLocaleDateString(
                      "vi-VN"
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BiTime className="text-gray-400" />
                  <span>Thời lượng: {movieData.filmDuration} phút</span>
                </div>
              </div>

              {/* Genre Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {movieData.tags &&
                  movieData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-red-600 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                <span className="border-2 border-red-600 text-red-600 px-3 py-1 rounded-full text-sm">
                  {movieData.ageRestriction}
                </span>
                <span className="border-2 border-red-600 text-red-600 px-3 py-1 rounded-full text-sm">
                  {movieData.format}
                </span>
              </div>

              {/* Trailer Button */}
              <button
                onClick={() => setShowTrailer(true)}
                className="flex items-center gap-3 bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg text-lg font-semibold transition-all hover:scale-105"
              >
                <FaPlay />
                Xem Trailer
              </button>
            </div>
          </div>
        </div>

        {/* Movie Info Section */}
        <div className="container mx-auto px-4 md:px-[100px] mb-8">
          <div className="text-white">
            <h2 className="text-2xl font-bold mb-4">Nội dung phim</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              {movieData.filmDescription}
            </p>
          </div>
        </div>

        {/* Reviews and Suggestions Layout */}
        <div className="container mx-auto px-4 md:px-[100px] pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Reviews Section - Left side (75%) */}
            <div className="lg:col-span-3">
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-6">
                  Đánh giá của khán giả
                </h2>

                {/* Rating Form */}
                <div className="bg-gray-900 p-6 rounded-lg mb-8">
                  <h3 className="text-xl font-bold mb-4">Viết đánh giá</h3>
                  <form onSubmit={handleCommentSubmit}>
                    {/* Star Rating */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Đánh giá của bạn:
                      </label>
                      <StarRating
                        rating={userRating}
                        onRatingChange={setUserRating}
                        size="xl"
                      />
                    </div>

                    {/* Comment */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2">
                        Nhận xét:
                      </label>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
                        className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none resize-none"
                        rows="4"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!comment.trim() || userRating === 0}
                      className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 px-6 py-2 rounded-lg transition-colors"
                    >
                      Gửi đánh giá
                    </button>
                  </form>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((review) => (
                    <div key={review.id} className="bg-gray-900 p-6 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold">{review.user}</h4>
                          <div className="flex items-center gap-2">
                            <StarRating
                              rating={review.rating}
                              readonly={true}
                              size="sm"
                            />
                            <span className="text-sm text-gray-400">
                              {new Date(review.date).toLocaleDateString(
                                "vi-VN"
                              )}
                            </span>
                          </div>
                        </div>
                        <button className="flex items-center gap-1 text-gray-400 hover:text-red-500">
                          <FaHeart />
                          <span>{review.likes}</span>
                        </button>
                      </div>
                      <p className="text-gray-300">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions Section - Right side (25%) */}
            <div className="lg:col-span-1">
              <div className="text-white sticky top-24">
                <h2 className="text-xl font-bold mb-6">Phim gợi ý</h2>
                <div className="space-y-4">
                  {suggestedMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="group cursor-pointer"
                      onClick={() => navigate(`/movie/${movie.id}`)}
                    >
                      <div className="relative mb-2">
                        <img
                          src={movie.posterURL || movie.thumbnailURL}
                          alt={movie.title}
                          className="w-full h-60 object-cover rounded-lg transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                          <FaPlay className="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <h3 className="font-bold text-sm mb-1">{movie.title}</h3>
                      <div className="flex items-center gap-1 text-sm">
                        <StarRating
                          rating={8.0}
                          readonly={true}
                          size="sm"
                          showValue={true}
                        />
                        <span className="text-gray-400">
                          •{" "}
                          {movie.tags && movie.tags[0] ? movie.tags[0] : "Phim"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Player */}
      <TrailerPlayer
        isOpen={showTrailer}
        onClose={() => setShowTrailer(false)}
        trailerUrl={movieData.trailerURL}
        movieTitle={movieData.title}
      />

      <Footer />
    </div>
  );
};

export default MovieDetailPage;
