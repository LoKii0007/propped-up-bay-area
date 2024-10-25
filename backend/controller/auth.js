const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SignUpDetails = require("../models/userDetails");

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

    if (googleId) { // If Google ID is provided, it's a Google-authenticated user
      newUserData.googleId = googleId;
    } else if (password) { // For email/password signup, hash the password
      const salt = await bcrypt.genSalt(10);
      newUserData.password = await bcrypt.hash(password, salt);
    } else {
      return res.status(400).json({ message: "Password or Google ID required" });
    }

    // Create new user
    user = new User(newUserData);
    await user.save();

    // Create and send JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      // maxAge : 
    });

    res.status(201).json({ token: token, user: user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "signup Server error" });
  }
};


//?------------------------------
//? user details for signup
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
      profileComplete,
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
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only set secure flag in production
      sameSite: "Lax",
      // maxAge: 3600000,
    });
    res.status(200).json({ token: token, user: user });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "login Server error" });
  }
};

module.exports = {
  signUp,
  login,
  userDetails,
};
