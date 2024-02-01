const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const messageModel = require("./models/message.model");
const chatModel = require("../chats/models/chat.model");
const userModel = require("../users/models/user.model");

const createMessage = async (req, res) => {
  try {
    // const userId = req.user._id;
    const { senderId, chatId, content } = req.body;
    const chat = await chatModel.findById(chatId);
    const sender = await userModel.findById(senderId);
    const message = new messageModel({
      sender: sender,
      chat: chat,
      content,
    });
    await message.save();
    chat.latestMessage = message;
    await chat.save();
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Messaged created" });
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

module.exports = { createMessage };
