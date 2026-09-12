import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Compass } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <nav className="w-full bg-white border-b border-[#dadce0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo - Google style clean logo */}
        <div 
          onClick={() => setActiveView('landing')}
          className="flex items-center gap-2 cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#e8f0fe] flex items-center justify-center text-[#1a73e8]">
            <Compass className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-xl font-medium tracking-tight text-[#202124]">
            Skill<span className="text-[#1a73e8] font-bold">X</span>
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5f6368]">
          <button onClick={() => setActiveView('landing')} className="hover:text-[#202124] transition-colors py-1">
            Overview
          </button>
          <a href="#how-it-works" onClick={(e) => { e.preventDefault(); setActiveView('landing'); }} className="hover:text-[#202124] transition-colors py-1">
            How It Works
          </a>
          <a href="#features" onClick={(e) => { e.preventDefault(); setActiveView('landing'); }} className="hover:text-[#202124] transition-colors py-1">
            Features
          </a>
          <a href="#about" onClick={(e) => { e.preventDefault(); setActiveView('landing'); }} className="hover:text-[#202124] transition-colors py-1">
            About
          </a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveView('login')}
            className="px-4 py-2 text-sm font-medium text-[#1a73e8] hover:bg-[#f8f9fa] rounded-full transition-colors"
          >
            Sign in
          </button>
          <button
            onClick={() => setActiveView('signup')}
            className="px-5 py-2 text-sm font-medium text-white bg-[#1a73e8] hover:bg-[#1557d0] rounded-full transition-colors flex items-center gap-1.5 shadow-xs"
          >
            Get started
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};
