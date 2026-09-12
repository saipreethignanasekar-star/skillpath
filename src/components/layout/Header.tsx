import React from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Menu, ChevronDown, HelpCircle } from 'lucide-react';
import type { CareerRole } from '../../types';

export const Header: React.FC = () => {
  const { user, targetRole, setTargetRole, setMobileMenuOpen, setActiveView } = useApp();

  const roles: CareerRole[] = [
    'Cloud Engineer',
    'DevOps Engineer',
    'Full Stack Developer',
    'Data Analyst',
    'AI/ML Engineer',
    'Cybersecurity Engineer',
    'Software Developer'
  ];

  return (
    <header className="h-16 bg-white border-b border-[#dadce0] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-2xl">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Google-style search bar */}
        <div className="relative w-full max-w-lg hidden sm:block">
          <Search className="w-4 h-4 text-[#5f6368] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search skills, challenges, jobs..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#f1f3f4] hover:bg-[#e8eaed] focus:bg-white rounded-full border border-transparent focus:border-[#dadce0] focus:outline-none focus:ring-1 focus:ring-[#1a73e8] transition-all text-[#202124] placeholder:text-[#5f6368]"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Target role selector chip */}
        <div className="relative flex items-center">
          <div className="relative">
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value as CareerRole)}
              className="appearance-none bg-white hover:bg-[#f8f9fa] border border-[#dadce0] text-[#3c4043] text-xs sm:text-sm font-medium pl-3 pr-7 py-1.5 rounded-full cursor-pointer focus:outline-none focus:border-[#1a73e8] transition-colors"
            >
              {roles.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#5f6368] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Help icon */}
        <button
          onClick={() => alert('SkillX Help Center & AI Mentor are available to guide your learning trajectory.')}
          className="p-2 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] transition-colors hidden sm:inline-flex"
          aria-label="Help"
        >
          <HelpCircle className="w-5 h-5 stroke-[1.8]" />
        </button>

        {/* Notifications */}
        <button 
          onClick={() => alert('Notifications:\n• Docker challenge evaluated (86%)\n• 2 new matched jobs for Cloud Engineer')}
          className="relative p-2 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 stroke-[1.8]" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-[#1a73e8] rounded-full ring-2 ring-white" />
        </button>

        {/* User profile avatar */}
        <button 
          onClick={() => setActiveView('profile')}
          className="flex items-center gap-2.5 p-1 rounded-full hover:bg-[#f1f3f4] transition-colors select-none"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover ring-1 ring-[#dadce0]"
          />
          <span className="hidden md:inline text-xs font-medium text-[#202124] pr-1">
            {user.name.split(' ')[0]}
          </span>
        </button>
      </div>
    </header>
  );
};
