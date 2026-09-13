import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  User,
  Target,
  Compass,
  Award,
  FolderGit2,
  Briefcase,
  Bot,
  HelpCircle,
  LogOut,
  X,
  FileText
} from 'lucide-react';
import type { ActiveView } from '../../types';

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, mobileMenuOpen, setMobileMenuOpen, logout } = useApp();

  const navItems: { id: ActiveView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'resume-analysis', label: 'Resume Analysis', icon: FileText },
    { id: 'skill-gap', label: 'Skill Gap Analysis', icon: Target },
    { id: 'roadmap', label: 'Career Roadmap', icon: Compass },
    { id: 'challenges', label: 'Practical Challenges', icon: Award },
    { id: 'jobs', label: 'Job Matching', icon: Briefcase },
    { id: 'ai-mentor', label: 'AI Mentor', icon: Bot },
  ];

  const handleNavClick = (id: ActiveView) => {
    setActiveView(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-[#202124]/30 backdrop-blur-[1px] z-40 lg:hidden"
        />
      )}

      {/* Google-style Clean Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white text-[#3c4043] flex flex-col transition-transform duration-200 ease-in-out border-r border-[#dadce0]
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#dadce0]">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8]">
              <Compass className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="text-xl font-medium tracking-tight text-[#202124]">
              Skill<span className="text-[#1a73e8] font-bold">X</span>
            </span>
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items - Google rounded pill style */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive =
              activeView === item.id ||
              (item.id === 'challenges' && (activeView === 'challenge-detail' || activeView === 'ai-evaluation'));

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-sm transition-colors text-left ${
                  isActive
                    ? 'bg-[#e8f0fe] text-[#1967d2] font-medium'
                    : 'text-[#3c4043] hover:bg-[#f1f3f4] font-normal hover:text-[#202124]'
                }`}
              >
                <Icon className={`w-4 h-4 stroke-[1.8] ${isActive ? 'text-[#1a73e8]' : 'text-[#5f6368]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Help & Logout */}
        <div className="p-3 border-t border-[#dadce0] space-y-1">
          <button
            onClick={() => alert('SkillX Help: AI mentor assistance and live guidance are active.')}
            className="w-full flex items-center gap-3.5 px-4 py-2 rounded-full text-sm text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] transition-colors"
          >
            <HelpCircle className="w-4 h-4 stroke-[1.8]" />
            <span>Help & Support</span>
          </button>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3.5 px-4 py-2 rounded-full text-sm text-[#d93025] hover:bg-[#fce8e6] transition-colors"
          >
            <LogOut className="w-4 h-4 stroke-[1.8]" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
