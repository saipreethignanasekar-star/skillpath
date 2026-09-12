import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CircularProgress } from '../components/common/CircularProgress';
import {
  ShieldCheck,
  CheckCircle2,
  Share2,
  Edit3,
  Award,
  FolderGit2,
  Trophy,
  ExternalLink
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, targetRole, setActiveView } = useApp();
  const [activeTab, setActiveTab] = useState<'projects' | 'certifications' | 'achievements'>('projects');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Profile Header Card (Screen 14) - Google Account style */}
      <div className="bg-white rounded-xl border border-[#dadce0] shadow-xs p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-1 ring-[#dadce0]"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-medium text-[#202124]">{user.name}</h1>
              <span className="p-1 rounded-full bg-[#e6f4ea] text-[#137333]">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>
            <div className="text-sm font-medium text-[#1a73e8] mt-0.5">{user.targetRole}</div>
            <p className="text-xs text-[#5f6368] mt-1">
              {user.college} • {user.currentYear}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => alert('Profile settings modal')}
            className="flex-1 md:flex-initial px-4 py-2 rounded-full border border-[#dadce0] hover:bg-[#f8f9fa] text-[#3c4043] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit profile</span>
          </button>

          <button
            onClick={handleShare}
            className="flex-1 md:flex-initial px-5 py-2 rounded-full bg-[#1a73e8] hover:bg-[#1557d0] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs transition-colors"
          >
            {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share profile'}</span>
          </button>
        </div>
      </div>

      {/* Career Readiness & Verified Skills Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Career Readiness Card */}
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
            <span className="text-xs font-medium text-[#137333] bg-[#e6f4ea] px-2.5 py-0.5 rounded-full">
              {user.readinessChange}
            </span>
            <div className="text-xs text-[#5f6368] mt-2">
              Target: <strong className="text-[#202124] font-medium">{targetRole}</strong>
            </div>
          </div>
        </div>

        {/* Verified Skills Pills (Screen 14) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-[#dadce0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-medium text-[#202124]">Verified Skills</h2>
                <p className="text-xs text-[#5f6368]">Validated via SkillX practical assessments & automated rubrics</p>
              </div>
              <button
                onClick={() => setActiveView('challenges')}
                className="text-xs font-medium text-[#1a73e8] hover:underline"
              >
                + Verify more
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {user.verifiedSkills.map((skill: string) => (
                <div
                  key={skill}
                  className="p-3 rounded-xl border border-[#ceead6] bg-[#e6f4ea]/40 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-[#202124]">{skill}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#137333]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#f1f3f4] flex items-center justify-between text-xs text-[#5f6368]">
            <span>Verification badge ID: #SKX-2026-RHL</span>
            <button
              onClick={() => alert('Certificate PDF generated for verified skills!')}
              className="text-[#1a73e8] font-medium hover:underline"
            >
              Download Credential PDF
            </button>
          </div>
        </div>
      </div>

      {/* Tabs for Projects, Certifications, Achievements */}
      <div className="bg-white rounded-xl border border-[#dadce0] shadow-xs p-6">
        <div className="flex border-b border-[#dadce0] gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'projects'
                ? 'border-[#1a73e8] text-[#1a73e8]'
                : 'border-transparent text-[#5f6368] hover:text-[#202124]'
            }`}
          >
            <FolderGit2 className="w-4 h-4" />
            <span>Projects (3)</span>
          </button>

          <button
            onClick={() => setActiveTab('certifications')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'certifications'
                ? 'border-[#1a73e8] text-[#1a73e8]'
                : 'border-transparent text-[#5f6368] hover:text-[#202124]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Certifications (2)</span>
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'achievements'
                ? 'border-[#1a73e8] text-[#1a73e8]'
                : 'border-transparent text-[#5f6368] hover:text-[#202124]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Achievements (4)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="pt-6">
          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-[#dadce0] bg-white hover:bg-[#f8f9fa] transition-colors">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-[#202124]">
                    Microservice Containerization & CI/CD
                  </h3>
                  <ExternalLink className="w-4 h-4 text-[#5f6368]" />
                </div>
                <p className="text-xs text-[#5f6368] mt-1.5 leading-relaxed">
                  Dockerized full-stack Node.js microservices with automated GitHub Actions testing and container image tagging.
                </p>
                <div className="flex gap-1.5 mt-3 text-[10px] font-normal text-[#5f6368]">
                  <span className="bg-[#f1f3f4] px-2.5 py-0.5 rounded-full">Docker</span>
                  <span className="bg-[#f1f3f4] px-2.5 py-0.5 rounded-full">Node.js</span>
                  <span className="bg-[#f1f3f4] px-2.5 py-0.5 rounded-full">CI/CD</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[#dadce0] bg-white hover:bg-[#f8f9fa] transition-colors">
                <div className="flex justify-between items-start">
                  <h3 className="text-sm font-medium text-[#202124]">
                    Automated Linux Server Provisioning
                  </h3>
                  <ExternalLink className="w-4 h-4 text-[#5f6368]" />
                </div>
                <p className="text-xs text-[#5f6368] mt-1.5 leading-relaxed">
                  Bash scripting suite for configuring security hardening, user permissions, and Nginx reverse proxies across Ubuntu VMs.
                </p>
                <div className="flex gap-1.5 mt-3 text-[10px] font-normal text-[#5f6368]">
                  <span className="bg-[#f1f3f4] px-2.5 py-0.5 rounded-full">Linux</span>
                  <span className="bg-[#f1f3f4] px-2.5 py-0.5 rounded-full">Bash</span>
                  <span className="bg-[#f1f3f4] px-2.5 py-0.5 rounded-full">Networking</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'certifications' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-[#dadce0] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-[#202124]">AWS Certified Cloud Practitioner</h3>
                  <p className="text-xs text-[#5f6368] mt-0.5">Amazon Web Services • Verified ID: AWS-CCP-7890</p>
                </div>
                <span className="text-xs font-medium px-2.5 py-0.5 bg-[#e6f4ea] text-[#137333] rounded-full">Active</span>
              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-[#dadce0] bg-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#fef7e0] text-[#e37400] flex items-center justify-center font-bold">
                  <Trophy className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-[#202124]">Docker Assessment Specialist</div>
                  <div className="text-[10px] text-[#5f6368]">Scored 86% on hands-on practical rubric</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-[#dadce0] bg-white flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center font-bold">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-medium text-[#202124]">Consistent Learner</div>
                  <div className="text-[10px] text-[#5f6368]">14-day streak on Cloud Engineer roadmap</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
