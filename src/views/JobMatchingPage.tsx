import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Search,
  Check,
  Building
} from 'lucide-react';
import type { JobItem } from '../types';

export const JobMatchingPage: React.FC = () => {
  const { jobs, applyForJob, appliedJobIds, user } = useApp();
  const [roleSearch, setRoleSearch] = useState<string>('');
  const [onlyRemote, setOnlyRemote] = useState<boolean>(false);

  const filteredJobs = jobs.filter((job: JobItem) => {
    const matchesRole = job.title.toLowerCase().includes(roleSearch.toLowerCase()) ||
                        job.company.toLowerCase().includes(roleSearch.toLowerCase());
    const matchesRemote = onlyRemote ? job.isRemote : true;
    return matchesRole && matchesRemote;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-normal text-[#202124] tracking-tight">
          Job Matches
        </h1>
        <p className="text-xs sm:text-sm text-[#5f6368] mt-0.5">
          Curated opportunities matching your verified skills ({user.verifiedSkills.join(', ')}).
        </p>
      </div>

      {/* Filter Bar (Screen 13) - Google style */}
      <div className="bg-white p-3 rounded-xl border border-[#dadce0] shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#5f6368] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, skill, or company..."
            value={roleSearch}
            onChange={(e) => setRoleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#f1f3f4] focus:bg-white rounded-full border border-transparent focus:border-[#dadce0] focus:outline-none focus:ring-1 focus:ring-[#1a73e8] text-[#202124]"
          />
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end px-2">
          <label className="flex items-center gap-2 text-xs font-normal text-[#3c4043] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyRemote}
              onChange={(e) => setOnlyRemote(e.target.checked)}
              className="w-4 h-4 rounded text-[#1a73e8] focus:ring-[#1a73e8] border-[#dadce0]"
            />
            <span>Remote only</span>
          </label>

          <span className="text-xs text-[#5f6368]">
            {filteredJobs.length} roles found
          </span>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="space-y-3.5">
        {filteredJobs.map((job: JobItem) => {
          const isApplied = appliedJobIds.includes(job.id);

          return (
            <div
              key={job.id}
              className="bg-white rounded-xl border border-[#dadce0] shadow-xs p-6 hover:border-[#bdc1c6] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center font-medium text-sm shrink-0">
                    <Building className="w-5 h-5 stroke-[1.8]" />
                  </div>

                  <div>
                    <h3 className="text-base font-medium text-[#202124] leading-tight">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#5f6368] mt-1">
                      <span className="font-medium text-[#202124]">{job.company}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#5f6368]" />
                        {job.location}
                      </span>
                      <span>•</span>
                      <span>{job.experience}</span>
                    </div>
                  </div>
                </div>

                {/* Skills tags: Matched vs Missing */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-medium text-[#5f6368] mr-1">Matched:</span>
                  {job.skills.map((s: string) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#e6f4ea] text-[#137333]"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{s}</span>
                    </span>
                  ))}

                  {job.missingSkills.length > 0 && (
                    <>
                      <span className="text-xs font-medium text-[#5f6368] ml-2 mr-1">Missing:</span>
                      {job.missingSkills.map((s: string) => (
                        <span
                          key={s}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fce8e6] text-[#c5221f]"
                        >
                          <AlertCircle className="w-3 h-3" />
                          <span>{s}</span>
                        </span>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Match Score & Action */}
              <div className="flex items-center justify-between lg:flex-col lg:items-end gap-3 shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#f1f3f4]">
                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f0fe] text-[#1967d2] font-medium text-xs sm:text-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{job.matchScore}% Match</span>
                  </div>
                  <div className="text-[11px] text-[#5f6368] mt-1">
                    Posted {job.postedAgo}
                  </div>
                </div>

                <button
                  onClick={() => applyForJob(job.id)}
                  disabled={isApplied}
                  className={`px-5 py-2 rounded-full text-xs font-medium transition-all flex items-center gap-2 shadow-xs ${
                    isApplied
                      ? 'bg-[#1e8e3e] text-white cursor-default'
                      : 'bg-[#1a73e8] hover:bg-[#1557d0] text-white'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Applied with SkillX Profile</span>
                    </>
                  ) : (
                    <span>Apply with verified skills</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
