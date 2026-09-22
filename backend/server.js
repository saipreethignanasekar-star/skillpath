import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initDatabase,
  getUserByEmail,
  createUser,
  findOrCreateOAuthUser,
  getAllUsers,
  getDbStatus
} from './db.js';

// Resolve directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root and backend
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Database connection on start
initDatabase();

// In-memory OTP store: Map<email, { code, expiresAt, attempts, name }>
const otpStore = new Map();

// Helper to create Nodemailer Transporter
const createMailTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').replace(/\s+/g, '').trim();

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: user && pass ? { user, pass } : undefined
  });
};

// Generate HTML email template
const generateVerificationEmailHtml = (name, code) => {
  const studentName = name ? name.trim() : 'Student';
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SkillX Verification Code</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: 'Google Sans', Roboto, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #f8f9fa; color: #202124;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #dadce0; overflow: hidden; box-shadow: 0 1px 3px rgba(60,64,67,0.08);">
      <!-- Header -->
      <tr>
        <td style="padding: 32px 32px 20px 32px; text-align: center; background-color: #ffffff; border-bottom: 1px solid #f1f3f4;">
          <table align="center" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align: middle; padding-right: 8px;">
                <div style="width: 36px; height: 36px; background-color: #e8f0fe; border-radius: 10px; text-align: center; line-height: 36px; font-size: 20px; color: #1a73e8; font-weight: bold;">
                  ⚡
                </div>
              </td>
              <td style="vertical-align: middle;">
                <span style="font-size: 24px; font-weight: 600; letter-spacing: -0.5px; color: #202124;">
                  Skill<span style="color: #1a73e8;">X</span>
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Body Content -->
      <tr>
        <td style="padding: 32px 32px 24px 32px;">
          <h2 style="font-size: 20px; font-weight: 600; color: #202124; margin: 0 0 12px 0;">
            Verify your email address
          </h2>
          <p style="font-size: 14px; line-height: 22px; color: #5f6368; margin: 0 0 24px 0;">
            Hi <strong>${studentName}</strong>, thank you for joining SkillX! Please use the following 6-digit verification code to complete your registration and activate your student career account.
          </p>

          <!-- OTP Code Box -->
          <div style="background: #f8f9fa; border: 1px solid #dadce0; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
            <div style="font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; color: #5f6368; margin-bottom: 8px;">
              Your Verification Code
            </div>
            <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1a73e8; font-family: monospace; padding: 4px 0;">
              ${code}
            </div>
            <div style="font-size: 12px; color: #d93025; margin-top: 8px; font-weight: 500;">
              ⏳ Valid for 10 minutes
            </div>
          </div>

          <p style="font-size: 13px; line-height: 20px; color: #5f6368; margin: 24px 0 0 0;">
            If you did not initiate this request, you can safely ignore this email. No account will be activated without this verification code.
          </p>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding: 20px 32px; background-color: #f8f9fa; border-top: 1px solid #dadce0; text-align: center;">
          <p style="font-size: 11px; color: #5f6368; margin: 0 0 4px 0;">
            SkillX Career Readiness & Skill Verification Platform
          </p>
          <p style="font-size: 11px; color: #80868b; margin: 0;">
            This is an automated message. Please do not reply directly to this email.
          </p>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

// ================= API ROUTES =================

// Health check with Neon DB & OAuth status
app.get('/api/health', (req, res) => {
  const isSmtpConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
  const dbStatus = getDbStatus();

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    oauth: {
      google: Boolean(process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID),
      github: Boolean(process.env.GITHUB_CLIENT_ID || process.env.VITE_GITHUB_CLIENT_ID)
    },
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || '465',
      configured: isSmtpConfigured,
      from: process.env.SMTP_FROM || process.env.SMTP_USER || 'SkillX <noreply@skillpath.app>'
    }
  });
});

// Expose public OAuth Client IDs to frontend
app.get('/api/auth/config', (req, res) => {
  const googleClientId = process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '';
  const githubClientId = process.env.VITE_GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID || '';

  res.json({
    success: true,
    googleClientId,
    githubClientId,
    isGoogleConfigured: Boolean(googleClientId),
    isGithubConfigured: Boolean(githubClientId)
  });
});

