const router = require("express").Router();
const { query } = require("express-validator");
const { getUserProfile, searchUsers } = require("./users.service");

router.get("/profile", getUserProfile);

router.get(
  "/search",
  query("q").notEmpty().withMessage("q cannot be empty").escape().toLowerCase(),
  searchUsers
);

module.exports = router;
