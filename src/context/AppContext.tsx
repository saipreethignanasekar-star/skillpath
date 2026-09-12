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
  login: (email: string) => void;
  signup: (userData: Partial<UserProfile>) => void;
  logout: () => void;
  uploadResumeSimulated: (fileName: string) => Promise<void>;
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
  const [cohortStudents] = useState<StudentCohortMetric[]>(defaultCohortStudents);
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

  // Switch role and dynamically update required skills and gaps
  const setTargetRole = (role: CareerRole) => {
    setTargetRoleState(role);
    setUser(prev => ({
      ...prev,
      targetRole: role,
      careerReadiness: role === 'Cloud Engineer' ? 68 : role === 'DevOps Engineer' ? 72 : 60
    }));

    // Adjust skill requirement profiles
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
  };

  const login = (email: string) => {
    setIsLoggedIn(true);
    setUser(prev => ({ ...prev, email: email || prev.email }));
    setActiveView('dashboard');
  };

  const signup = (userData: Partial<UserProfile>) => {
    setIsLoggedIn(true);
    setUser(prev => ({
      ...prev,
      ...userData,
      careerReadiness: 45
    }));
    setActiveView('onboarding');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setActiveView('login');
  };

  const uploadResumeSimulated = async (fileName: string) => {
    setIsAnalyzingResume(true);
    setResumeScanStep(1); // Reading resume

    await new Promise(r => setTimeout(r, 700));
    setResumeScanStep(2); // Identifying skills

    await new Promise(r => setTimeout(r, 700));
    setResumeScanStep(3); // Finding projects

    await new Promise(r => setTimeout(r, 700));
    setResumeScanStep(4); // Mapping career requirements

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

  const completeRoadmapModule = (phaseId: string, moduleId: string) => {
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

  const submitChallengeCode = (code: string) => {
    setChallenge(prev => ({ ...prev, initialCode: code, completed: true }));
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

  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);

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

  const applyForJob = (jobId: string) => {
    if (!appliedJobIds.includes(jobId)) {
      setAppliedJobIds(prev => [...prev, jobId]);
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
