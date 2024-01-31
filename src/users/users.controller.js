const router = require("express").Router();
const { getUserProfile } = require("./users.service");

router.get("/profile", getUserProfile);

module.exports = router;
