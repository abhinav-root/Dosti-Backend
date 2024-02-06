const { Schema, model, SchemaTypes } = require("mongoose");

const resetPasswordSchema = new Schema(
  {
    userId: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: SchemaTypes.String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("ResetPassword", resetPasswordSchema);
