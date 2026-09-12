import mongoose from 'mongoose';

const challengeSchema = new mongoose.Schema(
  {
    challengeId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    role: { type: String, required: true },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    durationMinutes: { type: Number, default: 45 },
    description: { type: String, required: true },
    instructions: [{ type: String }],
    initialCode: { type: String, required: true },
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    verifiedBadge: { type: String }
  },
  { timestamps: true }
);

export const Challenge = mongoose.model('Challenge', challengeSchema);
