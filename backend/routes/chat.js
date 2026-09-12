import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { Chat } from '../models/Chat.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// GET /api/chat/messages
router.get('/messages', authenticateUser, async (req, res) => {
  try {
    let chat = await Chat.findOne({ user: req.user._id });
    if (!chat) {
      chat = await Chat.create({
        user: req.user._id,
        messages: [
          {
            id: 'msg_1',
            sender: 'ai',
            text: `Hello ${req.user.name.split(' ')[0]}! I've reviewed your current skill profile against your ${req.user.targetRole} target. What would you like to work on today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      });
    }
    return res.json({ success: true, messages: chat.messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch chat history.', error: error.message });
  }
});

// POST /api/chat/send
router.post('/send', authenticateUser, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Message text is required.' });
    }

    let chat = await Chat.findOne({ user: req.user._id });
    if (!chat) {
      chat = await Chat.create({ user: req.user._id, messages: [] });
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: timeStr
    };
    chat.messages.push(userMsg);

    let reply = "I'm analyzing your skill trajectory. Focusing on practical hands-on challenges and foundational architecture will boost your readiness score quickly!";
    let card = undefined;

    // Check if Gemini API Key is provided in environment
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const systemPrompt = `You are SkillX AI Career Mentor for a student named ${req.user.name}. Their target role is ${req.user.targetRole}, readiness score is ${req.user.careerReadiness}%. Verified skills: ${req.user.verifiedSkills.join(', ')}. Keep response clear, practical, concise and encouraging.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [systemPrompt, `User question: ${text}`]
        });

        if (response && response.text) {
          reply = response.text;
        }
      } catch (geminiErr) {
        console.warn('[Gemini AI] API call error fallback:', geminiErr.message);
      }
    }

    // Contextual Action Card Generator
    const lower = text.toLowerCase();
    if (lower.includes('next') || lower.includes('learn') || lower.includes('gap')) {
      reply = `Based on your current profile, I recommend learning AWS EC2 and IAM next. These represent your highest-impact skill gaps for your ${req.user.targetRole} goal.`;
      card = {
        title: 'Recommended Next Steps:',
        items: ['1. AWS EC2 & S3 Basics', '2. AWS IAM Least-Privilege Policies', '3. AWS VPC Network Architecture'],
        primaryButtonText: 'Start AWS Roadmap',
        primaryAction: 'roadmap',
        secondaryButtonText: 'Take AWS Challenge',
        secondaryAction: 'challenge'
      };
    } else if (lower.includes('docker') || lower.includes('container')) {
      reply = 'Your Docker challenge score was an impressive 86%! The next milestone is orchestrating these containers with Kubernetes.';
      card = {
        title: 'Ready for the next challenge?',
        items: ['Kubernetes Pod Deployment Challenge', 'Write Kubernetes manifests and service exposure'],
        primaryButtonText: 'View Challenge',
        primaryAction: 'challenge'
      };
    } else if (lower.includes('job') || lower.includes('intern') || lower.includes('hire')) {
      reply = `You currently have an 82% match for ${req.user.targetRole} Intern positions! Improving your Kubernetes score to 50% will increase that match to 94%.`;
      card = {
        title: 'Matching Opportunities:',
        items: ['TechCorp - Cloud Engineer Intern (82% match)', 'InnoTech - DevOps Engineer Intern (75% match)'],
        primaryButtonText: 'View Matched Jobs',
        primaryAction: 'jobs'
      };
    }

    const aiMsg = {
      id: `ai_${Date.now()}`,
      sender: 'ai',
      text: reply,
      timestamp: timeStr,
      card
    };
    chat.messages.push(aiMsg);
    await chat.save();

    return res.json({ success: true, userMessage: userMsg, aiMessage: aiMsg, messages: chat.messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to process chat message.', error: error.message });
  }
});

export default router;
