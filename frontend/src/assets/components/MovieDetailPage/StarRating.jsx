import React, { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({
  rating = 0,
  maxRating = 5,
  onRatingChange = null,
  readonly = false,
  size = "md",
  showValue = false,
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-xl",
    xl: "text-2xl",
  };

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoveredRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoveredRating(0);
    }
  };

  const renderStar = (index) => {
    const value = index + 1;
    const currentRating = hoveredRating || rating;
    const isFilled = currentRating >= value;
    const isHalfFilled = currentRating >= value - 0.5 && currentRating < value;

    return (
      <button
        key={index}
        type="button"
        onClick={() => handleClick(value)}
        onMouseEnter={() => handleMouseEnter(value)}
        onMouseLeave={handleMouseLeave}
        disabled={readonly}
        className={`
          ${sizeClasses[size]} 
          transition-all duration-200 
          ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}
          ${
            isFilled
              ? "text-yellow-400"
              : isHalfFilled
              ? "text-yellow-300"
              : "text-gray-400"
          }
          ${!readonly ? "hover:text-yellow-400" : ""}
        `}
        title={readonly ? `${rating}/${maxRating}` : `Đánh giá ${value} sao`}
      >
        {isFilled ? (
          <FaStar />
        ) : isHalfFilled ? (
          <FaStarHalfAlt />
        ) : (
          <FaRegStar />
        )}
      </button>
    );
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
      </div>

      {showValue && (
        <span className="ml-2 text-sm text-gray-400">
          {rating.toFixed(1)}/{maxRating}
        </span>
      )}

      {!readonly && hoveredRating > 0 && (
        <span className="ml-2 text-sm text-gray-300">{hoveredRating} sao</span>
      )}
    </div>
  );
};

export default StarRating;
