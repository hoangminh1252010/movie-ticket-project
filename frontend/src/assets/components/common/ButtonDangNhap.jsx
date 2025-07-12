import React, { useReducer } from "react";

// Reducer để xử lý hover state
function reducer(state, action) {
  switch (action) {
    case "mouse_enter":
      return { ...state, status: "hover" };
    case "mouse_leave":
      return { ...state, status: "inactive" };
    default:
      return state;
  }
}

const ButtonDangNhap = ({
  stateProp = "inactive",
  className = "",
  rectangle = "https://c.animaapp.com/lSnjeCa0/img/rectangle-83.svg",
  divClassName = "",
  onClick, // Cho phép truyền hàm xử lý click từ ngoài
}) => {
  const [state, dispatch] = useReducer(reducer, {
    status: stateProp,
  });

  const isHover = state.status === "hover";

  return (
    <div
      className={`w-[393px] h-[55px] cursor-pointer ${className}`}
      onMouseEnter={() => dispatch("mouse_enter")}
      onMouseLeave={() => dispatch("mouse_leave")}
      onClick={onClick}
    >
      <div className="w-[391px] h-[54px] relative">
        <img
          className="w-[391px] h-[47px] absolute top-1 left-0"
          alt="Rectangle"
          src={
            isHover
              ? "https://c.animaapp.com/lSnjeCa0/img/rectangle-83-1.svg"
              : rectangle
          }
        />

        <div
          className={`[font-family:'Inter',Helvetica] w-[335px] h-[54px] absolute top-0 left-[29px] tracking-[0] text-xl font-medium text-center leading-[normal]
            ${isHover ? "text-white" : "text-black opacity-80"} ${divClassName}`}
        >
          ĐĂNG NHẬP
        </div>
      </div>
    </div>
  );
};

export default ButtonDangNhap;
