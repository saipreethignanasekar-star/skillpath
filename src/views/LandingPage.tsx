import React from 'react';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/layout/Navbar';
import { CircularProgress } from '../components/common/CircularProgress';
import {
  ArrowRight,
  BrainCircuit,
  SearchCheck,
  Compass,
  Award,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <div className="min-h-screen bg-[#ffffff] flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e8f0fe] text-[#1967d2] text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4 text-[#1a73e8]" />
            <span>AI-Powered Career Readiness Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-[#202124] tracking-tight leading-[1.2]">
            Build the skills <br className="hidden sm:inline" />
            your career <span className="text-[#1a73e8] font-medium">demands.</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg text-[#5f6368] max-w-2xl mx-auto leading-relaxed">
            SkillX analyzes your skills, pinpoints your gap, creates a personalized learning roadmap, and helps you prove your competence through practical challenges.
          </p>

          {/* CTAs - Google style buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveView('signup')}
              className="px-6 py-3 bg-[#1a73e8] hover:bg-[#1557d0] text-white font-medium rounded-full transition-colors flex items-center gap-2 text-sm sm:text-base shadow-xs"
            >
              <span>Get started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveView('dashboard')}
              className="px-6 py-3 bg-white hover:bg-[#f8f9fa] text-[#1a73e8] font-medium rounded-full border border-[#dadce0] hover:border-[#bdc1c6] transition-colors text-sm sm:text-base"
            >
              See how it works
            </button>
          </div>
        </div>

        {/* Clean Dashboard Preview Card (Google-style minimal window) */}
        <div className="mt-14 max-w-4xl mx-auto bg-white rounded-2xl border border-[#dadce0] overflow-hidden">
          <div className="bg-[#f8f9fa] px-4 py-2.5 flex items-center justify-between border-b border-[#dadce0]">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#dadce0]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#dadce0]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#dadce0]" />
            </div>
            <span className="text-xs text-[#5f6368] font-mono">skillx.google.com/dashboard</span>
            <div className="w-6" />
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white">
            {/* Circular readiness preview */}
            <div className="flex flex-col items-center justify-center p-6 bg-[#f8f9fa] rounded-xl border border-[#e8eaed] text-center">
              <span className="text-xs font-medium text-[#5f6368] uppercase tracking-wider mb-3">
                Career Readiness
              </span>
              <CircularProgress value={68} size={135} strokeWidth={9} color="#1a73e8" />
              <div className="mt-4">
                <span className="text-xs font-medium text-[#137333] bg-[#e6f4ea] px-3 py-1 rounded-full">
                  +12% this month
                </span>
                <p className="text-xs text-[#5f6368] mt-2.5">
                  Target: <strong className="text-[#202124] font-medium">Cloud Engineer</strong>
                </p>
              </div>
            </div>

            {/* Skills preview bars */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between text-xs font-medium text-[#5f6368] uppercase tracking-wider pb-2 border-b border-[#f1f3f4]">
                <span>Skill</span>
                <span>Proficiency</span>
              </div>

              {[
                { name: 'Python', pct: 90, color: 'bg-[#1e8e3e]' },
                { name: 'Linux', pct: 80, color: 'bg-[#1a73e8]' },
                { name: 'Git', pct: 75, color: 'bg-[#1a73e8]' },
                { name: 'Docker', pct: 60, color: 'bg-[#1a73e8]' },
                { name: 'AWS', pct: 40, color: 'bg-[#e37400]' },
                { name: 'Kubernetes', pct: 20, color: 'bg-[#d93025]' },
              ].map(skill => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-normal">
                    <span className="text-[#3c4043]">{skill.name}</span>
                    <span className="text-[#5f6368] font-medium">{skill.pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#e8eaed] rounded-full overflow-hidden">
                    <div
                      className={`h-full ${skill.color} rounded-full transition-all duration-700`}
                      style={{ width: `${skill.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Key Pillars / Features */}
        <div id="features" className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-xl border border-[#dadce0] hover:border-[#bdc1c6] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center mb-4">
              <BrainCircuit className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="text-base font-medium text-[#202124] mb-1.5">AI Skill Analysis</h3>
            <p className="text-xs text-[#5f6368] leading-relaxed">
              Analyze resumes, coursework, and past projects to map your industry skill footprint.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#dadce0] hover:border-[#bdc1c6] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center mb-4">
              <SearchCheck className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="text-base font-medium text-[#202124] mb-1.5">Skill Gap Detection</h3>
            <p className="text-xs text-[#5f6368] leading-relaxed">
              Understand exact missing proficiencies required for your desired target position.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#dadce0] hover:border-[#bdc1c6] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center mb-4">
              <Compass className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="text-base font-medium text-[#202124] mb-1.5">Personalized Roadmap</h3>
            <p className="text-xs text-[#5f6368] leading-relaxed">
              Follow step-by-step modular phases tailored to close gaps with real hands-on projects.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#dadce0] hover:border-[#bdc1c6] transition-all">
            <div className="w-10 h-10 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center mb-4">
              <Award className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h3 className="text-base font-medium text-[#202124] mb-1.5">Prove Your Skill</h3>
            <p className="text-xs text-[#5f6368] leading-relaxed">
              Complete practical challenges and receive verifiable AI rubrics to share with recruiters.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#dadce0] bg-[#f8f9fa] py-8 px-4 text-center text-xs text-[#5f6368]">
        <p>© 2026 SkillX. Minimal, intuitive career preparation platform.</p>
      </footer>
    </div>
  );
};
