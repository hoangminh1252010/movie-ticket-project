import { Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import HomePage from "./assets/pages/HomePage";
import TicketPage from "./assets/pages/TicketPage";
import MovieSchedule from "./assets/pages/Movieschedule";
import PromotionPage from "./assets/pages/PromotionPage";
import SignUpPage from "./assets/pages/SignUpPage";
import MoviePage from "./assets/pages/MoviePage";
import CheckoutPage from "./assets/pages/CheckoutPage";
import AboutPage from "./assets/pages/AboutPage";
import UserProfile1 from "./assets/pages/UserProfile1";
import LoginPage from "./assets/pages/LoginPage";
import PickSeatPage from "./assets/pages/PickSeatPage";
import MovieDetailPage from "./assets/pages/MovieDetailPage";
import ChatBot from "./assets/components/common/ChatBot";
import ChatBotDemo from "./assets/pages/ChatBotDemo";

// ✅ Component bảo vệ routes cần login
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Đang tải...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return children;
};

const RouterConfig = () => {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="*" element={<HomePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/moviepage" element={<MoviePage />} />
        <Route path="/movieschedule" element={<MovieSchedule />} />
        <Route path="/promotion" element={<PromotionPage />} />
        <Route path="/aboutus" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/pickseat/:id" element={<PickSeatPage />} />
        <Route path="/chatbot-demo" element={<ChatBotDemo />} />

        {/* Protected routes - cần đăng nhập */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile1 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchase"
          element={
            <ProtectedRoute>
              <TicketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* ChatBot - Available on all pages */}
      <ChatBot />
    </>
  );
};

export default RouterConfig;
