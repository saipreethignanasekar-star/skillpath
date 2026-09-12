import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  Cloud,
  Repeat,
  Layers,
  BarChart2,
  Cpu,
  Shield,
  Code,
  ArrowRight,
  ArrowLeft,
  Upload,
  CheckCircle2
} from 'lucide-react';
import type { CareerRole } from '../types';

export const OnboardingPage: React.FC = () => {
  const { targetRole, setTargetRole, setActiveView, uploadResumeSimulated } = useApp();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [experienceLevel, setExperienceLevel] = useState<string>('Student / Fresher');

  const careerOptions: { role: CareerRole; icon: React.FC<{ className?: string }> }[] = [
    { role: 'Cloud Engineer', icon: Cloud },
    { role: 'DevOps Engineer', icon: Repeat },
    { role: 'Full Stack Developer', icon: Layers },
    { role: 'Data Analyst', icon: BarChart2 },
    { role: 'AI/ML Engineer', icon: Cpu },
    { role: 'Cybersecurity Engineer', icon: Shield },
    { role: 'Software Developer', icon: Code },
  ];

  const handleNext = async () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setActiveView('dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between py-2">
        <div
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8]">
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xl font-medium tracking-tight text-[#202124]">
            Skill<span className="text-[#1a73e8] font-bold">X</span>
          </span>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map(step => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all ${
                  step === currentStep
                    ? 'w-6 bg-[#1a73e8]'
                    : step < currentStep
                    ? 'w-2 bg-[#1a73e8]/50'
                    : 'w-2 bg-[#dadce0]'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-[#5f6368]">Step {currentStep} of 4</span>
        </div>
      </div>

      {/* Wizard Content */}
      <div className="max-w-3xl mx-auto w-full my-auto py-8">
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl font-normal text-[#202124] tracking-tight">
                What career are you working toward?
              </h1>
              <p className="text-sm text-[#5f6368]">
                Select the target role you'd like to prepare for.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {careerOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = targetRole === opt.role;
                return (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => setTargetRole(opt.role)}
                    className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between h-32 relative ${
                      isSelected
                        ? 'border-[#1a73e8] bg-[#e8f0fe]/40 ring-1 ring-[#1a73e8]'
                        : 'border-[#dadce0] bg-white hover:border-[#bdc1c6] hover:bg-[#f8f9fa]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-[#1a73e8] text-white' : 'bg-[#f1f3f4] text-[#5f6368]'
                        }`}
                      >
                        <Icon className="w-5 h-5 stroke-[1.8]" />
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 text-[#1a73e8]" />
                      )}
                    </div>
                    <div>
                      <span className={`text-sm font-medium block ${isSelected ? 'text-[#1967d2]' : 'text-[#202124]'}`}>
                        {opt.role}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-normal text-[#202124] tracking-tight">
                What is your experience level?
              </h2>
              <p className="text-sm text-[#5f6368]">
                Helps tailor the roadmap pacing and complexity.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              {[
                { title: 'Beginner / First-Year Student', desc: 'Starting from fundamental computer science principles' },
                { title: 'Student / Fresher', desc: 'Have completed basic coursework and ready for industry tools' },
                { title: 'Early Career Professional', desc: '1-2 years experience looking to upskill or transition' },
              ].map(item => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setExperienceLevel(item.title)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    experienceLevel === item.title
                      ? 'border-[#1a73e8] bg-[#e8f0fe]/40 ring-1 ring-[#1a73e8]'
                      : 'border-[#dadce0] bg-white hover:border-[#bdc1c6]'
                  }`}
                >
                  <div className="text-sm font-medium text-[#202124]">{item.title}</div>
                  <div className="text-xs text-[#5f6368] mt-0.5">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 max-w-xl mx-auto text-center">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-normal text-[#202124] tracking-tight">
                Upload your resume (Optional)
              </h2>
              <p className="text-sm text-[#5f6368]">
                Allow our skill parser to automatically extract your skills.
              </p>
            </div>

            <div
              onClick={() => uploadResumeSimulated('Rahul_Kumar_Resume.pdf')}
              className="p-8 border-2 border-dashed border-[#dadce0] hover:border-[#1a73e8] bg-white hover:bg-[#f8f9fa] rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 stroke-[1.8]" />
              </div>
              <span className="text-sm font-medium text-[#202124]">
                Click to load sample resume (Rahul_Kumar.pdf)
              </span>
              <span className="text-xs text-[#5f6368] mt-1">Supports PDF, DOC, DOCX up to 5MB</span>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6 max-w-lg mx-auto text-center">
            <div className="w-14 h-14 rounded-full bg-[#e6f4ea] text-[#137333] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 stroke-[1.8]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-normal text-[#202124] tracking-tight">
                You're ready, Rahul!
              </h2>
              <p className="text-sm text-[#5f6368]">
                We've customized your path for <strong className="text-[#202124] font-medium">{targetRole}</strong> with an initial baseline of <strong>68%</strong>.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#dadce0] text-left space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-[#5f6368]">Target role</span>
                <span className="font-medium text-[#202124]">{targetRole}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#5f6368]">Initial readiness</span>
                <span className="font-medium text-[#1a73e8]">68% (+12% this month)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#5f6368]">Estimated duration</span>
                <span className="font-medium text-[#202124]">6 weeks</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between pt-6 border-t border-[#dadce0]">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-5 py-2 rounded-full border border-[#dadce0] text-[#3c4043] hover:bg-[#f1f3f4] text-sm font-medium flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2 rounded-full bg-[#1a73e8] hover:bg-[#1557d0] text-white text-sm font-medium transition-colors shadow-xs flex items-center gap-1.5"
        >
          <span>{currentStep === 4 ? 'Launch Dashboard' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
