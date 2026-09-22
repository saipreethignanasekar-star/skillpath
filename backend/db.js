import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, 'data');
const usersFilePath = path.join(dataDir, 'users.json');

// Helper to manage JSON fallback storage
const readLocalUsers = () => {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (!fs.existsSync(usersFilePath)) {
      fs.writeFileSync(usersFilePath, '[]', 'utf-8');
      return [];
    }
    const raw = fs.readFileSync(usersFilePath, 'utf-8');
    return JSON.parse(raw) || [];
  } catch (err) {
    console.error('Error reading local users.json:', err);
    return [];
  }
};

const writeLocalUsers = (users) => {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local users.json:', err);
  }
};

let pool = null;
let isNeonConnected = false;
let connectionError = null;

// Initialize Neon PostgreSQL Database
export const initDatabase = async () => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl || databaseUrl.trim() === '' || databaseUrl.includes('your_neon_database_url')) {
    console.log('ℹ️  No DATABASE_URL configured in .env. Using local JSON database (backend/data/users.json).');
    isNeonConnected = false;
    return;
  }

  try {
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 10000
    });

    // Test connection
    const client = await pool.connect();
    console.log('⚡ Connected successfully to Neon PostgreSQL Database!');
    isNeonConnected = true;
    connectionError = null;

    // Create table if not exists
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        password VARCHAR(255),
        avatar TEXT,
        auth_provider VARCHAR(50) DEFAULT 'local',
        google_id VARCHAR(255),
        github_id VARCHAR(255),
        college VARCHAR(255),
        current_year VARCHAR(100),
        department VARCHAR(255),
        target_role VARCHAR(255) DEFAULT 'Cloud Engineer',
        career_readiness INTEGER DEFAULT 0,
        verified_skills JSONB DEFAULT '[]'::jsonb,
        detected_skills JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    await client.query(createTableQuery);
    client.release();
    console.log('✅ Neon DB table schema verified.');
  } catch (error) {
    console.error('⚠️  Failed to connect to Neon PostgreSQL database:', error.message);
    console.log('👉 Falling back to local storage (backend/data/users.json).');
    isNeonConnected = false;
    connectionError = error.message;
  }
};

// Database Status Helper
export const getDbStatus = () => {
  return {
    provider: isNeonConnected ? 'neon_postgres' : 'local_json',
    connected: isNeonConnected,
    databaseUrlSet: Boolean(process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('your_neon_database_url')),
    error: connectionError
  };
};

// Find User by Email
export const getUserByEmail = async (email) => {
  const normalized = email.trim().toLowerCase();

  if (isNeonConnected && pool) {
    try {
      const res = await pool.query('SELECT * FROM users WHERE LOWER(email) = $1 LIMIT 1', [normalized]);
      if (res.rows.length > 0) {
        const row = res.rows[0];
        return {
          id: row.id,
          email: row.email,
          name: row.name || '',
          password: row.password || '',
          avatar: row.avatar || '',
          authProvider: row.auth_provider || 'local',
          googleId: row.google_id || null,
          githubId: row.github_id || null,
          college: row.college || '',
          currentYear: row.current_year || '',
          department: row.department || '',
          targetRole: row.target_role || 'Cloud Engineer',
          careerReadiness: row.career_readiness || 0,
          verifiedSkills: Array.isArray(row.verified_skills) ? row.verified_skills : (typeof row.verified_skills === 'string' ? JSON.parse(row.verified_skills || '[]') : []),
          detectedSkills: Array.isArray(row.detected_skills) ? row.detected_skills : (typeof row.detected_skills === 'string' ? JSON.parse(row.detected_skills || '[]') : []),
          createdAt: row.created_at
        };
      }
      return null;
    } catch (err) {
      console.error('Neon getUserByEmail error, falling back to local:', err.message);
    }
  }

  // Fallback
  const users = readLocalUsers();
  return users.find(u => u.email.toLowerCase() === normalized) || null;
};

