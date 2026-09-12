import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  Loader2,
  ArrowRight,
  RefreshCw,
  Plus
} from 'lucide-react';

export const ResumeAnalysisPage: React.FC = () => {
  const {
    user,
    uploadResumeSimulated,
    isAnalyzingResume,
    resumeScanStep,
    setActiveView
  } = useApp();

  const [selectedPreset, setSelectedPreset] = useState<string>('Rahul_Kumar_Resume_2026.pdf');
  const [customSkillInput, setCustomSkillInput] = useState<string>('');

  const handleSimulatedUpload = (name: string) => {
    setSelectedPreset(name);
    uploadResumeSimulated(name);
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-normal text-[#202124] tracking-tight">
          Analyze Your Resume
        </h1>
        <p className="text-xs sm:text-sm text-[#5f6368] mt-0.5">
          Upload your resume and let SkillX identify your skills and experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Upload Box */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-xl border border-[#dadce0] shadow-xs flex flex-col items-center text-center">
          <div
            onClick={() => handleSimulatedUpload('Rahul_Kumar_CloudResume.pdf')}
            className="w-full p-8 rounded-xl border-2 border-dashed border-[#dadce0] hover:border-[#1a73e8] bg-white hover:bg-[#f8f9fa] transition-all cursor-pointer flex flex-col items-center justify-center group"
          >
            <div className="w-14 h-14 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <UploadCloud className="w-7 h-7 stroke-[1.8]" />
            </div>

            <h3 className="text-base font-medium text-[#202124] mb-1">
              Drag and drop your resume here
            </h3>
            <p className="text-xs text-[#5f6368] mb-4">or</p>

            <button
              type="button"
              className="px-5 py-2 bg-[#1a73e8] hover:bg-[#1557d0] text-white text-xs font-medium rounded-full transition-all shadow-xs"
            >
              Browse files
            </button>

            <div className="text-[11px] text-[#5f6368] mt-4">
              Supported formats: PDF, DOC, DOCX (Max 5MB)
            </div>
          </div>

          {/* Quick preset resume buttons */}
          <div className="w-full mt-6 pt-6 border-t border-[#f1f3f4] text-left">
            <span className="text-xs font-medium text-[#5f6368] uppercase tracking-wider block mb-2">
              Sample resumes:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                'Rahul_Kumar_Resume_2026.pdf',
                'Priya_Sharma_DevOps_CV.pdf',
                'Amit_Patel_FullStack.docx'
              ].map(file => (
                <button
                  key={file}
                  onClick={() => handleSimulatedUpload(file)}
                  className="px-3 py-1.5 rounded-full border border-[#dadce0] hover:border-[#bdc1c6] hover:bg-[#f8f9fa] text-xs font-normal text-[#3c4043] flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-[#1a73e8]" />
                  <span>{file}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: AI Analysis Status */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-xl border border-[#dadce0] shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
              <FileText className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#202124]">
                {isAnalyzingResume ? 'Analyzing resume...' : 'Resume Analysis Status'}
              </h3>
              <p className="text-xs text-[#5f6368]">
                {user.resumeUploaded ? `Active: ${user.resumeFileName || selectedPreset}` : 'Awaiting document upload'}
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="space-y-3">
            {[
              { step: 1, label: 'Reading resume structure and text' },
              { step: 2, label: 'Identifying technical proficiencies and tooling' },
              { step: 3, label: 'Extracting projects and practical experience' },
              { step: 4, label: 'Mapping career requirements to target role' },
            ].map(item => {
              const isCompleted = !isAnalyzingResume ? true : resumeScanStep > item.step;
              const isCurrent = isAnalyzingResume && resumeScanStep === item.step;

              return (
                <div
                  key={item.step}
                  className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all ${
                    isCurrent
                      ? 'border-[#1a73e8] bg-[#e8f0fe]/40'
                      : isCompleted
                      ? 'border-[#ceead6] bg-[#e6f4ea]/40 text-[#202124]'
                      : 'border-[#f1f3f4] bg-[#f8f9fa] text-[#80868b]'
                  }`}
                >
                  <div className="shrink-0">
                    {isCurrent ? (
                      <Loader2 className="w-4 h-4 text-[#1a73e8] animate-spin" />
                    ) : isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-[#1e8e3e]" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[#dadce0] flex items-center justify-center text-[10px] font-medium text-[#5f6368]">
                        {item.step}
                      </div>
                    )}
                  </div>
                  <span className="text-xs font-normal">{item.label}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-[#f1f3f4] flex items-center justify-between">
            <span className="text-xs text-[#5f6368]">
              Confidence: <strong className="text-[#137333] font-medium">96.4% Accuracy</strong>
            </span>
            <button
              onClick={() => handleSimulatedUpload(selectedPreset)}
              className="text-xs font-medium text-[#1a73e8] hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-analyze</span>
            </button>
          </div>
        </div>
      </div>

      {/* Detected Skills Pills */}
      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#dadce0] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-base font-medium text-[#202124]">Detected Skills</h3>
            <p className="text-xs text-[#5f6368]">
              Extracted automatically by the SkillX NLP model from your uploaded resume.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('skill-gap')}
              className="px-5 py-2 bg-[#1a73e8] hover:bg-[#1557d0] text-white rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Compare with target role</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {user.detectedSkills.map((skill: string) => (
            <span
              key={skill}
              className="px-3.5 py-1.5 rounded-full text-xs font-normal bg-[#f1f3f4] text-[#3c4043] hover:bg-[#e8eaed] transition-colors cursor-default border border-[#e8eaed]"
            >
              {skill}
            </span>
          ))}

          {/* Add custom skill inline */}
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-dashed border-[#dadce0] bg-white text-xs">
            <input
              type="text"
              placeholder="Add skill..."
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customSkillInput.trim()) {
                  user.detectedSkills.push(customSkillInput.trim());
                  setCustomSkillInput('');
                }
              }}
              className="text-xs bg-transparent border-none focus:outline-none w-20 text-[#202124]"
            />
            <button
              onClick={() => {
                if (customSkillInput.trim()) {
                  user.detectedSkills.push(customSkillInput.trim());
                  setCustomSkillInput('');
                }
              }}
              className="p-0.5 text-[#5f6368] hover:text-[#1a73e8]"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
