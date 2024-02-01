const { SchemaTypes, Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    chat: {
      required: true,
      type: SchemaTypes.ObjectId,
      ref: "Chat",
      index: true,
    },
    sender: {
      required: true,
      type: SchemaTypes.ObjectId,
      ref: "User",
      index: true,
    },
    content: {
      trim: true,
      required: true,
      type: SchemaTypes.String,
    },
  },
  { timestamps: true }
);

module.exports = model("Message", messageSchema);
