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
  id: 'usr_rahul_kumar',
  name: 'Rahul Kumar',
  email: 'rahul.kumar@example.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&h=160&q=80',
  college: 'National Institute of Technology',
  currentYear: '3rd Year',
  targetRole: 'Cloud Engineer',
  careerReadiness: 68,
  readinessChange: '+12% this month',
  estimatedWeeks: 6,
  verifiedSkills: ['Python', 'Linux', 'Git', 'Docker', 'AWS'],
  recentActivity: [
    { id: 'act_1', title: 'Resume analyzed', timeAgo: 'Today', type: 'resume' },
    { id: 'act_2', title: 'Docker challenge completed', timeAgo: 'Yesterday', type: 'challenge' },
    { id: 'act_3', title: 'AWS added to roadmap', timeAgo: '3 days ago', type: 'roadmap' }
  ],
  resumeUploaded: true,
  resumeFileName: 'Rahul_Kumar_Resume_2026.pdf',
  detectedSkills: ['Python', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'Docker', 'AWS']
};

export const defaultSkills: SkillItem[] = [
  { id: 'sk_linux', name: 'Linux', category: 'Foundation', userScore: 80, requiredScore: 75, gap: 5, status: 'Strong', verified: true },
  { id: 'sk_docker', name: 'Docker', category: 'DevOps', userScore: 60, requiredScore: 80, gap: -20, status: 'Needs Practice', verified: true },
  { id: 'sk_aws', name: 'AWS', category: 'Cloud', userScore: 40, requiredScore: 90, gap: -50, status: 'Critical', verified: true },
  { id: 'sk_k8s', name: 'Kubernetes', category: 'DevOps', userScore: 20, requiredScore: 80, gap: -60, status: 'Critical', verified: false },
  { id: 'sk_tf', name: 'Terraform', category: 'Tooling', userScore: 10, requiredScore: 70, gap: -60, status: 'Critical', verified: false },
  { id: 'sk_py', name: 'Python', category: 'Languages', userScore: 90, requiredScore: 70, gap: 20, status: 'Strong', verified: true },
  { id: 'sk_git', name: 'Git', category: 'Tooling', userScore: 75, requiredScore: 70, gap: 5, status: 'Strong', verified: true }
];

export const careerRolesList: { role: CareerRole; description: string; icon: string }[] = [
  { role: 'Cloud Engineer', description: 'Architect, deploy and automate scalable cloud infrastructure.', icon: 'Cloud' },
  { role: 'DevOps Engineer', description: 'Bridge development and operations with CI/CD and automation.', icon: 'Repeat' },
  { role: 'Full Stack Developer', description: 'Build end-to-end web applications from frontend to backend.', icon: 'Layers' },
  { role: 'Data Analyst', description: 'Transform raw data into meaningful insights and business dashboards.', icon: 'BarChart2' },
  { role: 'AI/ML Engineer', description: 'Train, evaluate and productionize machine learning and LLM models.', icon: 'Cpu' },
  { role: 'Cybersecurity Engineer', description: 'Secure networks, detect threats, and implement zero-trust systems.', icon: 'Shield' },
  { role: 'Software Developer', description: 'Design performant software architectures and robust APIs.', icon: 'Code' }
];

export const defaultRoadmapPhases: RoadmapPhase[] = [
  {
    id: 'ph_1',
    number: 1,
    title: 'Phase 1 - Foundation',
    duration: '2 weeks',
    status: 'completed',
    modules: [
      { id: 'mod_1', title: 'Linux Fundamentals', completed: true, duration: '4 days', description: 'CLI, permissions, file systems, process management' },
      { id: 'mod_2', title: 'Bash Scripting', completed: true, duration: '4 days', description: 'Shell automation, pipelines, cron tasks' },
      { id: 'mod_3', title: 'Networking Basics', completed: true, duration: '6 days', description: 'TCP/IP, DNS, Subnets, OSI model' }
    ]
  },
  {
    id: 'ph_2',
    number: 2,
    title: 'Phase 2 - Cloud',
    duration: '3 weeks',
    status: 'in_progress',
    modules: [
      { id: 'mod_4', title: 'AWS EC2 & S3', completed: true, duration: '1 week', description: 'Virtual instances, security groups, blob storage & policies' },
      { id: 'mod_5', title: 'AWS IAM', completed: false, duration: '1 week', description: 'Roles, policies, least-privilege security' },
      { id: 'mod_6', title: 'AWS VPC', completed: false, duration: '1 week', description: 'Custom subnets, NAT gateways, route tables' }
    ]
  },
  {
    id: 'ph_3',
    number: 3,
    title: 'Phase 3 - DevOps',
    duration: '4 weeks',
    status: 'upcoming',
    modules: [
      { id: 'mod_7', title: 'Docker', completed: false, duration: '10 days', description: 'Images, Dockerfile multi-stage, container networking' },
      { id: 'mod_8', title: 'Kubernetes', completed: false, duration: '12 days', description: 'Pods, Deployments, Services, ConfigMaps' },
      { id: 'mod_9', title: 'CI/CD', completed: false, duration: '6 days', description: 'GitHub Actions, automated build and delivery' }
    ]
  },
  {
    id: 'ph_4',
    number: 4,
    title: 'Phase 4 - Infrastructure',
    duration: '2 weeks',
    status: 'upcoming',
    modules: [
      { id: 'mod_10', title: 'Terraform', completed: false, duration: '1 week', description: 'HCL syntax, state management, providers' },
      { id: 'mod_11', title: 'Infrastructure as Code', completed: false, duration: '1 week', description: 'Reusable modules and cloud provisioning' }
    ]
  },
  {
    id: 'ph_5',
    number: 5,
    title: 'Phase 5 - Real Project',
    duration: '4 weeks',
    status: 'upcoming',
    modules: [
      { id: 'mod_12', title: 'Deploy a cloud application', completed: false, duration: '4 weeks', description: 'End-to-end resilient deployment with monitoring, autoscaling, and SSL' }
    ]
  }
];

