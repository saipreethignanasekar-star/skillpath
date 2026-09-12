import type {
  UserProfile,
  SkillItem,
  RoadmapPhase,
  ChallengeItem,
  ChallengeEvaluation,
  JobItem,
  ChatMessage,
  StudentCohortMetric,
  CareerRole
} from '../types';

export const initialProfile: UserProfile = {
  id: '',
  name: '',
  email: '',
  avatar: '',
  college: '',
  currentYear: '',
  targetRole: 'Cloud Engineer',
  careerReadiness: 0,
  readinessChange: '0%',
  estimatedWeeks: 0,
  verifiedSkills: [],
  recentActivity: [],
  resumeUploaded: false,
  resumeFileName: undefined,
  detectedSkills: []
};

export const defaultSkills: SkillItem[] = [];

export const careerRolesList: { role: CareerRole; description: string; icon: string }[] = [
  { role: 'Cloud Engineer', description: 'Architect, deploy and automate scalable cloud infrastructure.', icon: 'Cloud' },
  { role: 'DevOps Engineer', description: 'Bridge development and operations with CI/CD and automation.', icon: 'Repeat' },
  { role: 'Full Stack Developer', description: 'Build end-to-end web applications from frontend to backend.', icon: 'Layers' },
  { role: 'Data Analyst', description: 'Transform raw data into meaningful insights and business dashboards.', icon: 'BarChart2' },
  { role: 'AI/ML Engineer', description: 'Train, evaluate and productionize machine learning and LLM models.', icon: 'Cpu' },
  { role: 'Cybersecurity Engineer', description: 'Secure networks, detect threats, and implement zero-trust systems.', icon: 'Shield' },
  { role: 'Software Developer', description: 'Design performant software architectures and robust APIs.', icon: 'Code' }
];

export const defaultRoadmapPhases: RoadmapPhase[] = [];

export const defaultChallenge: ChallengeItem = {
  id: '',
  title: 'Practical Challenge',
  role: 'Software Engineer',
  difficulty: 'Beginner',
  durationMinutes: 30,
  description: 'Select or start a challenge to evaluate your skills.',
  instructions: [],
  initialCode: '// Write your code solution here\n',
  completed: false
};

export const defaultEvaluation: ChallengeEvaluation = {
  overallScore: 0,
  technicalCorrectness: 0,
  bestPractices: 0,
  security: 0,
  configuration: 0,
  summary: 'No evaluation submitted yet.',
  verifiedSkillName: ''
};

export const initialChatMessages: ChatMessage[] = [];

export const defaultJobs: JobItem[] = [];

export const defaultCohortStudents: StudentCohortMetric[] = [];
