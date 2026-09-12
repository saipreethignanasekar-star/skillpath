import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import { User } from './models/User.js';
import { Skill } from './models/Skill.js';
import { Roadmap } from './models/Roadmap.js';
import { Challenge } from './models/Challenge.js';
import { Job } from './models/Job.js';
import { Chat } from './models/Chat.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/skillpath';

const defaultSkillsData = [
  { skillId: 'sk_linux', name: 'Linux', category: 'Foundation', userScore: 85, requiredScore: 75, gap: 10, status: 'Strong', verified: true, fromResume: true, fromRoadmap: true },
  { skillId: 'sk_docker', name: 'Docker', category: 'DevOps', userScore: 65, requiredScore: 80, gap: -15, status: 'Needs Practice', verified: true, fromResume: true, fromRoadmap: false },
  { skillId: 'sk_aws', name: 'AWS', category: 'Cloud', userScore: 55, requiredScore: 90, gap: -35, status: 'Needs Practice', verified: true, fromResume: true, fromRoadmap: true },
  { skillId: 'sk_git', name: 'Git', category: 'Tooling', userScore: 80, requiredScore: 70, gap: 10, status: 'Strong', verified: true, fromResume: true, fromRoadmap: false },
  { skillId: 'sk_py', name: 'Python', category: 'Languages', userScore: 90, requiredScore: 70, gap: 20, status: 'Strong', verified: true, fromResume: true, fromRoadmap: false },
  { skillId: 'sk_k8s', name: 'Kubernetes', category: 'DevOps', userScore: 20, requiredScore: 80, gap: -60, status: 'Critical', verified: false, fromResume: false, fromRoadmap: false },
  { skillId: 'sk_tf', name: 'Terraform', category: 'Tooling', userScore: 10, requiredScore: 70, gap: -60, status: 'Critical', verified: false, fromResume: false, fromRoadmap: false }
];

