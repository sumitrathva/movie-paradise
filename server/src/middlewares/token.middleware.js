import jwt from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";
import userModel from "../models/user.model.js";

// Function to decode token and verify its validity
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
    if (error.name === "TokenExpiredError") {
      console.error("❌ Token expired.");
      return false; // Token expired
    }
    console.error("JWT Verification Error:", error.message);
    return false; // Other JWT verification errors
  }
};

// Authentication middleware
const auth = async (req, res, next) => {
  console.log("🔑 Checking Authorization Header:", req.headers.authorization);

  const tokenDecoded = tokenDecode(req);

  // If token is invalid or expired
  if (!tokenDecoded) {
    console.error("❌ Invalid or expired token. User is unauthorized.");
    return responseHandler.unauthorize(res, "Invalid or expired token. Please log in again.");
  }

  try {
    console.log("🔍 Token Decoded Data:", tokenDecoded);

    // Find the user by ID from the decoded token
    const user = await userModel.findById(tokenDecoded.data);
    if (!user) {
      console.error("❌ User not found. Unauthorized.");
      return responseHandler.unauthorize(res, "User not found. Please log in again.");
    }

    // Attach the user to the request object for use in route handlers
    req.user = user;
    console.log("✅ User authenticated:", user.displayName); // Log the display name or another user detail for debugging
    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);
    return responseHandler.error(res);
  }
};

export default { auth, tokenDecode };
