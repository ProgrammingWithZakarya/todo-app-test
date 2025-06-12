import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://...",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
