import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token missing or invalid.' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'skillpath_super_secret_jwt_key_2026_production';
    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.userId).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ success: false, message: 'User associated with token not found.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.', error: error.message });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied: Admin permissions required.' });
};

export const requireStudent = (req, res, next) => {
  if (req.user && (req.user.role === 'student' || req.user.role === 'admin')) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied: Student permissions required.' });
};
