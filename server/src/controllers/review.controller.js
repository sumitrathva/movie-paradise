import responseHandler from "../handlers/response.handler.js";
import reviewModel from "../models/review.model.js";

const create = async (req, res) => {
  try {
    const { movieId } = req.params;

    if (!movieId) {
      return responseHandler.badrequest(res, "Movie ID is required.");
    }

    if (!req.user || !req.user.id) {
      return responseHandler.unauthorized(res, "User authentication required.");
    }

    console.log("Creating review for Movie ID:", movieId, "by User:", req.user.id);

    const review = new reviewModel({
      user: req.user.id,
      movieId,
      ...req.body
    });

    await review.save();

    responseHandler.created(res, {
      ...review._doc,
      id: review.id,
      user: req.user
    });
  } catch (error) {
    console.error("❌ Error creating review:", error);
    responseHandler.error(res);
  }
};

const remove = async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!reviewId) {
      return responseHandler.badrequest(res, "Review ID is required.");
    }

    console.log("Deleting review with ID:", reviewId, "by User:", req.user.id);

    const review = await reviewModel.findOne({
      _id: reviewId,
      user: req.user.id
    });

    if (!review) {
      return responseHandler.notfound(res, "Review not found or you don't have permission to delete it.");
    }

    await review.deleteOne(); // ✅ Use deleteOne() instead of remove()
    responseHandler.ok(res, "Review deleted successfully.");
  } catch (error) {
    console.error("❌ Error deleting review:", error);
    responseHandler.error(res);
  }
};

const getReviewsOfUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return responseHandler.unauthorized(res, "User authentication required.");
    }

    console.log("Fetching reviews for User:", req.user.id);

    const reviews = await reviewModel.find({
      user: req.user.id
    }).sort("-createdAt");

    responseHandler.ok(res, reviews);
  } catch (error) {
    console.error("❌ Error fetching user reviews:", error);
    responseHandler.error(res);
  }
};

export default { create, remove, getReviewsOfUser };
