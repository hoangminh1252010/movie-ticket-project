import { apiRequest } from "../utils/apiRequest";

// Create a new booking
export const createBooking = async (bookingData) => {
  return await apiRequest("/bookings", {
    method: "POST",
    data: bookingData,
  });
};

// Get booking by ID
export const getBookingById = async (bookingId) => {
  return await apiRequest(`/bookings/${bookingId}`, {
    method: "GET",
  });
};

// Get bookings by user ID
export const getBookingsByUserId = async (userId) => {
  return await apiRequest(`/bookings/user/${userId}`, {
    method: "GET",
  });
};

// Get bookings by showtime ID
export const getBookingsByShowtimeId = async (showtimeId) => {
  return await apiRequest(`/bookings/showtime/${showtimeId}`, {
    method: "GET",
  });
};

// Update booking status
export const updateBookingStatus = async (bookingId, status) => {
  return await apiRequest(`/bookings/${bookingId}/status/${status}`, {
    method: "PUT",
  });
};

// Confirm booking
export const confirmBooking = async (bookingId) => {
  return await apiRequest(`/bookings/${bookingId}/confirm`, {
    method: "PUT",
  });
};

// Cancel booking
export const cancelBooking = async (bookingId) => {
  return await apiRequest(`/bookings/${bookingId}/cancel`, {
    method: "PUT",
  });
};
