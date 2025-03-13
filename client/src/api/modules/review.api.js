import privateClient from "../client/private.client";

const reviewEndpoints = {
  list: "reviews",
  add: "reviews",
  remove: ({ reviewId }) => `reviews/${reviewId}`,
};

const reviewApi = {
  add: async ({
    mediaId,
    mediaType,
    mediaTitle,
    mediaPoster,
    content,
  }) => {
    try {
      // Check if mediaId is valid
      if (!mediaId) {
        throw new Error("Movie ID is required.");
      }

      const response = await privateClient.post(reviewEndpoints.add, {
        mediaId,
        mediaType,
        mediaTitle,
        mediaPoster,
        content,
      });

      return { response };
    } catch (err) {
      console.error("Error adding review:", err);  // Log detailed error
      return { err };
    }
  },
  remove: async ({ reviewId }) => {
    try {
      const response = await privateClient.delete(
        reviewEndpoints.remove({ reviewId })
      );

      return { response };
    } catch (err) {
      console.error("Error removing review:", err);  // Added logging
      return { err };
    }
  },
  getList: async () => {
    try {
      const response = await privateClient.get(reviewEndpoints.list);

      return { response };
    } catch (err) {
      console.error("Error fetching reviews:", err);  // Added logging
      return { err };
    }
  },
};

export default reviewApi;