export const defaultChallenge: ChallengeItem = {
  id: 'ch_docker_1',
  title: 'Docker Challenge',
  role: 'Cloud Engineer',
  difficulty: 'Intermediate',
  durationMinutes: 45,
  description: 'Containerize a Node.js application and expose it on port 3000.',
  instructions: [
    'Create an optimized Dockerfile using an official Node.js base image',
    'Copy package.json and install production dependencies',
    'Copy application source code and set proper working directory',
    'Expose container port 3000',
    'Follow security best practices: run as non-root user'
  ],
  initialCode: `# Step 1: Base Image
FROM node:20-alpine

# Step 2: Set working directory
WORKDIR /app

# Step 3: Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Step 4: Copy application source
COPY . .

# Step 5: Security & Exposure
USER node
EXPOSE 3000

# Step 6: Start container
CMD ["node", "server.js"]
`,
  completed: false,
  score: 86,
  verifiedBadge: 'Docker - Verified Container Specialist'
};

export const defaultEvaluation: ChallengeEvaluation = {
  overallScore: 86,
  technicalCorrectness: 90,
  bestPractices: 85,
  security: 78,
  configuration: 88,
  summary: 'Your solution successfully containerized the application and exposed the required port with an optimized multi-stage build structure.',
  verifiedSkillName: 'Docker'
};

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg_1',
    sender: 'ai',
    text: "Hello Rahul! I've reviewed your current skill profile against your Cloud Engineer target. What would you like to work on today?",
    timestamp: '10:42 AM'
  },
  {
    id: 'msg_2',
    sender: 'user',
    text: 'What should I learn next to improve my readiness score?',
    timestamp: '10:43 AM'
  },
  {
    id: 'msg_3',
    sender: 'ai',
    text: 'Based on your current profile, I recommend learning AWS EC2 and IAM next. These represent your highest-impact skill gaps for the Cloud Engineer role.',
    timestamp: '10:43 AM',
    card: {
      title: 'Recommended Next Steps:',
      items: ['1. AWS EC2 & S3 Basics', '2. AWS IAM Least-Privilege Policies', '3. AWS VPC Network Architecture'],
      primaryButtonText: 'Start AWS Roadmap',
      primaryAction: 'roadmap',
      secondaryButtonText: 'Take AWS Challenge',
      secondaryAction: 'challenge'
    }
  }
];

export const defaultJobs: JobItem[] = [
  {
    id: 'job_1',
    title: 'Cloud Engineer Intern',
    company: 'TechCorp',
    location: 'Bengaluru, India',
    isRemote: false,
    experience: '0-1 years',
    matchScore: 82,
    skills: ['Linux', 'Docker'],
    missingSkills: ['Kubernetes'],
    salary: '₹6,00,000 - ₹9,00,000 / yr',
    postedAgo: '2 days ago'
  },
  {
    id: 'job_2',
    title: 'DevOps Engineer Intern',
    company: 'InnoTech',
    location: 'Remote',
    isRemote: true,
    experience: 'Fresher / Intern',
    matchScore: 75,
    skills: ['Docker', 'Kubernetes'],
    missingSkills: ['Terraform'],
    salary: '₹5,50,000 - ₹8,00,000 / yr',
    postedAgo: 'Yesterday'
  },
  {
    id: 'job_3',
    title: 'Junior Cloud Systems Associate',
    company: 'SkyScale Systems',
    location: 'Hyderabad, India',
    isRemote: false,
    experience: '0-2 years',
    matchScore: 68,
    skills: ['Linux', 'Python', 'Git'],
    missingSkills: ['AWS', 'Terraform'],
    salary: '₹7,00,000 - ₹10,50,000 / yr',
    postedAgo: '4 days ago'
  },
  {
    id: 'job_4',
    title: 'Site Reliability Engineering Intern',
    company: 'Nexus Cloud Labs',
    location: 'Pune, India',
    isRemote: true,
    experience: '0-1 years',
    matchScore: 72,
    skills: ['Linux', 'Git'],
    missingSkills: ['Docker', 'CI/CD'],
    salary: '₹6,50,000 - ₹9,50,000 / yr',
    postedAgo: '1 day ago'
  }
];

export const defaultCohortStudents: StudentCohortMetric[] = [
  {
    id: 'stu_1',
    name: 'Rahul Kumar',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80',
    targetRole: 'Cloud Engineer',
    readiness: 68,
    verifiedSkillsCount: 5,
    lastActivity: 'Just now',
    status: 'On Track'
  },
  {
    id: 'stu_2',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80',
    targetRole: 'DevOps Engineer',
    readiness: 84,
    verifiedSkillsCount: 8,
    lastActivity: '12 mins ago',
    status: 'Active'
  },
  {
    id: 'stu_3',
    name: 'Amit Patel',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&h=120&q=80',
    targetRole: 'Full Stack Developer',
    readiness: 91,
    verifiedSkillsCount: 11,
    lastActivity: '1 hour ago',
    status: 'Active'
  },
  {
    id: 'stu_4',
    name: 'Sneha Rao',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80',
    targetRole: 'AI/ML Engineer',
    readiness: 62,
    verifiedSkillsCount: 4,
    lastActivity: '3 hours ago',
    status: 'Needs Attention'
  },
  {
    id: 'stu_5',
    name: 'Vikram Singh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    targetRole: 'Cybersecurity Engineer',
    readiness: 76,
    verifiedSkillsCount: 6,
    lastActivity: 'Yesterday',
    status: 'On Track'
  }
];
