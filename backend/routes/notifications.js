import express from 'express';
import { Notification } from '../models/Notification.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications
router.get('/', authenticateUser, async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({ createdAt: -1 });
    return res.json({ success: true, notifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch notifications.', error: error.message });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', authenticateUser, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { read: true },
      { new: true }
    );
    return res.json({ success: true, notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update notification.', error: error.message });
  }
});

export default router;
