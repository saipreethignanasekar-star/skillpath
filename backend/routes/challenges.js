import express from 'express';
import { Challenge } from '../models/Challenge.js';
import { Submission } from '../models/Submission.js';
import { Skill } from '../models/Skill.js';
import { User } from '../models/User.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// GET /api/challenges
router.get('/', async (_req, res) => {
  try {
    const challenges = await Challenge.find();
    return res.json({ success: true, challenges });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch challenges.', error: error.message });
  }
});

// GET /api/challenges/:id
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ challengeId: req.params.id });
    if (!challenge) {
      return res.status(404).json({ success: false, message: 'Challenge not found.' });
    }
    return res.json({ success: true, challenge });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch challenge.', error: error.message });
  }
});

// POST /api/challenges/:id/submit
router.post('/:id/submit', authenticateUser, async (req, res) => {
  try {
    const { code } = req.body;
    const challengeId = req.params.id;

    if (!code) {
      return res.status(400).json({ success: false, message: 'Code submission body is required.' });
    }

    // Code scoring evaluation logic based on quality checks
    let technicalCorrectness = 90;
    let bestPractices = 85;
    let security = 80;
    let configuration = 88;

    const lowerCode = code.toLowerCase();
    if (!lowerCode.includes('from node')) technicalCorrectness -= 10;
    if (!lowerCode.includes('user node')) security -= 15;
    if (!lowerCode.includes('expose 3000')) configuration -= 10;
    if (!lowerCode.includes('workdir')) bestPractices -= 10;

    const overallScore = Math.round((technicalCorrectness + bestPractices + security + configuration) / 4);
    const verifiedSkillName = 'Docker';

    const submission = await Submission.create({
      student: req.user._id,
      challengeId,
      code,
      overallScore,
      technicalCorrectness,
      bestPractices,
      security,
      configuration,
      summary: `Your solution successfully containerized the application with an overall evaluation score of ${overallScore}%.`,
      verifiedSkillName,
      status: 'Completed'
    });

    // Update verified skill
    await Skill.findOneAndUpdate(
      { user: req.user._id, name: verifiedSkillName },
      { verified: true, userScore: Math.max(80, overallScore), gap: 0, status: 'Strong' },
      { upsert: true }
    );

    // Update User readiness and verified skills list
    const user = await User.findById(req.user._id);
    if (!user.verifiedSkills.includes(verifiedSkillName)) {
      user.verifiedSkills.push(verifiedSkillName);
    }
    user.careerReadiness = Math.min(100, user.careerReadiness + 8);
    user.readinessChange = '+18% this month';
    user.recentActivity = [
      { id: `act_${Date.now()}`, title: `${verifiedSkillName} verified score: ${overallScore}%`, timeAgo: 'Just now', type: 'skill' },
      ...user.recentActivity
    ];
    await user.save();

    if (req.io) {
      req.io.emit('student.challenge.evaluated', { userId: user._id, verifiedSkillName, overallScore });
    }

    return res.status(201).json({
      success: true,
      submission,
      evaluation: {
        overallScore,
        technicalCorrectness,
        bestPractices,
        security,
        configuration,
        summary: submission.summary,
        verifiedSkillName
      },
      user
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Challenge submission failed.', error: error.message });
  }
});

export default router;
