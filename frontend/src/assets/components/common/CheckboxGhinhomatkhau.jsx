import React from "react";

const CheckboxGhinhomatkhau = ({
  checked = false,
  onClick,
  className = "",
}) => {
  return (
    <svg
      onClick={onClick}
      className={`cursor-pointer ${className}`}
      fill="none"
      height="22"
      viewBox="0 0 21 22"
      width="21"
      xmlns=""
    >
      {/* Khung checkbox */}
      <path
        d="M1.5 1.5H19.5V20.5H1.5V1.5Z"
        fill="white"
        stroke="#337CCF"
        strokeWidth="3"
      />
      
      {/* Dấu tích khi checked */}
      {checked && (
        <path
          d="M5 11L9 15L16 7"
          stroke="#337CCF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

export default CheckboxGhinhomatkhau;
