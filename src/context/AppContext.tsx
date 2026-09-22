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
  PredefinedCareerRole,
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
  updateUserProfile: (updated: Partial<UserProfile>) => void;
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
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const ROLE_SKILL_TEMPLATES: Record<PredefinedCareerRole, { name: string; category: SkillItem['category']; requiredScore: number }[]> = {
  'Cloud Engineer': [
    { name: 'Linux', category: 'Foundation', requiredScore: 75 },
    { name: 'AWS', category: 'Cloud', requiredScore: 90 },
    { name: 'Docker', category: 'DevOps', requiredScore: 80 },
    { name: 'Kubernetes', category: 'DevOps', requiredScore: 80 },
    { name: 'Git', category: 'Tooling', requiredScore: 70 },
    { name: 'Terraform', category: 'Tooling', requiredScore: 70 },
    { name: 'Python', category: 'Languages', requiredScore: 70 }
  ],
  'DevOps Engineer': [
    { name: 'Linux', category: 'Foundation', requiredScore: 85 },
    { name: 'Docker', category: 'DevOps', requiredScore: 90 },
    { name: 'Kubernetes', category: 'DevOps', requiredScore: 95 },
    { name: 'CI/CD', category: 'DevOps', requiredScore: 90 },
    { name: 'Git', category: 'Tooling', requiredScore: 80 },
    { name: 'Terraform', category: 'Tooling', requiredScore: 80 },
    { name: 'Python', category: 'Languages', requiredScore: 75 }
  ],
  'Full Stack Developer': [
    { name: 'JavaScript', category: 'Languages', requiredScore: 90 },
    { name: 'React', category: 'Foundation', requiredScore: 90 },
    { name: 'Node.js', category: 'Foundation', requiredScore: 85 },
    { name: 'HTML/CSS', category: 'Foundation', requiredScore: 85 },
    { name: 'Git', category: 'Tooling', requiredScore: 80 },
    { name: 'PostgreSQL', category: 'Tooling', requiredScore: 80 },
    { name: 'REST API', category: 'Tooling', requiredScore: 85 }
  ],
  'Data Analyst': [
    { name: 'SQL', category: 'Foundation', requiredScore: 90 },
    { name: 'Python', category: 'Languages', requiredScore: 85 },
    { name: 'Excel', category: 'Tooling', requiredScore: 85 },
    { name: 'Tableau', category: 'Tooling', requiredScore: 80 },
    { name: 'Statistics', category: 'Foundation', requiredScore: 75 },
    { name: 'Pandas', category: 'Tooling', requiredScore: 80 }
  ],
  'AI/ML Engineer': [
    { name: 'Python', category: 'Languages', requiredScore: 95 },
    { name: 'PyTorch', category: 'Tooling', requiredScore: 90 },
    { name: 'Scikit-Learn', category: 'Tooling', requiredScore: 85 },
    { name: 'Mathematics', category: 'Foundation', requiredScore: 85 },
    { name: 'Machine Learning', category: 'Foundation', requiredScore: 90 },
    { name: 'Docker', category: 'DevOps', requiredScore: 75 }
  ],
  'Cybersecurity Engineer': [
    { name: 'Networking', category: 'Foundation', requiredScore: 90 },
    { name: 'Linux', category: 'Foundation', requiredScore: 85 },
    { name: 'Security Architecture', category: 'Foundation', requiredScore: 85 },
    { name: 'Penetration Testing', category: 'Tooling', requiredScore: 80 },
    { name: 'Python', category: 'Languages', requiredScore: 75 },
    { name: 'Cryptography', category: 'Tooling', requiredScore: 75 }
  ],
  'Software Developer': [
    { name: 'Data Structures', category: 'Foundation', requiredScore: 90 },
    { name: 'Java', category: 'Languages', requiredScore: 85 },
    { name: 'System Design', category: 'Foundation', requiredScore: 80 },
    { name: 'Git', category: 'Tooling', requiredScore: 85 },
    { name: 'SQL', category: 'Tooling', requiredScore: 75 },
    { name: 'Python', category: 'Languages', requiredScore: 80 }
  ]
};

