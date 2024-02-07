const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

const validateRequest = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(StatusCodes.BAD_REQUEST).json(result.mapped());
  }
  next();
};

module.exports = validateRequest;
