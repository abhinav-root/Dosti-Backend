const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const messageModel = require("./models/message.model");
const chatModel = require("../chats/models/chat.model");
const userModel = require("../users/models/user.model");

const createMessage = async (req, res) => {
  try {
    // const userId = req.user._id;
    const { senderId, chatId, content } = req.body;
    const chat = await chatModel.findById(chatId).populate("users");
    const sender = await userModel.findById(senderId);
    let message = new messageModel({
      sender: sender,
      chat: chat,
      content,
    });
    await message.save();
    chat.latestMessage = message;
    chat.unread++;
    chat.messageStatus = 'SENT'
    await chat.save();

    message = await messageModel.findById(message._id);
    const io = req.app.get("socketio"); //Here you use the exported socketio module
    // console.log({users: chat.users})
    // for (const u of chat.users) {
    //   console.log(u)
    //   console.log({receiver: u._id.toString() == senderId})
    // }
    const receiver = chat.users.find((u) => u._id.toString() !== senderId);
    console.log({ receiver });
    const socketMap = req.app.get("socketMap");
    const receiverSocketId = socketMap[receiver._id];
    console.log({ receiverSocketId });
    console.log({ socketMap });
    io.to(receiverSocketId).emit("message", message);
    return res.status(StatusCodes.CREATED).json(message);
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

const getAllMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { pageNo, limit } = req.query;
    const messages = await messageModel
      .find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip((pageNo - 1) * limit)
      .limit(limit);
    return res.status(StatusCodes.OK).json(messages.reverse());
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

const markMessagesRead = async (req, res) => {
  try {
    const { chatId } = req.body;
    const chat = await chatModel.findById(chatId);
    chat.unread = 0;
    chat.messageStatus = "SEEN";
    await chat.save();
    return res
      .status(StatusCodes.OK)
      .json({ message: "Marked messages as read" });
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

module.exports = { createMessage, getAllMessages, markMessagesRead };
