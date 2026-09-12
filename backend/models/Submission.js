import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    challengeId: { type: String, required: true },
    code: { type: String, required: true },
    overallScore: { type: Number, required: true, default: 85 },
    technicalCorrectness: { type: Number, default: 90 },
    bestPractices: { type: Number, default: 85 },
    security: { type: Number, default: 80 },
    configuration: { type: Number, default: 85 },
    summary: { type: String },
    verifiedSkillName: { type: String },
    status: { type: String, enum: ['Evaluating', 'Completed', 'Failed'], default: 'Completed' },
    evaluatedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Submission = mongoose.model('Submission', submissionSchema);
