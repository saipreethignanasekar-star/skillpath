import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Clock,
  Play,
  Terminal,
  Code2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ProveYourSkillPage: React.FC = () => {
  const { challenge, submitChallengeCode } = useApp();
  const [code, setCode] = useState<string>(challenge.initialCode);
  const [activeTab, setActiveTab] = useState<'editor' | 'terminal'>('editor');
  const [terminalOutput, setTerminalOutput] = useState<string[]>([
    '$ docker version',
    'Client: Docker Engine - Community 24.0.7',
    'Server: Docker Engine - Community 24.0.7',
    '$ ready for build test...'
  ]);
  const [isSimulatingBuild, setIsSimulatingBuild] = useState<boolean>(false);

  const handleTestBuild = () => {
    setIsSimulatingBuild(true);
    setActiveTab('terminal');
    setTerminalOutput(prev => [
      ...prev,
      '$ docker build -t skillx-app:latest .',
      '[+] Building 1.2s (8/8) FINISHED',
      ' => [internal] load build definition from Dockerfile',
      ' => [1/4] FROM docker.io/library/node:20-alpine',
      ' => [2/4] WORKDIR /app',
      ' => [3/4] COPY package*.json ./',
      ' => [4/4] COPY . .',
      ' => exporting to image',
      ' => => naming to docker.io/library/skillx-app:latest',
      '✔ Image built successfully! Ready for AI evaluation.'
    ]);
    setTimeout(() => {
      setIsSimulatingBuild(false);
    }, 800);
  };

  const handleSubmit = () => {
    submitChallengeCode(code);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-normal text-[#202124] tracking-tight">
          Practical Assessment
        </h1>
        <p className="text-xs sm:text-sm text-[#5f6368] mt-0.5">
          Write and test real configuration files to prove your competency.
        </p>
      </div>

      {/* Challenge Card (Screen 9) */}
      <div className="bg-white rounded-xl border border-[#dadce0] shadow-xs p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#f1f3f4]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#e8f0fe] text-[#1967d2]">
                {challenge.difficulty}
              </span>
              <div className="flex items-center gap-1 text-xs text-[#5f6368]">
                <Clock className="w-3.5 h-3.5" />
                <span>{challenge.durationMinutes} minutes</span>
              </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-medium text-[#202124]">
              {challenge.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#5f6368] mt-1 max-w-xl">
              {challenge.description}
            </p>
          </div>

          {/* Docker Overview Badge */}
          <div className="flex items-center gap-4 bg-[#f8f9fa] p-4 rounded-xl border border-[#dadce0] shrink-0">
            <div className="w-12 h-12 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
              <svg className="w-7 h-7 fill-[#1a73e8]" viewBox="0 0 24 24">
                <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.186.185.186zm0 2.715h2.118a.187.187 0 00.186-.186V6.289a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.186.185.186zm-2.954 0h2.118a.187.187 0 00.186-.186V6.289a.186.186 0 00-.186-.185H8.075a.185.185 0 00-.185.185v1.888c0 .102.082.186.185.186zm0 2.715h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186H8.075a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185zm-2.954 0h2.118a.187.187 0 00.186-.185V9.006a.186.186 0 00-.186-.186H5.12a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185zm10.741-6.148c-.287.03-.574.07-.86.118a5.27 5.27 0 00-3.328-1.579l-.337-.024-.194.278c-.687.986-.889 2.278-.553 3.447l.08.28-.276.088c-1.07.342-1.928 1.077-2.484 2.126H1.547a.547.547 0 00-.547.547v4.619c0 2.547 1.583 4.802 3.937 5.61 5.378 1.847 11.588 1.847 16.966 0 1.258-.432 2.345-1.253 3.092-2.336.748-1.084 1.07-2.385.908-3.664-.177-1.393-.91-2.617-2.062-3.445l-.475-.34.19-.553c.48-1.401.378-2.935-.286-4.208a5.52 5.52 0 00-3.407-2.736z" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-medium text-[#202124]">Challenge Overview</div>
              <div className="flex gap-1.5 mt-1.5">
                <span className="text-[10px] font-medium bg-white px-2 py-0.5 rounded-full border border-[#dadce0] text-[#5f6368]">
                  Cloud & DevOps
                </span>
                <span className="text-[10px] font-medium bg-white px-2 py-0.5 rounded-full border border-[#dadce0] text-[#5f6368]">
                  Containers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="py-6">
          <h3 className="text-xs font-medium text-[#5f6368] uppercase tracking-wider mb-3">
            Instructions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {challenge.instructions.map((inst: string, idx: number) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-[#f8f9fa] border border-[#dadce0] text-xs text-[#3c4043]"
              >
                <div className="w-5 h-5 rounded-full bg-[#e8f0fe] text-[#1a73e8] font-medium flex items-center justify-center shrink-0 text-[11px]">
                  {idx + 1}
                </div>
                <span className="font-normal pt-0.5">{inst}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Workspace: Code Editor & Terminal (Google Cloud Shell style) */}
        <div className="mt-2 rounded-xl border border-[#dadce0] bg-[#202124] overflow-hidden shadow-xs">
          {/* Editor Header Bar */}
          <div className="bg-[#2d3033] px-4 py-2 flex items-center justify-between border-b border-[#3c4043]">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeTab === 'editor'
                    ? 'bg-[#3c4043] text-white'
                    : 'text-[#9aa0a6] hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-[#8ab4f8]" />
                <span>Dockerfile</span>
              </button>
              <button
                onClick={() => setActiveTab('terminal')}
                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  activeTab === 'terminal'
                    ? 'bg-[#3c4043] text-white'
                    : 'text-[#9aa0a6] hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-[#81c995]" />
                <span>Cloud Shell</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleTestBuild}
                disabled={isSimulatingBuild}
                className="px-3 py-1 rounded-md bg-[#3c4043] hover:bg-[#4d5156] text-white text-xs font-normal flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3 h-3 text-[#81c995] fill-[#81c995]" />
                <span>{isSimulatingBuild ? 'Building...' : 'Test Build'}</span>
              </button>
            </div>
          </div>

          {/* Editor Content Area */}
          {activeTab === 'editor' ? (
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={14}
              spellCheck={false}
              className="w-full bg-[#202124] text-[#e8eaed] font-mono text-xs sm:text-sm p-4 focus:outline-none resize-none leading-relaxed selection:bg-[#1a73e8]/50"
            />
          ) : (
            <div className="p-4 font-mono text-xs text-[#e8eaed] space-y-1 h-[320px] overflow-y-auto bg-[#202124]">
              {terminalOutput.map((line, idx) => (
                <div
                  key={idx}
                  className={
                    line.startsWith('$')
                      ? 'text-[#8ab4f8] font-medium'
                      : line.includes('✔')
                      ? 'text-[#81c995] font-medium'
                      : 'text-[#9aa0a6]'
                  }
                >
                  {line}
                </div>
              ))}
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="bg-[#2d3033] px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#3c4043]">
            <div className="flex items-center gap-2 text-xs text-[#9aa0a6]">
              <Sparkles className="w-4 h-4 text-[#8ab4f8]" />
              <span>AI Evaluator will score correctness, security & best practices.</span>
            </div>

            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-[#1a73e8] hover:bg-[#1557d0] text-white rounded-full text-xs font-medium transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Submit for AI Evaluation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
