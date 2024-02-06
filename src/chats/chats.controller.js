const router = require("express").Router();
const { body, param } = require("express-validator");
const { createChat, getAllChats, deleteChat } = require("./chat.service");
const validateRequest = require("../middlewares/validate-request");

router.post("/", body("friendId").isMongoId(), validateRequest, createChat);

router.get("/", getAllChats);

router.delete("/:chatId", param('chatId').isMongoId(), validateRequest, deleteChat)

module.exports = router;
