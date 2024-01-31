const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const userModel = require("../users/models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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
    res.status(StatusCodes.OK).json({ accessToken });
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
    res.clearCookie("jwt", cookieOptions);
    res.status(StatusCodes.OK).json({ message: "Logged out" });
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

const getAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30s",
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
    expiresIn: 1000 * 60 * 60 * 24,
    httpOnly: true,
  };
  return options;
};
module.exports = { signup, login, refresh, logout };
