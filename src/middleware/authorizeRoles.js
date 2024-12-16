const jwt = require('jsonwebtoken');

const authorizeRoles = (roles) => async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');

    if (!roles.includes(decoded.role)) {
      return res.status(406).json({ message: 'Access denied: Insufficient permissions' });
    }

    req.user = req.user || decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authorizeRoles;
