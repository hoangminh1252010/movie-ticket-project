import { apiRequest } from "../utils/apiRequest";

// Get all active cinemas
export const getAllCinemas = async () => {
  return await apiRequest("/cinemas", {
    method: "GET",
  });
};

// Get cinema by ID
export const getCinemaById = async (cinemaId) => {
  return await apiRequest(`/cinemas/${cinemaId}`, {
    method: "GET",
  });
};

// Search cinemas by name
export const searchCinemasByName = async (name) => {
  return await apiRequest(`/cinemas/search?name=${encodeURIComponent(name)}`, {
    method: "GET",
  });
};

// Get cinemas by city
export const getCinemasByCity = async (city) => {
  return await apiRequest(`/cinemas/city/${encodeURIComponent(city)}`, {
    method: "GET",
  });
};

// Get available cities
export const getAvailableCities = async () => {
  return await apiRequest("/cinemas/cities", {
    method: "GET",
  });
};

// Create cinema
export const createCinema = async (cinemaData) => {
  return await apiRequest("/cinemas", {
    method: "POST",
    data: cinemaData,
  });
};

// Update cinema
export const updateCinema = async (cinemaId, cinemaData) => {
  return await apiRequest(`/cinemas/${cinemaId}`, {
    method: "PUT",
    data: cinemaData,
  });
};

// Create sample data
export const createSampleCinemas = async () => {
  return await apiRequest("/cinemas/sample-data", {
    method: "POST",
  });
};
