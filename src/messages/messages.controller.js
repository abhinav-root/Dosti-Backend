const { body, param, query } = require("express-validator");
const validateRequest = require("../middlewares/validate-request");
const {
  createMessage,
  getAllMessages,
  markMessagesRead,
} = require("./messages.service");

const router = require("express").Router();

// Create message
router.post(
  "/",
  body("chatId").isMongoId().trim(),
  body("senderId").notEmpty().isString().trim().isLength({ min: 1 }),
  body("content").notEmpty().isString().trim().isLength({ min: 1 }),
  validateRequest,
  createMessage
);

// Get all messages
router.get(
  "/:chatId",
  param("chatId").isMongoId(),
  query("pageNo").isNumeric(),
  query("limit").isNumeric(),
  validateRequest,
  getAllMessages
);

router.patch("/read", body("chatId").isMongoId().trim(), markMessagesRead);

module.exports = router;