export const ROLE_ROADMAP_TEMPLATES: Record<PredefinedCareerRole, RoadmapPhase[]> = {
  'Cloud Engineer': [
    {
      id: 'ph_1',
      number: 1,
      title: 'Phase 1 - Systems & Networking Foundation',
      duration: '2 weeks',
      status: 'in_progress',
      modules: [
        { id: 'mod_1', title: 'Linux Fundamentals & CLI', completed: false, duration: '4 days', description: 'Permissions, process control, file systems & shell scripting' },
        { id: 'mod_2', title: 'Networking Fundamentals', completed: false, duration: '6 days', description: 'TCP/IP, OSI Model, Subnetting, DNS, HTTP/HTTPS' }
      ]
    },
    {
      id: 'ph_2',
      number: 2,
      title: 'Phase 2 - Cloud Services (AWS / GCP)',
      duration: '3 weeks',
      status: 'upcoming',
      modules: [
        { id: 'mod_3', title: 'Compute & Storage (EC2 & S3)', completed: false, duration: '1 week', description: 'Virtual instances, security groups, blob storage & lifecycle rules' },
        { id: 'mod_4', title: 'Identity & Security (IAM)', completed: false, duration: '1 week', description: 'Roles, policies, least-privilege security & audit logs' },
        { id: 'mod_5', title: 'Virtual Private Cloud (VPC)', completed: false, duration: '1 week', description: 'Subnets, NAT gateways, route tables & peering' }
      ]
    },
    {
      id: 'ph_3',
      number: 3,
      title: 'Phase 3 - Containerization & Orchestration',
      duration: '4 weeks',
      status: 'upcoming',
      modules: [
        { id: 'mod_6', title: 'Docker Containers', completed: false, duration: '10 days', description: 'Image optimization, multi-stage builds & compose' },
        { id: 'mod_7', title: 'Kubernetes Cluster Management', completed: false, duration: '14 days', description: 'Pods, Deployments, Services, ConfigMaps & Secrets' }
      ]
    },
    {
      id: 'ph_4',
      number: 4,
      title: 'Phase 4 - Infrastructure as Code & CI/CD',
      duration: '3 weeks',
      status: 'upcoming',
      modules: [
        { id: 'mod_8', title: 'Terraform Provisioning', completed: false, duration: '10 days', description: 'HCL syntax, remote state, modules & providers' },
        { id: 'mod_9', title: 'GitHub Actions & Automation', completed: false, duration: '8 days', description: 'Automated testing, building, and cloud deployments' }
      ]
    }
  ],
  'DevOps Engineer': [
    {
      id: 'ph_1',
      number: 1,
      title: 'Phase 1 - Linux & Automation',
      duration: '2 weeks',
      status: 'in_progress',
      modules: [
        { id: 'mod_1', title: 'Advanced Linux Administration', completed: false, duration: '5 days', description: 'Kernel tuning, systemd, log analysis & SSH security' },
        { id: 'mod_2', title: 'Bash & Python Scripting', completed: false, duration: '5 days', description: 'Automating administrative tasks & API scripts' }
      ]
    },
    {
      id: 'ph_2',
      number: 2,
      title: 'Phase 2 - CI/CD Pipelines & Containerization',
      duration: '3 weeks',
      status: 'upcoming',
      modules: [
        { id: 'mod_3', title: 'Docker & Microservices', completed: false, duration: '1 week', description: 'Container security, multi-stage builds & compose' },
        { id: 'mod_4', title: 'CI/CD Automation', completed: false, duration: '2 weeks', description: 'GitHub Actions, Jenkins pipelines, release strategies' }
      ]
    },
    {
      id: 'ph_3',
      number: 3,
      title: 'Phase 3 - Kubernetes & Infrastructure as Code',
      duration: '4 weeks',
      status: 'upcoming',
      modules: [
        { id: 'mod_5', title: 'Kubernetes Operations', completed: false, duration: '2 weeks', description: 'Ingress controllers, Helm charts & RBAC' },
        { id: 'mod_6', title: 'Terraform & Ansible', completed: false, duration: '2 weeks', description: 'Declarative infrastructure and configuration management' }
      ]
    }
  ],
  'Full Stack Developer': [
    {
      id: 'ph_1',
      number: 1,
      title: 'Phase 1 - Web Core & Modern JavaScript',
      duration: '2 weeks',
      status: 'in_progress',
      modules: [
        { id: 'mod_1', title: 'HTML5, CSS3 & Responsive Design', completed: false, duration: '4 days', description: 'Flexbox, Grid, Tailwind CSS & accessibility' },
        { id: 'mod_2', title: 'Modern JavaScript & ES6+', completed: false, duration: '6 days', description: 'Async/Await, ES Modules, Promises & DOM manipulation' }
      ]
    },
    {
      id: 'ph_2',
      number: 2,
      title: 'Phase 2 - Frontend Engineering (React)',
      duration: '3 weeks',
      status: 'upcoming',
      modules: [
        { id: 'mod_3', title: 'React Hooks & Component State', completed: false, duration: '10 days', description: 'State management, custom hooks, component lifecycle' },
        { id: 'mod_4', title: 'TypeScript & Component Styling', completed: false, duration: '8 days', description: 'Type safety, props interfaces & state typing' }
      ]
    },
    {
      id: 'ph_3',
      number: 3,
      title: 'Phase 3 - Backend APIs & Databases',
      duration: '3 weeks',
      status: 'upcoming',
      modules: [
        { id: 'mod_5', title: 'Node.js & Express REST APIs', completed: false, duration: '10 days', description: 'Routing, middleware, JWT auth & error handling' },
        { id: 'mod_6', title: 'PostgreSQL & SQL ORMs', completed: false, duration: '8 days', description: 'Schema design, joins, migrations & index optimization' }
      ]
    }
  ],
  'Data Analyst': [
    {
      id: 'ph_1',
      number: 1,
      title: 'Phase 1 - Data Processing with SQL & Excel',
      duration: '2 weeks',
      status: 'in_progress',
      modules: [
        { id: 'mod_1', title: 'Advanced SQL Queries', completed: false, duration: '1 week', description: 'Joins, aggregations, window functions & subqueries' },
        { id: 'mod_2', title: 'Excel & Data Analysis', completed: false, duration: '1 week', description: 'Pivot tables, VLOOKUP, INDEX-MATCH & formulas' }
      ]
    },
    {
      id: 'ph_2',
      number: 2,
      title: 'Phase 2 - Python Data Analysis (Pandas)',
      duration: '3 weeks',
      status: 'upcoming',
      modules: [
        { id: 'mod_3', title: 'Pandas & NumPy Data Cleaning', completed: false, duration: '10 days', description: 'Handling missing values, reshaping & merging datasets' },
        { id: 'mod_4', title: 'Exploratory Data Analysis (EDA)', completed: false, duration: '8 days', description: 'Statistical summaries, distributions & outlier detection' }
      ]
    }
  ],
  'AI/ML Engineer': [
    {
      id: 'ph_1',
      number: 1,
      title: 'Phase 1 - Math & Python Foundations',
      duration: '2 weeks',
      status: 'in_progress',
      modules: [
        { id: 'mod_1', title: 'Linear Algebra & Calculus for ML', completed: false, duration: '1 week', description: 'Vectors, matrices, gradients & optimization' },
        { id: 'mod_2', title: 'NumPy & Scientific Python', completed: false, duration: '1 week', description: 'Efficient array operations & data structures' }
      ]
    },
    {
      id: 'ph_2',
      number: 2,
      title: 'Phase 2 - Machine Learning Models',
      duration: '3 weeks',
      status: 'upcoming',
      modules: [
        { id: 'mod_3', title: 'Supervised Learning (Scikit-Learn)', completed: false, duration: '10 days', description: 'Regression, Decision Trees, Random Forests & Evaluation' },
        { id: 'mod_4', title: 'Unsupervised Learning & Clustering', completed: false, duration: '8 days', description: 'K-Means, PCA, Dimensionality Reduction' }
      ]
    }
  ],
  'Cybersecurity Engineer': [
    {
      id: 'ph_1',
      number: 1,
      title: 'Phase 1 - Network Security Foundations',
      duration: '2 weeks',
      status: 'in_progress',
      modules: [
        { id: 'mod_1', title: 'Network Protocols & Analysis', completed: false, duration: '1 week', description: 'Wireshark, TCP/IP, OSI Layers, Port Scanning' },
        { id: 'mod_2', title: 'Linux Hardening & Firewall', completed: false, duration: '1 week', description: 'IPTables, UFW, SSH Hardening & Permission Control' }
      ]
    }
  ],
  'Software Developer': [
    {
      id: 'ph_1',
      number: 1,
      title: 'Phase 1 - Data Structures & Algorithms',
      duration: '3 weeks',
      status: 'in_progress',
      modules: [
        { id: 'mod_1', title: 'Arrays, Strings & Linked Lists', completed: false, duration: '1 week', description: 'Memory layout, traversal, time complexity' },
        { id: 'mod_2', title: 'Trees, Graphs & Dynamic Programming', completed: false, duration: '2 weeks', description: 'BFS/DFS, recursion, memoization' }
      ]
    }
  ]
};

