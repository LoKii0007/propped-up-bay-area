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

    // Initialize newUserData and ensure connectedAccounts is an array
    let newUserData = { firstName, lastName, email, connectedAccounts: [] };

    if (googleId) {
      // If Google ID is provided, it's a Google-authenticated user
      newUserData.googleId = googleId;
      newUserData.connectedAccounts.push("Google");
    } else if (password) {
      // For email/password signup, hash the password
      const salt = await bcrypt.genSalt(10);
      newUserData.password = await bcrypt.hash(password, salt);
      newUserData.connectedAccounts.push("Email");
    } else {
      return res.status(400).json({ msg: "Password or Google ID required" });
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
    delete userResponse.createdAt;
    delete userResponse.updatedAt;
    delete userResponse.totalOrders;
    delete userResponse.totalSpent;
    delete userResponse._id;

    res.status(201).json({ msg: "User saved", user: userResponse });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Signup server error" });
  }
};

//?------------------------------
//? login
//?------------------------------
const login = async (req, res) => {
  try {
    const { email, password, googleId } = req.body;

    const user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -totalOrders -totalSpent"
    ); // Check if user exists
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    if (!password && !googleId) {
      return res.status(400).json({ msg: "Please provide credentials" });
    }
    if (password && user.connectedAccounts.includes("Email")) {
      const isMatch = await bcrypt.compare(password, user.password); // Check password match
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
    }
    if (googleId && user.connectedAccounts.includes("Google")) {
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

    const user2 = user.toObject();
    delete user2._id;
    delete user2.password;

    res.status(200).json({ user: user2 });
  } catch (error) {
    console.error("Login api error", error.message);
    res.status(500).json({ msg: "login Server error" });
  }
};

//?------------------------------
//? login by authtoken
//?------------------------------
const getUserByToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      "-password -__v -createdAt -updatedAt -totalOrders -totalSpent"
    );
    if (!user) {
      return res.status(400).json({ msg: "no user found" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("authToken", token, {
      // httpOnly: true,
      secure: true, // Only set secure flag in production
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return res.status(200).json({ user});
  } catch (err) {
    console.log("error in getUser api", err.message);
    return res
      .status(500)
      .json({ error: err.message, msg: "error in getUser api" });
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

//? ------------------------
//? auth update for user
//? ------------------------
const authUpdate = async (req, res) => {
  try {
    const { email, password, googleId } = req.body;

    const tokenUser = await User.findById(req.user.userId);
    if (!tokenUser) {
      return res.status(400).json({ msg: "no user found" });
    }

    // Find the user by email
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user._id.toString() !== tokenUser._id.toString()) {
      return res.status(404).json({ msg: "not authorized" });
    }

    // If Google ID is provided and we want to link it to an email/password account
    if (googleId) {
      if (user.googleId) {
        // Check if the provided Google ID matches the existing one
        if (user.googleId !== googleId) {
          return res
            .status(400)
            .json({ msg: "Invalid Google ID for this user" });
        }
      } else {
        user.googleId = googleId; // Add Google ID if it does not exist
        user.connectedAccounts.push("Google");
      }
    }

    // If password is provided and we want to link it to a Google-authenticated account
    if (password) {
      if (user.password) {
        // Check if the provided password matches the existing one
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res
            .status(400)
            .json({ msg: "Invalid password for this user" });
        }
      } else {
        // Hash the new password and add it to the account
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.connectedAccounts.push("Email");
      }
    }

    // Save the updated user information
    await user.save();

    // Generate and send a new JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.cookie("authToken", token, {
      secure: true,
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.__v;
    delete userResponse.createdAt;
    delete userResponse.updatedAt;
    delete userResponse.totalOrders;
    delete userResponse.totalSpent;
    delete userResponse._id;

    res
      .status(200)
      .json({ msg: "User updated with new auth method", user: userResponse });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
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
      // httpOnly: true,
      secure: true,
      sameSite: "None",
      // domain: "propped-up-backend.vercel.app",
    });

    // Send response indicating sign-out success
    return res.status(200).json({ message: "Successfully signed out" });
  } catch (error) {
    console.error("Error in signOutApi:", error);
    return res.status(500).json({ message: "Server error during sign-out" });
  }
};

//* --------------admin routes----------------------

//?------------------------------
//? admin login
//?------------------------------
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await SuperUser.findOne({ email }).select("-__v -createdAt -updatedAt"); // Check if user exists
    if (!user) {
      return res.status(400).json({ msg: "user not found" });
    }

    if (user.role !== "admin" && user.role !== "superuser") {
      return res.status(400).json({ msg: "unauthorized" });
    }

    const isMatch = bcrypt.compare(password, user.password); // Check password match
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("authToken", token, {
      // httpOnly: true,
      secure: true, // Only set secure flag in production
      sameSite: "None",
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    const user2 = user.toObject()
    delete user2.password

    res.status(200).json({ user, msg: "logged in" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "login Server error" });
  }
};

//?------------------------------
//? update admin password
//?------------------------------
const updateAdminPassword = async (req, res) => {
  try {
    const { currentPass, newPass } = req.body;

    // Find the user by ID
    const user = await SuperUser.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.role !== "superuser" && user.role !== "admin") {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPass, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPass, salt);

    // Save the updated user
    await user.save();

    res.status(200).json({ msg: "Password updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: "Server error" });
  }
};

//?------------------------------
//? update admin details
//?------------------------------
const updateAdminDetails = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, email, phone } = req.body;

    // Find the admin user by ID
    const user = await SuperUser.findById(userId).select(
      "-__v -createdAt -updatedAt -password"
    );

    if (!user || (user.role !== "admin" && user.role !== "superuser")) {
      return res.status(403).json({ msg: "Unauthorized or user not found" });
    }

    // Update fields if they exist in the request body
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;

    await user.save(); // Save updated user details to the database

    res.status(200).json({ user, msg: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error while updating profile" });
  }
};

module.exports = {
  signUp,
  login,
  getUserByToken,
  updatePassword,
  adminLogin,
  signOutApi,
  updateAdminDetails,
  authUpdate,
  updateAdminPassword,
};