// Send Verification Code (SMTP)
app.post('/api/auth/send-verification', async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'A valid email address is required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if account already exists in Neon DB / local DB
    const existingUser = await getUserByEmail(normalizedEmail);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        code: 'EMAIL_EXISTS',
        message: 'An account with this email address already exists. Please sign in instead.'
      });
    }

    // Generate 6-digit random numeric OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store in memory
    otpStore.set(normalizedEmail, {
      code,
      expiresAt,
      attempts: 0,
      name: name ? name.trim() : ''
    });

    const isSmtpConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

    if (isSmtpConfigured) {
      const transporter = createMailTransporter();
      const fromAddress = process.env.SMTP_FROM || `"SkillPath" <${process.env.SMTP_USER}>`;

      await transporter.sendMail({
        from: fromAddress,
        to: normalizedEmail,
        subject: `Your SkillX Verification Code: ${code}`,
        text: `Hi ${name || 'Student'},\n\nYour SkillX verification code is: ${code}\nThis code is valid for 10 minutes.\n\nThank you,\nSkillX Team`,
        html: generateVerificationEmailHtml(name, code)
      });

      console.log(`[SMTP] Verification code sent successfully to ${normalizedEmail}`);
      return res.json({
        success: true,
        message: `Verification code sent to ${normalizedEmail}. Please check your inbox.`,
        email: normalizedEmail
      });
    } else {
      console.warn(`[SMTP Warning] SMTP credentials not set. Verification code for ${normalizedEmail} is: ${code}`);
      return res.json({
        success: true,
        message: `Verification code generated. (SMTP not configured — code: ${code})`,
        email: normalizedEmail,
        devCode: code,
        smtpConfigured: false
      });
    }
  } catch (error) {
    console.error('[SMTP Error] Failed to send verification email:', error);

    const normalizedEmail = (req.body?.email || '').trim().toLowerCase();
    const stored = otpStore.get(normalizedEmail);

    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to send verification email via SMTP.',
      devCode: stored?.code,
      errorDetails: error.code || error.message
    });
  }
});

// Verify Code Endpoint
app.post('/api/auth/verify-code', (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and verification code are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const cleanCode = code.toString().trim();

    const entry = otpStore.get(normalizedEmail);

    if (!entry) {
      return res.status(400).json({
        success: false,
        message: 'No verification code was requested for this email, or it has expired. Please click Resend.'
      });
    }

    if (Date.now() > entry.expiresAt) {
      otpStore.delete(normalizedEmail);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new code.'
      });
    }

    if (entry.attempts >= 5) {
      otpStore.delete(normalizedEmail);
      return res.status(429).json({
        success: false,
        message: 'Too many incorrect attempts. Please request a new verification code.'
      });
    }

    if (entry.code !== cleanCode) {
      entry.attempts += 1;
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check your email and try again.'
      });
    }

    // Success - remove from store
    otpStore.delete(normalizedEmail);

    console.log(`[AUTH] Email ${normalizedEmail} successfully verified.`);
    return res.json({
      success: true,
      verified: true,
      message: 'Email address verified successfully!'
    });
  } catch (error) {
    console.error('[Verify Error]:', error);
    return res.status(500).json({ success: false, message: 'Verification failed. Please try again.' });
  }
});

// Register / Save User to Neon DB
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, college, currentYear, department, targetRole } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await getUserByEmail(normalizedEmail);

    if (existing) {
      return res.status(409).json({
        success: false,
        code: 'EMAIL_EXISTS',
        message: 'An account with this email address already exists. Please sign in instead.'
      });
    }

    const user = await createUser({
      name: name?.trim() || '',
      email: normalizedEmail,
      password: password,
      college: college?.trim() || '',
      currentYear: currentYear || '1st Year',
      department: department?.trim() || '',
      targetRole: targetRole || 'Cloud Engineer',
      careerReadiness: 0,
      authProvider: 'local'
    });

    console.log(`[AUTH] User created in database for ${normalizedEmail}`);

    return res.json({
      success: true,
      message: 'Account created and saved to Neon database.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        college: user.college,
        currentYear: user.currentYear,
        department: user.department,
        targetRole: user.targetRole,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to create user account in database.' });
  }
});

