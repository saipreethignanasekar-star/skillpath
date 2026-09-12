import express from 'express';
import { User } from '../models/User.js';
import { Skill } from '../models/Skill.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// GET /api/users/profile
router.get('/profile', authenticateUser, async (req, res) => {
  return res.json({ success: true, user: req.user });
});

// PUT /api/users/profile
router.put('/profile', authenticateUser, async (req, res) => {
  try {
    const { name, college, currentYear, targetRole, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name) user.name = name;
    if (college) user.college = college;
    if (currentYear) user.currentYear = currentYear;
    if (targetRole) user.targetRole = targetRole;
    if (avatar) user.avatar = avatar;

    await user.save();

    return res.json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update profile.', error: error.message });
  }
});

// POST /api/users/target-role
router.post('/target-role', authenticateUser, async (req, res) => {
  try {
    const { role } = req.body;
    if (!role) {
      return res.status(400).json({ success: false, message: 'Career role is required.' });
    }

    const user = await User.findById(req.user._id);
    user.targetRole = role;
    user.careerReadiness = role === 'Cloud Engineer' ? 68 : role === 'DevOps Engineer' ? 72 : 60;
    await user.save();

    // Adjust skill requirement targets based on role
    const skills = await Skill.find({ user: user._id });
    for (const skill of skills) {
      let req = skill.requiredScore;
      if (role === 'Cloud Engineer') {
        if (skill.name === 'AWS') req = 90;
        if (skill.name === 'Kubernetes') req = 80;
        if (skill.name === 'Docker') req = 80;
        if (skill.name === 'Linux') req = 75;
        if (skill.name === 'Terraform') req = 70;
      } else if (role === 'DevOps Engineer') {
        if (skill.name === 'Kubernetes') req = 95;
        if (skill.name === 'Docker') req = 90;
        if (skill.name === 'Linux') req = 85;
        if (skill.name === 'AWS') req = 75;
      } else if (role === 'Full Stack Developer') {
        if (skill.name === 'Python') req = 85;
        if (skill.name === 'Git') req = 85;
        if (skill.name === 'Docker') req = 60;
      }

      skill.requiredScore = req;
      skill.gap = skill.userScore - req;
      skill.status = skill.gap >= 0 ? 'Strong' : skill.gap >= -25 ? 'Needs Practice' : 'Critical';
      await skill.save();
    }

    const updatedSkills = await Skill.find({ user: user._id });

    // Emit Socket.IO event if io instance attached
    if (req.io) {
      req.io.emit('student.skill.updated', { userId: user._id, targetRole: role });
    }

    return res.json({ success: true, user, skills: updatedSkills });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update target role.', error: error.message });
  }
});

export default router;
