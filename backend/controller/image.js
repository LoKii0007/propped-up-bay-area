const OpenHouseImageSchema = require("../models/OpenHouseImages");
const PostOrderImageSchema = require("../models/PostOrderImages");
const { postOrderSchema } = require("../models/postOrderSchema");
const SuperUser = require("../models/superUser");

const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//? ------------------------------
//? UPLOAD post order image
const postOrderImage = async (req, res) => {
  try {
    const { orderId } = req.body;
    const fileStr = req.file;
    const userId = req.user.userId;

    const user = await SuperUser.findById(userId);

    // check if user is authorized
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    if (user.role !== "superuser" && user.role !== "admin") {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Upload to Cloudinary
    const uploadedResponse = await cloudinary.uploader.upload(fileStr.path);
    console.log("image : ", uploadedResponse);

    // save in databse
    const image = await PostOrderImageSchema.create({
      orderId,
      imageUrl: uploadedResponse.secure_url,
    });

    if (!image) {
      return res.status(400).json({ msg: "error saving image" });
    }

    res.status(200).json({
      msg: "Image uploaded successfully!",
      url: uploadedResponse.secure_url,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Image upload failed!", error: error.message });
  }
};

//? ------------------------------
//? UPLOAD open house order image
const openHouseImage = async (req, res) => {
  try {
    const { orderId } = req.body;
    const fileStr = req.file;
    const userId = req.user.userId;

    const user = await SuperUser.findById(userId);

    // check if user is authorized
    if (!user) {
      return res.status(404).json({ msg: "user not found" });
    }

    if (user.role !== "superuser" && user.role !== "admin") {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Upload to Cloudinary
    const uploadedResponse = await cloudinary.uploader.upload(fileStr.path);

    // save in databse
    const image = await OpenHouseImageSchema.create({
      orderId,
      imageUrl: uploadedResponse.secure_url,
    });

    if (!image) {
      return res.status(400).json({ msg: "error saving image" });
    }

    res.status(200).json({
      msg: "Image uploaded successfully!",
      url: uploadedResponse.secure_url,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Image upload failed!", error: error.message });
  }
};

//? ------------------------------
//? UPDATE post order image
const updatePostOrderImage = async (req, res) => {
  try {
    const { orderId } = req.body;
    const fileStr = req.file;
    const userId = req.user.userId;

    // Check if the user is authorized
    const user = await SuperUser.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role !== "superuser" && user.role !== "admin") {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Check if the image exists for the given orderId
    const existingImage = await PostOrderImageSchema.findOne({ orderId });
    if (!existingImage) {
      return res.status(404).json({ msg: "Image not found for this order" });
    }

    // Upload the new image to Cloudinary
    const uploadedResponse = await cloudinary.uploader.upload(fileStr.path);

    // Update the image URL in the database
    existingImage.imageUrl = uploadedResponse.secure_url;
    await existingImage.save();

    res.status(200).json({
      msg: "Image updated successfully!",
      url: uploadedResponse.secure_url,
    });
  } catch (error) {
    res.status(500).json({ msg: "Image update failed!", error: error.message });
  }
};

//? ------------------------------
//? UPDATE open house order image
const updateOpenHouseImage = async (req, res) => {
  try {
    const { orderId } = req.body;
    const fileStr = req.file;
    const userId = req.user.userId;

    // Check if the user is authorized
    const user = await SuperUser.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role !== "superuser" && user.role !== "admin") {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Check if the image exists for the given orderId
    const existingImage = await OpenHouseImageSchema.findOne({ orderId });
    if (!existingImage) {
      return res.status(404).json({ msg: "Image not found for this order" });
    }

    // Upload the new image to Cloudinary
    const uploadedResponse = await cloudinary.uploader.upload(fileStr.path);

    // Update the image URL in the database
    existingImage.imageUrl = uploadedResponse.secure_url;
    await existingImage.save();

    res.status(200).json({
      msg: "Image updated successfully!",
      url: uploadedResponse.secure_url,
    });
  } catch (error) {
    res.status(500).json({ msg: "Image update failed!", error: error.message });
  }
};

const getOrderImage = async (req, res) => {
  const { orderId, type } = req.query;

  console.log(orderId, type)

  try {
    if (type === "openHouse") {
      const image = await OpenHouseImageSchema.findOne({ orderId });
      if (!image) {
        return res.status(400).json({ msg: "image not found" });
      }
      return res
        .status(200)
        .json({ msg: "image fetched", url: image.imageUrl });
    }
    if (type === "postOrder") {
      const image = await postOrderSchema.findOne({ orderId });
      if (!image) {
        return res.status(400).json({ msg: "image not found" });
      }
      return res
        .status(200)
        .json({ msg: "image fetched", url: image.imageUrl });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ msg: " error fetching image", error: error.message });
  }
};

module.exports = {
  postOrderImage,
  openHouseImage,
  updateOpenHouseImage,
  updatePostOrderImage,
  getOrderImage
};
