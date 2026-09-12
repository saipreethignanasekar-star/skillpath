import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import type {
  UserProfile,
  SkillItem,
  RoadmapPhase,
  ChallengeItem,
  ChallengeEvaluation,
  JobItem,
  ChatMessage,
  ChatActionCard,
  StudentCohortMetric,
  CareerRole,
  ActiveView
} from '../types';
import {
  initialProfile,
  defaultSkills,
  defaultRoadmapPhases,
  defaultChallenge,
  defaultEvaluation,
  initialChatMessages,
  defaultJobs,
  defaultCohortStudents
} from '../data/mockData';

import { authService } from '../services/authService';
import { userService } from '../services/userService';
import { skillService } from '../services/skillService';
import { roadmapService } from '../services/roadmapService';
import { resumeService } from '../services/resumeService';
import { challengeService } from '../services/challengeService';
import { jobService } from '../services/jobService';
import { aiService } from '../services/aiService';
import { initSocket, disconnectSocket } from '../services/socketService';

interface AppContextType {
  user: UserProfile;
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  skills: SkillItem[];
  targetRole: CareerRole;
  setTargetRole: (role: CareerRole) => void;
  roadmapPhases: RoadmapPhase[];
  challenge: ChallengeItem;
  evaluation: ChallengeEvaluation;
  chatMessages: ChatMessage[];
  jobs: JobItem[];
  cohortStudents: StudentCohortMetric[];
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isLoggedIn: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (userData: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  uploadResumeSimulated: (fileName: string) => Promise<void>;
  uploadResumeFile: (file: File) => Promise<void>;
  isAnalyzingResume: boolean;
  resumeScanStep: number;
  completeRoadmapModule: (phaseId: string, moduleId: string) => void;
  submitChallengeCode: (code: string) => void;
  addVerifiedSkillFromEvaluation: () => void;
  sendChatMessage: (text: string) => void;
  applyForJob: (jobId: string) => void;
  appliedJobIds: string[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [user, setUser] = useState<UserProfile>(initialProfile);
  const [targetRole, setTargetRoleState] = useState<CareerRole>('Cloud Engineer');
  const [skills, setSkills] = useState<SkillItem[]>(defaultSkills);
  const [roadmapPhases, setRoadmapPhases] = useState<RoadmapPhase[]>(defaultRoadmapPhases);
  const [challenge, setChallenge] = useState<ChallengeItem>(defaultChallenge);
  const [evaluation, setEvaluation] = useState<ChallengeEvaluation>(defaultEvaluation);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [jobs, setJobs] = useState<JobItem[]>(defaultJobs);
  const [cohortStudents, setCohortStudents] = useState<StudentCohortMetric[]>(defaultCohortStudents);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>([]);

  const [isAnalyzingResume, setIsAnalyzingResume] = useState<boolean>(false);
  const [resumeScanStep, setResumeScanStep] = useState<number>(0);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Check authentication & load initial data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const authData = await authService.me();
        if (authData.success && authData.user) {
          setUser(authData.user);
          setIsLoggedIn(true);
          setTargetRoleState(authData.user.targetRole || 'Cloud Engineer');

          // Initialize Socket.IO connection
          const socket = initSocket(authData.user.id);
          socket.on('student.skill.updated', () => {
            fetchUserSkills();
          });
          socket.on('student.readiness.updated', (data: any) => {
            setUser(prev => ({ ...prev, careerReadiness: data.careerReadiness }));
          });

          // Load user skills, roadmap, jobs, cohort
          await Promise.all([
            fetchUserSkills(),
            fetchUserRoadmap(),
            fetchJobs(),
            fetchCohortStudents(),
            fetchChatMessages()
          ]);
        }
      } catch (err) {
        console.warn('[AppContext] Connecting with local state mode:', err);
      }
    };

    loadUserData();

