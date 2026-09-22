import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Compass,
  ArrowRight,
  AlertCircle,
  Mail,
  CheckCircle2,
  RefreshCw,
  Edit2,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const { setActiveView, signup } = useApp();

  const [step, setStep] = useState<'form' | 'verify'>('form');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    currentYear: '1st Year'
  });

  // OTP Verification State
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [isSendingCode, setIsSendingCode] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successNotice, setSuccessNotice] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  const digitInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Resend Countdown Timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // Request Verification Code
  const requestVerificationCode = async (isResend = false) => {
    setIsSendingCode(true);
    setErrorMessage('');
    if (isResend) setSuccessNotice('');

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          name: formData.name.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStep('verify');
        setResendCooldown(30);
        setOtpDigits(['', '', '', '', '', '']);
        setSuccessNotice(isResend ? 'A new verification code was sent to your email!' : 'Verification code sent to your email!');

        // Focus first OTP input
        setTimeout(() => {
          digitInputsRef.current[0]?.focus();
        }, 150);
      } else {
        if (response.status === 409 || data.code === 'EMAIL_EXISTS' || (data.message && data.message.includes('already exist'))) {
          setErrorMessage('An account with this email address already exists. Please sign in instead.');
        } else {
          setErrorMessage(data.message || 'Failed to send verification code. Please check your email.');
        }
      }
    } catch (err: any) {
      console.warn('Backend API connection warning:', err);
      setErrorMessage('Unable to connect to verification server. Please ensure the backend is running.');
    } finally {
      setIsSendingCode(false);
    }
  };

  // Handle Form Submit
  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }
    setErrorMessage('');
    requestVerificationCode(false);
  };

  // Handle OTP digit changes
  const handleDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, ''); // numbers only
    if (!cleanVal) {
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    const char = cleanVal.charAt(cleanVal.length - 1);
    const updated = [...otpDigits];
    updated[index] = char;
    setOtpDigits(updated);
    if (errorMessage) setErrorMessage('');

    // Auto-advance to next input
    if (index < 5 && char) {
      digitInputsRef.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      digitInputsRef.current[index - 1]?.focus();
    }
  };

  // Handle Paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (pasteData) {
      const updated = ['', '', '', '', '', ''];
      for (let i = 0; i < pasteData.length; i++) {
        updated[i] = pasteData[i];
      }
      setOtpDigits(updated);
      const nextIndex = Math.min(pasteData.length, 5);
      digitInputsRef.current[nextIndex]?.focus();
    }
  };

  // Verify Code & Register User
  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const enteredCode = otpDigits.join('');
    if (enteredCode.length !== 6) {
      setErrorMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          code: enteredCode
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save user credentials to persistent backend database
        try {
          await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: formData.name.trim(),
              email: formData.email.trim(),
              password: formData.password,
              college: formData.college.trim(),
              currentYear: formData.currentYear
            })
          });
        } catch (saveErr) {
          console.warn('Backend local credentials save error (will fallback to localStorage):', saveErr);
        }

        // 2. Persist credentials to local device localStorage for auto-fill & offline verification
        try {
          localStorage.setItem(
            'skillx_saved_credentials',
            JSON.stringify({
              email: formData.email.trim(),
              password: formData.password,
              rememberMe: true
            })
          );

          const rawList = localStorage.getItem('skillx_registered_users');
          const usersList: any[] = rawList ? JSON.parse(rawList) : [];
          const existingIdx = usersList.findIndex(
            (u) => u.email?.toLowerCase() === formData.email.trim().toLowerCase()
          );
          const newUserData = {
            id: 'usr_' + Date.now(),
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            college: formData.college.trim(),
            currentYear: formData.currentYear
          };
          if (existingIdx >= 0) {
            usersList[existingIdx] = newUserData;
          } else {
            usersList.push(newUserData);
          }
          localStorage.setItem('skillx_registered_users', JSON.stringify(usersList));
        } catch (storageErr) {
          console.warn('localStorage credentials save error:', storageErr);
        }

        // 3. Complete sign up and transition to onboarding
        signup({
          name: formData.name.trim(),
          email: formData.email.trim(),
          college: formData.college.trim(),
          currentYear: formData.currentYear
        });
      } else {
        setErrorMessage(data.message || 'Invalid verification code. Please check your email and try again.');
      }
    } catch {
      setErrorMessage('Unable to reach verification server. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-[#dadce0] p-6 sm:p-10 shadow-xs">
        {/* Brand */}
        <div className="text-center mb-6">
          <div
            onClick={() => setActiveView('landing')}
            className="inline-flex items-center gap-2 cursor-pointer select-none mb-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8]">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-2xl font-medium tracking-tight text-[#202124]">
              Skill<span className="text-[#1a73e8] font-bold">X</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-normal text-[#202124] tracking-tight">
            {step === 'form' ? 'Create your student account' : 'Verify your email address'}
          </h2>
          <p className="text-xs sm:text-sm text-[#5f6368] mt-1">
            {step === 'form'
              ? 'Start building your verified career profile with AI roadmaps'
              : 'Enter the 6-digit verification code sent via SMTP to your email'}
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-[#fce8e6] border border-[#fad2cf] text-[#d93025] text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="leading-tight">{errorMessage}</span>
          </div>
        )}

        {/* Success Notice Banner */}
        {successNotice && step === 'verify' && (
          <div className="mb-5 p-3 rounded-xl bg-[#e6f4ea] border border-[#ceead6] text-[#137333] text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* ================= STEP 1: INITIAL REGISTRATION FORM ================= */}
        {step === 'form' && (
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#3c4043] mb-1.5">
                  Full name <span className="text-[#d93025]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Rahul Kumar"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 text-[#202124] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#3c4043] mb-1.5">
                  Email address <span className="text-[#d93025]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 text-[#202124] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#3c4043] mb-1.5">
                  Password <span className="text-[#d93025]">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="At least 6 characters"
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white rounded-lg border text-[#202124] transition-all focus:outline-none ${
                    errorMessage && (formData.password !== formData.confirmPassword || formData.password.length < 6)
                      ? 'border-[#d93025] focus:border-[#d93025] focus:ring-2 focus:ring-[#d93025]/20'
                      : 'border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#3c4043] mb-1.5">
                  Confirm password <span className="text-[#d93025]">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, confirmPassword: e.target.value });
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Re-enter password"
                  className={`w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white rounded-lg border text-[#202124] transition-all focus:outline-none ${
                    errorMessage && formData.password !== formData.confirmPassword
                      ? 'border-[#d93025] focus:border-[#d93025] focus:ring-2 focus:ring-[#d93025]/20'
                      : 'border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#3c4043] mb-1.5">
                  College / University <span className="text-[#d93025]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. National Institute of Tech"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 text-[#202124] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#3c4043] mb-1.5">
                  Current Year <span className="text-[#d93025]">*</span>
                </label>
                <select
                  value={formData.currentYear}
                  onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 text-[#202124] transition-all"
                >
                  <option value="1st Year">1st Year (Freshman)</option>
                  <option value="2nd Year">2nd Year (Sophomore)</option>
                  <option value="3rd Year">3rd Year (Junior)</option>
                  <option value="4th Year">4th Year (Senior / Final)</option>
                  <option value="Graduate">Recent Graduate</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveView('login')}
                className="text-xs sm:text-sm font-medium text-[#1a73e8] hover:bg-[#f1f3f4] px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                Sign in instead
              </button>

              <button
                type="submit"
                disabled={isSendingCode}
                className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557d0] disabled:bg-[#dadce0] text-white font-medium rounded-full text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                {isSendingCode ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <>
                    <span>Continue & Send Code</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Quick 1-click Sign up with Google or GitHub */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e8eaed]" />
              </div>
              <span className="relative px-3 bg-white text-xs font-normal text-[#5f6368]">
                or sign up instantly with
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={async () => {
                  setErrorMessage('');
                  try {
                    const res = await fetch('/api/auth/google', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        profile: {
                          id: `google_${Date.now()}`,
                          email: 'newstudent.google@gmail.com',
                          name: 'Google Student',
                          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=google_student'
                        }
                      })
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                      signup(data.user);
                    } else {
                      signup({
                        name: 'Google Student',
                        email: 'student.google@gmail.com',
                        college: 'Campus / Self Taught',
                        currentYear: '1st Year'
                      });
                    }
                  } catch {
                    signup({
                      name: 'Google Student',
                      email: 'student.google@gmail.com',
                      college: 'Campus / Self Taught',
                      currentYear: '1st Year'
                    });
                  }
                }}
                className="py-2.5 px-4 rounded-full border border-[#dadce0] bg-white hover:bg-[#f8f9fa] text-[#3c4043] text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.54 0 2.92.54 4.01 1.43l3-3C17.2 1.7 14.78 1 12 1 7.42 1 3.51 3.58 1.63 7.33l3.69 2.86C6.2 7.28 8.87 5 12 5z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-2 3.72-4.94 3.72-8.69z" />
                  <path fill="#FBBC05" d="M5.32 14.81c-.24-.73-.38-1.5-.38-2.31s.14-1.58.38-2.31L1.63 7.33C.59 9.4 0 11.64 0 14s.59 4.6 1.63 6.67l3.69-2.86z" />
                  <path fill="#34A853" d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.7-2.87c-1.08.72-2.45 1.16-4.23 1.16-3.13 0-5.8-2.28-6.68-5.19L1.63 16.05C3.51 19.8 7.42 23 12 23z" />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  setErrorMessage('');
                  try {
                    const res = await fetch('/api/auth/github', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        profile: {
                          id: `github_${Date.now()}`,
                          name: 'GitHub Developer',
                          email: 'developer.github@users.noreply.github.com',
                          avatar: 'https://avatars.githubusercontent.com/u/9919?v=4'
                        }
                      })
                    });
                    const data = await res.json();
                    if (res.ok && data.success) {
                      signup(data.user);
                    } else {
                      signup({
                        name: 'GitHub Developer',
                        email: 'dev.github@example.com',
                        college: 'Tech Institute',
                        currentYear: '1st Year'
                      });
                    }
                  } catch {
                    signup({
                      name: 'GitHub Developer',
                      email: 'dev.github@example.com',
                      college: 'Tech Institute',
                      currentYear: '1st Year'
                    });
                  }
                }}
                className="py-2.5 px-4 rounded-full border border-[#dadce0] bg-[#24292f] hover:bg-[#1b1f23] text-white text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </form>
        )}

        {/* ================= STEP 2: 6-DIGIT EMAIL VERIFICATION (OTP) ================= */}
        {step === 'verify' && (
          <form onSubmit={handleVerifySubmit} className="space-y-6">
            {/* Email info card */}
            <div className="p-4 rounded-xl border border-[#dadce0] bg-[#f8f9fa] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#5f6368]">Verification email sent to:</div>
                  <div className="text-sm font-medium text-[#202124]">{formData.email}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep('form');
                  setErrorMessage('');
                }}
                className="text-xs font-medium text-[#1a73e8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Change</span>
              </button>
            </div>

            {/* 6-Digit OTP Input Boxes */}
            <div>
              <label className="block text-xs font-medium text-center text-[#3c4043] mb-3">
                Enter 6-Digit Verification Code
              </label>

              <div className="flex justify-center items-center gap-2 sm:gap-3">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      digitInputsRef.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-bold rounded-xl border-2 border-[#dadce0] focus:border-[#1a73e8] focus:ring-4 focus:ring-[#1a73e8]/15 focus:outline-none transition-all text-[#202124] bg-white shadow-2xs"
                  />
                ))}
              </div>
            </div>

            {/* Resend Code Row */}
            <div className="flex items-center justify-between text-xs text-[#5f6368] pt-1">
              <span>Didn't receive the email?</span>
              {resendCooldown > 0 ? (
                <span className="font-medium text-[#5f6368]">
                  Resend code in <strong className="text-[#1a73e8]">{resendCooldown}s</strong>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => requestVerificationCode(true)}
                  disabled={isSendingCode}
                  className="font-medium text-[#1a73e8] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSendingCode ? 'animate-spin' : ''}`} />
                  <span>Resend verification code</span>
                </button>
              )}
            </div>

            {/* Buttons */}
            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setStep('form');
                  setErrorMessage('');
                }}
                className="px-4 py-2.5 rounded-full border border-[#dadce0] hover:bg-[#f1f3f4] text-[#3c4043] text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                type="submit"
                disabled={isVerifying || otpDigits.join('').length !== 6}
                className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557d0] disabled:bg-[#dadce0] text-white font-medium rounded-full text-xs sm:text-sm transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Create Account</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
