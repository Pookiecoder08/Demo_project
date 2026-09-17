import React, { useState } from 'react';
import { useSOC } from '../../context/SOCContext';
import { Lock, Mail, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

export const LoginView = () => {
  const { login } = useSOC();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const result = await login(email, password);
    if (!result?.success) {
      setErrorMessage(result?.error || 'Authentication failed. Please verify credentials in README.md.');
    }
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
            Enterprise Security Operations Center &amp; NIDS Engine
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start space-x-2.5 text-xs text-status-critical animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-status-critical" />
              <div className="leading-snug">
                <span className="font-semibold block">Authentication Error</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-text-main block mb-1.5 flex items-center space-x-1.5">
              <Mail className="w-4 h-4 text-text-muted" />
              <span>Operator Email</span>
            </label>
            <input
              type="email"
              required
              placeholder="e.g. alex.vance@securenet.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs text-text-main focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-text-subtle"
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
              placeholder="Enter your security password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs text-text-main focus:ring-2 focus:ring-primary focus:outline-none transition-all placeholder:text-text-subtle"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-primary/25 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? 'Authenticating...' : 'Authenticate & Enter SOC'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 text-center space-y-1">
            <p className="text-[11px] text-text-subtle">
              Valid credentials for all roles are provided in <code className="text-primary font-semibold bg-primary-light px-1.5 py-0.5 rounded">README.md</code>
            </p>
            <p className="text-[10px] text-text-muted">
              Protected by Suricata NIDS &amp; Multi-Factor Zero-Trust
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
