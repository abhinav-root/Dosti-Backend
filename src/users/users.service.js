const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const userModel = require("./models/user.model");

const getUserProfile = async (req, res) => {
  try {
    const profile = await userModel
      .findById(req.user._id)
      .select("-password -updatedAt -refreshToken");
    return res.status(StatusCodes.OK).json(profile);
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

module.exports = { getUserProfile };
