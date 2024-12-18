const SignUpDetails = require("../models/userDetails");
const UserDetails = require("../models/userDetails");
const User = require("../models/user");
const SuperUser = require("../models/superUser");
const streamifier = require("streamifier");
const { nodemailerTransport, gmailTemplateIncompleteProfile } = require("../utilities/gmail");

const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//?------------------------------
//? create user details for signup
//?------------------------------
const userDetails = async (req, res) => {
  try {
    const {
      company,
      caDreLicense,
      address,
      city,
      state,
      zipCode,
      workPhone,
      mobilePhone,
      receiveEmailNotifications,
      receiveTextNotifications,
    } = req.body;

    const userId = req.user.userId;

    const user = await User.findById(req.user.userId).select(
      "-password -__v -createdAt -updatedAt -totalOrders -totalSpent"
    );
    if (!user) {
      return res.status(400).json({ msg: "no user found" });
    }

    // Creaing a new record with the signup details
    const profileComplete = await SignUpDetails.create({
      userId,
      company,
      caDreLicense,
      address,
      city,
      state,
      zipCode,
      workPhone,
      mobilePhone,
      receiveEmailNotifications: receiveEmailNotifications || false, // default to false if not provided
      receiveTextNotifications: receiveTextNotifications || false, // default to false if not provided
    });

    if (!profileComplete) {
      return res.status(500).json({
        msg: "User details could not be saved",
      });
    }

    user.profileCompleted = true;

    const updatedUser = await user.save();

    return res.status(201).json({
      user: updatedUser,
      msg: "User details saved successfully",
    });
  } catch (error) {
    console.error("Error in userDetails API: ", error.message);
    return res.status(500).json({
      msg: "User details could not be saved",
      error: error.message,
    });
  }
};

//?------------------------------
//? getting user details
//?------------------------------
const getUserDetailsApi = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password"); // Exclude password
    if (!user) {
      return res.status(404).json({ msg: "User not found." });
    }
    if (!user.profileCompleted) {
      return res.status(400).json({ msg: "signup not complete" });
    }

    const userDetails = await UserDetails.find({ userId });
    if (!userDetails) {
      return res.status(404).json({ msg: "User details not found." });
    }

    return res.status(200).json({
      msg: "User details retrieved successfully",
      userDetails,
    });
  } catch (error) {
    console.error("Error in getUserDetailsApi API: ", error.message);
    return res.status(500).json({
      msg: "Could not retrieve user details",
      error: error.message,
    });
  }
};

//?------------------------------
//? upload image
//?------------------------------
const uploadUserImage = async (req, res) => {
  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: "image", folder: "user_profiles" },
      async (error, result) => {
        if (error) {
          return res
            .status(500)
            .json({ msg: "Cloudinary upload failed", error: error.message });
        }

        const user = await User.findByIdAndUpdate(req.user.userId, {img : result.secure_url}, {new: true});

        res
          .status(200)
          .json({ msg: "Image uploaded successfully", user });
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
  } catch (error) {
    console.error("Error in uploadUserImage API: ", error.message);
    res.status(500).json({ msg: "Image upload failed", msg: error.message });
  }
};

//?------------------------------
//? send reminder email
//?------------------------------
async function sendReminderEmail(req, res) {
  try {
    const { email } = req.body;
    console.log('email ',email)

    if (!email) {
      return res.status(401).json({ msg: "Please provide a valid email" });
    }

    const requestingUser = await SuperUser.findById(req.user.userId);
    if (!requestingUser) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    // Check if the requesting user has the necessary role
    if (
      requestingUser.role !== "superuser" &&
      requestingUser.role !== "admin"
    ) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email, 
      subject: "Reminder Notification",
      html: gmailTemplateIncompleteProfile(user.firstName),
    };

    await nodemailerTransport.sendMail(mailOptions);
    res.status(200).json({ msg: "Notification sent successfully" });
  } catch (error) {
    console.error("Error in sendReminderEmail API: ", error.message);
    res.status(500).json({ msg: "Error sending notification", err: error.message });
  }
}

//?------------------------------
//? UPDATE user details
//?------------------------------
const updateUserDetails = async (req, res) => {
  const userId = req.user.userId; // from middleware
  const {
    firstName,
    lastName,
    company,
    state,
    mobilePhone,
    workPhone,
    zipCode,
    caDreLicense,
    address,
    img,
    receiveEmailNotifications,
    receiveTextNotifications,
  } = req.body;

  try {
    // Update User schema
    const userUpdate = await User.findOneAndUpdate(
      { _id: userId },
      { firstName, lastName, img },
      { new: true }
    );

    // Update UserDetails schema
    const detailsUpdate = await UserDetails.findOneAndUpdate(
      { userId },
      {
        company,
        state,
        mobilePhone,
        workPhone,
        zipCode,
        caDreLicense,
        address,
        receiveEmailNotifications,
        receiveTextNotifications,
      },
      { new: true }
    );

    if (userUpdate && detailsUpdate) {
      return res.status(200).json({
        msg: "Profile updated successfully",
        user: userUpdate,
        userDetails: detailsUpdate,
      });
    }
    res.status(404).json({ msg: "User or User Details not found" });
  } catch (error) {
    console.error("Error in updateUserDetails API: ", error.message);
    res.status(500).json({ msg: "Failed to update profile", error: error.message });
  }
};

//?------------------------------
//? getting all users -- admin route
//?------------------------------
const getAllUsersApi = async (req, res) => {
  try {
    // Find the requesting user
    const requestingUser = await SuperUser.findById(req.user.userId);
    if (!requestingUser) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if the requesting user has the necessary role
    if (
      requestingUser.role !== "superuser" &&
      requestingUser.role !== "admin"
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Set pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Find total users
    let totalUsersCount = 0;
    if (page === 1) {
      totalUsersCount = await User.countDocuments();
    }

    // Find users with pagination
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .select("-__v -createdAt -googleId -password -updatedAt ");

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res
      .status(200)
      .json({ users, message: "Users found.", count: totalUsersCount });
  } catch (error) {
    console.error("Error in getAllUsersApi API: ", error.message);
    return res.status(500).json({ message: "Error in getAllUsersApi", error: error.message });
  }
};

//?------------------------------
//? get single userDetails -- admin route
//?------------------------------
const getSingleUserDetails = async (req, res) => {
  const { userId } = req.query;
  const requesterId = req.user.userId; // from middleware

  try {
    // Fetch requester role for authorization check
    const requester = await SuperUser.findById(requesterId);
    if (
      !requester ||
      !requester.role ||
      (requester.role !== "admin" && requester.role !== "superuser")
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const userDetails = await UserDetails.findOne({ userId });

    if (!userDetails) {
      return res.status(404).json({ message: "User Details not found" });
    }

    // Send response with both User and UserDetails data
    res.status(200).json({
      message: "User details retrieved successfully",
      userDetails,
    });
  } catch (error) {
    console.error("Error in getSingleUserDetails API: ", error.message);
    res.status(500).json({
      message: "Failed to retrieve user details",
      error: error.message,
    });
  }
};

module.exports = {
  updateUserDetails,
  getUserDetailsApi,
  getAllUsersApi,
  userDetails,
  getSingleUserDetails,
  uploadUserImage,
  sendReminderEmail,
};
