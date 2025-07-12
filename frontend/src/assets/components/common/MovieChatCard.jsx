import React from "react";
import { FaClock, FaCalendarAlt, FaTag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MovieChatCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/movie/${movie.id}`);
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div
      onClick={handleViewDetails}
      className="bg-gradient-to-r from-[#2b2b2b] to-[#1f1f1f] border border-gray-600 rounded-lg p-2 hover:border-[#BE1238] hover:shadow-lg hover:shadow-[#BE1238]/20 transition-all duration-300 cursor-pointer group w-full max-w-xs"
    >
      <div className="flex gap-3">
        {/* Movie Thumbnail */}
        <div className="relative overflow-hidden rounded-md flex-shrink-0">
          <img
            src={movie.poster || "/api/placeholder/60/80"}
            alt={movie.title}
            className="w-12 h-16 object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "/api/placeholder/60/80";
            }}
          />
          {movie.ageRestriction && (
            <div className="absolute top-0.5 right-0.5 bg-[#BE1238] text-white text-xs px-1 py-0.5 rounded font-bold leading-none">
              {movie.ageRestriction}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Movie Info */}
        <div className="flex-1 space-y-1">
          <h4 className="text-white font-semibold text-sm leading-tight line-clamp-2 group-hover:text-[#BE1238] transition-colors">
            {movie.title}
          </h4>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <FaClock className="text-[#BE1238] text-xs" />
              <span>{formatDuration(movie.duration)}</span>
            </div>
          </div>

          {movie.tags && movie.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <FaTag className="text-[#BE1238] text-xs" />
              <span className="text-gray-500 text-xs truncate">
                {movie.tags.slice(0, 2).join(", ")}
              </span>
            </div>
          )}

          {/* Mini Action Button */}
          <div className="pt-1">
            <div className="inline-block bg-gradient-to-r from-[#BE1238] to-[#ff4757] text-white text-xs py-1 px-3 rounded-full font-medium group-hover:shadow-md transition-all duration-300">
              Đặt Vé 🎫
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieChatCard;
