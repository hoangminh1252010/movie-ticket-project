import { useState, useEffect } from "react";
import { getMovies } from "../api/movieApi";

export const useMovies = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    const response = await getMovies();

    if (response.error) {
      setError(response.error.message);
      setMovies([]);
    } else {
      setMovies(response.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return { movies, loading, error, refetch: fetchMovies };
};
