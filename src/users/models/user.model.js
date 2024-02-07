const { default: mongoose, SchemaTypes } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: SchemaTypes.String,
      required: true,
      lowercase: true,
      trim: true,
      minLength: 1,
      maxLength: 50,
    },
    lastName: {
      type: SchemaTypes.String,
      required: true,
      lowercase: true,
      trim: true,
      minLength: 1,
      maxLength: 50,
    },
    email: {
      type: SchemaTypes.String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      maxLength: 254,
    },
    password: {
      type: SchemaTypes.String,
      required: true,
    },
    refreshToken: {
      type: SchemaTypes.String,
      default: null,
      trim: true,
      index: true,
    },
    profileImageUrl: { type: SchemaTypes.String, default: null, trim: true },
  },
  {
    timestamps: true,
    statics: {
      findByEmail(email) {
        return this.findOne({ email });
      },
    },
  }
);

userSchema.index({ firstName: 1, lastName: 1 });

module.exports = mongoose.model("User", userSchema);
