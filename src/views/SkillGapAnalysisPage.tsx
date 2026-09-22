import React from 'react';
import { useApp } from '../context/AppContext';
import { CircularProgress } from '../components/common/CircularProgress';
import {
  ChevronDown,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  Sparkles
} from 'lucide-react';
import type { CareerRole, SkillItem } from '../types';

export const SkillGapAnalysisPage: React.FC = () => {
  const { targetRole, setTargetRole, user, skills, setActiveView } = useApp();

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
    <div className="space-y-6 pb-12">
      {/* Header with Target Role Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#202124] tracking-tight">
            Skill Gap Analysis
          </h1>
          <p className="text-xs sm:text-sm text-[#5f6368] mt-0.5">
            Compare your current skills with industry standards for your target role.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#5f6368]">Target role:</span>
          <div className="relative">
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value as CareerRole)}
              className="appearance-none bg-white border border-[#dadce0] text-[#202124] text-xs sm:text-sm font-medium pl-3 pr-8 py-1.5 rounded-full focus:outline-none focus:border-[#1a73e8] shadow-xs cursor-pointer"
            >
              {roles.map(r => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
              {!roles.includes(targetRole) && targetRole && (
                <option value={targetRole}>
                  {targetRole} (Custom)
                </option>
              )}
            </select>
            <ChevronDown className="w-4 h-4 text-[#5f6368] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Readiness & AI Insights Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Readiness Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-[#dadce0] shadow-xs flex flex-col items-center justify-center text-center">
          <span className="text-xs font-medium text-[#5f6368] uppercase tracking-wider mb-2">
            Career Readiness
          </span>
          <CircularProgress
            value={user.careerReadiness}
            size={140}
            strokeWidth={10}
            color="#1a73e8"
          />
          <div className="mt-3">
            <h3 className="text-sm font-medium text-[#202124]">
              You're {user.careerReadiness}% ready
            </h3>
            <p className="text-xs text-[#5f6368] mt-0.5">
              for your target role: <strong className="text-[#1a73e8] font-medium">{targetRole}</strong>
            </p>
          </div>
        </div>

        {/* Right AI Insights Card */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-[#dadce0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
                <Sparkles className="w-4 h-4 stroke-[1.8]" />
              </div>
              <h2 className="text-sm font-medium text-[#202124]">AI Insights</h2>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f8f9fa] border border-[#e8eaed] text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#1e8e3e] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#202124] font-medium">Your Linux fundamentals are strong.</strong>
                  <p className="text-[#5f6368] mt-0.5">
                    Your 80% score exceeds the 75% market baseline for entry-level cloud engineers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f8f9fa] border border-[#e8eaed] text-xs">
                <Flame className="w-4 h-4 text-[#d93025] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#202124] font-medium">Your biggest gap is Kubernetes (-60%).</strong>
                  <p className="text-[#5f6368] mt-0.5">
                    Modern cloud teams expect familiarity with container orchestration and manifests.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f8f9fa] border border-[#e8eaed] text-xs">
                <AlertTriangle className="w-4 h-4 text-[#e37400] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#202124] font-medium">Completing the Docker challenge could improve your readiness score by 8%.</strong>
                  <p className="text-[#5f6368] mt-0.5">
                    Docker is the prerequisite for closing your Kubernetes gap.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#f1f3f4] flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs text-[#5f6368]">
              Benchmark: 450+ Cloud Engineering Postings
            </span>
            <button
              onClick={() => setActiveView('roadmap')}
              className="text-xs font-medium text-[#1a73e8] hover:underline flex items-center gap-1"
            >
              <span>Explore personalized roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Skill Comparison Table - Google style clean table */}
      <div className="bg-white rounded-xl border border-[#dadce0] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#dadce0] flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-[#202124]">Skill Comparison</h3>
            <p className="text-xs text-[#5f6368]">Your current score vs target required threshold</p>
          </div>

          <button
            onClick={() => setActiveView('challenges')}
            className="px-4 py-2 bg-[#1a73e8] hover:bg-[#1557d0] text-white rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Prove skills</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] text-[#5f6368] uppercase tracking-wider font-medium border-b border-[#dadce0]">
                <th className="py-3 px-5">Skill</th>
                <th className="py-3 px-5">You</th>
                <th className="py-3 px-5">Required</th>
                <th className="py-3 px-5">Gap</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f4] font-normal">
              {skills.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-[#5f6368]">
                    No skills available for comparison yet. Upload a resume or select a role to populate skill requirements.
                  </td>
                </tr>
              ) : (
                skills.map((skill: SkillItem) => {
                  const statusBadge =
                    skill.status === 'Strong' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e6f4ea] text-[#137333]">
                        Strong
                      </span>
                    ) : skill.status === 'Needs Practice' ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fef7e0] text-[#b06000]">
                        Needs Practice
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fce8e6] text-[#c5221f]">
                        Critical
                      </span>
                    );

                  return (
                    <tr key={skill.id} className="hover:bg-[#f8f9fa] transition-colors">
                      <td className="py-3.5 px-5 font-medium text-[#202124] flex items-center gap-2">
                        <span>{skill.name}</span>
                        {skill.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1e8e3e]" />
                        )}
                      </td>
                      <td className="py-3.5 px-5 text-[#3c4043]">{skill.userScore}%</td>
                      <td className="py-3.5 px-5 text-[#5f6368]">{skill.requiredScore}%</td>
                      <td className="py-3.5 px-5">
                        <span className={`font-medium ${skill.gap >= 0 ? 'text-[#137333]' : 'text-[#c5221f]'}`}>
                          {skill.gap > 0 ? `+${skill.gap}%` : `${skill.gap}%`}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">{statusBadge}</td>
                      <td className="py-3.5 px-5 text-right">
                        {skill.name === 'Docker' ? (
                          <button
                            onClick={() => setActiveView('challenge-detail')}
                            className="text-xs font-medium text-[#1a73e8] hover:underline"
                          >
                            Start challenge →
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveView('roadmap')}
                            className="text-xs font-normal text-[#5f6368] hover:text-[#1a73e8]"
                          >
                            View roadmap →
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
