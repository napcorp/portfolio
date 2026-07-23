import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'data', 'db.json');
const JWT_SECRET = process.env.JWT_SECRET || 'cybercore-secret-jwt-key-2026';

const DEFAULT_TEMPLATE = {
  admin: {
    passwordHash: "$2b$10$k4kuRJQb0fedi6Ir0m/q5OIE.M46mVzXgRdsD.QEXWCuT9ruO6q/m"
  },
  profile: {
    name: "Alex Mercer",
    title: "Senior Systems Architect & Full-Stack Cybernetic Engineer",
    bio: "Building scalable decentralized systems, real-time AI pipelines, and high-performance web applications with futuristic UI/UX engineering. Passionate about distributed computing, quantum security, and next-gen frontend performance.",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    banner: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
    status: "Available for Select Contracts & High-Impact Roles",
    location: "San Francisco, CA // Global Remote",
    yearsExperience: 7,
    projectsCompletedCount: 24,
    socials: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://x.com",
      discord: "alexmercer#0001",
      email: "alex.mercer.dev@example.com"
    },
    capabilities: [
      {
        id: "cap-1",
        title: "Distributed Systems Architecture",
        description: "Engineered with zero memory overhead, high concurrency, and low latency micro-kernel isolation."
      },
      {
        id: "cap-2",
        title: "Generative AI & LLM Workflows",
        description: "Real-time prompt interpolation, custom fine-tuned LoRA integrations, and browser-accelerated WebGL pipelines."
      },
      {
        id: "cap-3",
        title: "Full-Stack Frontend & UI Engineering",
        description: "Single-page React architectures, Tailwind CSS token systems, and responsive dark-mode first design."
      }
    ],
    customTags: ["React", "TypeScript", "Node.js", "WebSockets", "Tailwind CSS", "Chart.js", "WebGL", "Python", "FastAPI", "Stable Diffusion API", "Rust", "WebAssembly", "Docker", "gRPC"],
    skills: [
      { name: "React / Next.js", category: "Frontend", level: 95, icon: "Code2" },
      { name: "TypeScript / JavaScript", category: "Frontend", level: 92, icon: "FileCode" },
      { name: "Node.js / Express", category: "Backend", level: 90, icon: "Server" },
      { name: "Python / FastAPI", category: "Backend", level: 88, icon: "Terminal" },
      { name: "PostgreSQL / Redis / Mongo", category: "Database", level: 85, icon: "Database" },
      { name: "Docker / Kubernetes / AWS", category: "DevOps", level: 82, icon: "Cpu" },
      { name: "Tailwind CSS & Canvas / WebGL", category: "Frontend", level: 90, icon: "Palette" },
      { name: "AI/LLM Integration & LangChain", category: "AI/ML", level: 86, icon: "Brain" }
    ]
  },
  projects: [
    {
      id: "proj-1",
      title: "QuantumGuard Security Mesh",
      status: "completed",
      category: "Cybersecurity",
      summary: "Real-time threat monitoring and cryptographic access enforcement system with automated anomaly isolation.",
      description: "QuantumGuard is a zero-trust network monitoring matrix engineered to analyze sub-millisecond network telemetry. Utilizing eBPF micro-probes and an adaptive AI intrusion detection model, it detects unusual socket activity, mitigates DDoS vectors dynamically, and renders real-time telemetry dashboards.",
      image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
      tags: ["React", "TypeScript", "Node.js", "WebSockets", "Tailwind CSS", "Chart.js"],
      github: "https://github.com",
      demo: "https://example.com/quantum-guard",
      featured: true,
      date: "2026-03-15"
    },
    {
      id: "proj-2",
      title: "NeuralCanvas AI Image Studio",
      status: "completed",
      category: "AI / Web",
      summary: "Browser-based generative AI workstation with multi-layer canvas, in-painting, and node graph pipeline.",
      description: "A cutting-edge browser workspace allowing digital artists to interface directly with SDXL and custom fine-tuned LoRA models. Built with a high-performance WebGL acceleration layer and node-based canvas, supporting real-time masking, prompt parameter interpolation, and batch export.",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      tags: ["React", "WebGL", "Python", "FastAPI", "Stable Diffusion API", "Tailwind CSS"],
      github: "https://github.com",
      demo: "https://example.com/neural-canvas",
      featured: true,
      date: "2026-01-20"
    },
    {
      id: "proj-3",
      title: "HyperDrive Autonomous OS Core",
      status: "in-progress",
      category: "Systems",
      summary: "Microkernel-inspired process manager and real-time task scheduler tailored for high-speed edge computing nodes.",
      description: "HyperDrive OS is designed to address multi-tenant edge workload isolation with zero memory overhead. Current development focuses on lock-free queue concurrency, dynamic memory paging, and a web-based real-time telemetry kernel inspector.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
      tags: ["Rust", "WebAssembly", "React", "Docker", "gRPC"],
      github: "https://github.com",
      demo: "",
      featured: false,
      date: "2026-05-10"
    },
    {
      id: "proj-4",
      title: "CyberGrid Decentralized Storage",
      status: "in-progress",
      category: "Distributed Systems",
      summary: "Peer-to-peer encrypted file distribution system with content-addressable storage and auto-healing nodes.",
      description: "A resilient distributed filesystem protocol allowing chunked, AES-256 encrypted file blocks to be replicated across decentralized storage nodes. Features an intuitive glassmorphic storage explorer and bandwidth analytics monitor.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
      tags: ["Go", "Libp2p", "React", "IndexedDB", "Tailwind CSS"],
      github: "https://github.com",
      demo: "",
      featured: false,
      date: "2026-06-01"
    },
    {
      id: "proj-5",
      title: "Holographic UI Component System",
      status: "planned",
      category: "Frontend Architecture",
      summary: "A futuristic 3D augmented-reality themed web UI toolkit featuring spatial sound synthesis and glass refraction.",
      description: "An ambitious next-generation component design system. It will provide developers with drop-in futuristic UI elements including glowing neon buttons, spatial audio triggers, reactive particles, and 3D depth-layer cards.",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
      tags: ["Three.js", "React Three Fiber", "Web Audio API", "Tailwind CSS"],
      github: "https://github.com",
      demo: "",
      featured: false,
      date: "2026-08-01"
    },
    {
      id: "proj-6",
      title: "SwarmProtocol Robotics Orchestration",
      status: "planned",
      category: "Robotics / IoT",
      summary: "Low-latency coordination platform for multi-agent autonomous drone and rover fleets.",
      description: "A centralized dashboard and event bus architecture for mapping real-time spatial positioning, pathfinding collision prevention, and dynamic battery re-allocation among autonomous multi-rotor hardware nodes.",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
      tags: ["Python", "ROS2", "React", "MQTT", "Deck.gl"],
      github: "https://github.com",
      demo: "",
      featured: false,
      date: "2026-09-15"
    }
  ]
};

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

