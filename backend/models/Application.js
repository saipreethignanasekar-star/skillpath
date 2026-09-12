import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    jobId: { type: String, required: true },
    status: {
      type: String,
      enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview', 'Rejected', 'Selected'],
      default: 'Applied'
    },
    appliedAt: { type: Date, default: Date.now },
    resumeUrl: { type: String },
    notes: { type: String }
  },
  { timestamps: true }
);

export const Application = mongoose.model('Application', applicationSchema);
