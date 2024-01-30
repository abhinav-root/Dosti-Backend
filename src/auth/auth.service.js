const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const userModel = require("../users/models/user.model");


const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const user = new userModel({ email, firstName, lastName, password });
    await user.save();
    return res.status(StatusCodes.CREATED).json({ message: "Account created" });
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

module.exports = { signup };
