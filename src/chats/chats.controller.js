const router = require("express").Router();
const { body } = require("express-validator");
const { createChat, getAllChats } = require("./chat.service");
const validateRequest = require("../middlewares/validate-request");

router.post("/", body("friendId").isMongoId(), validateRequest, createChat);

router.get("/", getAllChats);

module.exports = router;
