import React, { useState, useRef } from 'react';
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
  CheckCircle2,
  GraduationCap,
  Camera,
  Trash2
} from 'lucide-react';
import type { CareerRole } from '../types';

export const OnboardingPage: React.FC = () => {
  const { user, targetRole, setTargetRole, setActiveView, uploadResumeFile, updateUserProfile } = useApp();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [studentForm, setStudentForm] = useState({
    name: user.name || '',
    college: user.college || '',
    department: user.department || '',
    currentYear: user.currentYear || '',
    rollNumber: user.rollNumber || '',
    cgpa: user.cgpa || '',
    graduationYear: user.graduationYear || '',
    bio: user.bio || '',
    avatar: user.avatar || ''
  });

  const [stepError, setStepError] = useState<string | null>(null);

  const careerOptions: { role: CareerRole; icon: React.FC<{ className?: string }> }[] = [
    { role: 'Cloud Engineer', icon: Cloud },
    { role: 'DevOps Engineer', icon: Repeat },
    { role: 'Full Stack Developer', icon: Layers },
    { role: 'Data Analyst', icon: BarChart2 },
    { role: 'AI/ML Engineer', icon: Cpu },
    { role: 'Cybersecurity Engineer', icon: Shield },
    { role: 'Software Developer', icon: Code },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setStudentForm(prev => ({ ...prev, avatar: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setStudentForm(prev => ({ ...prev, avatar: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNext = async () => {
    setStepError(null);

    // Validate Step 1
    if (currentStep === 1) {
      if (!studentForm.name.trim()) {
        setStepError('Please enter your full name to create your profile.');
        return;
      }
      if (!studentForm.college.trim()) {
        setStepError('Please enter your college / university name.');
        return;
      }
      if (!studentForm.department.trim()) {
        setStepError('Please enter or select your department / branch.');
        return;
      }
      if (!studentForm.currentYear.trim()) {
        setStepError('Please select your current academic year.');
        return;
      }

      updateUserProfile({
        name: studentForm.name.trim(),
        college: studentForm.college.trim(),
        department: studentForm.department.trim(),
        currentYear: studentForm.currentYear.trim(),
        rollNumber: studentForm.rollNumber.trim(),
        cgpa: studentForm.cgpa.trim(),
        graduationYear: studentForm.graduationYear.trim(),
        bio: studentForm.bio.trim(),
        avatar: studentForm.avatar
      });

      setCurrentStep(2);
      return;
    }

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
      <div className="max-w-3xl mx-auto w-full my-auto py-6">
        {/* STEP 1: Student Academic & Profile Details */}
        {currentStep === 1 && (
          <div className="space-y-6 max-w-2xl mx-auto">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center mx-auto mb-2">
                <GraduationCap className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-normal text-[#202124] tracking-tight">
                Create your student profile
              </h1>
              <p className="text-xs sm:text-sm text-[#5f6368]">
                Provide your academic and background details to personalize your career journey.
              </p>
            </div>

            {stepError && (
              <div className="p-3 bg-[#fce8e6] border border-[#f5c6cb] text-[#d93025] rounded-xl text-xs font-medium text-center">
                {stepError}
              </div>
            )}

            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#dadce0] shadow-xs space-y-5">
              {/* Photo Upload Section */}
              <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#dadce0]">
                <label className="block text-xs font-medium text-[#202124] mb-2">
                  Profile Photo (Optional)
                </label>
                <div className="flex items-center gap-4">
                  {studentForm.avatar ? (
                    <img
                      src={studentForm.avatar}
                      alt="Preview"
                      className="w-14 h-14 rounded-full object-cover ring-2 ring-[#dadce0] shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1a73e8] to-[#1557d0] text-white flex items-center justify-center text-lg font-medium ring-2 ring-[#dadce0] shrink-0">
                      {studentForm.name ? studentForm.name.trim().charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}

                  <div className="flex-1 space-y-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                      id="onboarding-photo-upload"
                    />
                    <div className="flex flex-wrap gap-2">
                      <label
                        htmlFor="onboarding-photo-upload"
                        className="px-3 py-1.5 rounded-lg bg-white border border-[#dadce0] hover:bg-[#f1f3f4] text-[#3c4043] text-xs font-medium cursor-pointer flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#1a73e8]" />
                        <span>Upload photo</span>
                      </label>
                      {studentForm.avatar && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3 py-1.5 rounded-lg bg-white border border-[#dadce0] hover:bg-[#fce8e6] hover:text-[#d93025] hover:border-[#f5c6cb] text-[#5f6368] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-[#5f6368]">
                      Upload from your device, or first letter initial will be used automatically.
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#202124] mb-1.5">
                    Full Name <span className="text-[#d93025]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentForm.name}
                    onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124]"
                  />
                </div>

                {/* College / University */}
                <div>
                  <label className="block text-xs font-medium text-[#202124] mb-1.5">
                    College / University <span className="text-[#d93025]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentForm.college}
                    onChange={(e) => setStudentForm({ ...studentForm, college: e.target.value })}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124]"
                  />
                </div>

                {/* Department / Branch */}
                <div>
                  <label className="block text-xs font-medium text-[#202124] mb-1.5">
                    Department / Branch <span className="text-[#d93025]">*</span>
                  </label>
                  <input
                    type="text"
                    list="onboarding-departments"
                    required
                    value={studentForm.department}
                    onChange={(e) => setStudentForm({ ...studentForm, department: e.target.value })}
                    placeholder="e.g. Computer Science and Engineering"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124]"
                  />
                  <datalist id="onboarding-departments">
                    <option value="Computer Science and Engineering" />
                    <option value="Information Technology" />
                    <option value="Artificial Intelligence & Data Science" />
                    <option value="Electronics & Communication Engineering" />
                    <option value="Electrical & Electronics Engineering" />
                    <option value="Mechanical Engineering" />
                    <option value="Civil Engineering" />
                    <option value="Cybersecurity & Forensics" />
                  </datalist>
                </div>

                {/* Current Academic Year */}
                <div>
                  <label className="block text-xs font-medium text-[#202124] mb-1.5">
                    Current Academic Year <span className="text-[#d93025]">*</span>
                  </label>
                  <select
                    value={studentForm.currentYear}
                    onChange={(e) => setStudentForm({ ...studentForm, currentYear: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124]"
                  >
                    <option value="">Select current year</option>
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year (Final Year)">4th Year (Final Year)</option>
                    <option value="Postgraduate / Masters">Postgraduate / Masters</option>
                    <option value="Recent Graduate">Recent Graduate</option>
                  </select>
                </div>

                {/* Roll Number / Student ID */}
                <div>
                  <label className="block text-xs font-medium text-[#202124] mb-1.5">
                    Roll Number / Student ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={studentForm.rollNumber}
                    onChange={(e) => setStudentForm({ ...studentForm, rollNumber: e.target.value })}
                    placeholder="e.g. 21CS049"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124]"
                  />
                </div>

                {/* CGPA / Percentage */}
                <div>
                  <label className="block text-xs font-medium text-[#202124] mb-1.5">
                    CGPA / Academic Score (Optional)
                  </label>
                  <input
                    type="text"
                    value={studentForm.cgpa}
                    onChange={(e) => setStudentForm({ ...studentForm, cgpa: e.target.value })}
                    placeholder="e.g. 8.75 / 10 or 85%"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124]"
                  />
                </div>

                {/* Expected Graduation Year */}
                <div>
                  <label className="block text-xs font-medium text-[#202124] mb-1.5">
                    Expected Graduation Year
                  </label>
                  <select
                    value={studentForm.graduationYear}
                    onChange={(e) => setStudentForm({ ...studentForm, graduationYear: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124]"
                  >
                    <option value="">Select graduation year</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                  </select>
                </div>

                {/* Bio / Career Objective */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#202124] mb-1.5">
                    Short Bio / Career Objective (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={studentForm.bio}
                    onChange={(e) => setStudentForm({ ...studentForm, bio: e.target.value })}
                    placeholder="Briefly describe your career aspirations or student background..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124] resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Target Career Role Selection */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl sm:text-4xl font-normal text-[#202124] tracking-tight">
                What career are you working toward?
              </h1>
              <p className="text-sm text-[#5f6368]">
                Select your target role to generate your tailored curriculum & skill benchmarks.
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
                    className={`p-5 rounded-xl border text-left transition-all flex flex-col justify-between h-32 relative cursor-pointer ${
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

        {/* STEP 3: Resume Upload (Optional) */}
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

            <div>
              <input
                type="file"
                id="onboarding-resume-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    uploadResumeFile(file);
                  }
                }}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
              />

              <label
                htmlFor="onboarding-resume-upload"
                className="p-8 border-2 border-dashed border-[#dadce0] hover:border-[#1a73e8] bg-white hover:bg-[#f8f9fa] rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center group block"
              >
                <div className="w-12 h-12 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform mx-auto">
                  <Upload className="w-6 h-6 stroke-[1.8]" />
                </div>
                <span className="text-sm font-medium text-[#202124] block">
                  {user.resumeUploaded && user.resumeFileName
                    ? `Uploaded: ${user.resumeFileName}`
                    : 'Click to browse and upload resume from device'}
                </span>
                <span className="text-xs text-[#5f6368] mt-1 block">Supports PDF, DOC, DOCX, TXT up to 5MB</span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 4: Ready Confirmation & Profile Summary */}
        {currentStep === 4 && (
          <div className="space-y-6 max-w-lg mx-auto text-center">
            <div className="w-14 h-14 rounded-full bg-[#e6f4ea] text-[#137333] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 stroke-[1.8]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-normal text-[#202124] tracking-tight">
                Your profile is ready{studentForm.name ? `, ${studentForm.name.split(' ')[0]}` : ''}!
              </h2>
              <p className="text-sm text-[#5f6368]">
                We've customized your path for <strong className="text-[#202124] font-medium">{targetRole}</strong> with an initial baseline of <strong>{user.careerReadiness}%</strong>.
              </p>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#dadce0] text-left space-y-3 shadow-xs">
              <div className="flex items-center gap-3 pb-3 border-b border-[#f1f3f4]">
                {studentForm.avatar ? (
                  <img src={studentForm.avatar} alt="Profile" className="w-10 h-10 rounded-full object-cover ring-1 ring-[#dadce0]" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center font-semibold text-sm">
                    {studentForm.name ? studentForm.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-[#202124]">{studentForm.name || 'Student Name'}</div>
                  <div className="text-xs text-[#5f6368]">
                    {studentForm.department ? `${studentForm.department} • ` : ''}{studentForm.college || 'University'}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Target role</span>
                  <span className="font-medium text-[#202124]">{targetRole}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Current status</span>
                  <span className="font-medium text-[#202124]">{studentForm.currentYear || 'Student'}</span>
                </div>
                {studentForm.rollNumber && (
                  <div className="flex justify-between">
                    <span className="text-[#5f6368]">Student ID</span>
                    <span className="font-medium text-[#202124]">{studentForm.rollNumber}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Initial readiness</span>
                  <span className="font-medium text-[#1a73e8]">{user.careerReadiness}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5f6368]">Estimated duration</span>
                  <span className="font-medium text-[#202124]">{user.estimatedWeeks || 4} weeks</span>
                </div>
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
            className="px-5 py-2 rounded-full border border-[#dadce0] text-[#3c4043] hover:bg-[#f1f3f4] text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
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
          className="px-6 py-2 rounded-full bg-[#1a73e8] hover:bg-[#1557d0] text-white text-sm font-medium transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
        >
          <span>{currentStep === 4 ? 'Launch Dashboard' : 'Next'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
