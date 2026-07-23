import React, { createContext, useContext, useState, useEffect } from 'react';

const INITIAL_PROFILE = {
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
};

const INITIAL_PROJECTS = [
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
];

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [token, setToken] = useState(() => localStorage.getItem('cyber_admin_token') || '');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!localStorage.getItem('cyber_admin_token'));
  const [activeTab, setActiveTab] = useState('portfolio');

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  // GROUND TRUTH DATABASE FETCH FUNCTION
  const refreshFromDatabase = async () => {
    try {
      const [resProf, resProj] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/projects')
      ]);

      if (resProf.ok) {
        const pData = await resProf.json();
        if (pData && pData.name) {
          setProfile(pData);
          localStorage.setItem('cyber_profile', JSON.stringify(pData));
        }
      }

      if (resProj.ok) {
        const prData = await resProj.json();
        if (Array.isArray(prData)) {
          setProjects(prData);
          localStorage.setItem('cyber_projects', JSON.stringify(prData));
        }
      }
    } catch (err) {
      console.log('Database fetch fallback.');
    }
  };

  // Always pull directly from database on mount
  useEffect(() => {
    refreshFromDatabase();
  }, []);

  // Strict Login Handler (Verifies against database password hash)
  const loginAdmin = async (password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setIsAdminLoggedIn(true);
        localStorage.setItem('cyber_admin_token', data.token);
        return { success: true };
      } else {
        const errorData = await res.json();
        return { success: false, error: errorData.error || 'Invalid admin passphrase' };
      }
    } catch (e) {
      return { success: false, error: 'Database connection offline.' };
    }
  };

  const logoutAdmin = () => {
    setToken('');
    setIsAdminLoggedIn(false);
    localStorage.removeItem('cyber_admin_token');
    setActiveTab('portfolio');
  };

  const updatePassword = async (newPass) => {
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword: newPass })
      });
      return res.ok;
    } catch (err) {
      return false;
    }
  };

  const addProject = async (projectData) => {
    const newProj = {
      id: `proj-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...projectData
    };

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newProj)
      });
      if (res.ok) {
        await refreshFromDatabase();
        return;
      }
    } catch (err) {
      console.error('API create error:', err);
    }

    // Fallback sync
    setProjects(prev => [newProj, ...prev]);
  };

  const updateProject = async (id, updatedData) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        await refreshFromDatabase();
        return;
      }
    } catch (err) {
      console.error('API update error:', err);
    }

    // Fallback sync
    setProjects(prev => prev.map(p => String(p.id) === String(id) ? { ...p, ...updatedData } : p));
  };

  const deleteProject = async (id) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        await refreshFromDatabase();
        return;
      }
    } catch (err) {
      console.error('API delete error:', err);
    }

    // Fallback sync
    setProjects(prev => prev.filter(p => String(p.id) !== String(id)));
  };

  const updateProfile = async (updatedData) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      if (res.ok) {
        await refreshFromDatabase();
        return;
      }
    } catch (err) {
      console.error('API profile update error:', err);
    }

    // Fallback sync
    setProfile(prev => ({ ...prev, ...updatedData }));
  };

  const resetDataToDefault = () => {
    setProfile(INITIAL_PROFILE);
    setProjects(INITIAL_PROJECTS);
    localStorage.removeItem('cyber_profile');
    localStorage.removeItem('cyber_projects');
  };

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        projects,
        token,
        isAdminLoggedIn,
        activeTab,
        setActiveTab,
        statusFilter,
        setStatusFilter,
        searchQuery,
        setSearchQuery,
        selectedTag,
        setSelectedTag,
        selectedProject,
        setSelectedProject,
        loginAdmin,
        logoutAdmin,
        updatePassword,
        addProject,
        updateProject,
        deleteProject,
        updateProfile,
        resetDataToDefault,
        refreshFromDatabase
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
