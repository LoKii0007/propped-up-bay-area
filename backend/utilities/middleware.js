const jwt = require('jsonwebtoken');
const User = require('../models/user');

//? Middleware to verify the JWT token
const verifyUser = (req, res, next) => {
  // const token = req.header('Authorization')?.split(' ')[1]; // Bearer <token>
  const token = req.cookies.authToken

  if (!token) {
    return res.status(401).json({ message: 'Access denied. Not authorized' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    // console.log(req.user)
    next()
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(400).json({ message: 'Invalid token.' });
  }
}

module.exports = verifyUser;
