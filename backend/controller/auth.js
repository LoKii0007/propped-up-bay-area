const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SuperUser = require("../models/superUser");

//?------------------------------
//? signup
//?------------------------------
const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, googleId } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
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
        .json({ msg: "Password or Google ID required" });
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
    res.status(500).json({ msg: "signup Server error" });
  }
};

//?------------------------------
//? login
//?------------------------------
const login = async (req, res) => {
  console.log("login");
  try {
    const { email, password, googleId } = req.body;

    const user = await User.findOne({ email }).select('-__v -createdAt -updatedAt -totalOrders -totalSpent') // Check if user exists
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    if (!password && !googleId) {
      return res.status(400).json({ msg: "Please provide credentials" });
    }
    if (password) {
      const isMatch = await bcrypt.compare(password, user.password); // Check password match
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
    }
    if (googleId) {
      if (user.googleId !== googleId) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("authToken", token, {
      // httpOnly: true,
      secure: true, // Only set secure flag in production
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    const user2 = user.toObject()
    delete user2._id
    delete user2.password

    res.status(200).json({ user : user2 });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "login Server error" });
  }
};

//?------------------------------
//? admin login
//?------------------------------
const adminLogin = async (req, res) => {
  try {
    const { email, password, googleId } = req.body;

    const user = await SuperUser.findOne({ email }).select('-__v -createdAt') // Check if user exists
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    if (user.role !== "admin") {
      return res.status(400).json({ msg: "unauthorized" });
    }

    if (password) {
      const isMatch = bcrypt.compare(password, user.password); // Check password match
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
    }
    if (googleId) {
      if (user.googleId !== googleId) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("authToken", token, {
      // httpOnly: true,
      secure: true, // Only set secure flag in production
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
    res.status(200).json({ user, msg : 'logged in' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "login Server error" });
  }
};

//?------------------------------
//? login by authtoken
//?------------------------------
const getUserByToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password -__v -createdAt -updatedAt -totalOrders -totalSpent");
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
    const { currentPass, newPass } = req.body;

    // Find the user by ID
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPass, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPass, salt);

    // Save the updated user
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//?------------------------------
//? update admin details
//?------------------------------
const updateAdminDetails = async (req, res) => {
  try {
    const { userId } = req.user.userId ; // Extract userId from token middleware 
    const { firstName, lastName, email, phone } = req.body;
    const profilePic = req.file?.path; // Assuming profilePic is uploaded using multer

    // Find the admin user by ID
    const user = await SuperUser.findById(userId);
    if (!user || (user.role !== "admin" && user.role !== 'superuser')) {
      return res.status(403).json({ message: "Unauthorized or user not found" });
    }

    // Update fields if they exist in the request body
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (profilePic) user.profilePic = profilePic; // Update profilePic only if a new file is uploaded

    await user.save(); // Save updated user details to the database

    res.status(200).json({ user, message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating profile" });
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
      domain: "propped-up-backend.vercel.app", 
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
  getUserByToken,
  updatePassword,
  adminLogin,
  signOutApi,
  updateAdminDetails
};
