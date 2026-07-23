import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Shield, Lock, Eye, EyeOff, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function AdminLogin() {
  const { loginAdmin, setActiveTab } = usePortfolio();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await loginAdmin(password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#070709]">
      
      {/* Header */}
      <header className="w-full border-b border-[#222226] bg-[#0E0E11] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-blue-600 flex items-center justify-center text-white font-mono text-sm font-bold">
            ✦
          </div>
          <div className="font-heading font-extrabold text-base text-white tracking-tight">
            Admin Security Portal
          </div>
        </div>

        <button
          onClick={() => setActiveTab('portfolio')}
          className="btn-dark-action text-xs px-3.5 py-1.5 flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Site</span>
        </button>
      </header>

      {/* Login Form */}
      <div className="grow flex items-center justify-center px-4 py-12">
        <div className="brand-card-grid w-full max-w-md p-8 border border-[#222226] bg-[#0E0E11] shadow-2xl">
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#16161A] border border-[#222226] text-white mx-auto flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-[#38BDF8]" />
            </div>
            <h2 className="text-2xl font-extrabold font-heading text-[#FAFAFA]">
              Admin Authentication
            </h2>
            <p className="text-xs font-mono text-[#8E8E93] mt-1">
              Enter admin passphrase to access portfolio CMS
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[#FAFAFA] mb-1.5 font-semibold">ADMIN PASSPHRASE</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8E8E93] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin passphrase"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#16161A] border border-[#222226] text-[#FAFAFA] placeholder-[#8E8E93] text-xs focus:outline-none focus:border-[#383840]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E8E93] hover:text-[#FAFAFA]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-white-action py-3 rounded-xl text-xs flex items-center justify-center gap-2 font-bold shadow-lg"
            >
              {loading ? 'Authenticating...' : 'Authenticate & Enter CMS'}
            </button>
          </form>

        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-[#222226] bg-[#070709] px-6 py-4 text-center font-mono text-xs text-[#8E8E93]">
        Admin Security Portal // Encrypted Session Protection
      </footer>

    </div>
  );
}
