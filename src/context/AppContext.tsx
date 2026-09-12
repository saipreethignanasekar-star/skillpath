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
        { id: `act_${Date.now()}`, title: `Resume analyzed: ${fileName}`, timeAgo: 'Just now', type: 'resume' },
        ...prev.recentActivity
      ]
    }));

    // Update skills based on uploaded resume
    setSkills(prev =>
      prev.map(s => {
        const isMatched = newSkills.some(d => d.toLowerCase() === s.name.toLowerCase());
        if (isMatched) {
          const boostedScore = Math.max(s.userScore, 75);
          const gap = boostedScore - s.requiredScore;
          const status: SkillItem['status'] = gap >= 0 ? 'Strong' : gap >= -25 ? 'Needs Practice' : 'Critical';
          return {
            ...s,
            userScore: boostedScore,
            fromResume: true,
            gap,
            status
          };
        }
        return s;
      })
    );

    triggerConfetti();
  };

  const uploadResumeFile = async (file: File) => {
    setIsAnalyzingResume(true);
    setResumeScanStep(1); // Reading resume structure and binary

    // Read file text content if plain text or attempt decoding
    let extractedText = '';
    try {
      if (file.type.includes('text') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        extractedText = await file.text();
      } else {
        // Read raw buffer slice to catch plaintext strings in PDFs or documents
        const buffer = await file.arrayBuffer();
        const decoder = new TextDecoder('utf-8', { fatal: false });
        extractedText = decoder.decode(buffer.slice(0, 100000));
      }
    } catch {
      extractedText = '';
    }

    await new Promise(r => setTimeout(r, 600));
    setResumeScanStep(2); // Identifying technical proficiencies

    // Match against real skills catalogue
    const knownSkillsList = [
      'Python', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express',
      'HTML', 'CSS', 'Tailwind', 'MongoDB', 'PostgreSQL', 'MySQL', 'SQL',
      'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Linux', 'Git',
      'CI/CD', 'GitHub Actions', 'Terraform', 'GraphQL', 'REST API',
      'Next.js', 'Vue', 'Django', 'Flask', 'FastAPI', 'Java', 'C++',
      'Go', 'Rust', 'Redis', 'Kafka', 'Ansible', 'Bash', 'Figma'
    ];

    const detectedFromContent: string[] = [];
    if (extractedText) {
      const lowerText = extractedText.toLowerCase();
      knownSkillsList.forEach(s => {
        // Match word boundaries or substring
        const regex = new RegExp(`\\b${s.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (regex.test(lowerText) && !detectedFromContent.includes(s)) {
          detectedFromContent.push(s);
        }
      });
    }

    await new Promise(r => setTimeout(r, 700));
    setResumeScanStep(3); // Extracting projects and practical experience

    // Default or merge with detected
    const finalDetected = detectedFromContent.length >= 3
      ? detectedFromContent
      : Array.from(new Set([
          ...detectedFromContent,
          'React', 'TypeScript', 'Node.js', 'Docker', 'AWS', 'Git', 'Linux', 'REST API'
        ]));

    await new Promise(r => setTimeout(r, 600));
    setResumeScanStep(4); // Mapping career requirements to target role

    await new Promise(r => setTimeout(r, 600));
    setIsAnalyzingResume(false);

    setUser(prev => ({
      ...prev,
      resumeUploaded: true,
      resumeFileName: file.name,
      detectedSkills: finalDetected,
      recentActivity: [
        { id: `act_${Date.now()}`, title: `Uploaded local resume: ${file.name}`, timeAgo: 'Just now', type: 'resume' },
        ...prev.recentActivity
      ]
    }));

    // Dynamically update skills tracker based on uploaded resume skills
    setSkills(prev => {
      const updated = prev.map(s => {
        const isMatched = finalDetected.some(d => d.toLowerCase() === s.name.toLowerCase());
        if (isMatched) {
          const newScore = Math.max(s.userScore, 75);
          const gap = newScore - s.requiredScore;
          const status: SkillItem['status'] = gap >= 0 ? 'Strong' : gap >= -25 ? 'Needs Practice' : 'Critical';
          return {
            ...s,
            userScore: newScore,
            fromResume: true,
            gap,
            status
          };
        }
        return s;
      });

      // Also add newly detected skills if not already tracked
      const existingNames = new Set(updated.map(s => s.name.toLowerCase()));
      const extraSkills: SkillItem[] = [];

      finalDetected.forEach(skillName => {
        if (!existingNames.has(skillName.toLowerCase())) {
          extraSkills.push({
            id: `sk_custom_${skillName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
            name: skillName,
            category: 'Languages',
            userScore: 75,
            requiredScore: 70,
            gap: 5,
            status: 'Strong',
            verified: false,
            fromResume: true,
            fromRoadmap: false
          });
        }
      });

      return [...updated, ...extraSkills];
    });

    triggerConfetti();
  };

  const completeRoadmapModule = (phaseId: string, moduleId: string) => {
    let completedModuleTitle = '';

    setRoadmapPhases(prev =>
      prev.map(phase => {
        if (phase.id !== phaseId) return phase;
        const updatedMods = phase.modules.map(mod => {
          if (mod.id === moduleId) {
            completedModuleTitle = mod.title;
            return { ...mod, completed: true };
          }
          return mod;
        });
        const allCompleted = updatedMods.every(m => m.completed);
        return {
          ...phase,
          status: allCompleted ? 'completed' : 'in_progress',
          modules: updatedMods
        };
      })
    );

    // Map module keywords to relevant skills and level them up
    const lowerMod = completedModuleTitle.toLowerCase();
    setSkills(prev =>
      prev.map(skill => {
        const skillLower = skill.name.toLowerCase();
        const isTargetSkill =
          (skillLower === 'linux' && (lowerMod.includes('linux') || lowerMod.includes('bash') || lowerMod.includes('foundation'))) ||
          (skillLower === 'aws' && (lowerMod.includes('aws') || lowerMod.includes('cloud') || lowerMod.includes('s3') || lowerMod.includes('iam') || lowerMod.includes('vpc'))) ||
          (skillLower === 'docker' && (lowerMod.includes('docker') || lowerMod.includes('container'))) ||
          (skillLower === 'kubernetes' && (lowerMod.includes('kubernetes') || lowerMod.includes('k8s'))) ||
          (skillLower === 'terraform' && (lowerMod.includes('terraform') || lowerMod.includes('infrastructure'))) ||
          (skillLower === 'git' && (lowerMod.includes('git') || lowerMod.includes('ci/cd') || lowerMod.includes('actions'))) ||
          lowerMod.includes(skillLower);

        if (isTargetSkill) {
          const newScore = Math.min(100, skill.userScore + 18);
          const gap = newScore - skill.requiredScore;
          const status: SkillItem['status'] = gap >= 0 ? 'Strong' : gap >= -25 ? 'Needs Practice' : 'Critical';
          return {
            ...skill,
            userScore: newScore,
            fromRoadmap: true,
            gap,
            status
          };
        }
        return skill;
      })
    );

    setUser(prev => ({
      ...prev,
      careerReadiness: Math.min(100, prev.careerReadiness + 4),
      readinessChange: '+16% this month',
      recentActivity: [
        { id: `act_${Date.now()}`, title: `Completed roadmap module: ${completedModuleTitle}`, timeAgo: 'Just now', type: 'roadmap' },
        ...prev.recentActivity
      ]
    }));

    triggerConfetti();
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
