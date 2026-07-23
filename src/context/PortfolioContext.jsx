import React, { createContext, useContext, useState, useEffect } from 'react';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [profile, setProfile] = useState({});
  const [projects, setProjects] = useState([]);
  const [token, setToken] = useState(() => localStorage.getItem('cyber_admin_token') || '');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!localStorage.getItem('cyber_admin_token'));
  const [activeTab, setActiveTab] = useState('portfolio');

  // Filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  // STRICT DATABASE FETCH (Sole Source of Truth)
  const refreshFromDatabase = async () => {
    try {
      const [resProf, resProj] = await Promise.all([
        fetch('/api/profile'),
        fetch('/api/projects')
      ]);

      if (resProf.ok) {
        const pData = await resProf.json();
        setProfile(pData || {});
      }

      if (resProj.ok) {
        const prData = await resProj.json();
        setProjects(Array.isArray(prData) ? prData : []);
      }
    } catch (err) {
      console.error('Error fetching database state:', err);
    }
  };

  // Always pull directly from database on mount
  useEffect(() => {
    refreshFromDatabase();
  }, []);

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
        return { success: false, error: errorData.error || 'Invalid admin credentials' };
      }
    } catch (e) {
      return { success: false, error: 'Database server connection offline.' };
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
      console.error('API create project error:', err);
    }
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
      console.error('API update project error:', err);
    }
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
      console.error('API delete project error:', err);
    }
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
  };

  // Re-import Downloaded JSON Backup directly into database
  const importBackupJson = async (backupData) => {
    try {
      const res = await fetch('/api/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(backupData)
      });

      if (res.ok) {
        await refreshFromDatabase();
        return { success: true };
      } else {
        const errData = await res.json();
        return { success: false, error: errData.error || 'Failed to import backup' };
      }
    } catch (err) {
      return { success: false, error: 'Database import error' };
    }
  };

  // Reset database back to default template ONLY from CMS
  const resetDataToDefault = async () => {
    try {
      const res = await fetch('/api/reset', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        await refreshFromDatabase();
      }
    } catch (err) {
      console.error('API database reset error:', err);
    }
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
        importBackupJson,
        resetDataToDefault,
        refreshFromDatabase
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
