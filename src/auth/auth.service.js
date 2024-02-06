const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const userModel = require("../users/models/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const resetPasswordModel = require("./models/reset-password.model");
const { sendForgotPasswordEmail } = require("../config/email");

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const passwordHashed = bcrypt.hashSync(password, 12);
    const user = new userModel({
      email,
      firstName,
      lastName,
      password: passwordHashed,
    });
    await user.save();
    return res.status(StatusCodes.CREATED).json({ message: "Account created" });
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

const login = async (req, res) => {
  try {
    const userId = req.user._id;
    const payload = { _id: userId };
    const accessToken = getAccessToken(payload);
    const refreshToken = getRefreshToken(payload);
    const cookieOptions = getCookieOptions();
    res.cookie("jwt", refreshToken, cookieOptions);
    const user = await userModel.findById(userId);
    user.refreshToken = refreshToken;
    await user.save();
    const userProfile = await userModel
      .findById(userId)
      .select("-password -refreshToken").lean();
    res.status(StatusCodes.OK).json({ accessToken, ...userProfile });
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

const refresh = async (req, res) => {
  try {
    const user = await userModel.findById(req.user._id);
    const payload = { _id: user._id };
    const accessToken = getAccessToken(payload);
    const refreshToken = getRefreshToken(payload);
    const cookieOptions = getCookieOptions();
    res.cookie("jwt", refreshToken, cookieOptions);
    user.refreshToken = refreshToken;
    await user.save();
    res.status(StatusCodes.OK).json({ accessToken });
  } catch (err) {
    console.log(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

const logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies["jwt"]) {
      return res.sendStatus(StatusCodes.NO_CONTENT);
    }
    const refreshToken = cookies["jwt"];
    const user = await userModel.findOne({ refreshToken });
    if (!user) {
      return res.sendStatus(StatusCodes.FORBIDDEN);
    }
    const cookieOptions = getCookieOptions();
    res.clearCookie("jwt", { ...cookieOptions, maxAge: 0 });
    res.status(StatusCodes.OK).json({ message: "Logged out" });
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email not found" });
    }
    let token = await resetPasswordModel.findOne({ userId: user._id });
    if (token) {
      await token.deleteOne();
    }
    let resetToken = crypto.randomBytes(32).toString("hex");
    console.log({resetToken})
    const hash = bcrypt.hashSync(resetToken, 12);
    console.log({hash})
    await new resetPasswordModel({
      userId: user._id,
      token: hash,
    }).save();
    const link = `${process.env.REACT_APP_URL}/reset-password?token=${resetToken}&id=${user._id}`;
    sendForgotPasswordEmail(email, link);
    return res
      .status(StatusCodes.OK)
      .json({ message: "A reset password link has been send to your email" });
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { userId, token, password } = req.body;
    let passwordResetToken = await resetPasswordModel.findOne({ userId });
    if (!passwordResetToken) {
      throw new Error("Invalid or expired password reset token");
    }
    console.log({tokenFE: token, tokenSaved: passwordResetToken.token})
    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
      throw new Error("Invalid or expired password reset token");
    }
    const hash = await bcrypt.hash(password, 12);
    await userModel.updateOne(
      { _id: userId },
      { $set: { password: hash } },
      { new: true }
    );
    await resetPasswordModel.deleteOne();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Password changed successfully" });
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

const getAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "5s",
  });
};

const getRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
};

const getCookieOptions = () => {
  const options = {
    secure: true,
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
  };
  return options;
};
module.exports = {
  signup,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
};
