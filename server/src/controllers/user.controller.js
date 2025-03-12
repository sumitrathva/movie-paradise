import userModel from "../models/user.model.js";
import jsonwebtoken from "jsonwebtoken";
import responseHandler from "../handlers/response.handler.js";

const signup = async (req, res) => {
  try {
    console.log("🔍 Received Signup Data:", req.body); 
    const { username, password, displayName } = req.body;

    const checkUser = await userModel.findOne({ username });

    if (checkUser) return responseHandler.badrequest(res, "Username already used");

    const user = new userModel();
    user.username = username;
    user.displayName = displayName;
    user.setPassword(password);

    await user.save();

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id
    });
  } catch (error) {
    console.error("❌ Signup Error:", error);
    responseHandler.error(res);
  }
};

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username }).select("username password salt id displayName");

    if (!user) return responseHandler.badrequest(res, "User does not exist");

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Wrong password");

    const token = jsonwebtoken.sign(
      { data: user.id },
      process.env.TOKEN_SECRET,
      { expiresIn: "24h" }
    );

    user.password = undefined;
    user.salt = undefined;

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id
    });
  } catch (error) {
    console.error("❌ Signin Error:", error);
    responseHandler.error(res);
  }
};

const updatePassword = async (req, res) => {
  try {
    const { password, newPassword } = req.body;

    const user = await userModel.findById(req.user.id).select("password id salt displayName");

    if (!user) return responseHandler.unauthorize(res);

    if (!user.validPassword(password)) return responseHandler.badrequest(res, "Wrong password");

    user.setPassword(newPassword);
    await user.save();

    responseHandler.ok(res);
  } catch (error) {
    console.error("❌ Update Password Error:", error);
    responseHandler.error(res);
  }
};

const getInfo = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).select("username displayName id");

    if (!user) return responseHandler.notfound(res);

    responseHandler.ok(res, user);
  } catch (error) {
    console.error("❌ Get Info Error:", error);
    responseHandler.error(res);
  }
};

export default {
  signup,
  signin,
  getInfo,
  updatePassword
};