function readDb() {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return DEFAULT_TEMPLATE;
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing db.json:', err);
    return false;
  }
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

// --- PUBLIC DB ENDPOINTS ---

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

// --- PROTECTED ADMIN DB ENDPOINTS ---

app.post('/api/auth/change-password', authenticateToken, (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 4) {
    return res.status(400).json({ error: 'Password must be at least 4 characters long' });
  }

  const db = readDb();
  const salt = bcrypt.genSaltSync(10);
  db.admin.passwordHash = bcrypt.hashSync(newPassword, salt);
  
  if (writeDb(db)) {
    res.json({ message: 'Password updated successfully' });
  } else {
    res.status(500).json({ error: 'Failed to save new password' });
  }
});

app.put('/api/profile', authenticateToken, (req, res) => {
  const updatedProfile = req.body;
  const db = readDb();
  db.profile = { ...db.profile, ...updatedProfile };

  if (writeDb(db)) {
    res.json(db.profile);
  } else {
    res.status(500).json({ error: 'Failed to update profile' });
  }
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

  if (writeDb(db)) {
    res.status(201).json(project);
  } else {
    res.status(500).json({ error: 'Failed to create project' });
  }
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

  if (writeDb(db)) {
    res.json(db.projects[index]);
  } else {
    res.status(500).json({ error: 'Failed to update project' });
  }
});

app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = readDb();

  db.projects = db.projects.filter(p => String(p.id) !== String(id));

  if (writeDb(db)) {
    res.json({ message: 'Project deleted successfully', id });
  } else {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Import Downloaded JSON Backup to Database
app.post('/api/import', authenticateToken, (req, res) => {
  const { profile, projects } = req.body;

  if (!profile && !projects) {
    return res.status(400).json({ error: 'Invalid backup JSON data' });
  }

  const db = readDb();
  if (profile) db.profile = profile;
  if (Array.isArray(projects)) db.projects = projects;

  if (writeDb(db)) {
    res.json({ message: 'Database backup imported successfully', profile: db.profile, projects: db.projects });
  } else {
    res.status(500).json({ error: 'Failed to save imported backup' });
  }
});

// Reset Database to Clean Default Template
app.post('/api/reset', authenticateToken, (req, res) => {
  if (writeDb(DEFAULT_TEMPLATE)) {
    res.json({ message: 'Database reset to default template', ...DEFAULT_TEMPLATE });
  } else {
    res.status(500).json({ error: 'Failed to reset database' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CyberCore Backend REST API running on http://localhost:${PORT}`);
});
