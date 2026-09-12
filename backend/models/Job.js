import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    isRemote: { type: Boolean, default: false },
    experience: { type: String, required: true },
    requiredSkills: [{ type: String }],
    salary: { type: String },
    postedAgo: { type: String, default: 'Just now' },
    description: { type: String }
  },
  { timestamps: true }
);

export const Job = mongoose.model('Job', jobSchema);
