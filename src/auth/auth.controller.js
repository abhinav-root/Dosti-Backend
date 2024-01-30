const { body } = require("express-validator");
const validateRequest = require("../middlewares/validate");
const { signup } = require("./auth.service");
const { isEmailInUse } = require("./middlewares/is-email-in-use.middleware");

const router = require("express").Router();

router.post(
  "/signup",
  body("firstName")
    .notEmpty()
    .withMessage("This field cannot be empty")
    .isString()
    .withMessage("This field must be a string")
    .trim()
    .isLength({ min: 1 })
    .withMessage("This field must contain al teast 1 character")
    .isLength({ max: 50 })
    .withMessage("This field cannot contain more than 50 characters")
    .isAlpha()
    .withMessage("This field must contain alphabets only")
    .escape()
    .toLowerCase(),
  body("lastName")
    .notEmpty()
    .withMessage("This field cannot be empty")
    .isString()
    .withMessage("This field must be a string")
    .trim()
    .isLength({ min: 1 })
    .withMessage("This field must contain al teast 1 character")
    .isLength({ max: 50 })
    .withMessage("This field cannot contain more than 50 characters")
    .isAlpha()
    .withMessage("This field must contain alphabets only")
    .escape()
    .toLowerCase(),
  body("email")
    .notEmpty()
    .withMessage("This field cannot be empty")
    .isString()
    .withMessage("This field must be a string")
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .escape()
    .toLowerCase(),
  body("password")
    .notEmpty()
    .withMessage("This field cannot be empty")
    .isString()
    .isLength({ min: 8 })
    .withMessage("This field must contain at least 8 characters")
    .isLength({ max: 50 })
    .withMessage("This field cannot be more than 50 characters"),
  validateRequest,
  isEmailInUse,
  signup
);

module.exports = router;
