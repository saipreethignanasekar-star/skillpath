import express from 'express';
import { Skill } from '../models/Skill.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// GET /api/skills
router.get('/', authenticateUser, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user._id });
    return res.json({ success: true, skills });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch skills.', error: error.message });
  }
});

// POST /api/skills
router.post('/', authenticateUser, async (req, res) => {
  try {
    const { name, category, userScore, requiredScore } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Skill name is required.' });
    }

    const uScore = userScore || 50;
    const reqScore = requiredScore || 75;
    const gap = uScore - reqScore;
    const status = gap >= 0 ? 'Strong' : gap >= -25 ? 'Needs Practice' : 'Critical';

    const skillId = `sk_${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    const newSkill = await Skill.create({
      user: req.user._id,
      skillId,
      name,
      category: category || 'Foundation',
      userScore: uScore,
      requiredScore: reqScore,
      gap,
      status,
      verified: false
    });

    return res.status(201).json({ success: true, skill: newSkill });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create skill.', error: error.message });
  }
});

export default router;
