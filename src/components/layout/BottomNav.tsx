import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Compass,
  Award,
  Bot,
  User,
  MoreHorizontal,
  FileText,
  Target,
  Briefcase,
  HelpCircle,
  LogOut,
  X,
  ChevronRight
} from 'lucide-react';
import type { ActiveView } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeView, setActiveView, user, logout } = useApp();
  const [moreSheetOpen, setMoreSheetOpen] = useState<boolean>(false);

  const primaryTabs: { id: ActiveView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Roadmap', icon: Compass },
    { id: 'challenges', label: 'Challenges', icon: Award },
    { id: 'ai-mentor', label: 'AI Mentor', icon: Bot },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const moreItems: { id: ActiveView; label: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'resume-analysis', label: 'Resume Analysis', desc: 'Scan and extract skills from your CV', icon: FileText },
    { id: 'skill-gap', label: 'Skill Gap Analysis', desc: 'Compare your skills against role requirements', icon: Target },
    { id: 'jobs', label: 'Job Matching', desc: 'Explore career opportunities matched to your readiness', icon: Briefcase },
  ];

  const handleTabClick = (id: ActiveView) => {
    setActiveView(id);
    setMoreSheetOpen(false);
  };

  const isMoreActive = ['resume-analysis', 'skill-gap', 'jobs'].includes(activeView);

  return (
    <>
      {/* Slide-up Bottom Sheet for Extra Sidebar Items */}
      {moreSheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setMoreSheetOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
          />

          {/* Sheet Container */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl border-t border-[#dadce0] max-h-[85vh] overflow-y-auto flex flex-col animate-in slide-in-from-bottom duration-250 z-10 pb-6">
            {/* Sheet Handle & Header */}
            <div className="p-4 border-b border-[#dadce0] flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center font-medium text-xs ring-1 ring-[#dadce0]">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="text-sm font-medium text-[#202124] leading-tight">{user.name || 'Student'}</div>
                  <div className="text-[11px] text-[#5f6368]">{user.targetRole}</div>
                </div>
              </div>

              <button
                onClick={() => setMoreSheetOpen(false)}
                className="p-1.5 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Links List */}
            <div className="p-3 space-y-1">
              <div className="px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#5f6368]">
                Additional Features
              </div>

              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full p-3 rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#e8f0fe] text-[#1967d2] font-medium'
                        : 'hover:bg-[#f8f9fa] text-[#202124]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? 'bg-[#1a73e8] text-white' : 'bg-[#f1f3f4] text-[#5f6368]'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-medium">{item.label}</div>
                        <div className="text-[11px] text-[#5f6368] leading-tight">{item.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#5f6368] shrink-0" />
                  </button>
                );
              })}

              <div className="pt-3 border-t border-[#dadce0] mt-3 space-y-1">
                <button
                  onClick={() => {
                    setMoreSheetOpen(false);
                    alert('SkillX Help: 24/7 AI mentor assistance and live guidance are active.');
                  }}
                  className="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-xs text-[#5f6368] hover:bg-[#f8f9fa] hover:text-[#202124] transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>Help & Support</span>
                </button>

                <button
                  onClick={() => {
                    setMoreSheetOpen(false);
                    logout();
                  }}
                  className="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 text-xs text-[#d93025] hover:bg-[#fce8e6] transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Bottom Navigation Bar */}
      <nav
        aria-label="Mobile navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#dadce0] shadow-[0_-2px_10px_rgba(0,0,0,0.06)] lg:hidden transition-transform duration-200"
      >
        <div className="flex items-center justify-around h-16 px-1 max-w-md mx-auto">
          {primaryTabs.slice(0, 4).map((tab) => {
            const Icon = tab.icon;
            const isActive =
              activeView === tab.id ||
              (tab.id === 'challenges' && (activeView === 'challenge-detail' || activeView === 'ai-evaluation'));

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className="flex-1 flex flex-col items-center justify-center py-1 group select-none cursor-pointer relative"
              >
                <div
                  className={`px-4 py-1 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-[#e8f0fe] text-[#1a73e8]'
                      : 'text-[#5f6368] group-hover:text-[#202124] group-active:scale-95'
                  }`}
                >
                  <Icon className={`w-5 h-5 stroke-[1.8] ${isActive ? 'stroke-[2.2]' : ''}`} />
                </div>
                <span
                  className={`text-[10px] mt-0.5 tracking-tight transition-colors ${
                    isActive ? 'font-semibold text-[#1967d2]' : 'font-normal text-[#5f6368]'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}

          {/* More / Menu Tab Button */}
          <button
            onClick={() => setMoreSheetOpen(true)}
            className="flex-1 flex flex-col items-center justify-center py-1 group select-none cursor-pointer relative"
          >
            <div
              className={`px-4 py-1 rounded-full flex items-center justify-center transition-all ${
                isMoreActive || moreSheetOpen
                  ? 'bg-[#e8f0fe] text-[#1a73e8]'
                  : 'text-[#5f6368] group-hover:text-[#202124] group-active:scale-95'
              }`}
            >
              <MoreHorizontal className={`w-5 h-5 stroke-[1.8] ${isMoreActive ? 'stroke-[2.2]' : ''}`} />
            </div>
            <span
              className={`text-[10px] mt-0.5 tracking-tight transition-colors ${
                isMoreActive || moreSheetOpen ? 'font-semibold text-[#1967d2]' : 'font-normal text-[#5f6368]'
              }`}
            >
              More
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
