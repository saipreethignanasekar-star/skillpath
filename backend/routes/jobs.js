import express from 'express';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// GET /api/jobs
router.get('/', async (_req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return res.json({ success: true, jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch jobs.', error: error.message });
  }
});

// POST /api/jobs/:id/apply
router.post('/:id/apply', authenticateUser, async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findOne({ jobId });

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found.' });
    }

    const existingApp = await Application.findOne({ student: req.user._id, jobId });
    if (existingApp) {
      return res.status(400).json({ success: false, message: 'You have already applied for this job.' });
    }

    const application = await Application.create({
      student: req.user._id,
      job: job._id,
      jobId: job.jobId,
      status: 'Applied',
      resumeUrl: req.user.resumeUrl
    });

    if (req.io) {
      req.io.emit('application.updated', { userId: req.user._id, jobId: job.jobId, status: 'Applied' });
    }

    return res.status(201).json({ success: true, application });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Job application failed.', error: error.message });
  }
});

// GET /api/jobs/applications
router.get('/applications', authenticateUser, async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user._id }).populate('job');
    return res.json({ success: true, applications });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch applications.', error: error.message });
  }
});

export default router;
