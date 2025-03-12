import jwt from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";
import userModel from "../models/user.model.js";

const tokenDecode = (req) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (!bearerHeader || !bearerHeader.startsWith("Bearer ")) {
      return false;
    }

    const token = bearerHeader.split(" ")[1];

    // Verify token and check expiration
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    return decoded;
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return false;
  }
};

const auth = async (req, res, next) => {
  const tokenDecoded = tokenDecode(req);

  if (!tokenDecoded) {
    return responseHandler.unauthorize(res, "Invalid or expired token. Please log in again.");
  }

  try {
    const user = await userModel.findById(tokenDecoded.data);
    if (!user) {
      return responseHandler.unauthorize(res, "User not found. Please log in again.");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return responseHandler.error(res);
  }
};

export default { auth, tokenDecode };