// Login Endpoint (Verify with Neon DB / credentials)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await getUserByEmail(normalizedEmail);

    if (!user) {
      return res.status(404).json({
        success: false,
        code: 'USER_NOT_FOUND',
        message: 'No account found with this email address. Please sign up.'
      });
    }

    if (user.password && user.password !== password) {
      return res.status(401).json({
        success: false,
        code: 'WRONG_PASSWORD',
        message: 'Wrong password. Please check and try again.'
      });
    }

    console.log(`[AUTH] Successful login for ${normalizedEmail}`);
    return res.json({
      success: true,
      message: 'Login successful!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        college: user.college,
        currentYear: user.currentYear,
        department: user.department,
        targetRole: user.targetRole,
        careerReadiness: user.careerReadiness,
        verifiedSkills: user.verifiedSkills,
        detectedSkills: user.detectedSkills
      }
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

// ================= GOOGLE OAUTH ENDPOINT =================
app.post('/api/auth/google', async (req, res) => {
  try {
    const { token, credential, profile } = req.body;

    let googleProfile = profile;

    // If a Google credential token was sent, decode/verify it
    if (credential && !googleProfile) {
      try {
        // Fetch token verification from Google tokeninfo endpoint
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        if (verifyRes.ok) {
          const tokenData = await verifyRes.json();
          googleProfile = {
            id: tokenData.sub,
            email: tokenData.email,
            name: tokenData.name,
            avatar: tokenData.picture
          };
        }
      } catch (tokenErr) {
        console.warn('Google token verify warning:', tokenErr.message);
      }
    }

    if (!googleProfile || !googleProfile.email) {
      return res.status(400).json({
        success: false,
        message: 'Valid Google profile or credential is required.'
      });
    }

    const user = await findOrCreateOAuthUser({
      provider: 'google',
      providerId: googleProfile.id || `g_${Date.now()}`,
      email: googleProfile.email,
      name: googleProfile.name || googleProfile.email.split('@')[0],
      avatar: googleProfile.avatar || ''
    });

    console.log(`[Google OAuth] User authenticated: ${user.email}`);

    return res.json({
      success: true,
      message: 'Google Sign-In successful!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        college: user.college,
        currentYear: user.currentYear,
        department: user.department,
        targetRole: user.targetRole,
        careerReadiness: user.careerReadiness,
        verifiedSkills: user.verifiedSkills,
        detectedSkills: user.detectedSkills
      }
    });
  } catch (error) {
    console.error('[Google OAuth Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to authenticate with Google: ' + error.message
    });
  }
});

// ================= GITHUB OAUTH ENDPOINT =================
app.post('/api/auth/github', async (req, res) => {
  try {
    const { code, profile } = req.body;

    let githubProfile = profile;

    // If OAuth code is provided, exchange it for access token
    if (code && !githubProfile) {
      const clientId = process.env.GITHUB_CLIENT_ID || process.env.VITE_GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        return res.status(400).json({
          success: false,
          message: 'GitHub OAuth credentials (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET) not set in backend .env'
        });
      }

      // Exchange code for access token
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code
        })
      });

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        return res.status(400).json({
          success: false,
          message: tokenData.error_description || 'Failed to obtain GitHub access token'
        });
      }

      // Fetch user profile from GitHub API
      const userRes = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'SkillX-App'
        }
      });
      const userData = await userRes.json();

      // Fetch user emails if email is private
      let userEmail = userData.email;
      if (!userEmail) {
        const emailsRes = await fetch('https://api.github.com/user/emails', {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': 'SkillX-App'
          }
        });
        if (emailsRes.ok) {
          const emails = await emailsRes.json();
          const primaryEmail = emails.find(e => e.primary && e.verified) || emails[0];
          userEmail = primaryEmail?.email;
        }
      }

      githubProfile = {
        id: userData.id?.toString(),
        name: userData.name || userData.login,
        email: userEmail || `${userData.login}@users.noreply.github.com`,
        avatar: userData.avatar_url,
        login: userData.login
      };
    }

    if (!githubProfile || !githubProfile.email) {
      return res.status(400).json({
        success: false,
        message: 'Valid GitHub profile or authorization code is required.'
      });
    }

    const user = await findOrCreateOAuthUser({
      provider: 'github',
      providerId: githubProfile.id || `gh_${Date.now()}`,
      email: githubProfile.email,
      name: githubProfile.name || githubProfile.login || 'GitHub Developer',
      avatar: githubProfile.avatar || ''
    });

    console.log(`[GitHub OAuth] User authenticated: ${user.email}`);

    return res.json({
      success: true,
      message: 'GitHub Sign-In successful!',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        college: user.college,
        currentYear: user.currentYear,
        department: user.department,
        targetRole: user.targetRole,
        careerReadiness: user.careerReadiness,
        verifiedSkills: user.verifiedSkills,
        detectedSkills: user.detectedSkills
      }
    });
  } catch (error) {
    console.error('[GitHub OAuth Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to authenticate with GitHub: ' + error.message
    });
  }
});

// Get registered accounts list for local autofill
app.get('/api/auth/users', async (req, res) => {
  try {
    const users = await getAllUsers();
    return res.json({ success: true, users });
  } catch {
    return res.status(500).json({ success: false, users: [] });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 SkillPath Backend running on http://localhost:${PORT}`);
  console.log(`📧 SMTP Host: ${process.env.SMTP_HOST || 'smtp.gmail.com'}:${process.env.SMTP_PORT || '465'}`);
  console.log(`🔑 SMTP Configured: ${Boolean(process.env.SMTP_USER && process.env.SMTP_PASS)}`);
  console.log(`🐘 Neon DB Configured: ${Boolean(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('your_neon_database_url'))}`);
});