const defaultRoadmapPhasesData = [
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

const defaultJobsData = [
  {
    jobId: 'job_1',
    title: 'Cloud Engineer Intern',
    company: 'TechCorp',
    location: 'Bengaluru, India',
    isRemote: false,
    experience: '0-1 years',
    requiredSkills: ['Linux', 'Docker', 'AWS'],
    salary: '₹6,00,000 - ₹9,00,000 / yr',
    postedAgo: '2 days ago'
  },
  {
    jobId: 'job_2',
    title: 'DevOps Engineer Intern',
    company: 'InnoTech',
    location: 'Remote',
    isRemote: true,
    experience: 'Fresher / Intern',
    requiredSkills: ['Docker', 'Kubernetes', 'CI/CD'],
    salary: '₹5,50,000 - ₹8,00,000 / yr',
    postedAgo: 'Yesterday'
  },
  {
    jobId: 'job_3',
    title: 'Junior Cloud Systems Associate',
    company: 'SkyScale Systems',
    location: 'Hyderabad, India',
    isRemote: false,
    experience: '0-2 years',
    requiredSkills: ['Linux', 'Python', 'Git'],
    salary: '₹7,00,000 - ₹10,50,000 / yr',
    postedAgo: '4 days ago'
  },
  {
    jobId: 'job_4',
    title: 'Site Reliability Engineering Intern',
    company: 'Nexus Cloud Labs',
    location: 'Pune, India',
    isRemote: true,
    experience: '0-1 years',
    requiredSkills: ['Linux', 'Git', 'Docker'],
    salary: '₹6,50,000 - ₹9,50,000 / yr',
    postedAgo: '1 day ago'
  }
];

async function seed() {
  try {
    console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Clear existing data
    await User.deleteMany({});
    await Skill.deleteMany({});
    await Roadmap.deleteMany({});
    await Challenge.deleteMany({});
    await Job.deleteMany({});
    await Chat.deleteMany({});

    console.log('Cleared existing collections.');

    // Create Admin User
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const adminUser = await User.create({
      name: 'Admin / Faculty Mentor',
      email: 'admin.mentor@skillx.ai',
      passwordHash: adminPasswordHash,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      college: 'SkillX Engineering Portal',
      currentYear: 'Faculty Lead',
      targetRole: 'Cloud Engineer'
    });

    // Create Main Student User (Rahul Kumar)
    const studentPasswordHash = await bcrypt.hash('password123', 10);
    const mainStudent = await User.create({
      name: 'Rahul Kumar',
      email: 'rahul.kumar@example.com',
      passwordHash: studentPasswordHash,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&h=160&q=80',
      college: 'National Institute of Technology',
      currentYear: '3rd Year',
      targetRole: 'Cloud Engineer',
      careerReadiness: 68,
      readinessChange: '+12% this month',
      estimatedWeeks: 6,
      verifiedSkills: ['Python', 'Linux', 'Git', 'Docker', 'AWS'],
      recentActivity: [
        { id: 'act_1', title: 'Resume analyzed with AI', timeAgo: 'Today', type: 'resume' },
        { id: 'act_2', title: 'Docker challenge completed', timeAgo: 'Yesterday', type: 'challenge' },
        { id: 'act_3', title: 'AWS added to roadmap', timeAgo: '3 days ago', type: 'roadmap' }
      ],
      resumeUploaded: true,
      resumeFileName: 'Rahul_Kumar_Resume_2026.pdf',
      detectedSkills: ['Python', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Git', 'Docker', 'AWS']
    });

    // Create Cohort Students
    const cohortStudentsData = [
      { name: 'Priya Sharma', email: 'priya.sharma@example.com', targetRole: 'DevOps Engineer', readiness: 84, verifiedSkills: ['Linux', 'Docker', 'AWS', 'CI/CD', 'Git', 'Python', 'Kubernetes', 'Terraform'] },
      { name: 'Amit Patel', email: 'amit.patel@example.com', targetRole: 'Full Stack Developer', readiness: 91, verifiedSkills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'SQL', 'Git', 'Tailwind', 'HTML', 'CSS', 'TypeScript'] },
      { name: 'Sneha Rao', email: 'sneha.rao@example.com', targetRole: 'AI/ML Engineer', readiness: 62, verifiedSkills: ['Python', 'SQL', 'Git', 'Linux'] },
      { name: 'Vikram Singh', email: 'vikram.singh@example.com', targetRole: 'Cybersecurity Engineer', readiness: 76, verifiedSkills: ['Linux', 'Networking', 'Python', 'Bash', 'Git', 'Docker'] }
    ];

    for (const studentData of cohortStudentsData) {
      await User.create({
        name: studentData.name,
        email: studentData.email,
        passwordHash: studentPasswordHash,
        role: 'student',
        college: 'National Institute of Technology',
        currentYear: '3rd Year',
        targetRole: studentData.targetRole,
        careerReadiness: studentData.readiness,
        verifiedSkills: studentData.verifiedSkills
      });
    }

    // Seed Skills for Main Student
    for (const skillItem of defaultSkillsData) {
      await Skill.create({
        user: mainStudent._id,
        ...skillItem
      });
    }

    // Seed Roadmap for Main Student
    await Roadmap.create({
      user: mainStudent._id,
      targetRole: 'Cloud Engineer',
      phases: defaultRoadmapPhasesData
    });

    // Seed Challenge
    await Challenge.create({
      challengeId: 'ch_docker_1',
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
      initialCode: `# Step 1: Base Image\nFROM node:20-alpine\n\n# Step 2: Set working directory\nWORKDIR /app\n\n# Step 3: Install dependencies\nCOPY package*.json ./\nRUN npm ci --only=production\n\n# Step 4: Copy application source\nCOPY . .\n\n# Step 5: Security & Exposure\nUSER node\nEXPOSE 3000\n\n# Step 6: Start container\nCMD ["node", "server.js"]\n`,
      completed: false,
      score: 86,
      verifiedBadge: 'Docker - Verified Container Specialist'
    });

    // Seed Jobs
    for (const jobItem of defaultJobsData) {
      await Job.create(jobItem);
    }

    console.log('✅ Database successfully seeded with starter data!');
    console.log('👤 Admin user: admin.mentor@skillx.ai (password: admin123)');
    console.log('👤 Student user: rahul.kumar@example.com (password: password123)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    process.exit(1);
  }
}

seed();
