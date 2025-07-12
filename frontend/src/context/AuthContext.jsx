import React, { createContext, useContext, useState, useEffect } from "react";
import {
  login as loginApi,
  register as registerApi,
  logout as logoutApi,
} from "../api/authApi";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      // Clear invalid data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (loginData) => {
    try {
      setIsLoading(true);
      const response = await loginApi(loginData);

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setUser(response.data.user);
        setIsAuthenticated(true);

        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (registerData) => {
    try {
      setIsLoading(true);
      const response = await registerApi(registerData);

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data.success) {
        // Đăng ký thành công nhưng không tự động đăng nhập
        // Không lưu token và user data vào localStorage
        // User sẽ phải đăng nhập lại

        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear local data regardless of API response
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
