import { useState, useEffect } from "react";
import { getUpcomingMovies } from "../api/movieApi";

export const useUpcomingMovies = () => {
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUpcomingMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUpcomingMovies();

      if (response.error) {
        setError(response.error.message);
        setUpcomingMovies([]);
      } else {
        setUpcomingMovies(response.data || []);
      }
    } catch (err) {
      setError(err.message);
      setUpcomingMovies([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUpcomingMovies();
  }, []);

  return { upcomingMovies, loading, error, refetch: fetchUpcomingMovies };
};
