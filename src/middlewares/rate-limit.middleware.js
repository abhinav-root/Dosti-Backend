const { default: expressRateLimit } = require("express-rate-limit");

const rateLimit = expressRateLimit({
  windowMs: 60 * 1000,
  max: 50,
  message: { message: "You have exceeded your 50 requests per minute limit." },
  headers: true,
});

module.exports = rateLimit;
