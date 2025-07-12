import { apiRequest } from "../utils/apiRequest";

// Get all showtimes
export const getAllShowtimes = async () => {
  return await apiRequest("/showtimes", {
    method: "GET",
  });
};

// Get showtime by ID
export const getShowtimeById = async (showtimeId) => {
  return await apiRequest(`/showtimes/${showtimeId}`, {
    method: "GET",
  });
};

// Get showtimes by movie ID
export const getShowtimesByMovieId = async (movieId) => {
  return await apiRequest(`/showtimes/movie/${movieId}`, {
    method: "GET",
  });
};

// Get default showtime for movie
export const getDefaultShowtimeForMovie = async (movieId) => {
  return await apiRequest(`/showtimes/movie/${movieId}/default`, {
    method: "GET",
  });
};

// Get showtimes by cinema ID
export const getShowtimesByCinemaId = async (cinemaId) => {
  return await apiRequest(`/showtimes/cinema/${cinemaId}`, {
    method: "GET",
  });
};

// Get showtimes by date
export const getShowtimesByDate = async (date) => {
  return await apiRequest(`/showtimes/date/${date}`, {
    method: "GET",
  });
};

// Lấy showtimes theo movie và ngày
export const getShowtimesByMovieAndDate = async (movieId, date) => {
  return await apiRequest(`/showtimes/movie/${movieId}/date/${date}`, {
    method: "GET",
  });
};

// Lấy showtimes theo cinema và ngày
export const getShowtimesByCinemaAndDate = async (cinemaId, date) => {
  return await apiRequest(`/showtimes/cinema/${cinemaId}/date/${date}`, {
    method: "GET",
  });
};

// Tạo showtime mới
export const createShowtime = async (showtimeData) => {
  return await apiRequest("/showtimes", {
    method: "POST",
    data: showtimeData,
  });
};

// Cập nhật showtime
export const updateShowtime = async (id, showtimeData) => {
  return await apiRequest(`/showtimes/${id}`, {
    method: "PUT",
    data: showtimeData,
  });
};

// Ẩn showtime (soft delete)
export const hideShowtime = async (id) => {
  return await apiRequest(`/showtimes/${id}/hide`, {
    method: "PATCH",
  });
};

// Xóa showtime vĩnh viễn
export const deleteShowtime = async (id) => {
  return await apiRequest(`/showtimes/${id}`, {
    method: "DELETE",
  });
};

// Cập nhật ghế đã khóa
export const updateLockedSeats = async (id, lockedSeats) => {
  return await apiRequest(`/showtimes/${id}/locked-seats`, {
    method: "PATCH",
    data: lockedSeats,
  });
};

// Utility function để format date cho API
export const formatDateForAPI = (date) => {
  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }
  return date;
};
