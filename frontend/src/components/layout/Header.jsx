import React from 'react';
import { useSOC } from '../../context/SOCContext';
import { ShieldCheck, Bell, Activity, LogOut, ShieldAlert, Radio } from 'lucide-react';

export const Header = () => {
  const {
    user,
    role,
    switchRole,
    unreadAlertsCount,
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    wsConnected,
    wsStreamActive,
    setWsStreamActive,
    logout
  } = useSOC();

  return (
    <header className="h-16 bg-surface border-b border-border px-6 flex items-center justify-between sticky top-0 z-30 select-none shadow-sm">
      {/* Left: Brand Identity */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-md shadow-primary/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight text-text-main">
            SecureNet<span className="text-primary font-extrabold">AI</span>
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary-light text-primary border border-primary/20">
            SOC Enterprise v4.2
          </span>
        </div>
      </div>

      {/* Right: Actions, Live Stream Indicator, Role Switcher, Alerts & Profile */}
      <div className="flex items-center space-x-4">
        {/* Live WS Stream Indicator */}
        <button
          onClick={() => setWsStreamActive(!wsStreamActive)}
          title="Click to toggle live telemetry polling/stream"
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-surface-secondary border border-border text-xs font-medium text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors"
        >
          <span className="relative flex h-2.5 w-2.5">
            {wsStreamActive ? (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-healthy opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-healthy"></span>
              </>
            ) : (
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-text-subtle"></span>
            )}
          </span>
          <span>{wsStreamActive ? "WS Stream: Active" : "Stream: Paused"}</span>
        </button>

        {/* Role Quick-Switcher Dropdown */}
        <div className="flex items-center space-x-1.5 bg-surface-secondary px-3 py-1 rounded-lg border border-border">
          <span className="text-xs font-semibold text-text-subtle uppercase tracking-wider">Role:</span>
          <select
            value={role}
            onChange={(e) => switchRole(e.target.value)}
            className="bg-transparent text-xs font-semibold text-text-main focus:outline-none cursor-pointer py-1"
          >
            <option value="Administrator">Administrator (Full Access)</option>
            <option value="Network Security Analyst">Security Analyst (Investigate Only)</option>
            <option value="Employee">Employee (Read-Only Monitor)</option>
          </select>
        </div>

        {/* Alert Notification Bell */}
        <button
          onClick={() => setIsNotificationDrawerOpen(!isNotificationDrawerOpen)}
          className="relative p-2 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors"
          title="Security Alerts Drawer"
        >
          <Bell className="w-5 h-5" />
          {unreadAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-status-critical text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white animate-pulse">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center space-x-3 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary">
            {user?.avatar || "AV"}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-text-main leading-tight">{user?.name || "Alex Vance"}</span>
            <span className="text-[11px] text-text-muted font-medium leading-tight">{role}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          title="Sign out of SOC Console"
          className="p-2 rounded-lg text-text-muted hover:text-status-critical hover:bg-status-critical-bg transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