const STORAGE_KEYS = {
  USER: 'skillx_user_profile',
  IS_LOGGED_IN: 'skillx_is_logged_in',
  TARGET_ROLE: 'skillx_target_role',
  SKILLS: 'skillx_skills',
  ROADMAP_PHASES: 'skillx_roadmap_phases',
  CHALLENGE: 'skillx_challenge',
  EVALUATION: 'skillx_evaluation',
  CHAT_MESSAGES: 'skillx_chat_messages',
  JOBS: 'skillx_jobs',
  APPLIED_JOB_IDS: 'skillx_applied_job_ids',
  ACTIVE_VIEW: 'skillx_active_view'
} as const;

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    if (item === null) return fallback;
    return JSON.parse(item);
  } catch (error) {
    console.warn(`Error loading "${key}" from localStorage:`, error);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error saving "${key}" to localStorage:`, error);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>(() => {
    const savedLoggedIn = loadFromStorage<boolean | null>(STORAGE_KEYS.IS_LOGGED_IN, null);
    if (savedLoggedIn === false) return 'login';
    const savedView = loadFromStorage<ActiveView | null>(STORAGE_KEYS.ACTIVE_VIEW, null);
    return savedView || 'dashboard';
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = loadFromStorage<boolean | null>(STORAGE_KEYS.IS_LOGGED_IN, null);
    return saved !== null ? saved : true;
  });
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = loadFromStorage<Partial<UserProfile> | null>(STORAGE_KEYS.USER, null);
    if (!saved) return initialProfile;
    return {
      ...initialProfile,
      ...saved,
      verifiedSkills: saved.verifiedSkills || initialProfile.verifiedSkills || [],
      detectedSkills: saved.detectedSkills || initialProfile.detectedSkills || [],
      recentActivity: saved.recentActivity || initialProfile.recentActivity || []
    };
  });
  const [targetRole, setTargetRoleState] = useState<CareerRole>(() => {
    const saved = loadFromStorage<CareerRole | null>(STORAGE_KEYS.TARGET_ROLE, null);
    return saved || 'Cloud Engineer';
  });
  const [skills, setSkills] = useState<SkillItem[]>(() => {
    const saved = loadFromStorage<SkillItem[] | null>(STORAGE_KEYS.SKILLS, null);
    return saved && Array.isArray(saved) && saved.length > 0 ? saved : defaultSkills;
  });
  const [roadmapPhases, setRoadmapPhases] = useState<RoadmapPhase[]>(() => {
    const saved = loadFromStorage<RoadmapPhase[] | null>(STORAGE_KEYS.ROADMAP_PHASES, null);
    return saved && Array.isArray(saved) && saved.length > 0 ? saved : defaultRoadmapPhases;
  });
  const [challenge, setChallenge] = useState<ChallengeItem>(() => {
    const saved = loadFromStorage<ChallengeItem | null>(STORAGE_KEYS.CHALLENGE, null);
    return saved ? { ...defaultChallenge, ...saved } : defaultChallenge;
  });
  const [evaluation, setEvaluation] = useState<ChallengeEvaluation>(() => {
    const saved = loadFromStorage<ChallengeEvaluation | null>(STORAGE_KEYS.EVALUATION, null);
    return saved ? { ...defaultEvaluation, ...saved } : defaultEvaluation;
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = loadFromStorage<ChatMessage[] | null>(STORAGE_KEYS.CHAT_MESSAGES, null);
    return saved && Array.isArray(saved) && saved.length > 0 ? saved : initialChatMessages;
  });
  const [jobs, setJobs] = useState<JobItem[]>(() => {
    const saved = loadFromStorage<JobItem[] | null>(STORAGE_KEYS.JOBS, null);
    return saved && Array.isArray(saved) && saved.length > 0 ? saved : defaultJobs;
  });
  const [cohortStudents] = useState<StudentCohortMetric[]>(defaultCohortStudents);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(() => {
    const saved = loadFromStorage<string[] | null>(STORAGE_KEYS.APPLIED_JOB_IDS, null);
    return saved && Array.isArray(saved) ? saved : [];
  });

  const [isAnalyzingResume, setIsAnalyzingResume] = useState<boolean>(false);
  const [resumeScanStep, setResumeScanStep] = useState<number>(0);

  // Sync state changes to localStorage
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ACTIVE_VIEW, activeView);
  }, [activeView]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.IS_LOGGED_IN, isLoggedIn);
  }, [isLoggedIn]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.USER, user);
  }, [user]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TARGET_ROLE, targetRole);
  }, [targetRole]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.SKILLS, skills);
  }, [skills]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ROADMAP_PHASES, roadmapPhases);
  }, [roadmapPhases]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CHALLENGE, challenge);
  }, [challenge]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.EVALUATION, evaluation);
  }, [evaluation]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CHAT_MESSAGES, chatMessages);
  }, [chatMessages]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.JOBS, jobs);
  }, [jobs]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.APPLIED_JOB_IDS, appliedJobIds);
  }, [appliedJobIds]);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Helper to sync skills, roadmap & readiness score based on target role & detected skills
  const syncUserTargetRoleAndSkills = (role: CareerRole, detectedSkills: string[]) => {
    const templates: { name: string; category: SkillItem['category']; requiredScore: number }[] =
      (ROLE_SKILL_TEMPLATES as Record<string, { name: string; category: SkillItem['category']; requiredScore: number }[]>)[role] || [
        { name: `${role} Fundamentals`, category: 'Foundation', requiredScore: 85 },
        { name: 'Core Architecture & Patterns', category: 'Foundation', requiredScore: 80 },
        { name: 'Primary Programming Language', category: 'Languages', requiredScore: 80 },
        { name: 'Git & Version Control', category: 'Tooling', requiredScore: 75 },
        { name: 'Testing & Quality Assurance', category: 'Tooling', requiredScore: 75 },
        { name: 'Cloud & Production Deployment', category: 'Cloud', requiredScore: 70 }
      ];
    const lowerDetected = new Set(detectedSkills.map(d => d.toLowerCase()));

    let totalUserScore = 0;
    let totalReqScore = 0;

    const newSkills: SkillItem[] = templates.map((t, idx) => {
      const isDetected = lowerDetected.has(t.name.toLowerCase());
      const userScore = isDetected ? Math.min(85, t.requiredScore + 5) : 0;
      const gap = userScore - t.requiredScore;
      const status: SkillItem['status'] = gap >= 0 ? 'Strong' : gap >= -25 ? 'Needs Practice' : 'Critical';

      totalUserScore += Math.min(userScore, t.requiredScore);
      totalReqScore += t.requiredScore;

      return {
        id: `sk_${idx}_${t.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        name: t.name,
        category: t.category,
        userScore,
        requiredScore: t.requiredScore,
        gap,
        status,
        verified: isDetected,
        fromResume: isDetected,
        fromRoadmap: false
      };
    });

    // Include custom skills detected in resume
    detectedSkills.forEach((detName) => {
      const exists = newSkills.some(s => s.name.toLowerCase() === detName.toLowerCase());
      if (!exists) {
        newSkills.push({
          id: `sk_custom_${detName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          name: detName,
          category: 'Languages',
          userScore: 75,
          requiredScore: 70,
          gap: 5,
          status: 'Strong',
          verified: true,
          fromResume: true,
          fromRoadmap: false
        });
        totalUserScore += 70;
        totalReqScore += 70;
      }
    });

    const newReadiness = totalReqScore > 0 ? Math.round((totalUserScore / totalReqScore) * 100) : 0;
    const newRoadmap: RoadmapPhase[] = (ROLE_ROADMAP_TEMPLATES as Record<string, RoadmapPhase[]>)[role] || [
      {
        id: 'ph_custom_1',
        number: 1,
        title: `Phase 1 - ${role} Foundations & Tools`,
        duration: '2 weeks',
        status: 'in_progress',
        modules: [
          { id: 'mod_c1', title: `${role} Principles & Language Syntax`, completed: false, duration: '1 week', description: 'Master foundational syntax, standards & development setup' },
          { id: 'mod_c2', title: 'Data Structures, Architecture & Git', completed: false, duration: '1 week', description: 'Version control, system workflows & modular design' }
        ]
      },
      {
        id: 'ph_custom_2',
        number: 2,
        title: `Phase 2 - Applied ${role} Systems & Projects`,
        duration: '3 weeks',
        status: 'upcoming',
        modules: [
          { id: 'mod_c3', title: 'Hands-on Deliverables & Testing', completed: false, duration: '10 days', description: 'Build end-to-end practical projects and unit testing' },
          { id: 'mod_c4', title: 'Performance Optimization & Deployment', completed: false, duration: '8 days', description: 'Benchmarking, security and production readiness' }
        ]
      }
    ];

    setSkills(newSkills);
    setRoadmapPhases(newRoadmap);

    setUser(prev => ({
      ...prev,
      targetRole: role,
      careerReadiness: newReadiness,
      estimatedWeeks: Math.max(2, Math.ceil((100 - newReadiness) / 10)),
      verifiedSkills: Array.from(new Set([...prev.verifiedSkills, ...detectedSkills]))
    }));

    // Update job matches
    setJobs([
      {
        id: `job_1_${Date.now()}`,
        title: `${role} Intern`,
        company: 'CloudScale Technologies',
        location: 'Bengaluru, India',
        isRemote: false,
        experience: '0-1 years',
        matchScore: newReadiness > 0 ? Math.min(95, newReadiness + 15) : 60,
        skills: detectedSkills.slice(0, 3),
        missingSkills: newSkills.filter(s => s.status === 'Critical').slice(0, 2).map(s => s.name),
        salary: '₹6,00,000 - ₹9,00,000 / yr',
        postedAgo: '2 days ago'
      },
      {
        id: `job_2_${Date.now()}`,
        title: `Junior ${role}`,
        company: 'Nexus Innovations',
        location: 'Remote',
        isRemote: true,
        experience: 'Fresher / Intern',
        matchScore: newReadiness > 0 ? Math.min(90, newReadiness + 10) : 55,
        skills: detectedSkills.slice(0, 2),
        missingSkills: newSkills.filter(s => s.status !== 'Strong').slice(0, 2).map(s => s.name),
        salary: '₹5,50,000 - ₹8,00,000 / yr',
        postedAgo: 'Yesterday'
      }
    ]);
  };

  // Switch role and dynamically update required skills and gaps
  const setTargetRole = (role: CareerRole) => {
    setTargetRoleState(role);
    syncUserTargetRoleAndSkills(role, user.detectedSkills);
  };

  const login = (email: string) => {
    setIsLoggedIn(true);
    setUser(prev => ({ ...prev, email: email || prev.email }));
    setActiveView('dashboard');
  };

  const signup = (userData: Partial<UserProfile>) => {
    setIsLoggedIn(true);
    const chosenRole = userData.targetRole || targetRole;
    setUser(prev => ({
      ...prev,
      ...userData
    }));

    if (userData.targetRole) {
      setTargetRoleState(userData.targetRole);
    }
    syncUserTargetRoleAndSkills(chosenRole, user.detectedSkills);
    setActiveView('onboarding');
  };

  const logout = () => {
    setIsLoggedIn(false);
    setActiveView('login');
  };

  const resetAllData = () => {
    Object.values(STORAGE_KEYS).forEach(k => {
      try {
        localStorage.removeItem(k);
      } catch (err) {
        console.warn(`Error clearing ${k} from localStorage:`, err);
      }
    });
    setUser(initialProfile);
    setIsLoggedIn(true);
    setTargetRoleState('Cloud Engineer');
    setSkills(defaultSkills);
    setRoadmapPhases(defaultRoadmapPhases);
    setChallenge(defaultChallenge);
    setEvaluation(defaultEvaluation);
    setChatMessages(initialChatMessages);
    setJobs(defaultJobs);
    setAppliedJobIds([]);
    setActiveView('dashboard');
  };

  const updateUserProfile = (updated: Partial<UserProfile>) => {
    setUser(prev => ({
      ...prev,
      ...updated
    }));
  };

  const uploadResumeSimulated = async (fileName: string) => {
    setIsAnalyzingResume(true);
    setResumeScanStep(1); // Reading resume

    await new Promise(r => setTimeout(r, 600));
    setResumeScanStep(2); // Identifying skills

    await new Promise(r => setTimeout(r, 600));
    setResumeScanStep(3); // Finding projects

    await new Promise(r => setTimeout(r, 600));
    setResumeScanStep(4); // Mapping career requirements

    await new Promise(r => setTimeout(r, 600));
    setIsAnalyzingResume(false);

    const newSkills = ['Python', 'JavaScript', 'React', 'Node.js', 'Docker', 'AWS', 'Linux', 'Git'];
    
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

    syncUserTargetRoleAndSkills(targetRole, newSkills);
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

    syncUserTargetRoleAndSkills(targetRole, finalDetected);
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
        updateUserProfile,
        uploadResumeSimulated,
        uploadResumeFile,
        isAnalyzingResume,
        resumeScanStep,
        completeRoadmapModule,
        submitChallengeCode,
        addVerifiedSkillFromEvaluation,
        sendChatMessage,
        applyForJob,
        appliedJobIds,
        resetAllData
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
