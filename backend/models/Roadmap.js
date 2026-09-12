import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  duration: { type: String },
  description: { type: String }
});

const phaseSchema = new mongoose.Schema({
  id: { type: String, required: true },
  number: { type: Number, required: true },
  title: { type: String, required: true },
  duration: { type: String },
  status: { type: String, enum: ['completed', 'in_progress', 'upcoming'], default: 'upcoming' },
  modules: [moduleSchema]
});

const roadmapSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetRole: { type: String, required: true },
    phases: [phaseSchema]
  },
  { timestamps: true }
);

export const Roadmap = mongoose.model('Roadmap', roadmapSchema);
