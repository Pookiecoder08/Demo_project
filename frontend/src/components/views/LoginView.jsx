import React, { useState } from 'react';
import { useSOC } from '../../context/SOCContext';
import { ShieldCheck, Lock, Mail, UserCheck, ArrowRight } from 'lucide-react';

export const LoginView = () => {
  const { login } = useSOC();
  const [role, setRole] = useState('Administrator');
  const [email, setEmail] = useState('alex.vance@securenet.ai');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === 'Administrator') {
      setEmail('alex.vance@securenet.ai');
      setPassword('admin123');
    } else if (newRole === 'Network Security Analyst') {
      setEmail('sarah.jenkins@securenet.ai');
      setPassword('analyst123');
    } else {
      setEmail('employee.vance@securenet.ai');
      setPassword('user123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password, role);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-50 flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-surface rounded-2xl shadow-modal border border-border overflow-hidden">
        {/* Top Brand Banner */}
        <div className="p-8 text-center bg-gradient-to-b from-surface-secondary to-surface border-b border-border">
          <img
            src="/logo-full.png"
            alt="SecureNet AI"
            className="w-20 h-20 object-contain mx-auto drop-shadow-md transition-transform hover:scale-105"
          />
          <h1 className="text-2xl font-extrabold tracking-tight text-text-main mt-3 flex items-center justify-center">
            <span>SecureNet</span>
            <span className="text-sky-500 font-black ml-0.5">AI</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Enterprise Security Operations Center &amp; NIDS Engine v4.2
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Role Preset Selector */}
          <div>
            <label className="text-xs font-bold text-text-main block mb-1.5 flex items-center space-x-1.5">
              <UserCheck className="w-4 h-4 text-primary" />
              <span>Demonstration Access Role</span>
            </label>
            <select
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-surface-secondary text-xs font-semibold text-text-main focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
            >
              <option value="Administrator">Administrator (Full SOC Access & Remediation)</option>
              <option value="Network Security Analyst">Network Security Analyst (Investigation Mode)</option>
              <option value="Employee">Corporate Employee (Read-Only Monitor)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-text-main block mb-1.5 flex items-center space-x-1.5">
              <Mail className="w-4 h-4 text-text-muted" />
              <span>Operator Email</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-text-main block mb-1.5 flex items-center space-x-1.5">
              <Lock className="w-4 h-4 text-text-muted" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-primary/25 transition-all transform active:scale-[0.99]"
            >
              <span>{isLoading ? 'Authenticating...' : 'Authenticate & Enter SOC'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-text-subtle">
              Protected by Suricata NIDS & Multi-Factor Zero-Trust
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
