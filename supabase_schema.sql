-- =========================================================
-- SUPABASE DATABASE SCHEMA SETUP FOR PORTFOLIO CMS
-- Copy and paste this script directly into your Supabase SQL Editor.
-- =========================================================

-- 1. Create Admin Auth Table
CREATE TABLE IF NOT EXISTS admin_auth (
  id INT PRIMARY KEY DEFAULT 1,
  password_hash TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Profile Metadata Table
CREATE TABLE IF NOT EXISTS profile (
  id INT PRIMARY KEY DEFAULT 1,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  avatar TEXT,
  banner TEXT,
  status TEXT,
  location TEXT,
  years_experience INT DEFAULT 7,
  projects_completed_count INT DEFAULT 24,
  socials JSONB,
  capabilities JSONB,
  custom_tags JSONB,
  skills JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('completed', 'in-progress', 'planned')),
  category TEXT DEFAULT 'General',
  summary TEXT,
  description TEXT,
  image TEXT,
  tags JSONB,
  github TEXT,
  demo TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS) & Public Read Access
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_auth ENABLE ROW LEVEL SECURITY;

-- Allow public read access to projects and profile
CREATE POLICY "Allow public read access on projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access on profile" ON profile FOR SELECT USING (true);

-- Seed Initial Admin Passphrase Hash (admin123)
INSERT INTO admin_auth (id, password_hash)
VALUES (1, '$2b$10$k4kuRJQb0fedi6Ir0m/q5OIE.M46mVzXgRdsD.QEXWCuT9ruO6q/m')
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Profile
INSERT INTO profile (id, name, title, bio, status, location, years_experience, socials, capabilities, custom_tags, skills)
VALUES (
  1,
  'Alex Mercer',
  'Senior Systems Architect & Full-Stack Cybernetic Engineer',
  'Building scalable decentralized systems, real-time AI pipelines, and high-performance web applications with futuristic UI/UX engineering.',
  'Available for Select Contracts & High-Impact Roles',
  'San Francisco, CA // Global Remote',
  7,
  '{"github": "https://github.com", "linkedin": "https://linkedin.com", "twitter": "https://x.com", "email": "alex.mercer.dev@example.com"}'::jsonb,
  '[{"id": "cap-1", "title": "Distributed Systems Architecture", "description": "Engineered with zero memory overhead, high concurrency, and low latency micro-kernel isolation."}, {"id": "cap-2", "title": "Generative AI & LLM Workflows", "description": "Real-time prompt interpolation and browser-accelerated WebGL pipelines."}]'::jsonb,
  '["React", "TypeScript", "Node.js", "WebSockets", "Tailwind CSS", "Python", "FastAPI", "Docker"]'::jsonb,
  '[{"name": "React / Next.js", "category": "Frontend", "level": 95}, {"name": "Node.js / Express", "category": "Backend", "level": 90}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
