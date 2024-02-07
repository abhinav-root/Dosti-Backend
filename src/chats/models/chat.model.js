const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        index: true,
      },
    ],
    latestMessage: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Message",
      index: true,
      default: null,
    },
    unread: { type: mongoose.SchemaTypes.Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
