import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  UserCheck,
  TrendingUp,
  Award,
  BarChart3,
  PieChart,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import type { StudentCohortMetric } from '../types';

export const AdminOverviewPage: React.FC = () => {
  const { cohortStudents } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#202124] tracking-tight">
            Cohort Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#5f6368] mt-0.5">
            Real-time talent metrics and readiness telemetry across student cohorts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => alert('Exporting cohort analytics CSV...')}
            className="px-4 py-1.5 rounded-full border border-[#dadce0] hover:bg-[#f8f9fa] text-[#3c4043] text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Filter className="w-3.5 h-3.5 text-[#5f6368]" />
            <span>Filter Cohort</span>
          </button>
        </div>
      </div>

      {/* 4 Key Metrics (Screen 12) - Google Admin style */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white p-5 rounded-xl border border-[#dadce0] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#5f6368] uppercase tracking-wider">
              Total Students
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-normal text-[#202124]">248</div>
          <div className="text-[11px] text-[#137333] font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+18 this term</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#dadce0] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#5f6368] uppercase tracking-wider">
              Active Students
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#e6f4ea] text-[#1e8e3e] flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-normal text-[#202124]">215</div>
          <div className="text-[11px] text-[#5f6368] font-normal mt-1">
            86.7% weekly activity
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#dadce0] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#5f6368] uppercase tracking-wider">
              Avg. Readiness
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-normal text-[#202124]">82%</div>
          <div className="text-[11px] text-[#137333] font-medium mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+6.4% cohort growth</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#dadce0] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-[#5f6368] uppercase tracking-wider">
              Verified Skills
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#fef7e0] text-[#e37400] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-normal text-[#202124]">1,245</div>
          <div className="text-[11px] text-[#5f6368] font-normal mt-1">
            Across 18 tech stacks
          </div>
        </div>
      </div>

      {/* Middle Analytics Charts Row (Screen 12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Most Common Skill Gaps */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-[#dadce0] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-medium text-[#202124]">Most Common Skill Gaps</h3>
              <p className="text-xs text-[#5f6368]">Skills most frequently missing across student profiles</p>
            </div>
            <BarChart3 className="w-4 h-4 text-[#5f6368]" />
          </div>

          <div className="space-y-4 pt-2">
            {[
              { skill: 'AWS Cloud Architecture', pct: 65, color: 'bg-[#d93025]' },
              { skill: 'Kubernetes Orchestration', pct: 58, color: 'bg-[#e37400]' },
              { skill: 'Terraform IaC', pct: 42, color: 'bg-[#1a73e8]' },
              { skill: 'Docker Containerization', pct: 30, color: 'bg-[#1e8e3e]' },
            ].map(item => (
              <div key={item.skill} className="space-y-1">
                <div className="flex justify-between text-xs font-normal">
                  <span className="text-[#3c4043] font-medium">{item.skill}</span>
                  <span className="text-[#5f6368]">{item.pct}% students missing</span>
                </div>
                <div className="h-2 w-full bg-[#e8eaed] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Readiness Distribution (Screen 12 Donut) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#dadce0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-medium text-[#202124]">Student Readiness Distribution</h3>
              <p className="text-xs text-[#5f6368]">Cohort split by job-readiness brackets</p>
            </div>
            <PieChart className="w-4 h-4 text-[#5f6368]" />
          </div>

          {/* SVG Donut Illustration - Google colors */}
          <div className="flex items-center justify-center my-4">
            <div className="relative w-36 h-36">
              <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f3f4" strokeWidth="4" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1e8e3e" strokeWidth="4" strokeDasharray="43 57" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#1a73e8" strokeWidth="4" strokeDasharray="35 65" strokeDashoffset="-43" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f29900" strokeWidth="4" strokeDasharray="14 86" strokeDashoffset="-78" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#d93025" strokeWidth="4" strokeDasharray="8 92" strokeDashoffset="-92" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-medium text-[#202124]">248</span>
                <span className="text-[10px] uppercase font-medium text-[#5f6368]">Students</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-[#f1f3f4]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1e8e3e]" />
              <span className="text-[#3c4043]">76-100% (43%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1a73e8]" />
              <span className="text-[#3c4043]">51-75% (35%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f29900]" />
              <span className="text-[#3c4043]">26-50% (14%)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d93025]" />
              <span className="text-[#3c4043]">0-25% (8%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Students Table (Screen 12) */}
      <div className="bg-white rounded-xl border border-[#dadce0] shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#dadce0] flex items-center justify-between">
          <div>
            <h3 className="text-base font-medium text-[#202124]">Recent Candidates</h3>
            <p className="text-xs text-[#5f6368]">Live readiness telemetry and verification badges</p>
          </div>
          <span className="text-xs font-normal text-[#5f6368]">Showing top candidates</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f8f9fa] text-[#5f6368] uppercase tracking-wider font-medium border-b border-[#dadce0]">
                <th className="py-3 px-5">Student</th>
                <th className="py-3 px-5">Target Role</th>
                <th className="py-3 px-5">Readiness</th>
                <th className="py-3 px-5">Verified Skills</th>
                <th className="py-3 px-5 text-right">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f4] font-normal">
              {cohortStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-xs text-[#5f6368]">
                    No students currently in cohort. New student signups will appear here automatically.
                  </td>
                </tr>
              ) : (
                cohortStudents.map((student: StudentCohortMetric) => (
                  <tr key={student.id} className="hover:bg-[#f8f9fa] transition-colors">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-[#dadce0]"
                      />
                      <div>
                        <div className="font-medium text-[#202124]">{student.name}</div>
                        <div className="text-[10px] text-[#5f6368]">{student.status}</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-[#3c4043]">{student.targetRole}</td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-[#e8eaed] rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              student.readiness >= 80
                                ? 'bg-[#1e8e3e]'
                                : student.readiness >= 65
                                ? 'bg-[#1a73e8]'
                                : 'bg-[#f29900]'
                            } rounded-full`}
                            style={{ width: `${student.readiness}%` }}
                          />
                        </div>
                        <span className="font-medium text-[#202124]">{student.readiness}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-[#3c4043]">
                      {student.verifiedSkillsCount} verified
                    </td>
                    <td className="py-3.5 px-5 text-right text-[#5f6368]">
                      {student.lastActivity}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
