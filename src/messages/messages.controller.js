const { body } = require("express-validator");
const validateRequest = require("../middlewares/validate-request");
const { createMessage } = require("./messages.service");

const router = require("express").Router();

router.post(
  "/",
  body("chatId").isMongoId().trim(),
  body("senderId").notEmpty().isString().trim().isLength({ min: 1 }),
  body("content").notEmpty().isString().trim().isLength({ min: 1 }),
  validateRequest,
  createMessage
);

module.exports = router;
