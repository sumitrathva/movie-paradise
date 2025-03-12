import axiosClient from "../axios/axios.client.js";
import tmdbEndpoints from "./tmdb.endpoints.js";

const tmdbApi = {
  mediaList: async ({ mediaType, mediaCategory, page }) => {
    try {
      const response = await axiosClient.get(
        tmdbEndpoints.mediaList({ mediaType, mediaCategory, page })
      );
      console.log("✅ TMDB API Response:", response.data); // Ensure correct data
      return response.data; // Return only response.data
    } catch (error) {
      console.error("❌ TMDB API Error:", error.response ? error.response.data : error.message);
      return null;
    }
  }, // 🔴 Missing comma was here!

  mediaDetail: async ({ mediaType, mediaId }) => {
    try {
      const response = await axiosClient.get(
        tmdbEndpoints.mediaDetail({ mediaType, mediaId })
      );
      return response.data || null;
    } catch (error) {
      console.error("❌ TMDB API Error:", error.response?.data || error.message);
      return null;
    }
  },

  mediaGenres: async ({ mediaType }) => {
    try {
      const response = await axiosClient.get(
        tmdbEndpoints.mediaGenres({ mediaType })
      );
      return response.data || null;
    } catch (error) {
      console.error("❌ TMDB API Error:", error.response?.data || error.message);
      return null;
    }
  },

  mediaSearch: async ({ mediaType, query, page }) => {
    try {
      const response = await axiosClient.get(
        tmdbEndpoints.mediaSearch({ mediaType, query, page })
      );
      return response.data || null;
    } catch (error) {
      console.error("❌ TMDB API Error:", error.response?.data || error.message);
      return null;
    }
  }
};

export default tmdbApi;
