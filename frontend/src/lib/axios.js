import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000/api/v1", // ensure this matches your backend route
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;