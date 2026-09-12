import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Award
} from 'lucide-react';

export const ChallengesListPage: React.FC = () => {
  const { setActiveView, user } = useApp();

  const challengesList = [
    {
      id: 'ch_docker_1',
      title: 'Docker Challenge',
      role: 'Cloud & DevOps',
      difficulty: 'Intermediate',
      time: '45 mins',
      description: 'Containerize a Node.js application and expose it on port 3000 following security best practices.',
      isCompleted: user.verifiedSkills.includes('Docker'),
      score: 86,
      tags: ['Docker', 'Containers', 'Security']
    },
    {
      id: 'ch_aws_iam',
      title: 'AWS IAM Policy Configuration',
      role: 'Cloud Engineer',
      difficulty: 'Beginner',
      time: '30 mins',
      description: 'Create a least-privilege IAM policy allowing S3 read-only access for a specific EC2 role.',
      isCompleted: user.verifiedSkills.includes('AWS'),
      score: 92,
      tags: ['AWS', 'IAM', 'Security']
    },
    {
      id: 'ch_k8s_deploy',
      title: 'Kubernetes Pod & Service Deployment',
      role: 'DevOps Engineer',
      difficulty: 'Advanced',
      time: '60 mins',
      description: 'Write Kubernetes YAML manifests for a 3-replica Deployment with rolling updates and ClusterIP service.',
      isCompleted: user.verifiedSkills.includes('Kubernetes'),
      tags: ['Kubernetes', 'YAML', 'Orchestration']
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#202124] tracking-tight">
            Practical Challenges
          </h1>
          <p className="text-xs sm:text-sm text-[#5f6368] mt-0.5">
            Demonstrate real-world competency. Verified challenges increase your career readiness score.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium px-3.5 py-1.5 rounded-full bg-[#e6f4ea] text-[#137333] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>{user.verifiedSkills.length} Skills Verified</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {challengesList.map((ch) => (
          <div
            key={ch.id}
            className={`bg-white rounded-xl border p-6 flex flex-col justify-between shadow-xs transition-all ${
              ch.isCompleted ? 'border-[#ceead6]' : 'border-[#dadce0] hover:border-[#bdc1c6]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#f1f3f4] text-[#5f6368]">
                  {ch.difficulty}
                </span>
                <div className="flex items-center gap-1 text-xs text-[#5f6368]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{ch.time}</span>
                </div>
              </div>

              <h2 className="text-base font-medium text-[#202124] mb-1.5">
                {ch.title}
              </h2>
              <p className="text-xs text-[#5f6368] leading-relaxed mb-4">
                {ch.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {ch.tags.map(t => (
                  <span key={t} className="text-[10px] font-normal bg-[#f8f9fa] px-2.5 py-0.5 rounded-full text-[#5f6368] border border-[#dadce0]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#f1f3f4] flex items-center justify-between">
              {ch.isCompleted ? (
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#137333]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verified ({ch.score}%)</span>
                </div>
              ) : (
                <span className="text-xs text-[#5f6368]">+8% Readiness boost</span>
              )}

              <button
                onClick={() => {
                  if (ch.id === 'ch_docker_1') {
                    setActiveView('challenge-detail');
                  } else {
                    alert('Launching challenge environment for ' + ch.title);
                  }
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs ${
                  ch.isCompleted
                    ? 'bg-white border border-[#dadce0] hover:bg-[#f8f9fa] text-[#3c4043]'
                    : 'bg-[#1a73e8] hover:bg-[#1557d0] text-white'
                }`}
              >
                <span>{ch.isCompleted ? 'Review Solution' : 'Start Challenge'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
