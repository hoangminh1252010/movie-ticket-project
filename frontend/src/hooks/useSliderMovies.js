import { useState, useEffect } from "react";
import { getNowPlayingMovies, getUpcomingMovies } from "../api/movieApi";

export const useSliderMovies = () => {
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both now playing and upcoming movies
      const [nowPlayingResponse, upcomingResponse] = await Promise.all([
        getNowPlayingMovies(),
        getUpcomingMovies(),
      ]);

      if (nowPlayingResponse.error) {
        throw new Error(nowPlayingResponse.error.message);
      }
      if (upcomingResponse.error) {
        throw new Error(upcomingResponse.error.message);
      }

      setNowPlayingMovies(nowPlayingResponse.data || []);
      setUpcomingMovies(upcomingResponse.data || []);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError(err.message);
      setNowPlayingMovies([]);
      setUpcomingMovies([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return {
    nowPlayingMovies,
    upcomingMovies,
    loading,
    error,
    refetch: fetchMovies,
  };
}; 