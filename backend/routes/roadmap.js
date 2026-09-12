import express from 'express';
import { Roadmap } from '../models/Roadmap.js';
import { User } from '../models/User.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// GET /api/roadmap
router.get('/', authenticateUser, async (req, res) => {
  try {
    let roadmap = await Roadmap.findOne({ user: req.user._id });
    return res.json({ success: true, roadmap });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch roadmap.', error: error.message });
  }
});

// POST /api/roadmap/modules/complete
router.post('/modules/complete', authenticateUser, async (req, res) => {
  try {
    const { phaseId, moduleId } = req.body;
    let roadmap = await Roadmap.findOne({ user: req.user._id });

    if (!roadmap) {
      return res.status(404).json({ success: false, message: 'Roadmap not found.' });
    }

    let moduleFound = false;
    roadmap.phases = roadmap.phases.map(phase => {
      if (phase.id !== phaseId) return phase;

      const updatedModules = phase.modules.map(mod => {
        if (mod.id === moduleId) {
          moduleFound = true;
          return { ...mod, completed: true };
        }
        return mod;
      });

      const allCompleted = updatedModules.every(m => m.completed);
      return {
        ...phase,
        status: allCompleted ? 'completed' : 'in_progress',
        modules: updatedModules
      };
    });

    await roadmap.save();

    // Update readiness score in User model
    const user = await User.findById(req.user._id);
    user.careerReadiness = Math.min(100, user.careerReadiness + 3);
    user.recentActivity = [
      { id: `act_${Date.now()}`, title: 'Roadmap module completed', timeAgo: 'Just now', type: 'roadmap' },
      ...user.recentActivity
    ];
    await user.save();

    if (req.io) {
      req.io.emit('student.roadmap.updated', { userId: user._id, careerReadiness: user.careerReadiness });
    }

    return res.json({ success: true, roadmap, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to complete module.', error: error.message });
  }
});

export default router;
