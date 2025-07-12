import { apiRequest } from "../utils/apiRequest";

// Login API
export const login = async (loginData) => {
  return await apiRequest("/auth/login", {
    method: "POST",
    data: loginData,
  });
};

// Register API
export const register = async (registerData) => {
  return await apiRequest("/auth/register", {
    method: "POST",
    data: registerData,
  });
};

// Logout API
export const logout = async () => {
  return await apiRequest("/auth/logout", {
    method: "POST",
  });
};