    return () => {
      disconnectSocket();
    };
  }, []);

  const fetchUserSkills = async () => {
    try {
      const res = await skillService.getSkills();
      if (res.success && res.skills.length > 0) {
        setSkills(res.skills);
      }
    } catch (e) {
      console.warn('Skills fetch fallback to local defaults');
    }
  };

  const fetchUserRoadmap = async () => {
    try {
      const res = await roadmapService.getRoadmap();
      if (res.success && res.roadmap && res.roadmap.phases) {
        setRoadmapPhases(res.roadmap.phases);
      }
    } catch (e) {
      console.warn('Roadmap fetch fallback to local defaults');
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await jobService.getJobs();
      if (res.success && res.jobs.length > 0) {
        setJobs(res.jobs);
      }
    } catch (e) {
      console.warn('Jobs fetch fallback to local defaults');
    }
  };

  const fetchCohortStudents = async () => {
    try {
      const res = await userService.getCohortStudents();
      if (res.success && res.students && res.students.length > 0) {
        const cohortData: StudentCohortMetric[] = res.students.map((s: any) => ({
          id: s._id || s.id,
          name: s.name,
          avatar: s.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
          targetRole: s.targetRole || 'Cloud Engineer',
          readiness: s.careerReadiness || 68,
          verifiedSkillsCount: (s.verifiedSkills || []).length,
          lastActivity: 'Just now',
          status: s.status || 'On Track'
        }));
        setCohortStudents(cohortData);
      }
    } catch (e) {
      console.warn('Cohort fetch fallback to local defaults');
    }
  };

  const fetchChatMessages = async () => {
    try {
      const res = await aiService.getMessages();
      if (res.success && res.messages.length > 0) {
        setChatMessages(res.messages);
      }
    } catch (e) {
      console.warn('Chat fetch fallback to local defaults');
    }
  };

  // Switch target career role
  const setTargetRole = async (role: CareerRole) => {
    setTargetRoleState(role);
    setUser(prev => ({
      ...prev,
      targetRole: role,
      careerReadiness: role === 'Cloud Engineer' ? 68 : role === 'DevOps Engineer' ? 72 : 60
    }));

    try {
      const res = await userService.setTargetRole(role);
      if (res.success && res.skills) {
        setSkills(res.skills);
      }
    } catch (e) {
      // Local adjustment fallback
      setSkills(prev =>
        prev.map(skill => {
          let req = skill.requiredScore;
          if (role === 'Cloud Engineer') {
            if (skill.name === 'AWS') req = 90;
            if (skill.name === 'Kubernetes') req = 80;
            if (skill.name === 'Docker') req = 80;
            if (skill.name === 'Linux') req = 75;
            if (skill.name === 'Terraform') req = 70;
          } else if (role === 'DevOps Engineer') {
            if (skill.name === 'Kubernetes') req = 95;
            if (skill.name === 'Docker') req = 90;
            if (skill.name === 'Linux') req = 85;
            if (skill.name === 'AWS') req = 75;
          } else if (role === 'Full Stack Developer') {
            if (skill.name === 'Python') req = 85;
            if (skill.name === 'Git') req = 85;
            if (skill.name === 'Docker') req = 60;
          }
          const gap = skill.userScore - req;
          const status = gap >= 0 ? 'Strong' : gap >= -25 ? 'Needs Practice' : 'Critical';
          return { ...skill, requiredScore: req, gap, status };
        })
      );
    }
  };

  const login = async (email: string, password?: string) => {
    try {
      const res = await authService.login(email, password);
      if (res.success && res.user) {
        setIsLoggedIn(true);
        setUser(res.user);
        initSocket(res.user.id);
        setActiveView(res.user.role === 'admin' ? 'admin-overview' : 'dashboard');
        await Promise.all([fetchUserSkills(), fetchUserRoadmap(), fetchJobs()]);
        return;
      }
    } catch (e) {
      console.warn('Backend login fallback to local state:', e);
    }

    setIsLoggedIn(true);
    setUser(prev => ({ ...prev, email: email || prev.email }));
    setActiveView('dashboard');
  };

  const signup = async (userData: Partial<UserProfile>) => {
    try {
      const res = await authService.signup(userData);
      if (res.success && res.user) {
        setIsLoggedIn(true);
        setUser(res.user);
        initSocket(res.user.id);
        setActiveView('onboarding');
        return;
      }
    } catch (e) {
      console.warn('Backend signup fallback to local state:', e);
    }

    setIsLoggedIn(true);
    setUser(prev => ({
      ...prev,
      ...userData,
      careerReadiness: 45
    }));
    setActiveView('onboarding');
  };

  const logout = () => {
    authService.logout();
    disconnectSocket();
    setIsLoggedIn(false);
    setActiveView('login');
  };

  const uploadResumeFile = async (file: File) => {
    setIsAnalyzingResume(true);
    setResumeScanStep(1);

    await new Promise(r => setTimeout(r, 600));
    setResumeScanStep(2);

    await new Promise(r => setTimeout(r, 600));
    setResumeScanStep(3);

    try {
      const res = await resumeService.uploadResumeFile(file);
      setResumeScanStep(4);
      await new Promise(r => setTimeout(r, 600));

      if (res.success && res.user) {
        setUser(res.user);
      }
    } catch (e) {
      console.warn('Resume API fallback:', e);
      await uploadResumeSimulated(file.name);
    } finally {
      setIsAnalyzingResume(false);
      triggerConfetti();
    }
  };

  const uploadResumeSimulated = async (fileName: string) => {
    setIsAnalyzingResume(true);
    setResumeScanStep(1);

    await new Promise(r => setTimeout(r, 700));
    setResumeScanStep(2);

    await new Promise(r => setTimeout(r, 700));
    setResumeScanStep(3);

    await new Promise(r => setTimeout(r, 700));
    setResumeScanStep(4);

    await new Promise(r => setTimeout(r, 700));
    setIsAnalyzingResume(false);

    const newSkills = ['Python', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'Docker', 'AWS', 'Linux', 'Express'];
    setUser(prev => ({
      ...prev,
      resumeUploaded: true,
      resumeFileName: fileName,
      detectedSkills: newSkills,
      recentActivity: [
        { id: `act_${Date.now()}`, title: 'Resume analyzed with AI', timeAgo: 'Just now', type: 'resume' },
        ...prev.recentActivity
      ]
    }));
    triggerConfetti();
  };

  const completeRoadmapModule = async (phaseId: string, moduleId: string) => {
    try {
      const res = await roadmapService.completeModule(phaseId, moduleId);
      if (res.success && res.roadmap) {
        setRoadmapPhases(res.roadmap.phases);
        if (res.user) setUser(res.user);
        return;
      }
    } catch (e) {
      console.warn('Complete module API fallback:', e);
    }

    setRoadmapPhases(prev =>
      prev.map(phase => {
        if (phase.id !== phaseId) return phase;
        const updatedMods = phase.modules.map(mod =>
          mod.id === moduleId ? { ...mod, completed: true } : mod
        );
        const allCompleted = updatedMods.every(m => m.completed);
        return {
          ...phase,
          status: allCompleted ? 'completed' : 'in_progress',
          modules: updatedMods
        };
      })
    );

    setUser(prev => ({
      ...prev,
      careerReadiness: Math.min(100, prev.careerReadiness + 3)
    }));
  };

  const submitChallengeCode = async (code: string) => {
    setChallenge(prev => ({ ...prev, initialCode: code, completed: true }));

    try {
      const res = await challengeService.submitCode(challenge.id, code);
      if (res.success && res.evaluation) {
        setEvaluation(res.evaluation);
        if (res.user) setUser(res.user);
        setActiveView('ai-evaluation');
        return;
      }
    } catch (e) {
      console.warn('Challenge submit API fallback:', e);
    }

    setActiveView('ai-evaluation');
  };

  const addVerifiedSkillFromEvaluation = () => {
    const skillName = evaluation.verifiedSkillName;
    if (!user.verifiedSkills.includes(skillName)) {
      setUser(prev => ({
        ...prev,
        verifiedSkills: [...prev.verifiedSkills, skillName],
        careerReadiness: Math.min(100, prev.careerReadiness + 8),
        readinessChange: '+18% this month',
        recentActivity: [
          { id: `act_${Date.now()}`, title: `${skillName} skill verified with score 86%`, timeAgo: 'Just now', type: 'skill' },
          ...prev.recentActivity
        ]
      }));
    }

    setSkills(prev =>
      prev.map(s => (s.name === skillName ? { ...s, verified: true, userScore: 80, gap: 0, status: 'Strong' } : s))
    );

    triggerConfetti();
    setActiveView('dashboard');
  };

  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

    try {
      const res = await aiService.sendMessage(text);
      if (res.success && res.aiMessage) {
        setChatMessages(prev => {
          // Replace user message with backend response if formatted
          const filtered = prev.filter(m => m.id !== userMsg.id);
          return [...filtered, res.userMessage, res.aiMessage];
        });
        return;
      }
    } catch (e) {
      console.warn('AI chat API fallback:', e);
    }

    setTimeout(() => {
      let reply = "I'm analyzing your skill trajectory. Focusing on practical hands-on challenges and foundational architecture will boost your readiness score quickly!";
      let card: ChatActionCard | undefined;

      const lower = text.toLowerCase();
      if (lower.includes('next') || lower.includes('learn') || lower.includes('gap')) {
        reply = "Based on your current profile, I recommend learning AWS EC2 and IAM next. These represent your highest-impact skill gaps for your Cloud Engineer goal.";
        card = {
          title: 'Recommended next steps:',
          items: ['1. AWS EC2 & S3 Basics', '2. AWS IAM Least-Privilege Policies', '3. AWS VPC Network Architecture'],
          primaryButtonText: 'Start AWS Roadmap',
          primaryAction: 'roadmap',
          secondaryButtonText: 'Take AWS Challenge',
          secondaryAction: 'challenge'
        };
      } else if (lower.includes('docker') || lower.includes('container')) {
        reply = "Your Docker challenge score was an impressive 86%! The next milestone is orchestrating these containers with Kubernetes.";
        card = {
          title: 'Ready for the next challenge?',
          items: ['Kubernetes Pod Deployment Challenge', 'Write Kubernetes manifests and service exposure'],
          primaryButtonText: 'View Challenge',
          primaryAction: 'challenge'
        };
      } else if (lower.includes('job') || lower.includes('intern') || lower.includes('hire')) {
        reply = "You currently have an 82% match for Cloud Engineer Intern positions! Improving your Kubernetes score to 50% will increase that match to 94%.";
        card = {
          title: 'Matching Opportunities:',
          items: ['TechCorp - Cloud Engineer Intern (82% match)', 'InnoTech - DevOps Engineer Intern (75% match)'],
          primaryButtonText: 'View Matched Jobs',
          primaryAction: 'jobs'
        };
      }

      const aiMsg: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        card
      };
      setChatMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  const applyForJob = async (jobId: string) => {
    if (!appliedJobIds.includes(jobId)) {
      setAppliedJobIds(prev => [...prev, jobId]);

      try {
        await jobService.applyForJob(jobId);
      } catch (e) {
        console.warn('Job apply API fallback:', e);
      }

      triggerConfetti();
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        activeView,
        setActiveView,
        skills,
        targetRole,
        setTargetRole,
        roadmapPhases,
        challenge,
        evaluation,
        chatMessages,
        jobs,
        cohortStudents,
        mobileMenuOpen,
        setMobileMenuOpen,
        isLoggedIn,
        login,
        signup,
        logout,
        uploadResumeSimulated,
        uploadResumeFile,
        isAnalyzingResume,
        resumeScanStep,
        completeRoadmapModule,
        submitChallengeCode,
        addVerifiedSkillFromEvaluation,
        sendChatMessage,
        applyForJob,
        appliedJobIds
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
