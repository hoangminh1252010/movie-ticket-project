
import React, { useState } from "react";

function Card({ img, title, desc }) {
  const [active, setActive] = useState(false);

  return (
    <div
      onClick={() => setActive(!active)}
      className={`bg-[#1e293b] rounded-xl p-4 flex flex-col sm:flex-row gap-4 shadow-md cursor-pointer transition duration-300 hover:scale-105 ${
        active ? "ring-2 ring-red-400 z-10" : ""
      }`}
    >
      <img
        src={img}
        alt={title}
        className="w-full sm:w-60 h-40 sm:h-auto object-cover rounded-lg"
      />
      <div className="text-left flex flex-col justify-start gap-2">
        <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
        <p className="text-base sm:text-lg text-white">{desc}</p>
      </div>
    </div>
  );
}

export default Card;
