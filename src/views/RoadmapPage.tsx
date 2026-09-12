import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Circle,
  Clock,
  Sparkles
} from 'lucide-react';
import type { RoadmapPhase, RoadmapModule } from '../types';

export const RoadmapPage: React.FC = () => {
  const { targetRole, roadmapPhases, completeRoadmapModule, setActiveView } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-normal text-[#202124] tracking-tight">
            Career Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-[#5f6368] mt-0.5">
            Step-by-step learning path for <strong className="text-[#1a73e8] font-medium">{targetRole}</strong>.
          </p>
        </div>

        <button
          onClick={() => setActiveView('ai-mentor')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#dadce0] text-[#1a73e8] hover:bg-[#f8f9fa] text-xs font-medium transition-colors self-start sm:self-auto shadow-xs"
        >
          <Sparkles className="w-4 h-4 stroke-[1.8]" />
          <span>Ask AI Mentor</span>
        </button>
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-4">
        {roadmapPhases.map((phase: RoadmapPhase) => {
          const isPhaseCompleted = phase.status === 'completed';
          const isPhaseActive = phase.status === 'in_progress';

          return (
            <div
              key={phase.id}
              className={`bg-white rounded-xl border p-6 transition-all shadow-xs ${
                isPhaseActive
                  ? 'border-[#1a73e8] ring-1 ring-[#1a73e8]'
                  : isPhaseCompleted
                  ? 'border-[#dadce0]'
                  : 'border-[#dadce0]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#f1f3f4]">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs shrink-0 ${
                      isPhaseCompleted
                        ? 'bg-[#e6f4ea] text-[#137333]'
                        : isPhaseActive
                        ? 'bg-[#e8f0fe] text-[#1a73e8]'
                        : 'bg-[#f1f3f4] text-[#5f6368]'
                    }`}
                  >
                    {isPhaseCompleted ? <CheckCircle2 className="w-4 h-4 text-[#1e8e3e]" /> : phase.number}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-medium text-[#202124]">{phase.title}</h2>
                      <span
                        className={`text-[10px] font-medium uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          isPhaseCompleted
                            ? 'bg-[#e6f4ea] text-[#137333]'
                            : isPhaseActive
                            ? 'bg-[#e8f0fe] text-[#1967d2]'
                            : 'bg-[#f1f3f4] text-[#5f6368]'
                        }`}
                      >
                        {isPhaseCompleted ? 'Completed' : isPhaseActive ? 'In Progress' : 'Upcoming'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#5f6368] mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{phase.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {phase.number === 3 && (
                    <button
                      onClick={() => setActiveView('challenge-detail')}
                      className="px-3.5 py-1.5 rounded-full bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#1967d2] text-xs font-medium transition-colors"
                    >
                      Docker Challenge
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const nextMod = phase.modules.find((m: RoadmapModule) => !m.completed);
                      if (nextMod) {
                        completeRoadmapModule(phase.id, nextMod.id);
                      }
                    }}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all shadow-xs ${
                      isPhaseCompleted
                        ? 'bg-white border border-[#dadce0] hover:bg-[#f8f9fa] text-[#3c4043]'
                        : 'bg-[#1a73e8] hover:bg-[#1557d0] text-white'
                    }`}
                  >
                    {isPhaseCompleted ? 'Review' : 'Progress'}
                  </button>
                </div>
              </div>

              {/* Sub-modules List */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
                {phase.modules.map((mod: RoadmapModule) => (
                  <div
                    key={mod.id}
                    onClick={() => completeRoadmapModule(phase.id, mod.id)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                      mod.completed
                        ? 'border-[#ceead6] bg-[#e6f4ea]/30 text-[#202124]'
                        : 'border-[#dadce0] bg-white hover:bg-[#f8f9fa]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {mod.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-[#1e8e3e] shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-[#dadce0] shrink-0" />
                        )}
                        <span className={`text-xs font-medium ${mod.completed ? 'text-[#137333] line-through' : 'text-[#202124]'}`}>
                          {mod.title}
                        </span>
                      </div>
                      {mod.duration && (
                        <span className="text-[10px] text-[#5f6368] font-normal shrink-0">
                          {mod.duration}
                        </span>
                      )}
                    </div>
                    {mod.description && (
                      <p className="text-[11px] text-[#5f6368] mt-1.5 line-clamp-2 pl-6">
                        {mod.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
