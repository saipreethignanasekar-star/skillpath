import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalFilename: { type: String, required: true },
    storedFilename: { type: String, required: true },
    filePath: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    extractedText: { type: String, default: '' },
    detectedSkills: [{ type: String }],
    analysis: {
      resumeScore: { type: Number, default: 78 },
      detectedSkills: [{ type: String }],
      missingSkills: [{ type: String }],
      strengths: [{ type: String }],
      weaknesses: [{ type: String }],
      suggestions: [{ type: String }]
    }
  },
  { timestamps: true }
);

export const Resume = mongoose.model('Resume', resumeSchema);
