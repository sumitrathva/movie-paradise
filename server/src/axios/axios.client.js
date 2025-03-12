import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: "3ec57d50733f3595980ece0f45f787a4", // Replace with your TMDB API key
    language: "en-US",
  },
  headers: {
    Accept: "application/json",
    "Accept-Encoding": "identity", // Helps avoid gzip-related issues
  },
});

// ✅ Debugging: Log responses and errors
axiosClient.interceptors.response.use(
  (response) => {
    console.log("🟢 Axios Response:", response.data);
    return response;
  },
  (error) => {
    console.error("🔴 Axios Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
