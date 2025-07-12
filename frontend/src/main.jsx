import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import RouterConfig from "./router.jsx";
import { AuthProvider } from "./context/AuthContext";
import "flowbite";
import { BookingProvider } from "./assets/context/BookingContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BookingProvider>
          <RouterConfig />
        </BookingProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
