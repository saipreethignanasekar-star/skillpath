export type CareerRole =
  | 'Cloud Engineer'
  | 'DevOps Engineer'
  | 'Full Stack Developer'
  | 'Data Analyst'
  | 'AI/ML Engineer'
  | 'Cybersecurity Engineer'
  | 'Software Developer';

export interface SkillItem {
  id: string;
  name: string;
  category: 'Foundation' | 'Cloud' | 'DevOps' | 'Tooling' | 'Languages';
  userScore: number;     // 0 - 100
  requiredScore: number; // 0 - 100
  gap: number;           // userScore - requiredScore
  status: 'Strong' | 'Needs Practice' | 'Critical';
  verified?: boolean;
}

export interface ActivityItem {
  id: string;
  title: string;
  timeAgo: string;
  type: 'resume' | 'challenge' | 'roadmap' | 'skill';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  college: string;
  currentYear: string;
  targetRole: CareerRole;
  careerReadiness: number;
  readinessChange: string;
  estimatedWeeks: number;
  verifiedSkills: string[];
  recentActivity: ActivityItem[];
  resumeUploaded: boolean;
  resumeFileName?: string;
  detectedSkills: string[];
}

export interface RoadmapModule {
  id: string;
  title: string;
  completed: boolean;
  duration?: string;
  description?: string;
}

export interface RoadmapPhase {
  id: string;
  number: number;
  title: string;
  duration: string;
  status: 'completed' | 'in_progress' | 'upcoming';
  modules: RoadmapModule[];
}

export interface ChallengeItem {
  id: string;
  title: string;
  role: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  description: string;
  instructions: string[];
  initialCode: string;
  completed: boolean;
  score?: number;
  verifiedBadge?: string;
}

export interface ChallengeEvaluation {
  overallScore: number;
  technicalCorrectness: number;
  bestPractices: number;
  security: number;
  configuration: number;
  summary: string;
  verifiedSkillName: string;
}

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  experience: string;
  matchScore: number;
  skills: string[];
  missingSkills: string[];
  salary?: string;
  postedAgo: string;
}

export interface ChatActionCard {
  title: string;
  items: string[];
  primaryButtonText: string;
  primaryAction: string;
  secondaryButtonText?: string;
  secondaryAction?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  card?: ChatActionCard;
}

export interface StudentCohortMetric {
  id: string;
  name: string;
  avatar: string;
  targetRole: CareerRole;
  readiness: number;
  verifiedSkillsCount: number;
  lastActivity: string;
  status: 'Active' | 'On Track' | 'Needs Attention';
}

export type ActiveView =
  | 'landing'
  | 'login'
  | 'signup'
  | 'onboarding'
  | 'dashboard'
  | 'profile'
  | 'resume-analysis'
  | 'skill-gap'
  | 'roadmap'
  | 'challenges'
  | 'challenge-detail'
  | 'ai-evaluation'
  | 'ai-mentor'
  | 'jobs'
  | 'admin-overview';
