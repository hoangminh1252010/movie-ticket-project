import React from "react";
import { GiRoundStar } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

const TopWeekItem = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  const formatDuration = (minutes) => {
    if (!minutes) return "Chưa rõ";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours} giờ ${mins > 0 ? mins + " phút" : ""}`;
    }
    return `${minutes} phút`;
  };

  const getFirstGenre = (tags) => {
    if (!tags || tags.length === 0) return "Chưa phân loại";
    return tags[0];
  };

  return (
    <div
      className="relative group cursor-pointer overflow-hidden duration-500 w-52 h-64 bg-[#1f1f1f] p-3"
      onClick={handleClick}
    >
      <div className="">
        <div
          className="group-hover:scale-110 w-full h-52 bg-cover duration-500"
          style={{
            backgroundImage: `url(${movie.posterURL})`,
            backgroundPosition: "center",
          }}
        ></div>
        <div className="absolute w-56 left-0 px-3 pb-1 -bottom-4 duration-500 group-hover:-translate-y-4">
          <div className="absolute -z-10 left-0 w-64 h-28 opacity-0 duration-500 group-hover:opacity-50 group-hover:bg-[#BE1238]"></div>
          <span className="text-[16px] font-bold">{movie.title}</span>
          <p className="relative group-hover:opacity-100 duration-500 opacity-0 flex justify-between w-[184px]">
            <span className="text-[12px]">{getFirstGenre(movie.tags)}</span>
            <span className="text-[12px]">
              {formatDuration(movie.filmDuration)}
            </span>
            <div className="text-[12px] flex gap-1">
              <span>{movie.ageRestriction || "NR"}</span>
              <GiRoundStar className="text-yellow-400 relative top-[2px]" />
            </div>
          </p>
        </div>
      </div>
    </div>
  );
};
export default TopWeekItem;
