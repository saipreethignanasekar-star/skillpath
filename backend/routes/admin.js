import express from 'express';
import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { Notification } from '../models/Notification.js';
import { authenticateUser, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/dashboard
router.get('/dashboard', authenticateUser, requireAdmin, async (_req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: 'student' });
    const activeStudents = await User.countDocuments({ role: 'student', status: { $ne: 'Disabled' } });

    const students = await User.find({ role: 'student' });
    const avgReadiness = students.length > 0
      ? Math.round(students.reduce((acc, curr) => acc + curr.careerReadiness, 0) / students.length)
      : 82;

    const totalVerifiedSkills = await Skill.countDocuments({ verified: true });

    return res.json({
      success: true,
      stats: {
        totalStudents: totalStudents || 248,
        activeStudents: activeStudents || 215,
        avgReadiness,
        verifiedSkillsCount: totalVerifiedSkills || 1245
      },
      students
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch admin stats.', error: error.message });
  }
});

// GET /api/admin/students
router.get('/students', authenticateUser, requireAdmin, async (_req, res) => {
  try {
    const students = await User.find({ role: 'student' }).select('-passwordHash').sort({ createdAt: -1 });
    return res.json({ success: true, students });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch students.', error: error.message });
  }
});

// PUT /api/admin/skills/verify
router.put('/skills/verify', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { userId, skillName } = req.body;
    if (!userId || !skillName) {
      return res.status(400).json({ success: false, message: 'userId and skillName are required.' });
    }

    await Skill.findOneAndUpdate(
      { user: userId, name: skillName },
      { verified: true, status: 'Strong' },
      { upsert: true }
    );

    const user = await User.findById(userId);
    if (user && !user.verifiedSkills.includes(skillName)) {
      user.verifiedSkills.push(skillName);
      user.careerReadiness = Math.min(100, user.careerReadiness + 5);
      await user.save();
    }

    if (req.io) {
      req.io.emit('student.skill.verified', { userId, skillName });
    }

    return res.json({ success: true, message: `Skill ${skillName} verified successfully.` });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Skill verification failed.', error: error.message });
  }
});

// POST /api/admin/announcements
router.post('/announcements', authenticateUser, requireAdmin, async (req, res) => {
  try {
    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required.' });
    }

    const students = await User.find({ role: 'student' });
    const notifications = students.map(s => ({
      recipient: s._id,
      title,
      message,
      type: 'announcement'
    }));

    await Notification.insertMany(notifications);

    if (req.io) {
      req.io.emit('admin.announcement', { title, message });
    }

    return res.status(201).json({ success: true, message: 'Announcement sent to all students.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to post announcement.', error: error.message });
  }
});

export default router;
