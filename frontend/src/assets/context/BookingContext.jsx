import React, { createContext, useContext, useState, useEffect } from "react";

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [booking, setBookingState] = useState({
    selectedDate: "",
    selectedTime: "",
    selectedCinema: "",
    selectedMovie: null,
    selectedShowtime: null,
  });

  // Khi setBooking, đồng bộ với localStorage
  const setBooking = (newBooking) => {
    setBookingState(newBooking);
    localStorage.setItem("bookingInfo", JSON.stringify(newBooking));
  };

  // Khi mount, nếu localStorage có dữ liệu thì khôi phục
  useEffect(() => {
    const saved = localStorage.getItem("bookingInfo");
    if (saved) {
      setBookingState(JSON.parse(saved));
    }
  }, []);

  return (
    <BookingContext.Provider value={{ booking, setBooking }}>
      {children}
    </BookingContext.Provider>
  );
};
