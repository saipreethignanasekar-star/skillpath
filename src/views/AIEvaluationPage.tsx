import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CircularProgress } from '../components/common/CircularProgress';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  RefreshCw,
  TrendingUp
} from 'lucide-react';

export const AIEvaluationPage: React.FC = () => {
  const { evaluation, addVerifiedSkillFromEvaluation, setActiveView } = useApp();
  const [animating, setAnimating] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimating(false);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6f4ea] text-[#137333] text-xs font-medium mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Evaluation Complete</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-normal text-[#202124] tracking-tight">
          AI Evaluation Report
        </h1>
        <p className="text-xs sm:text-sm text-[#5f6368] mt-0.5">
          {animating ? 'Analyzing configuration rubric...' : 'Detailed automated grading for your Docker containerization solution.'}
        </p>
      </div>

      {/* Main Results Card */}
      <div className="bg-white rounded-xl border border-[#dadce0] shadow-xs p-6 sm:p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Overall Score Gauge */}
          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-[#f8f9fa] rounded-xl border border-[#e8eaed] text-center">
            <span className="text-xs font-medium text-[#5f6368] uppercase tracking-wider mb-3">
              Overall Score
            </span>
            <CircularProgress
              value={animating ? 0 : evaluation.overallScore}
              size={150}
              strokeWidth={10}
              color="#1a73e8"
            />
            <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-[#137333] bg-[#e6f4ea] px-3 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Passed (&gt; 70% threshold)</span>
            </div>
          </div>

          {/* Breakdown criteria */}
          <div className="md:col-span-7 space-y-4">
            <h3 className="text-sm font-medium text-[#202124] mb-2">
              Evaluation Criteria Breakdown
            </h3>

            {[
              { label: 'Technical Correctness', score: evaluation.technicalCorrectness, color: 'bg-[#1e8e3e]' },
              { label: 'Best Practices', score: evaluation.bestPractices, color: 'bg-[#1a73e8]' },
              { label: 'Security Hardening', score: evaluation.security, color: 'bg-[#e37400]' },
              { label: 'Configuration Syntax', score: evaluation.configuration, color: 'bg-[#1a73e8]' },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-[#3c4043]">{item.label}</span>
                  <span className="font-medium text-[#202124]">{item.score}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#e8eaed] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all duration-700`}
                    style={{ width: animating ? '0%' : `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Verified Banner (Google style) */}
        <div className="p-5 rounded-xl bg-[#e6f4ea] border border-[#ceead6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-full bg-[#1e8e3e] text-white flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#202124]">
                  Skill Verified: {evaluation.verifiedSkillName}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#137333] text-white">
                  Official
                </span>
              </div>
              <p className="text-xs text-[#3c4043] mt-1 max-w-lg leading-relaxed">
                {evaluation.summary}
              </p>
            </div>
          </div>

          <button
            onClick={addVerifiedSkillFromEvaluation}
            className="px-5 py-2.5 bg-[#1a73e8] hover:bg-[#1557d0] text-white rounded-full text-xs font-medium transition-all flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-center shadow-xs"
          >
            <span>Add to verified skills</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
          <button
            onClick={() => setActiveView('challenge-detail')}
            className="text-[#5f6368] hover:text-[#202124] flex items-center gap-1 font-medium"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retake challenge</span>
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className="text-[#1a73e8] font-medium hover:underline"
          >
            Return to dashboard →
          </button>
        </div>
      </div>
    </div>
  );
};
