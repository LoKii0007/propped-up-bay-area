const SignUpDetails = require("../models/userDetails");
const UserDetails = require("../models/userDetails");
const User = require("../models/user");
const SuperUser = require("../models/superUser");

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
        message: "User details could not be saved",
      });
    }

    const statusUpdated = await User.findByIdAndUpdate(
      userId,
      { profileCompleted: true },
      { new: true }
    );

    return res.status(201).json({
      message: "User details saved successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "User details could not be saved",
      error: error.message,
    });
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
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find users with pagination
    const users = await User.find().skip(skip).limit(limit);

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    return res.status(200).json({ users, message: "Users found." });
  } catch (error) {
    console.log("Error in getAllUsersApi", error.message);
    return res
      .status(500)
      .json({ message: "Error in getAllUsersApi", error: error.message });
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
      return res.status(404).json({ message: "User not found." });
    }
    if (!user.profileCompleted) {
      return res.status(400).json({ message: "signup not complete" });
    }

    const userDetails = await UserDetails.find({ userId });
    if (!userDetails) {
      return res.status(404).json({ message: "User details not found." });
    }

    return res.status(200).json({
      message: "User details retrieved successfully",
      userDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Could not retrieve user details",
      error: error.message,
    });
  }
};

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
    receiveEmailNotifications,
    receiveTextNotifications,
  } = req.body;

  try {
    // Update User schema
    const userUpdate = await User.findOneAndUpdate(
      { _id: userId },
      { firstName, lastName },
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
      return res
        .status(200)
        .json({
          message: "Profile updated successfully",
          user: userUpdate,
          userDetails: detailsUpdate,
        });
    }
    res.status(404).json({ message: "User or User Details not found" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
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
    if (!requester || !requester.role || (requester.role !== 'admin' && requester.role !== 'superuser')) {
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
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve user details", error: error.message });
  }
};


module.exports = {
  updateUserDetails,
  getUserDetailsApi,
  getAllUsersApi,
  userDetails,
  getSingleUserDetails
};
