import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Lấy token từ cookie hoặc localStorage
const getToken = () => {
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("token=")
  );
  if (tokenCookie) {
    return tokenCookie.split("=")[1];
  }
  return localStorage.getItem("token");
};

// Xoá token
const clearToken = () => {
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  localStorage.removeItem("token");
};

// Lưu token
const storeToken = (token) => {
  document.cookie = `token=${token}; path=/; secure; samesite=strict`;
  localStorage.setItem("token", token);
};

// Tạo instance của Axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  //withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Hàm gọi API
export const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = getToken();

    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await axiosInstance({
      url: endpoint,
      ...options,
      headers,
    });

    if (response.data?.token) {
      storeToken(response.data.token);
    }

    return { data: response.data };
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        clearToken();
      }
      return {
        error: new Error(error.response.data?.message || "Có lỗi xảy ra"),
      };
    }

    return { error };
  }
};
