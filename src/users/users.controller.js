const router = require("express").Router();
const { query, body } = require("express-validator");
const {
  getUserProfile,
  searchUsers,
  uploadProfileImage,
} = require("./users.service");
const validateRequest = require("../middlewares/validate-request");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

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

router.post(
  "/profile/profileImage",
  upload.single("image"),
  uploadProfileImage
);

module.exports = router;
