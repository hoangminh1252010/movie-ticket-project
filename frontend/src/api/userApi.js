// frontend/src/api/userApi.js
import { apiRequest } from "../utils/apiRequest";

// Update user API
export const updateUser = async (userId, userData) => {
  return await apiRequest(`/users/${userId}`, {
    method: "PUT",
    data: userData,
  });
};

// Get user API
export const getUserById = async (userId) => {
  return await apiRequest(`/users/${userId}`, {
    method: "GET",
  });
};
