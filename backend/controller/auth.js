const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SignUpDetails = require("../models/userDetails");
const UserDetails = require("../models/userDetails");

//?------------------------------
//? signup
//?------------------------------
const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, googleId } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    let newUserData = { firstName, lastName, email };

    if (googleId) {
      // If Google ID is provided, it's a Google-authenticated user
      newUserData.googleId = googleId;
    } else if (password) {
      // For email/password signup, hash the password
      const salt = await bcrypt.genSalt(10);
      newUserData.password = await bcrypt.hash(password, salt);
    } else {
      return res
        .status(400)
        .json({ message: "Password or Google ID required" });
    }

    // Create new user
    user = new User(newUserData);
    await user.save();

    // Create and send JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("authToken", token, {
      // httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.__v;
    delete userResponse.createdAt
    delete userResponse.updatedAt
    delete userResponse.totalOrders
    delete userResponse.totalSpent
    delete userResponse._id

    res.status(201).json({msg:'user saved', user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "signup Server error" });
  }
};

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
      message: "User details saved successfully"
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
//? login
//?------------------------------
const login = async (req, res) => {
  console.log("login");
  try {
    const { email, password, googleId } = req.body;

    const user = await User.findOne({ email }).select('-_id -password -__v -createdAt -updatedAt -totalOrders -totalSpent') // Check if user exists
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    if (!password && !googleId) {
      return res.status(400).json({ message: "Please provide credentials" });
    }
    if (password) {
      const isMatch = await bcrypt.compare(password, user.password); // Check password match
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }
    if (googleId) {
      if (user.googleId !== googleId) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("authToken", token, {
      // httpOnly: true,
      secure: true, // Only set secure flag in production
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    res.status(200).json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "login Server error" });
  }
};

//?------------------------------
//? admin login
//?------------------------------
const adminLogin = async (req, res) => {
  try {
    const { email, password, googleId } = req.body;

    const user = await User.findOne({ email }).select('-_id -password -__v -createdAt -updatedAt -totalOrders -totalSpent') // Check if user exists
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }

    if (user.role !== "admin") {
      return res.status(400).json({ message: "unauthorized" });
    }

    if (password) {
      const isMatch = bcrypt.compare(password, user.password); // Check password match
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }
    if (googleId) {
      if (user.googleId !== googleId) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("authToken", token, {
      // httpOnly: true,
      secure: true, // Only set secure flag in production
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 30,
      // path : '/'
    });
    res.status(200).json({ user, message : 'logged in' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "login Server error" });
  }
};

//?------------------------------
//? login by authtoken
//?------------------------------
const getUserByToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-_id -password -__v -createdAt -updatedAt -totalOrders -totalSpent");
    if (!res) {
      return res.status(400).json({ messsage: "no user found" });
    }
    return res.status(200).json({ user, message: "user found" });
  } catch (err) {
    console.log("error in getUser api", err.message);
    return res
      .status(500)
      .json({ error: err.message, message: "error in getUser api" });
  }
};

//?------------------------------
//? update password
//?------------------------------
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//?------------------------------
//? getting all users
//?------------------------------
const getAllUsersApi = async (req, res) => {
  try {
    // Find the requesting user
    const requestingUser = await User.findById(req.user.userId);
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

    const userDetails = await UserDetails.find({userId});
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
//? update user details
//?------------------------------
const updateUserDetails = async (req, res) => {
  const userId = req.user.userId; // from middleware
  const { firstName, lastName, company, state, mobilePhone, workPhone, zipCode, caDreLicense, address, receiveEmailNotifications, receiveTextNotifications } = req.body;

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
      { company, state, mobilePhone, workPhone, zipCode, caDreLicense, address, receiveEmailNotifications, receiveTextNotifications },
      { new: true }
    );

    if (userUpdate && detailsUpdate) {
      return res.status(200).json({ message: 'Profile updated successfully', user: userUpdate, userDetails: detailsUpdate });
    }
    res.status(404).json({ message: 'User or User Details not found' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};


//? ------------------------
//? signout api
//? ------------------------
const signOutApi = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is missing" });
    }

    // Clear the authToken cookie, specifying the domain for cross-site compatibility
    res.clearCookie("authToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None", // Allows cross-site cookie usage
      domain: ".https://propped-up-bay-area.vercel.app.com", 
    });

    // Send response indicating sign-out success
    return res.status(200).json({ message: "Successfully signed out" });
  } catch (error) {
    console.error("Error in signOutApi:", error);
    return res.status(500).json({ message: "Server error during sign-out" });
  }
};


module.exports = {
  signUp,
  login,
  userDetails,
  getUserByToken,
  updateUserDetails,
  updatePassword,
  getAllUsersApi,
  adminLogin,
  getUserDetailsApi,
  signOutApi
};
