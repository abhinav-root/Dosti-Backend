const router = require("express").Router();
const { query } = require("express-validator");
const { getUserProfile, searchUsers } = require("./users.service");
const validateRequest = require("../middlewares/validate-request");

router.get("/profile", getUserProfile);

router.get(
  "/search",
  query("q")
    .notEmpty()
    .withMessage("q cannot be empty")
    .isLength({ min: 1 })
    .escape()
    .toLowerCase(),
  validateRequest,
  searchUsers
);

module.exports = router;
