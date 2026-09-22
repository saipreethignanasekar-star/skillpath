import React, { useState, useRef } from 'react';
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
  ExternalLink,
  X,
  Camera,
  Trash2,
  GraduationCap,
  Building2,
  BookOpen,
  Calendar,
  CreditCard,
  Globe,
  Link,
  Sparkles,
  TrendingUp
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, targetRole, setActiveView, updateUserProfile } = useApp();
  const [activeTab, setActiveTab] = useState<'projects' | 'certifications' | 'achievements'>('projects');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [savedToast, setSavedToast] = useState<boolean>(false);
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal Form State
  const [formData, setFormData] = useState({
    name: user.name || '',
    department: user.department || '',
    college: user.college || '',
    currentYear: user.currentYear || '',
    rollNumber: user.rollNumber || '',
    cgpa: user.cgpa || '',
    graduationYear: user.graduationYear || '',
    bio: user.bio || '',
    githubUrl: user.githubUrl || '',
    linkedinUrl: user.linkedinUrl || '',
    avatar: user.avatar || ''
  });

  const openEditModal = () => {
    setFormData({
      name: user.name || '',
      department: user.department || '',
      college: user.college || '',
      currentYear: user.currentYear || '',
      rollNumber: user.rollNumber || '',
      cgpa: user.cgpa || '',
      graduationYear: user.graduationYear || '',
      bio: user.bio || '',
      githubUrl: user.githubUrl || '',
      linkedinUrl: user.linkedinUrl || '',
      avatar: user.avatar || ''
    });
    setIsEditModalOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({ ...prev, avatar: base64String }));
        setFailedAvatarUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, avatar: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: formData.name.trim(),
      department: formData.department.trim(),
      college: formData.college.trim(),
      currentYear: formData.currentYear.trim(),
      rollNumber: formData.rollNumber.trim(),
      cgpa: formData.cgpa.trim(),
      graduationYear: formData.graduationYear.trim(),
      bio: formData.bio.trim(),
      githubUrl: formData.githubUrl.trim(),
      linkedinUrl: formData.linkedinUrl.trim(),
      avatar: formData.avatar
    });

    setIsEditModalOpen(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const isAvatarValid = Boolean(user.avatar && failedAvatarUrl !== user.avatar);
  const userInitial = user.name ? user.name.trim().charAt(0).toUpperCase() : 'U';

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#137333] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* Profile Header Card - Google Account style */}
      <div className="bg-white rounded-xl border border-[#dadce0] shadow-xs p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar with initial fallback and quick camera button */}
          <div className="relative group shrink-0">
            {isAvatarValid ? (
              <img
                src={user.avatar}
                alt={user.name || 'Student'}
                onError={() => setFailedAvatarUrl(user.avatar)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover ring-2 ring-[#dadce0]"
              />
            ) : (
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#1a73e8] to-[#1557d0] text-white flex items-center justify-center text-3xl font-medium shadow-inner ring-2 ring-[#dadce0]">
                {userInitial}
              </div>
            )}
            <button
              onClick={openEditModal}
              title="Change profile photo"
              className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full border border-[#dadce0] text-[#5f6368] hover:text-[#1a73e8] hover:border-[#1a73e8] shadow-xs transition-colors cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-medium text-[#202124]">
                {user.name || 'Student Name'}
              </h1>
              <span className="p-1 rounded-full bg-[#e6f4ea] text-[#137333]" title="Verified Student">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div className="text-sm font-medium text-[#1a73e8] mt-0.5">{user.targetRole}</div>

            <p className="text-xs text-[#5f6368] mt-1 flex flex-wrap items-center gap-1.5">
              {user.department && (
                <span className="font-medium text-[#3c4043]">{user.department}</span>
              )}
              {user.department && user.college && <span>•</span>}
              {user.college && <span>{user.college}</span>}
              {(user.college || user.department) && user.currentYear && <span>•</span>}
              {user.currentYear && <span>{user.currentYear}</span>}
            </p>

            {/* Bio */}
            {user.bio && (
              <p className="text-xs text-[#5f6368] mt-2 max-w-xl leading-relaxed">
                {user.bio}
              </p>
            )}

            {/* Student metadata tags */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {user.rollNumber && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#f1f3f4] text-[#3c4043] font-medium border border-[#dadce0]">
                  Roll No: {user.rollNumber}
                </span>
              )}
              {user.cgpa && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] font-medium border border-[#ceead6]">
                  CGPA: {user.cgpa}
                </span>
              )}
              {user.graduationYear && (
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#e8f0fe] text-[#1967d2] font-medium border border-[#d2e3fc]">
                  Batch: {user.graduationYear}
                </span>
              )}
              {user.githubUrl && (
                <a
                  href={user.githubUrl.startsWith('http') ? user.githubUrl : `https://${user.githubUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-white hover:bg-[#f8f9fa] text-[#3c4043] border border-[#dadce0] transition-colors"
                >
                  <Globe className="w-3 h-3 text-[#5f6368]" />
                  <span>GitHub</span>
                </a>
              )}
              {user.linkedinUrl && (
                <a
                  href={user.linkedinUrl.startsWith('http') ? user.linkedinUrl : `https://${user.linkedinUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full bg-white hover:bg-[#f8f9fa] text-[#0a66c2] border border-[#dadce0] transition-colors"
                >
                  <Link className="w-3 h-3 text-[#0a66c2]" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            onClick={openEditModal}
            className="flex-1 md:flex-initial px-4 py-2 rounded-full border border-[#dadce0] hover:bg-[#f8f9fa] text-[#3c4043] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>Edit profile</span>
          </button>

          <button
            onClick={handleShare}
            className="flex-1 md:flex-initial px-5 py-2 rounded-full bg-[#1a73e8] hover:bg-[#1557d0] text-white text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share profile'}</span>
          </button>
        </div>
      </div>

      {/* Student Academic Details Overview */}
      <div className="bg-white rounded-xl border border-[#dadce0] shadow-xs p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#1a73e8]" />
            <h2 className="text-base font-medium text-[#202124]">Academic Details</h2>
          </div>
          <button
            onClick={openEditModal}
            className="text-xs font-medium text-[#1a73e8] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Edit3 className="w-3 h-3" />
            <span>Update Details</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3.5 rounded-xl border border-[#dadce0] bg-[#f8f9fa] flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-[#1a73e8] border border-[#dadce0] flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-[#5f6368] font-medium uppercase tracking-wider">Department / Branch</div>
              <div className="text-xs font-medium text-[#202124] mt-0.5">
                {user.department || 'Not specified'}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#dadce0] bg-[#f8f9fa] flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-[#1a73e8] border border-[#dadce0] flex items-center justify-center shrink-0 mt-0.5">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-[#5f6368] font-medium uppercase tracking-wider">College / University</div>
              <div className="text-xs font-medium text-[#202124] mt-0.5">
                {user.college || 'Not specified'}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#dadce0] bg-[#f8f9fa] flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-[#1a73e8] border border-[#dadce0] flex items-center justify-center shrink-0 mt-0.5">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-[#5f6368] font-medium uppercase tracking-wider">Current Academic Year</div>
              <div className="text-xs font-medium text-[#202124] mt-0.5">
                {user.currentYear || 'Not specified'}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#dadce0] bg-[#f8f9fa] flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-[#1a73e8] border border-[#dadce0] flex items-center justify-center shrink-0 mt-0.5">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-[#5f6368] font-medium uppercase tracking-wider">Roll Number / Student ID</div>
              <div className="text-xs font-medium text-[#202124] mt-0.5">
                {user.rollNumber || 'Not specified'}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#dadce0] bg-[#f8f9fa] flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-[#137333] border border-[#dadce0] flex items-center justify-center shrink-0 mt-0.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-[#5f6368] font-medium uppercase tracking-wider">CGPA / Percentage</div>
              <div className="text-xs font-medium text-[#202124] mt-0.5">
                {user.cgpa ? `${user.cgpa}` : 'Not specified'}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-[#dadce0] bg-[#f8f9fa] flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-white text-[#e37400] border border-[#dadce0] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-[#5f6368] font-medium uppercase tracking-wider">Graduation Batch</div>
              <div className="text-xs font-medium text-[#202124] mt-0.5">
                {user.graduationYear ? `Class of ${user.graduationYear}` : 'Not specified'}
              </div>
            </div>
          </div>
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

        {/* Verified Skills Pills */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-[#dadce0] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-medium text-[#202124]">Verified Skills</h2>
                <p className="text-xs text-[#5f6368]">Validated via SkillX practical assessments & automated rubrics</p>
              </div>
              <button
                onClick={() => setActiveView('challenges')}
                className="text-xs font-medium text-[#1a73e8] hover:underline cursor-pointer"
              >
                + Verify more
              </button>
            </div>

            {user.verifiedSkills.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#5f6368] bg-[#f8f9fa] rounded-xl border border-[#dadce0]">
                <p>No skills verified yet.</p>
                <button
                  onClick={() => setActiveView('challenges')}
                  className="mt-2 text-[#1a73e8] font-medium hover:underline cursor-pointer"
                >
                  Take a skill challenge to get verified
                </button>
              </div>
            ) : (
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
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#f1f3f4] flex items-center justify-between text-xs text-[#5f6368]">
            <span>Verification badge ID: #SKX-2026-{user.name ? user.name.slice(0, 3).toUpperCase() : 'STU'}</span>
            <button
              onClick={() => alert('Certificate PDF generated for verified skills!')}
              className="text-[#1a73e8] font-medium hover:underline cursor-pointer"
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
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
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
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
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
            className={`pb-3 border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
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

      {/* ================= EDIT PROFILE POP-UP MODAL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-2xl rounded-2xl border border-[#dadce0] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#dadce0] flex items-center justify-between bg-[#f8f9fa] shrink-0">
              <div>
                <h3 id="edit-profile-title" className="text-base sm:text-lg font-medium text-[#202124] flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-[#1a73e8]" />
                  <span>Edit Student Profile</span>
                </h3>
                <p className="text-xs text-[#5f6368] mt-0.5">
                  Update your personal, academic, and contact details
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-full text-[#5f6368] hover:text-[#202124] hover:bg-[#e8eaed] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body (Scrollable) */}
            <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Photo Upload Section */}
              <div className="bg-[#f8f9fa] p-4 rounded-xl border border-[#dadce0]">
                <label className="block text-xs font-medium text-[#202124] mb-2.5">
                  Profile Photo
                </label>
                <div className="flex items-center gap-4">
                  {formData.avatar ? (
                    <img
                      src={formData.avatar}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-[#dadce0] shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1a73e8] to-[#1557d0] text-white flex items-center justify-center text-xl font-medium ring-2 ring-[#dadce0] shrink-0">
                      {formData.name ? formData.name.trim().charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="hidden"
                      id="profile-photo-upload"
                    />
                    <div className="flex flex-wrap gap-2">
                      <label
                        htmlFor="profile-photo-upload"
                        className="px-3.5 py-1.5 rounded-lg bg-white border border-[#dadce0] hover:bg-[#f1f3f4] text-[#3c4043] text-xs font-medium cursor-pointer flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Camera className="w-3.5 h-3.5 text-[#1a73e8]" />
                        <span>Upload photo</span>
                      </label>
                      {formData.avatar && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="px-3.5 py-1.5 rounded-lg bg-white border border-[#dadce0] hover:bg-[#fce8e6] hover:text-[#d93025] hover:border-[#f5c6cb] text-[#5f6368] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-[#5f6368]">
                      Supports PNG, JPG, JPEG or WebP from your device. If omitted, first letter initial is used.
                    </p>
                  </div>
                </div>
              </div>

              {/* Personal & Academic Details Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#202124] mb-1.5">
                    Full Name <span className="text-[#d93025]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124]"
                  />
                </div>

                {/* Department / Branch */}
                <div>
                  <label className="block text-xs font-medium text-[#202124] mb-1.5">
                    Department / Branch <span className="text-[#d93025]">*</span>
                  </label>
                  <input
                    type="text"
                    list="department-suggestions"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Computer Science and Engineering"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124]"
                  />
                  <datalist id="department-suggestions">
                    <option value="Computer Science and Engineering" />
                    <option value="Information Technology" />
                    <option value="Artificial Intelligence & Data Science" />
                    <option value="Electronics & Communication Engineering" />
                    <option value="Electrical & Electronics Engineering" />
                    <option value="Mechanical Engineering" />
                    <option value="Civil Engineering" />
                    <option value="Cybersecurity & Forensics" />
                  </datalist>
                </div>

                {/* College / University */}
                <div>
                  <label className="block text-xs font-medium text-[#202124] mb-1.5">
                    College / University <span className="text-[#d93025]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    placeholder="e.g. National Institute of Technology"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124]"
                  />
                </div>

                {/* Current Year */}
                <div>
                  <label className="block text-xs font-medium text-[#202124] mb-1.5">
                    Current Academic Year <span className="text-[#d93025]">*</span>
                  </label>
                  <select
                    value={formData.currentYear}
                    onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124]"
                  >
                    <option value="">Select current year</option>
                    <option value="1st Year">1st Year (Freshman)</option>
                    <option value="2nd Year">2nd Year (Sophomore)</option>
                    <option value="3rd Year">3rd Year (Junior)</option>
                    <option value="4th Year (Final Year)">4th Year (Final Year)</option>
                    <option value="Postgraduate / Masters">Postgraduate / Masters</option>
                    <option value="Recent Graduate">Recent Graduate</option>
                  </select>
                </div>

                {/* Roll Number / Student ID */}
                <div>
                  <label className="block text-xs font-medium text-[#202124] mb-1.5">
                    Roll Number / Student ID
                  </label>
                  <input
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    placeholder="e.g. 21CS049"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124]"
                  />
                </div>

                {/* CGPA / Percentage */}
                <div>
                  <label className="block text-xs font-medium text-[#202124] mb-1.5">
                    CGPA / Percentage
                  </label>
                  <input
                    type="text"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    placeholder="e.g. 8.75 / 10 or 85%"
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124]"
                  />
                </div>

                {/* Graduation Year */}
                <div>
                  <label className="block text-xs font-medium text-[#202124] mb-1.5">
                    Expected Graduation Year
                  </label>
                  <select
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124]"
                  >
                    <option value="">Select graduation year</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                    <option value="2027">2027</option>
                    <option value="2028">2028</option>
                    <option value="2029">2029</option>
                  </select>
                </div>

                {/* Bio / Career Objective */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#202124] mb-1.5">
                    Bio / Career Objective
                  </label>
                  <textarea
                    rows={2}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Brief summary about your interests, technical focus, or student background..."
                    className="w-full px-3.5 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124] resize-none"
                  />
                </div>

                {/* GitHub Profile */}
                <div>
                  <label className="block text-xs font-medium text-[#202124] mb-1.5">
                    GitHub Profile Link
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-[#5f6368] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                      placeholder="github.com/username"
                      className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124]"
                    />
                  </div>
                </div>

                {/* LinkedIn Profile */}
                <div>
                  <label className="block text-xs font-medium text-[#202124] mb-1.5">
                    LinkedIn Profile Link
                  </label>
                  <div className="relative">
                    <Link className="w-4 h-4 text-[#5f6368] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={formData.linkedinUrl}
                      onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                      placeholder="linkedin.com/in/username"
                      className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-white rounded-lg border border-[#dadce0] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 focus:outline-none transition-all text-[#202124]"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-[#dadce0] flex items-center justify-end gap-3 sticky bottom-0 bg-white">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-full border border-[#dadce0] hover:bg-[#f1f3f4] text-[#3c4043] text-xs font-medium transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2 rounded-full bg-[#1a73e8] hover:bg-[#1557d0] text-white text-xs font-medium transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
