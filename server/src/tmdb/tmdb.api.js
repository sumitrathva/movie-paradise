import axiosClient from "../axios/axios.client.js";
import tmdbEndpoints from "./tmdb.endpoints.js";

const tmdbApi = {
  mediaList: async ({ mediaType, mediaCategory, page }) => {
    try {
      const response = await axiosClient.get(
        tmdbEndpoints.mediaList({ mediaType, mediaCategory, page })
      );
      return response.data || null;
    } catch (error) {
      console.error("❌ TMDB API Error:", error.response?.data || error.message);
      return null;
    }
  },

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
  },

  // 🔹 Add the missing media functions below:
  mediaCredits: async ({ mediaType, mediaId }) => {
    try {
      const response = await axiosClient.get(
        tmdbEndpoints.mediaCredits({ mediaType, mediaId })
      );
      return response.data || null;
    } catch (error) {
      console.error("❌ TMDB API Error:", error.response?.data || error.message);
      return null;
    }
  },

  mediaVideos: async ({ mediaType, mediaId }) => {
    try {
      const response = await axiosClient.get(
        tmdbEndpoints.mediaVideos({ mediaType, mediaId })
      );
      return response.data || null;
    } catch (error) {
      console.error("❌ TMDB API Error:", error.response?.data || error.message);
      return null;
    }
  },

  mediaRecommend: async ({ mediaType, mediaId }) => {
    try {
      const response = await axiosClient.get(
        tmdbEndpoints.mediaRecommend({ mediaType, mediaId })
      );
      return response.data || null;
    } catch (error) {
      console.error("❌ TMDB API Error:", error.response?.data || error.message);
      return null;
    }
  },

  mediaImages: async ({ mediaType, mediaId }) => {
    try {
      const response = await axiosClient.get(
        tmdbEndpoints.mediaImages({ mediaType, mediaId })
      );
      return response.data || null;
    } catch (error) {
      console.error("❌ TMDB API Error:", error.response?.data || error.message);
      return null;
    }
  }
};

export default tmdbApi;
