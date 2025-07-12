import React from "react";

const MovieList2 = ({ movies }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <div
          key={movie.title}
          className="rounded-xl shadow-md overflow-hidden hover:scale-105 transition"
        >
          <img
            src={movie.image}
            alt={movie.title}
            className="w-full h-[300px] object-cover"
          />
          <div className="p-4 text-white">
            <h3 className="font-bold text-base uppercase mb-2">
              {movie.title}
            </h3>
            <p className="text-sm text-gray-700 italic">
              Khởi chiếu: {movie.releaseDate}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieList2;
