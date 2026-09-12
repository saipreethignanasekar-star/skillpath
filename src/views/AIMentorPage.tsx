import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bot,
  Send,
  Sparkles,
  ArrowRight,
  Lightbulb
} from 'lucide-react';
import type { ChatMessage } from '../types';

export const AIMentorPage: React.FC = () => {
  const { chatMessages, sendChatMessage, setActiveView, user, targetRole } = useApp();
  const [inputVal, setInputVal] = useState<string>('');

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    sendChatMessage(inputVal);
    setInputVal('');
  };

  const samplePrompts = [
    'What should I learn next?',
    'How do I close my Kubernetes gap?',
    'Review my Docker challenge solution',
    'Which internships best fit my current profile?'
  ];

  return (
    <div className="space-y-4 pb-12 max-w-4xl mx-auto flex flex-col h-[calc(100vh-7rem)]">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
              <Bot className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-normal text-[#202124] tracking-tight">
              AI Career Mentor
            </h1>
          </div>
          <p className="text-xs text-[#5f6368] mt-0.5">
            Personalized guidance grounded in your verified skills and {targetRole} trajectory.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#f1f3f4] text-[#3c4043]">
          <Sparkles className="w-3.5 h-3.5 text-[#1a73e8]" />
          <span>{user.careerReadiness}% Readiness</span>
        </div>
      </div>

      {/* Chat Messages Container - Google style clean bubbles */}
      <div className="flex-1 bg-white rounded-xl border border-[#dadce0] shadow-xs p-4 sm:p-6 overflow-y-auto space-y-4">
        {/* Recommendation Header Banner (Screen 11) */}
        <div className="p-4 rounded-xl bg-[#f8f9fa] border border-[#dadce0] flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-[#1a73e8] shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="text-[#202124] font-medium block mb-0.5">
              Targeted Guidance
            </strong>
            <span className="text-[#5f6368]">
              Based on your skill gap analysis, prioritize infrastructure automation to increase employer matching from 82% to 95%.
            </span>
          </div>
        </div>

        {chatMessages.map((msg: ChatMessage) => {
          const isAI = msg.sender === 'ai';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs sm:text-sm ${isAI ? 'items-start' : 'items-end flex-row-reverse'}`}
            >
              {isAI && (
                <div className="w-7 h-7 rounded-full bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 stroke-[1.8]" />
                </div>
              )}

              <div className={`max-w-xl space-y-1.5 ${isAI ? 'text-left' : 'text-right'}`}>
                <div
                  className={`p-4 rounded-2xl leading-relaxed text-xs sm:text-sm ${
                    isAI
                      ? 'bg-[#f8f9fa] text-[#202124] border border-[#dadce0]'
                      : 'bg-[#1a73e8] text-white'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Recommendation Card inside AI message (Screen 11) */}
                  {msg.card && (
                    <div className="mt-3 p-4 rounded-xl bg-white border border-[#dadce0] text-left text-[#202124] space-y-3">
                      <div className="font-medium text-xs text-[#202124]">
                        {msg.card.title}
                      </div>

                      <div className="space-y-1.5">
                        {msg.card.items.map((item: string, i: number) => (
                          <div key={i} className="text-xs text-[#5f6368] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#1a73e8]" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#f1f3f4]">
                        <button
                          onClick={() => setActiveView(msg.card?.primaryAction as any || 'roadmap')}
                          className="px-4 py-1.5 rounded-full bg-[#1a73e8] hover:bg-[#1557d0] text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <span>{msg.card.primaryButtonText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        {msg.card.secondaryButtonText && (
                          <button
                            onClick={() => setActiveView(msg.card?.secondaryAction as any || 'challenges')}
                            className="px-4 py-1.5 rounded-full bg-white hover:bg-[#f8f9fa] text-[#3c4043] border border-[#dadce0] text-xs font-medium transition-colors"
                          >
                            {msg.card.secondaryButtonText}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-[#5f6368] px-1 font-normal block">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggested prompt chips - Google style rounded pills */}
      <div className="flex flex-wrap gap-2">
        {samplePrompts.map((prompt) => (
          <button
            key={prompt}
            onClick={() => {
              setInputVal(prompt);
              sendChatMessage(prompt);
            }}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-[#f8f9fa] border border-[#dadce0] text-xs text-[#3c4043] font-normal transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Input Bar - Google pill search/chat input */}
      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask AI Mentor about roadmap milestones, skill gaps, or interview prep..."
          className="w-full pl-4 pr-12 py-3 text-xs sm:text-sm bg-white rounded-full border border-[#dadce0] focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] text-[#202124] placeholder:text-[#5f6368] shadow-xs"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#1a73e8] hover:bg-[#1557d0] text-white transition-all"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
