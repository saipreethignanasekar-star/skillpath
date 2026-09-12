import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

import { connectDB } from './config/database.js';
import { initSocketServer } from './socket/index.js';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import skillRoutes from './routes/skills.js';
import resumeRoutes from './routes/resumes.js';
import roadmapRoutes from './routes/roadmap.js';
import challengeRoutes from './routes/challenges.js';
import jobRoutes from './routes/jobs.js';
import chatRoutes from './routes/chat.js';
import adminRoutes from './routes/admin.js';
import notificationRoutes from './routes/notifications.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Initialize Database
connectDB();

// Initialize Socket.IO Server
const io = initSocketServer(server, CLIENT_URL);

// Middleware
app.use(cors({
  origin: CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach socket.io to request object
app.use((req, _res, next) => {
  req.io = io;
  next();
});

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'SkillPath Real-Time Backend API is running.', timestamp: new Date() });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Global Error Handler
app.use((err, _req, res, _next) => {
  console.error('[Server Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

server.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`🚀 SkillPath Backend running on http://localhost:${PORT}`);
  console.log(`⚡ Real-Time Socket.IO listening for client events`);
  console.log(`=================================================`);
});
