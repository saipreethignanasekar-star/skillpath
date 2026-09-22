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
  Trash2,
  Sparkles
} from 'lucide-react';
import type { CareerRole, PredefinedCareerRole } from '../types';

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

  const careerOptions: {
    role: PredefinedCareerRole;
    icon: React.FC<{ className?: string }>;
    skills: string;
    description: string;
  }[] = [
    { role: 'Cloud Engineer', icon: Cloud, skills: 'AWS • Linux • Docker', description: 'Infrastructure & Cloud Services' },
    { role: 'DevOps Engineer', icon: Repeat, skills: 'CI/CD • Kubernetes • Terraform', description: 'Automation & CI/CD Pipelines' },
    { role: 'Full Stack Developer', icon: Layers, skills: 'React • Node.js • APIs', description: 'Web Applications & APIs' },
    { role: 'Data Analyst', icon: BarChart2, skills: 'SQL • Python • Tableau', description: 'Business Intelligence & Data' },
    { role: 'AI/ML Engineer', icon: Cpu, skills: 'Python • PyTorch • ML', description: 'Machine Learning & Models' },
    { role: 'Cybersecurity Engineer', icon: Shield, skills: 'Network • Linux • Security', description: 'Defense & Threat Mitigation' },
    { role: 'Software Developer', icon: Code, skills: 'DSA • Java • System Design', description: 'Data Structures & Core Systems' },
  ];

  const isPredefinedRole = careerOptions.some(opt => opt.role === targetRole);
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(() => !isPredefinedRole && Boolean(targetRole));
  const [customRoleInput, setCustomRoleInput] = useState<string>(() => (!isPredefinedRole && targetRole ? targetRole : ''));

  const handleSelectPredefined = (role: PredefinedCareerRole) => {
    setIsOtherSelected(false);
    setTargetRole(role);
    setStepError(null);
  };

  const handleSelectOther = () => {
    setIsOtherSelected(true);
    if (customRoleInput.trim()) {
      setTargetRole(customRoleInput.trim());
    }
    setStepError(null);
  };

  const handleCustomRoleChange = (val: string) => {
    setCustomRoleInput(val);
    if (val.trim()) {
      setTargetRole(val.trim());
      setStepError(null);
    }
  };

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

    // Validate Step 2
    if (currentStep === 2) {
      if (isOtherSelected && !customRoleInput.trim()) {
        setStepError('Please enter your desired career role to proceed.');
        return;
      }
      if (isOtherSelected && customRoleInput.trim()) {
        setTargetRole(customRoleInput.trim());
      }
      setCurrentStep(3);
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      setActiveView('dashboard');
    }
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#f8f9fa] flex flex-col">
      {/* Static Top Header */}
      <header className="shrink-0 bg-white border-b border-[#dadce0] px-4 sm:px-8 py-3.5 z-30 shadow-2xs">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
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
      </header>

      {/* Scrollable Wizard Content */}
      <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
        <div className="max-w-3xl mx-auto w-full my-auto py-2">
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
          <div className="space-y-4 sm:space-y-5">
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-normal text-[#202124] tracking-tight">
                What career are you working toward?
              </h1>
              <p className="text-xs sm:text-sm text-[#5f6368] max-w-md mx-auto">
                Select your target role or enter your desired career to generate your tailored curriculum & skill benchmarks.
              </p>
            </div>

            {stepError && (
              <div className="p-3 bg-[#fce8e6] border border-[#f5c6cb] text-[#d93025] rounded-xl text-xs font-medium text-center">
                {stepError}
              </div>
            )}

            {/* Balanced 8-Card Grid: 2 cols on mobile/tablet (4 rows), 4 cols on desktop (2 rows) */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
              {careerOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = !isOtherSelected && targetRole === opt.role;

                return (
                  <button
                    key={opt.role}
                    type="button"
                    onClick={() => handleSelectPredefined(opt.role)}
                    className={`p-3 sm:p-4 rounded-xl border text-left transition-all relative cursor-pointer flex flex-col justify-between min-h-[96px] sm:min-h-[112px] ${
                      isSelected
                        ? 'border-[#1a73e8] bg-[#e8f0fe]/60 ring-2 ring-[#1a73e8] shadow-xs'
                        : 'border-[#dadce0] bg-white hover:border-[#1a73e8]/40 hover:bg-[#f8f9fa] shadow-2xs'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full mb-1.5 sm:mb-2">
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[#1a73e8] text-white shadow-xs' : 'bg-[#f1f3f4] text-[#5f6368]'
                        }`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
                      </div>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-[#1a73e8] text-white flex items-center justify-center shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-[#dadce0]" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <span className={`text-xs sm:text-sm font-medium block leading-tight truncate ${isSelected ? 'text-[#1967d2]' : 'text-[#202124]'}`}>
                        {opt.role}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-[#5f6368] block leading-tight truncate">
                        {opt.skills}
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* 8th Card: Others */}
              <button
                type="button"
                onClick={handleSelectOther}
                className={`p-3 sm:p-4 rounded-xl border text-left transition-all relative cursor-pointer flex flex-col justify-between min-h-[96px] sm:min-h-[112px] ${
                  isOtherSelected
                    ? 'border-[#1a73e8] bg-[#e8f0fe]/60 ring-2 ring-[#1a73e8] shadow-xs'
                    : 'border-[#dadce0] bg-white hover:border-[#1a73e8]/40 hover:bg-[#f8f9fa] shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between w-full mb-1.5 sm:mb-2">
                  <div
                    className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isOtherSelected ? 'bg-[#1a73e8] text-white shadow-xs' : 'bg-[#f1f3f4] text-[#5f6368]'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
                  </div>
                  {isOtherSelected ? (
                    <div className="w-5 h-5 rounded-full bg-[#1a73e8] text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-[#dadce0]" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <span className={`text-xs sm:text-sm font-medium block leading-tight truncate ${isOtherSelected ? 'text-[#1967d2]' : 'text-[#202124]'}`}>
                    {customRoleInput.trim() ? customRoleInput.trim() : 'Others'}
                  </span>
                  <span className="text-[10px] sm:text-[11px] text-[#5f6368] block leading-tight truncate">
                    {customRoleInput.trim() ? 'Custom target career' : 'Enter desired career'}
                  </span>
                </div>
              </button>
            </div>

            {/* Custom Career Role Input Drawer when "Others" is selected */}
            {isOtherSelected && (
              <div className="p-4 sm:p-5 rounded-2xl border border-[#1a73e8] bg-white shadow-xs animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs sm:text-sm font-medium text-[#202124]">
                    Enter your desired career role <span className="text-[#d93025]">*</span>
                  </label>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#1967d2] font-medium">
                    Personalized Path
                  </span>
                </div>
                <input
                  type="text"
                  value={customRoleInput}
                  onChange={(e) => handleCustomRoleChange(e.target.value)}
                  placeholder="e.g. Mobile App Developer, Game Developer, Blockchain Engineer..."
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-[#f8f9fa] rounded-xl border border-[#dadce0] focus:bg-white focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124]"
                  autoFocus
                />
                
                {/* Popular Role Quick Suggestions */}
                <div className="mt-3">
                  <span className="text-[11px] text-[#5f6368] font-medium block mb-1.5">
                    Popular suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Mobile App Developer',
                      'Game Developer',
                      'Blockchain Engineer',
                      'UI/UX Designer',
                      'Product Manager',
                      'Cloud Security Architect'
                    ].map((roleSuggestion) => (
                      <button
                        key={roleSuggestion}
                        type="button"
                        onClick={() => handleCustomRoleChange(roleSuggestion)}
                        className={`text-[11px] px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                          customRoleInput.trim().toLowerCase() === roleSuggestion.toLowerCase()
                            ? 'bg-[#1a73e8] text-white border-[#1a73e8]'
                            : 'bg-[#f8f9fa] hover:bg-[#e8f0fe] text-[#3c4043] hover:text-[#1a73e8] border-[#dadce0]'
                        }`}
                      >
                        + {roleSuggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="text-[11px] text-[#5f6368] mt-3 flex items-center gap-1.5 pt-2.5 border-t border-[#f1f3f4]">
                  <Sparkles className="w-3.5 h-3.5 text-[#1a73e8] shrink-0" />
                  <span>Our AI will dynamically generate customized skill benchmarks and an end-to-end roadmap for this career.</span>
                </p>
              </div>
            )}
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
      </main>

      {/* Static Bottom Navigation Buttons */}
      <footer className="shrink-0 bg-white border-t border-[#dadce0] px-4 sm:px-8 py-3.5 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-5 py-2 rounded-full border border-[#dadce0] text-[#3c4043] hover:bg-[#f1f3f4] text-xs sm:text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
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
            className="px-6 py-2 rounded-full bg-[#1a73e8] hover:bg-[#1557d0] text-white text-xs sm:text-sm font-medium transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <span>{currentStep === 4 ? 'Launch Dashboard' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};
