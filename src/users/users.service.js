const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const userModel = require("./models/user.model");
const s3 = require("../config/s3");
const { PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const Bucket = process.env.BUCKET;
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const chatModel = require("../chats/models/chat.model");

const getUserProfile = async (req, res) => {
  try {
    const profile = await userModel
      .findById(req.user._id)
      .select("-password -updatedAt -refreshToken")
      .lean();
    if (profile.profileImageUrl) {
      profile.profileImageUrl = await getUrl(
        s3,
        profile.profileImageUrl,
        Bucket
      );
    }
    const friends = await chatModel.find({ users: req.user._id });
    profile["friends"] = friends?.length;
    return res.status(StatusCodes.OK).json(profile);
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

const searchUsers = async (req, res) => {
  try {
    const user = req.user;
    const { q } = req.query;
    const result = await userModel
      .find({
        $or: [{ firstName: { $regex: q } }, { lastName: { $regex: q } }],
        _id: { $ne: user._id },
      })
      .select("-password -refreshToken -updatedAt");
    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

const uploadProfileImage = async (req, res) => {
  try {
    const user = req.user;
    const file = req.file;
    const Key = `profilePicture/${user._id}`;
    const putObjectCommand = new PutObjectCommand({
      Key,
      Bucket,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
    await s3.send(putObjectCommand);
    await userModel.findByIdAndUpdate(user._id, { profileImageUrl: Key });
    const url = await getUrl(s3, Key, Bucket);
    return res
      .status(StatusCodes.CREATED)
      .json({ message: "Profile image uploaded", url });
  } catch (err) {
    console.log(err);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: ReasonPhrases.INTERNAL_SERVER_ERROR });
  }
};

const getUrl = async (s3, Key, Bucket) => {
  const getObjectCommand = new GetObjectCommand({ Key, Bucket });
  const url = await getSignedUrl(s3, getObjectCommand, { expiresIn: 3600 });
  return url;
};

module.exports = { getUserProfile, searchUsers, uploadProfileImage };
