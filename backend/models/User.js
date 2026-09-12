import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },
    avatar: {
      type: String,
      default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&h=160&q=80'
    },
    college: { type: String, default: 'National Institute of Technology' },
    currentYear: { type: String, default: '3rd Year' },
    targetRole: { type: String, default: 'Cloud Engineer' },
    careerReadiness: { type: Number, default: 68, min: 0, max: 100 },
    readinessChange: { type: String, default: '+12% this month' },
    estimatedWeeks: { type: Number, default: 6 },
    verifiedSkills: [{ type: String }],
    recentActivity: [
      {
        id: { type: String },
        title: { type: String },
        timeAgo: { type: String },
        type: { type: String }
      }
    ],
    resumeUploaded: { type: Boolean, default: false },
    resumeFileName: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    detectedSkills: [{ type: String }],
    status: { type: String, enum: ['Active', 'On Track', 'Needs Attention'], default: 'On Track' },
    lastActive: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
