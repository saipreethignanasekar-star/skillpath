import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Compass, ArrowRight } from 'lucide-react';
import type { CareerRole } from '../types';

export const SignUpPage: React.FC = () => {
  const { setActiveView, signup } = useApp();

  const [formData, setFormData] = useState({
    name: 'Rahul Kumar',
    email: 'rahul.kumar@example.com',
    password: 'password123',
    confirmPassword: 'password123',
    college: 'National Institute of Technology',
    currentYear: '3rd Year',
    targetRole: 'Cloud Engineer' as CareerRole
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup({
      name: formData.name,
      email: formData.email,
      college: formData.college,
      currentYear: formData.currentYear,
      targetRole: formData.targetRole
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-[#dadce0] p-8 sm:p-10 shadow-xs">
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

          <h2 className="text-2xl font-normal text-[#202124] tracking-tight">Create your account</h2>
          <p className="text-sm text-[#5f6368] mt-1">Start building your verified career profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#3c4043] mb-1.5">
                Full name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Rahul Kumar"
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-lg border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-[#202124] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#3c4043] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-lg border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-[#202124] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#3c4043] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-lg border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-[#202124] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#3c4043] mb-1.5">
                Confirm password
              </label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-lg border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-[#202124] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#3c4043] mb-1.5">
                College / University
              </label>
              <input
                type="text"
                required
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                placeholder="Select or enter college"
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-lg border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-[#202124] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#3c4043] mb-1.5">
                Current Year
              </label>
              <select
                value={formData.currentYear}
                onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-lg border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-[#202124] transition-all"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Graduate">Recent Graduate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#3c4043] mb-1.5">
              Target Career Goal
            </label>
            <select
              value={formData.targetRole}
              onChange={(e) => setFormData({ ...formData, targetRole: e.target.value as CareerRole })}
              className="w-full px-3.5 py-2.5 text-sm bg-white rounded-lg border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-[#202124] transition-all"
            >
              <option value="Cloud Engineer">Cloud Engineer</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="AI/ML Engineer">AI/ML Engineer</option>
              <option value="Cybersecurity Engineer">Cybersecurity Engineer</option>
              <option value="Software Developer">Software Developer</option>
            </select>
          </div>

          <div className="pt-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setActiveView('login')}
              className="text-sm font-medium text-[#1a73e8] hover:bg-[#f1f3f4] px-3 py-1.5 rounded-full transition-colors"
            >
              Sign in instead
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#1a73e8] hover:bg-[#1557d0] text-white font-medium rounded-full text-sm transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>Create account</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
