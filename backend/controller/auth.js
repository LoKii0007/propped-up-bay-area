const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signUp = async (req, res) => {
  try {
    console.log('req.body : ', req.body)
    const { firstName, lastName, email, password } = req.body


    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    await user.save();

    // Create and send JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only set secure flag in production
      sameSite: 'Lax',
      // maxAge: 3600000, 
    });

    res.status(201).json({ token : token, user : user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'signup Server error' });
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only set secure flag in production
      sameSite: 'Lax',
      // maxAge: 3600000, 
    });
    res.status(200).json({ token : token, user : user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'login Server error' });
  }
}

module.exports = {
  signUp,
  login
}