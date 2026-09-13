import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LandingPage } from './views/LandingPage';
import { LoginPage } from './views/LoginPage';
import { SignUpPage } from './views/SignUpPage';
import { OnboardingPage } from './views/OnboardingPage';
import { StudentDashboard } from './views/StudentDashboard';
import { ResumeAnalysisPage } from './views/ResumeAnalysisPage';
import { SkillGapAnalysisPage } from './views/SkillGapAnalysisPage';
import { RoadmapPage } from './views/RoadmapPage';
import { ChallengesListPage } from './views/ChallengesListPage';
import { ProveYourSkillPage } from './views/ProveYourSkillPage';
import { AIEvaluationPage } from './views/AIEvaluationPage';
import { AIMentorPage } from './views/AIMentorPage';
import { JobMatchingPage } from './views/JobMatchingPage';
import { ProfilePage } from './views/ProfilePage';
import { Layers } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeView, setActiveView } = useApp();

  // Standalone full-screen pages
  if (activeView === 'landing') return <LandingPage />;
  if (activeView === 'login') return <LoginPage />;
  if (activeView === 'signup') return <SignUpPage />;
  if (activeView === 'onboarding') return <OnboardingPage />;

  // Authenticated Dashboard Layout with Sidebar & Header
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      {/* Google-style light sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeView === 'dashboard' && <StudentDashboard />}
          {activeView === 'resume-analysis' && <ResumeAnalysisPage />}
          {activeView === 'skill-gap' && <SkillGapAnalysisPage />}
          {activeView === 'roadmap' && <RoadmapPage />}
          {activeView === 'challenges' && <ChallengesListPage />}
          {activeView === 'challenge-detail' && <ProveYourSkillPage />}
          {activeView === 'ai-evaluation' && <AIEvaluationPage />}
          {activeView === 'ai-mentor' && <AIMentorPage />}
          {activeView === 'jobs' && <JobMatchingPage />}
          {activeView === 'profile' && <ProfilePage />}
        </main>
      </div>

      {/* Google-styled quick screen preview switcher */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="group relative">
          <button className="px-3.5 py-2 rounded-full bg-white text-[#3c4043] text-xs font-medium shadow-md border border-[#dadce0] flex items-center gap-2 hover:bg-[#f8f9fa] hover:text-[#202124] transition-all">
            <Layers className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>Screen Switcher ({activeView})</span>
          </button>
          
          <div className="hidden group-hover:block absolute bottom-full right-0 mb-2 p-2 bg-white text-[#3c4043] rounded-2xl shadow-xl w-60 text-xs space-y-0.5 border border-[#dadce0]">
            <div className="px-3 py-1.5 text-[11px] font-medium uppercase text-[#5f6368] border-b border-[#f1f3f4]">
              Jump to Mockup Screen
            </div>
            <button onClick={() => setActiveView('landing')} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f1f3f4] text-[#3c4043] hover:text-[#202124] transition-colors">
              1. Landing Page
            </button>
            <button onClick={() => setActiveView('login')} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f1f3f4] text-[#3c4043] hover:text-[#202124] transition-colors">
              2. Login Page
            </button>
            <button onClick={() => setActiveView('signup')} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f1f3f4] text-[#3c4043] hover:text-[#202124] transition-colors">
              3. Sign Up Page
            </button>
            <button onClick={() => setActiveView('onboarding')} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f1f3f4] text-[#3c4043] hover:text-[#202124] transition-colors">
              4. Onboarding (Step 1-4)
            </button>
            <button onClick={() => setActiveView('dashboard')} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f1f3f4] text-[#3c4043] hover:text-[#202124] transition-colors">
              5. Student Dashboard
            </button>
            <button onClick={() => setActiveView('resume-analysis')} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f1f3f4] text-[#3c4043] hover:text-[#202124] transition-colors">
              6. Resume Analysis
            </button>
            <button onClick={() => setActiveView('skill-gap')} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f1f3f4] text-[#3c4043] hover:text-[#202124] transition-colors">
              7. Skill Gap Analysis
            </button>
            <button onClick={() => setActiveView('roadmap')} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f1f3f4] text-[#3c4043] hover:text-[#202124] transition-colors">
              8. Career Roadmap
            </button>
            <button onClick={() => setActiveView('challenge-detail')} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f1f3f4] text-[#3c4043] hover:text-[#202124] transition-colors">
              9. Practical Challenge (Docker)
            </button>
            <button onClick={() => setActiveView('ai-evaluation')} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f1f3f4] text-[#3c4043] hover:text-[#202124] transition-colors">
              10. AI Evaluation
            </button>
            <button onClick={() => setActiveView('ai-mentor')} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f1f3f4] text-[#3c4043] hover:text-[#202124] transition-colors">
              11. AI Mentor Chat
            </button>
            <button onClick={() => setActiveView('jobs')} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f1f3f4] text-[#3c4043] hover:text-[#202124] transition-colors">
              12. Job Matching
            </button>
            <button onClick={() => setActiveView('profile')} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-[#f1f3f4] text-[#3c4043] hover:text-[#202124] transition-colors">
              13. My Profile (Rahul Kumar)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