// Create New User
export const createUser = async (userData) => {
  const normalized = userData.email.trim().toLowerCase();
  const id = userData.id || `usr_${Date.now()}`;
  const user = {
    id,
    email: normalized,
    name: userData.name?.trim() || '',
    password: userData.password || '',
    avatar: userData.avatar || '',
    authProvider: userData.authProvider || 'local',
    googleId: userData.googleId || null,
    githubId: userData.githubId || null,
    college: userData.college?.trim() || '',
    currentYear: userData.currentYear || '',
    department: userData.department?.trim() || '',
    targetRole: userData.targetRole || 'Cloud Engineer',
    careerReadiness: userData.careerReadiness || 0,
    verifiedSkills: userData.verifiedSkills || [],
    detectedSkills: userData.detectedSkills || [],
    createdAt: new Date().toISOString()
  };

  if (isNeonConnected && pool) {
    try {
      const insertQuery = `
        INSERT INTO users (
          id, email, name, password, avatar, auth_provider, google_id, github_id,
          college, current_year, department, target_role, career_readiness,
          verified_skills, detected_skills, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, NOW(), NOW())
        RETURNING *;
      `;
      const values = [
        user.id,
        user.email,
        user.name,
        user.password,
        user.avatar,
        user.authProvider,
        user.googleId,
        user.githubId,
        user.college,
        user.currentYear,
        user.department,
        user.targetRole,
        user.careerReadiness,
        JSON.stringify(user.verifiedSkills),
        JSON.stringify(user.detectedSkills)
      ];
      await pool.query(insertQuery, values);
    } catch (err) {
      console.error('Neon createUser error, saving to local:', err.message);
    }
  }

  // Always keep local sync as mirror/fallback
  const users = readLocalUsers();
  const existingIdx = users.findIndex(u => u.email.toLowerCase() === normalized);
  if (existingIdx >= 0) {
    users[existingIdx] = user;
  } else {
    users.push(user);
  }
  writeLocalUsers(users);

  return user;
};

// Find or Create OAuth User (Google / GitHub)
export const findOrCreateOAuthUser = async ({ provider, providerId, email, name, avatar }) => {
  const normalizedEmail = (email || `${provider}_${providerId}@auth.skillx.internal`).trim().toLowerCase();
  let existingUser = await getUserByEmail(normalizedEmail);

  if (existingUser) {
    // Update existing user with provider details if needed
    if (isNeonConnected && pool) {
      try {
        const idField = provider === 'google' ? 'google_id' : 'github_id';
        await pool.query(
          `UPDATE users SET ${idField} = $1, avatar = COALESCE(avatar, $2), updated_at = NOW() WHERE LOWER(email) = $3`,
          [providerId, avatar || '', normalizedEmail]
        );
      } catch (err) {
        console.error('Neon update OAuth error:', err.message);
      }
    }
    return existingUser;
  }

  // Create new user for OAuth sign in
  const newUser = await createUser({
    id: `usr_${provider}_${Date.now()}`,
    email: normalizedEmail,
    name: name || `${provider === 'google' ? 'Google' : 'GitHub'} User`,
    avatar: avatar || '',
    authProvider: provider,
    googleId: provider === 'google' ? providerId : null,
    githubId: provider === 'github' ? providerId : null,
    college: 'Campus / Self Taught',
    currentYear: '1st Year',
    department: 'Computer Science',
    targetRole: 'Cloud Engineer',
    careerReadiness: 25,
    verifiedSkills: provider === 'github' ? ['Git', 'GitHub'] : ['Cloud Foundations']
  });

  return newUser;
};

// Get all users summary
export const getAllUsers = async () => {
  if (isNeonConnected && pool) {
    try {
      const res = await pool.query('SELECT id, name, email, avatar, college, target_role, created_at FROM users ORDER BY created_at DESC');
      return res.rows.map(r => ({
        id: r.id,
        name: r.name,
        email: r.email,
        avatar: r.avatar,
        college: r.college,
        targetRole: r.target_role,
        createdAt: r.created_at
      }));
    } catch (err) {
      console.error('Neon getAllUsers error:', err.message);
    }
  }

  return readLocalUsers().map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    avatar: u.avatar || '',
    college: u.college,
    targetRole: u.targetRole,
    createdAt: u.createdAt
  }));
};
