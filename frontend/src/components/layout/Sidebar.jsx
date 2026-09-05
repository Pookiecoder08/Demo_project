import React from 'react';
import { useSOC } from '../../context/SOCContext';
import {
  LayoutDashboard,
  Network,
  HardDrive,
  ShieldAlert,
  BellRing,
  Cpu,
  ShieldBan,
  Router,
  Server,
  FileBarChart,
  ScrollText,
  Settings
} from 'lucide-react';

export const Sidebar = () => {
  const {
    currentView,
    setCurrentView,
    role,
    activeThreatsCount,
    unreadAlertsCount
  } = useSOC();

  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, access: ['Administrator', 'Network Security Analyst', 'Employee'] },
    { id: 'topology', label: 'Network Topology', icon: Network, access: ['Administrator', 'Network Security Analyst', 'Employee'] },
    { id: 'devices', label: 'Devices', icon: HardDrive, access: ['Administrator', 'Network Security Analyst', 'Employee'] },
    { id: 'threats', label: 'Threat Monitor', icon: ShieldAlert, badge: activeThreatsCount, access: ['Administrator', 'Network Security Analyst', 'Employee'] },
    { id: 'alerts', label: 'Alerts', icon: BellRing, badge: unreadAlertsCount, access: ['Administrator', 'Network Security Analyst', 'Employee'] },
    // Advanced SOC Views (hidden from Employee)
    { id: 'packets', label: 'Packet Analysis', icon: Cpu, access: ['Administrator', 'Network Security Analyst'] },
    { id: 'firewall', label: 'Firewall', icon: ShieldBan, access: ['Administrator', 'Network Security Analyst'] },
    { id: 'routers', label: 'Routers & Switch', icon: Router, access: ['Administrator', 'Network Security Analyst'] },
    { id: 'servers', label: 'Servers', icon: Server, access: ['Administrator', 'Network Security Analyst'] },
    { id: 'reports', label: 'Reports', icon: FileBarChart, access: ['Administrator', 'Network Security Analyst'] },
    { id: 'logs', label: 'SIEM Logs', icon: ScrollText, access: ['Administrator', 'Network Security Analyst'] },
    // Admin only
    { id: 'settings', label: 'System Settings', icon: Settings, access: ['Administrator'] }
  ];

  const visibleItems = allNavItems.filter(item => item.access.includes(role));

  return (
    <aside className="w-60 bg-surface border-r border-border h-[calc(100vh-4rem)] sticky top-16 flex flex-col justify-between p-4 select-none shrink-0 overflow-y-auto">
      {/* Navigation Links */}
      <div className="space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-text-subtle px-3 py-2">
          Operations & Monitoring
        </div>
        {visibleItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? 'bg-primary text-white shadow-sm shadow-primary/30'
                  : 'text-text-muted hover:text-text-main hover:bg-surface-hover'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-text-muted'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-status-critical-bg text-status-critical border border-status-critical-border'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info Card */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="p-3 bg-surface-secondary border border-border rounded-xl">
          <div className="flex items-center space-x-2">
            <span className="badge-dot bg-status-healthy"></span>
            <span className="text-[11px] font-bold text-text-main">NIDS Core Engine</span>
          </div>
          <p className="text-[10px] text-text-muted mt-1">Sensor v4.2 • DB Connected</p>
          <div className="mt-2 pt-2 border-t border-border/60 flex items-center justify-between text-[10px]">
            <span className="text-text-subtle font-medium">Session:</span>
            <span className="font-semibold text-primary">{role}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
