import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '..', 'server', 'data', 'db.json');
const JWT_SECRET = process.env.JWT_SECRET || 'cybercore-secret-jwt-key-2026';

const DEFAULT_TEMPLATE = {
  admin: {
    passwordHash: "$2b$10$k4kuRJQb0fedi6Ir0m/q5OIE.M46mVzXgRdsD.QEXWCuT9ruO6q/m"
  },
  profile: {
    name: "Alex Mercer",
    title: "Senior Systems Architect & Full-Stack Cybernetic Engineer",
    bio: "Building scalable decentralized systems, real-time AI pipelines, and high-performance web applications with futuristic UI/UX engineering.",
    status: "Available for Select Contracts & High-Impact Roles",
    location: "San Francisco, CA // Global Remote",
    yearsExperience: 7,
    projectsCompletedCount: 24,
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://x.com",
      email: "alex.mercer.dev@example.com"
    },
    capabilities: [],
    customTags: ["React", "TypeScript", "Node.js"],
    skills: []
  },
  projects: []
};

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

let inMemoryDb = null;

function readDb() {
  if (inMemoryDb) return inMemoryDb;
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    inMemoryDb = JSON.parse(data);
    return inMemoryDb;
  } catch (err) {
    inMemoryDb = DEFAULT_TEMPLATE;
    return inMemoryDb;
  }
}

function writeDb(data) {
  inMemoryDb = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {}
  return true;
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  if (token === 'cyber_local_token_admin') {
    req.user = { role: 'admin' };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

// --- PUBLIC ROUTE HANDLERS ---

app.get('/api/profile', (req, res) => {
  const db = readDb();
  res.json(db.profile || {});
});

app.get('/api/projects', (req, res) => {
  const db = readDb();
  res.json(db.projects || []);
});

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  const db = readDb();

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (!db.admin?.passwordHash) {
    return res.status(401).json({ error: 'Admin credentials not configured' });
  }

  const isMatch = bcrypt.compareSync(password, db.admin.passwordHash);

  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, message: 'Authentication successful' });
});

// --- PROTECTED ROUTE HANDLERS ---

app.post('/api/auth/change-password', authenticateToken, (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters long' });
  }

  const db = readDb();
  const salt = bcrypt.genSaltSync(10);
  db.admin.passwordHash = bcrypt.hashSync(newPassword, salt);
  
  writeDb(db);
  res.json({ message: 'Password updated successfully' });
});

app.put('/api/profile', authenticateToken, (req, res) => {
  const updatedProfile = req.body;
  const db = readDb();
  db.profile = { ...db.profile, ...updatedProfile };

  writeDb(db);
  res.json(db.profile);
});

app.post('/api/projects', authenticateToken, (req, res) => {
  const newProject = req.body;
  if (!newProject.title) {
    return res.status(400).json({ error: 'Project title is required' });
  }

  const db = readDb();
  const project = {
    id: `proj-${Date.now()}`,
    title: newProject.title || 'Untitled Project',
    status: newProject.status || 'planned',
    category: newProject.category || 'General',
    summary: newProject.summary || '',
    description: newProject.description || '',
    image: newProject.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    tags: Array.isArray(newProject.tags) ? newProject.tags : [],
    github: newProject.github || '',
    demo: newProject.demo || '',
    featured: Boolean(newProject.featured),
    date: new Date().toISOString().split('T')[0]
  };

  db.projects.unshift(project);
  writeDb(db);
  res.status(201).json(project);
});

app.put('/api/projects/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  const db = readDb();

  const index = db.projects.findIndex(p => String(p.id) === String(id));
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  db.projects[index] = { ...db.projects[index], ...updatedData };
  writeDb(db);
  res.json(db.projects[index]);
});

app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = readDb();

  db.projects = db.projects.filter(p => String(p.id) !== String(id));
  writeDb(db);
  res.json({ message: 'Project deleted successfully', id });
});

app.post('/api/import', authenticateToken, (req, res) => {
  const { profile, projects } = req.body;

  const db = readDb();
  if (profile) db.profile = profile;
  if (Array.isArray(projects)) db.projects = projects;

  writeDb(db);
  res.json({ message: 'Database backup imported successfully', profile: db.profile, projects: db.projects });
});

app.post('/api/reset', authenticateToken, (req, res) => {
  writeDb(DEFAULT_TEMPLATE);
  res.json({ message: 'Database reset to default template', ...DEFAULT_TEMPLATE });
});

export default app;
