import React from 'react';
import { useApp } from '../context/AppContext';
import { CircularProgress } from '../components/common/CircularProgress';
import {
  FileText,
  Target,
  Compass,
  Award,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user, skills, setActiveView, targetRole } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#202124] tracking-tight">
            Good morning, {user.name ? user.name.split(' ')[0] : 'User'}
          </h1>
          <p className="text-xs sm:text-sm text-[#5f6368] mt-0.5">
            Here's what you need to focus on today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#e8f0fe] text-[#1967d2] border border-[#d2e3fc]">
            Target: <strong className="font-semibold">{targetRole}</strong>
          </span>
        </div>
      </div>

      {/* Top Row: Readiness Card + Your Skills Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Career Readiness Widget */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#dadce0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#5f6368] uppercase tracking-wider">
              Career Readiness
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#137333] bg-[#e6f4ea] px-2.5 py-0.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{user.readinessChange}</span>
            </span>
          </div>

          <div className="flex flex-col items-center justify-center my-6">
            <CircularProgress
              value={user.careerReadiness}
              size={150}
              strokeWidth={10}
              color="#1a73e8"
            />
            <div className="text-center mt-3">
              <div className="text-xs text-[#5f6368] font-normal">Target Role</div>
              <div className="text-sm font-medium text-[#202124]">{user.targetRole}</div>
              <div className="text-xs text-[#5f6368] mt-1">
                Estimated time to readiness: <strong className="text-[#3c4043] font-medium">{user.estimatedWeeks} weeks</strong>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#f1f3f4] flex items-center justify-between text-xs">
            <span className="text-[#5f6368]">Verified skills</span>
            <span className="font-medium text-[#1a73e8]">{user.verifiedSkills.length} Verified</span>
          </div>
        </div>

        {/* Your Skills Widget */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-[#dadce0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-medium text-[#202124] leading-none">Your Skills</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#e8f0fe] text-[#1967d2] font-medium border border-[#d2e3fc]">
                  Resume & Roadmap Synced
                </span>
              </div>
              <p className="text-xs text-[#5f6368] mt-1">
                Proficiency tracked from your uploaded resume and roadmap milestones.
              </p>
            </div>
            <button
              onClick={() => setActiveView('skill-gap')}
              className="text-xs font-medium text-[#1a73e8] hover:underline flex items-center gap-1 shrink-0"
            >
              <span>View gap analysis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5 flex-1 justify-center flex flex-col my-1">
            {skills.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#5f6368] space-y-2">
                <p>No skills detected yet.</p>
                <button
                  onClick={() => setActiveView('resume-analysis')}
                  className="px-4 py-1.5 bg-[#e8f0fe] text-[#1a73e8] rounded-full font-medium hover:bg-[#d2e3fc] transition-colors"
                >
                  Upload Resume to Extract Skills
                </button>
              </div>
            ) : (
              skills.slice(0, 6).map((skill) => {
                const color =
                  skill.userScore >= 75
                    ? 'bg-[#1e8e3e]'
                    : skill.userScore >= 50
                    ? 'bg-[#1a73e8]'
                    : skill.userScore >= 30
                    ? 'bg-[#e37400]'
                    : 'bg-[#d93025]';

                return (
                  <div key={skill.id} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-[#3c4043]">{skill.name}</span>
                        {skill.fromResume && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-[#f1f3f4] text-[#5f6368] rounded border border-[#dadce0]">
                            Resume
                          </span>
                        )}
                        {skill.fromRoadmap && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-[#e6f4ea] text-[#137333] rounded border border-[#ceead6]">
                            Roadmap
                          </span>
                        )}
                      </div>
                      <span className="font-medium text-[#202124]">{skill.userScore}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#e8eaed] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all duration-700`}
                        style={{ width: `${skill.userScore}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="pt-3 border-t border-[#f1f3f4] flex items-center justify-between text-[11px] text-[#5f6368]">
            <span>
              {user.resumeFileName ? `Synced with ${user.resumeFileName}` : 'Upload resume to sync initial skills'}
            </span>
            <button
              onClick={() => setActiveView('roadmap')}
              className="text-[#1a73e8] hover:underline font-medium cursor-pointer"
            >
              Complete roadmap modules to level up
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar - Google style rounded tiles */}
      <div>
        <h3 className="text-xs font-medium text-[#5f6368] uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <button
            onClick={() => setActiveView('resume-analysis')}
            className="p-4 bg-white rounded-xl border border-[#dadce0] hover:border-[#bdc1c6] hover:bg-[#f8f9fa] transition-all flex items-center gap-3 text-left shadow-xs"
          >
            <div className="w-9 h-9 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#202124]">Upload Resume</div>
              <div className="text-[11px] text-[#5f6368]">Scan & extract skills</div>
            </div>
          </button>

          <button
            onClick={() => setActiveView('skill-gap')}
            className="p-4 bg-white rounded-xl border border-[#dadce0] hover:border-[#bdc1c6] hover:bg-[#f8f9fa] transition-all flex items-center gap-3 text-left shadow-xs"
          >
            <div className="w-9 h-9 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shrink-0">
              <Target className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#202124]">Analyze Skills</div>
              <div className="text-[11px] text-[#5f6368]">Inspect role gaps</div>
            </div>
          </button>

          <button
            onClick={() => setActiveView('roadmap')}
            className="p-4 bg-white rounded-xl border border-[#dadce0] hover:border-[#bdc1c6] hover:bg-[#f8f9fa] transition-all flex items-center gap-3 text-left shadow-xs"
          >
            <div className="w-9 h-9 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shrink-0">
              <Compass className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#202124]">Continue Roadmap</div>
              <div className="text-[11px] text-[#5f6368]">Phase 2 Cloud</div>
            </div>
          </button>

          <button
            onClick={() => setActiveView('challenges')}
            className="p-4 bg-white rounded-xl border border-[#dadce0] hover:border-[#bdc1c6] hover:bg-[#f8f9fa] transition-all flex items-center gap-3 text-left shadow-xs"
          >
            <div className="w-9 h-9 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shrink-0">
              <Award className="w-4 h-4 stroke-[1.8]" />
            </div>
            <div>
              <div className="text-xs font-medium text-[#202124]">Take Challenge</div>
              <div className="text-[11px] text-[#5f6368]">Docker practical</div>
            </div>
          </button>
        </div>
      </div>

      {/* Bottom Row: Next Step Card & Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Next Step - Clean Google card with light accent banner */}
        <div className="bg-white p-6 rounded-xl border border-[#dadce0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-[#5f6368] uppercase tracking-wider">
                Recommended Next Step
              </span>
              <span className="text-xs text-[#5f6368] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>45 mins</span>
              </span>
            </div>
            <h3 className="text-xl font-medium text-[#202124] mt-1">
              Learn Docker fundamentals
            </h3>
            <p className="text-xs text-[#5f6368] mt-1 leading-relaxed">
              Docker represents one of your primary gaps for the Cloud Engineer role. Completing the hands-on container challenge will boost your career readiness by 8%.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#f1f3f4] flex items-center justify-between">
            <span className="text-xs text-[#137333] font-medium bg-[#e6f4ea] px-2.5 py-0.5 rounded-full">
              +8% readiness gain
            </span>
            <button
              onClick={() => setActiveView('challenge-detail')}
              className="px-5 py-2 bg-[#1a73e8] hover:bg-[#1557d0] text-white rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <span>Continue learning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl border border-[#dadce0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-medium text-[#202124]">Recent Activity</h3>
              <span className="text-xs text-[#5f6368]">Latest updates</span>
            </div>

            <div className="space-y-3.5">
              {user.recentActivity.length === 0 ? (
                <div className="py-6 text-center text-xs text-[#5f6368]">
                  No recent activity recorded yet.
                </div>
              ) : (
                user.recentActivity.slice(0, 3).map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-[#202124]">{act.title}</div>
                      <div className="text-[11px] text-[#5f6368]">{act.timeAgo}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveView('roadmap')}
            className="w-full mt-4 py-2 border border-[#dadce0] hover:bg-[#f8f9fa] text-[#3c4043] text-xs font-medium rounded-full transition-colors"
          >
            View full timeline
          </button>
        </div>
      </div>
    </div>
  );
};
