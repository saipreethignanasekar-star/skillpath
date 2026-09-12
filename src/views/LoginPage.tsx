import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, ArrowRight, Sparkles, UserCheck, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { setActiveView, login } = useApp();
  const [email, setEmail] = useState('rahul.kumar@example.com');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#dadce0] p-8 sm:p-10 shadow-xs">
        {/* Brand */}
        <div className="text-center mb-8">
          <div
            onClick={() => setActiveView('landing')}
            className="inline-flex items-center gap-2 cursor-pointer select-none mb-3"
          >
            <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8]">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-2xl font-medium tracking-tight text-[#202124]">
              Skill<span className="text-[#1a73e8] font-bold">X</span>
            </span>
          </div>

          <h2 className="text-2xl font-normal text-[#202124] tracking-tight mt-2">Sign in</h2>
          <p className="text-sm text-[#5f6368] mt-1">to continue to SkillX Career Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#3c4043] mb-1.5">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 text-sm bg-white rounded-lg border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-[#202124] transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-medium text-[#3c4043]">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset link sent to ' + email)}
                className="text-xs font-medium text-[#1a73e8] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white rounded-lg border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-[#202124] transition-all"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveView('signup')}
              className="text-sm font-medium text-[#1a73e8] hover:bg-[#f1f3f4] px-3 py-1.5 rounded-full transition-colors"
            >
              Create account
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557d0] text-white font-medium rounded-full text-sm transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Demo Login Options */}
        <div className="mt-6 p-4 rounded-xl bg-[#f8f9fa] border border-[#e8eaed]">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1a73e8] uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick Demo Login</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                login('rahul.kumar@example.com');
                setActiveView('dashboard');
              }}
              className="px-3 py-2 bg-white hover:bg-[#e8f0fe] hover:border-[#1a73e8] border border-[#dadce0] text-[#202124] rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all text-left group"
            >
              <UserCheck className="w-4 h-4 text-[#1a73e8] shrink-0" />
              <div>
                <div className="font-semibold group-hover:text-[#1a73e8]">Student Demo</div>
                <div className="text-[10px] text-[#5f6368]">Rahul Kumar</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                login('admin.mentor@skillx.ai');
                setActiveView('admin-overview');
              }}
              className="px-3 py-2 bg-white hover:bg-[#e8f0fe] hover:border-[#1a73e8] border border-[#dadce0] text-[#202124] rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all text-left group"
            >
              <ShieldCheck className="w-4 h-4 text-[#129eaf] shrink-0" />
              <div>
                <div className="font-semibold group-hover:text-[#1a73e8]">Admin / Mentor</div>
                <div className="text-[10px] text-[#5f6368]">Cohort Analytics</div>
              </div>
            </button>
          </div>
        </div>

        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e8eaed]" />
          </div>
          <span className="relative px-3 bg-white text-xs font-normal text-[#5f6368]">
            or sign in with
          </span>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => login('rahul.google@example.com')}
            className="w-full py-2 px-4 rounded-full border border-[#dadce0] bg-white hover:bg-[#f8f9fa] text-[#3c4043] text-xs font-medium flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.54 0 2.92.54 4.01 1.43l3-3C17.2 1.7 14.78 1 12 1 7.42 1 3.51 3.58 1.63 7.33l3.69 2.86C6.2 7.28 8.87 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-2 3.72-4.94 3.72-8.69z"
              />
              <path
                fill="#FBBC05"
                d="M5.32 14.81c-.24-.73-.38-1.5-.38-2.31s.14-1.58.38-2.31L1.63 7.33C.59 9.4 0 11.64 0 14s.59 4.6 1.63 6.67l3.69-2.86z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.95-1.08 7.93-2.91l-3.7-2.87c-1.08.72-2.45 1.16-4.23 1.16-3.13 0-5.8-2.28-6.68-5.19L1.63 16.05C3.51 19.8 7.42 23 12 23z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <button
            type="button"
            onClick={() => login('rahul.github@example.com')}
            className="w-full py-2 px-4 rounded-full border border-[#dadce0] bg-white hover:bg-[#f8f9fa] text-[#3c4043] text-xs font-medium flex items-center justify-center gap-2.5 transition-colors"
          >
            <svg className="w-4 h-4 fill-[#202124]" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>Continue with GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
};
