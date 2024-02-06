const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const chatModel = require("./models/chat.model");
const messageModel = require("../messages/models/message.model");

const createChat = async (req, res) => {
  try {
    const { _id } = req.user;
    const { friendId } = req.body;
    const chatExists = await chatModel.findOne({
      users: { $all: [_id, friendId] },
    });
    if (chatExists) {
      return res
        .status(StatusCodes.CONFLICT)
        .json({ message: "Chat is already created" });
    }

    const chat = new chatModel();
    chat.users.push(_id, friendId);
    await chat.save();
    await chat.populate("users")
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Chat created", data: chat });
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

const getAllChats = async (req, res) => {
  try {
    const { _id } = req.user;
    const chats = await chatModel
      .find({ users: _id })
      .populate("users", "-password -refreshToken")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
    return res.status(StatusCodes.OK).json(chats);
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

const deleteChat = async (req, res) => {
  try {
    const { chatId } = req.params;
    await messageModel.deleteMany({ chat: chatId });
    await chatModel.findByIdAndDelete(chatId);
    return res.status(StatusCodes.OK).json({message: "Chat deleted"});
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

module.exports = { createChat, getAllChats, deleteChat };
