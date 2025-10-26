const jwt = require('jsonwebtoken');

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    req.userId = null;
    return next();
  }

  const decoded = verifyToken(token);
  if (decoded) {
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
  }
  
  next();
}

function requireAuth(req, res, next) {
  if (!req.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

module.exports = { authMiddleware, requireAuth };