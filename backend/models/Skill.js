import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skillId: { type: String, required: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['Foundation', 'Cloud', 'DevOps', 'Tooling', 'Languages'],
      default: 'Foundation'
    },
    userScore: { type: Number, required: true, default: 50 },
    requiredScore: { type: Number, required: true, default: 75 },
    gap: { type: Number, required: true, default: -25 },
    status: {
      type: String,
      enum: ['Strong', 'Needs Practice', 'Critical'],
      default: 'Needs Practice'
    },
    verified: { type: Boolean, default: false },
    fromResume: { type: Boolean, default: false },
    fromRoadmap: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Skill = mongoose.model('Skill', skillSchema);
