import { apiRequest } from "../utils/apiRequest";

// Lấy danh sách phim (GET /movies)
export const getMovies = async () => {
  return await apiRequest("/movies", {
    method: "GET",
  });
};

// Lấy phim theo id (GET /movies/:id)
export const getMovieById = async (id) => {
  return await apiRequest(`/movies/${id}`, {
    method: "GET",
  });
};

// ✅ Thêm method mới cho upcoming movies
export const getUpcomingMovies = async () => {
  return await apiRequest("/movies/upcoming", {
    method: "GET",
  });
};

export const getNowPlayingMovies = async () => {
  return await apiRequest("/movies/now-playing", {
    method: "GET",
  });
};

// Search methods
export const searchMoviesByTitle = async (query) => {
  return await apiRequest(
    `/movies/search/title?q=${encodeURIComponent(query)}`,
    {
      method: "GET",
    }
  );
};

export const getMoviesByTag = async (tag) => {
  return await apiRequest(`/movies/tag/${encodeURIComponent(tag)}`, {
    method: "GET",
  });
};

// Thêm phim mới (POST /movies)
export const addMovie = async (movieData) => {
  return await apiRequest("/movies", {
    method: "POST",
    data: movieData,
  });
};

// Cập nhật phim (PUT /movies/:id)
export const updateMovie = async (id, movieData) => {
  return await apiRequest(`/movies/${id}`, {
    method: "PUT",
    data: movieData,
  });
};

// Xoá phim (DELETE /movies/:id)
export const deleteMovie = async (id) => {
  return await apiRequest(`/movies/${id}`, {
    method: "DELETE",
  });
};
