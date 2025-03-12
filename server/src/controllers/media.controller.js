import responseHandler from "../handlers/response.handler.js";
import tmdbApi from "../tmdb/tmdb.api.js";
import userModel from "../models/user.model.js";
import favoriteModel from "../models/favorite.model.js";
import reviewModel from "../models/review.model.js";
import tokenMiddlerware from "../middlewares/token.middleware.js";


const getList = async (req, res) => {
  try {
    let { page } = req.query;
    const { mediaType, mediaCategory } = req.params;

    // Ensure page is a valid number
    page = Number(page);
    if (!page || page < 1 || page > 500) page = 1;

    // console.log("📢 Fetching TMDB media list with:", { mediaType, mediaCategory, page });

    const response = await tmdbApi.mediaList({ mediaType, mediaCategory, page });

    if (!response || !response.results) {
      console.warn("⚠️ No data received from TMDB! Response:", response);
      return responseHandler.error(res, "TMDB API did not return data.");
    }

   // console.log("✅ Final TMDB Response:", response);

    return responseHandler.ok(res, response);
  } catch (err) {
    console.error("❌ Error fetching media list:", err);
    responseHandler.error(res);
  }
};

const getGenres = async (req, res) => {
  try {
    const { mediaType } = req.params;

   // console.log("📢 Fetching TMDB genres for:", mediaType);

    const response = await tmdbApi.mediaGenres({ mediaType });

  //  console.log("✅ Genres Response:", response);

    return responseHandler.ok(res, response);
  } catch (err) {
    //console.error("❌ Error fetching genres:", err);
    responseHandler.error(res);
  }
};

const search = async (req, res) => {
  try {
    const { mediaType } = req.params;
    const { query, page } = req.query;

    //console.log("📢 Searching TMDB with:", { query, page, mediaType });

    const response = await tmdbApi.mediaSearch({
      query,
      page,
      mediaType: mediaType === "people" ? "person" : mediaType,
    });

    //console.log("✅ Search Results:", response);

    responseHandler.ok(res, response);
  } catch (err) {
    //console.error("❌ Error in search:", err);
    responseHandler.error(res);
  }
};

const getDetail = async (req, res) => {
  try {
    const { mediaType, mediaId } = req.params;

   // console.log("📢 Fetching TMDB details for:", { mediaType, mediaId });

    const params = { mediaType, mediaId };
    const media = await tmdbApi.mediaDetail(params);

    if (!media) {
     // console.warn("⚠️ No media details found!");
      return responseHandler.notfound(res);
    }

    media.credits = await tmdbApi.mediaCredits(params);
    media.videos = await tmdbApi.mediaVideos(params);
    media.recommend = (await tmdbApi.mediaRecommend(params)).results;
    media.images = await tmdbApi.mediaImages(params);

    const tokenDecoded = tokenMiddlerware.tokenDecode(req);

    if (tokenDecoded) {
      const user = await userModel.findById(tokenDecoded.data);

      if (user) {
        const isFavorite = await favoriteModel.findOne({ user: user.id, mediaId });
        media.isFavorite = !!isFavorite;
      }
    }

    media.reviews = await reviewModel.find({ mediaId }).populate("user").sort("-createdAt");

    //console.log("✅ Media Details Fetched Successfully");
    responseHandler.ok(res, media);
  } catch (err) {
   // console.error("❌ Error fetching media details:", err);
    responseHandler.error(res);
  }
};

export default { getList, getGenres, search, getDetail };
