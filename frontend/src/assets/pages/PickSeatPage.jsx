import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PickSeat from "../components/MovieDetail/PickSeat";
import MovieCover from "../components/MovieDetail/MovieCover";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import PickAnother from "../components/MovieDetail/PickAnother";
import { getMovieById } from "../../api/movieApi";
import { useBooking } from "../context/BookingContext";

const PickSeatPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);
  const { booking, setBooking } = useBooking();

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMovieById(id);
        if (response.error) {
          throw new Error(
            response.error.message || "Không thể tải thông tin phim"
          );
        }
        const movieData = response.data;
        if (!movieData) {
          throw new Error("Không tìm thấy phim với ID này");
        }
        setMovie(movieData);
      } catch (err) {
        setError(err.message || "Không thể tải thông tin phim");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchMovieData();
    } else {
      setError("Không có ID phim trong URL");
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (
      !booking.selectedMovie ||
      !booking.selectedTime ||
      !booking.selectedCinema
    ) {
      const saved = localStorage.getItem("bookingInfo");
      if (saved) {
        setBooking(JSON.parse(saved));
      }
    }
  }, []);

  const getBackgroundImage = () => {
    return (
      movie?.thumbnailURL ||
      "https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=Loading"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#be1238] mx-auto mb-4"></div>
          <p className="text-lg">Đang tải thông tin phim...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-4">
          <h2 className="text-xl font-bold mb-4">Có lỗi xảy ra</h2>
          <p className="text-red-500 text-lg mb-4">Lỗi: {error}</p>
          <div className="text-gray-400 text-sm mb-4">
            <p>Movie ID từ URL: {id || "Không có"}</p>
            <p>API Base URL: http://localhost:8080/api</p>
          </div>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              window.location.reload();
            }}
            className="bg-[#be1238] px-4 py-2 rounded hover:bg-[#9F0F2F] mr-2"
          >
            Thử lại
          </button>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <NavBar />
      {/* Dynamic background image */}
      <div
        className="fixed inset-0 w-full h-full object-cover brightness-[0.3] -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${getBackgroundImage()})`,
        }}
      ></div>
      {movie && <MovieCover movie={movie} />}
      {/* Hiển thị thông tin đã chọn từ context */}
      <div className="max-w-2xl mx-auto bg-black/70 rounded-lg p-4 mt-4 mb-2 text-white text-center">
        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <span>
            Ngày: <b>{booking.selectedDate || "-"}</b>
          </span>
          <span>
            Giờ: <b>{booking.selectedTime || "-"}</b>
          </span>
          <span>
            Rạp: <b>{booking.selectedCinema || "-"}</b>
          </span>
          <span>
            Phim: <b>{booking.selectedMovie?.title || movie?.title || "-"}</b>
          </span>
        </div>
      </div>
      {movie && (
        <>
          <PickAnother movie={movie} onShowtimeSelect={setSelectedShowtime} />
          {/* Ưu tiên showtime từ context nếu có */}
          <PickSeat
            movie={movie}
            selectedShowtime={booking.selectedShowtime || selectedShowtime}
          />
        </>
      )}
      <Footer />
    </div>
  );
};

export default PickSeatPage;
