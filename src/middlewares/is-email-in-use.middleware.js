const { StatusCodes } = require("http-status-codes");
const userModel = require("../users/models/user.model");

const isEmailInUse = async (req, res, next) => {
  const userExists = await userModel.findByEmail(req.body.email);
  if (userExists) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ message: "This email is already registered" });
  }
  next();
};

module.exports = { isEmailInUse };
