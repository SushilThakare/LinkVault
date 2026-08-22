const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in the Authorization header
  // Format: "Bearer eyJhbGciOiJI..."
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token (remove "Bearer " prefix)
      token = req.headers.authorization.split(' ')[1];

      // Verify the token (checks if it's valid and not expired)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user to the request object (minus the password)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Continue to the next middleware/route handler
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token invalid' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };