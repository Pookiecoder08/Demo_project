import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../api/client';
import {
  SEED_USERS,
  SEED_METRIC_CARDS,
  SEED_NODES,
  SEED_THREATS,
  SEED_FIREWALL_RULES,
  SEED_ALERTS,
  SEED_PACKETS,
  SEED_LOGS
} from '../data/seedData';

const SOCContext = createContext(null);

export const SOCProvider = ({ children }) => {
  // Auth & RBAC State
  const [user, setUser] = useState(SEED_USERS[0]); // Default: Alex Vance (Administrator)
  const [role, setRole] = useState("Administrator");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Navigation State
  const [currentView, setCurrentView] = useState("login");

  // Slide-over & Modals
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedThreatForResolve, setSelectedThreatForResolve] = useState(null);
  const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);

  // Data Collections
  const [metrics, setMetrics] = useState({
    cards: SEED_METRIC_CARDS,
    packetsCaptured: 1482910,
    threatsActive: 2,
    threatsResolved: 12,
    firewallRulesCount: 4,
    ppsCurrent: 14200,
    throughputMbps: 840.5
  });
  const [nodes, setNodes] = useState(SEED_NODES);
  const [threats, setThreats] = useState(SEED_THREATS);
  const [firewallRules, setFirewallRules] = useState(SEED_FIREWALL_RULES);
  const [alerts, setAlerts] = useState(SEED_ALERTS);
  const [packets, setPackets] = useState(SEED_PACKETS);
  const [logs, setLogs] = useState(SEED_LOGS);

  // WebSocket State
  const [wsConnected, setWsConnected] = useState(false);
  const [wsStreamActive, setWsStreamActive] = useState(true);
  const [isSiteLoading, setIsSiteLoading] = useState(true);

  // Toast Queue State (Max 2 visible, rest queued)
  const [toastQueue, setToastQueue] = useState([]);
  const [visibleToasts, setVisibleToasts] = useState([
    {
      id: "toast-init-1",
      title: "Critical SQL Injection Signature Triggered",
      severity: "critical",
      description: "Suricata SID: 2010992 - UNION SELECT pattern detected against Primary Database host.",
      asset: "db-server (192.168.1.50)",
      threatId: "TRT-2026-8801",
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: "toast-init-2",
      title: "High Inbound UDP Volume on Gateway",
      severity: "critical",
      description: "Traffic spike exceeding 12 Gbps threshold on Cisco Catalyst interface Te1/0/1.",
      asset: "router (192.168.1.254)",
      threatId: "TRT-2026-8802",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const addToast = useCallback((toastData) => {
    const newToast = {
      id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toLocaleTimeString(),
      ...toastData
    };
    setVisibleToasts(prev => {
      if (prev.length < 2) {
        return [...prev, newToast];
      } else {
        setToastQueue(q => [...q, newToast]);
        return prev;
      }
    });
  }, []);

  const dismissToast = useCallback((id) => {
    setVisibleToasts(prev => {
      const updated = prev.filter(t => t.id !== id);
      // If there's an item in queue, promote next item
      setToastQueue(q => {
        if (q.length > 0 && updated.length < 2) {
          const [next, ...rest] = q;
          updated.push(next);
          return rest;
        }
        return q;
      });
      return updated;
    });
  }, []);

  // Role Switching with Permission Enforcement
  const switchRole = useCallback((newRole) => {
    const targetUser = SEED_USERS.find(u => u.role === newRole) || {
      name: `${newRole} User`,
      email: `${newRole.toLowerCase().replace(/\s+/g, '.')}@securenet.ai`,
      role: newRole,
      avatar: newRole.charAt(0)
    };
    setUser(targetUser);
    setRole(newRole);

    addToast({
      title: `Active Role Changed: ${newRole}`,
      severity: "info",
      description: `Switched view context to ${newRole}. Permissions updated.`,
      asset: "SOC Console"
    });

    // If employee switches and is on an advanced view, redirect to dashboard
    if (newRole === "Employee") {
      const allowed = ["dashboard", "topology", "devices", "threats", "alerts"];
      if (!allowed.includes(currentView)) {
        setCurrentView("dashboard");
      }
    }
  }, [currentView, addToast]);

  const login = useCallback(async (email, password, chosenRole) => {
    const res = await apiClient.login(email, password, chosenRole);
    if (res && res.user) {
      setUser(res.user);
      setRole(res.user.role);
      setIsAuthenticated(true);
      setCurrentView("dashboard");
      addToast({
        title: "Session Authenticated",
        severity: "healthy",
        description: `Welcome back, ${res.user.name}. SOC Session Established.`,
        asset: "Authentication"
      });
    }
  }, [addToast]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentView("login");
    addToast({
      title: "Session Terminated",
      severity: "info",
      description: "User logged out of SecureNetAI Enterprise SOC.",
      asset: "Auth Gate"
    });
  }, [addToast]);

  // Initial Data Fetching from API (with fallback)
  const refreshTelemetry = useCallback(async () => {
    try {
      const [m, n, t, fw, a, p, l] = await Promise.all([
        apiClient.getDashboardMetrics(),
        apiClient.getTopologyNodes(),
        apiClient.getThreats(),
        apiClient.getFirewallRules(),
        apiClient.getAlerts(),
        apiClient.getPackets(),
        apiClient.getLogs()
      ]);
      if (m) setMetrics(m);
      if (n && n.length) setNodes(n);
      if (t && t.length) setThreats(t);
      if (fw && fw.length) setFirewallRules(fw);
      if (a && a.length) setAlerts(a);
      if (p && p.length) setPackets(p);
      if (l && l.length) setLogs(l);
    } catch (e) {
      console.warn("Telemetry refresh error:", e);
    }
  }, []);

  useEffect(() => {
    const initApp = async () => {
      await refreshTelemetry();
      setTimeout(() => {
        setIsSiteLoading(false);
      }, 1500);
    };
    initApp();
  }, [refreshTelemetry]);

  // WebSocket Live Stream Connection
  useEffect(() => {
    const ws = apiClient.createWebSocket(
      (msg) => {
        if (msg.type === "TELEMETRY_UPDATE") {
          setMetrics(prev => ({
            ...prev,
            packetsCaptured: msg.data.packetsCaptured,
            ppsCurrent: msg.data.ppsCurrent,
            throughputMbps: msg.data.throughputMbps
          }));
        } else if (msg.type === "STREAM_CONNECTED") {
          setWsConnected(true);
        }
      },
      () => setWsConnected(true),
      () => setWsConnected(false)
    );

    return () => {
      if (ws) ws.close();
    };
  }, []);

  // Threat Resolution Logic
  const resolveThreat = useCallback(async (threatId, action, notes) => {
    if (role !== "Administrator") {
      addToast({
        title: "Permission Denied",
        severity: "critical",
        description: "Requires Administrator privileges to resolve threats.",
        asset: "RBAC Guard"
      });
      return false;
    }

    const res = await apiClient.resolveThreat(threatId, action, notes, user.name);
    if (res && res.success) {
      setThreats(prev => prev.map(t => {
        if (t.id === threatId || t.ticket_id === threatId) {
          return {
            ...t,
            status: "Resolved",
            action_taken: action,
            admin_notes: notes,
            resolved_by: user.name,
            resolved_at: new Date().toISOString()
          };
        }
        return t;
      }));

      // Update metric counters
      setMetrics(prev => ({
        ...prev,
        threatsActive: Math.max(0, prev.threatsActive - 1),
        threatsResolved: prev.threatsResolved + 1
      }));

      addToast({
        title: `Threat ${threatId} Resolved`,
        severity: "healthy",
        description: `Action Applied: ${action}. Threat ticket updated to Resolved.`,
        asset: "SOC Triage Engine"
      });
      return true;
    }
    return false;
  }, [role, user.name, addToast]);

  // Firewall Rule Creation
  const addFirewallRule = useCallback(async (ruleData) => {
    if (role !== "Administrator") {
      addToast({
        title: "Permission Denied",
        severity: "critical",
        description: "Requires Administrator privileges to add firewall rules.",
        asset: "RBAC Guard"
      });
      return false;
    }

    const created = await apiClient.createFirewallRule(ruleData);
    if (created) {
      setFirewallRules(prev => [...prev, created]);
      setMetrics(prev => ({ ...prev, firewallRulesCount: prev.firewallRulesCount + 1 }));
      addToast({
        title: `Firewall Rule #${created.rule_number} Added`,
        severity: "healthy",
        description: `ACL policy created: ${created.name} (${created.action} ${created.direction})`,
        asset: "PA-5250 Firewall"
      });
      return true;
    }
    return false;
  }, [role, addToast]);

  // Firewall Rule Toggle
  const toggleFirewallRule = useCallback(async (ruleId) => {
    if (role !== "Administrator") {
      addToast({
        title: "Permission Denied",
        severity: "critical",
        description: "Requires Administrator privileges to toggle rules.",
        asset: "RBAC Guard"
      });
      return;
    }
    setFirewallRules(prev => prev.map(r => {
      if (r.id === ruleId || r.rule_number === ruleId) {
        return { ...r, is_active: !r.is_active };
      }
      return r;
    }));
    await apiClient.toggleFirewallRule(ruleId);
    addToast({
      title: "Firewall Rule Updated",
      severity: "info",
      description: `Rule #${ruleId} state toggled.`,
      asset: "PA-5250 Firewall"
    });
  }, [role, addToast]);

  // Alert Acknowledge
  const acknowledgeAlert = useCallback(async (alertId) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId || a.alert_id === alertId) {
        return { ...a, is_acknowledged: true };
      }
      return a;
    }));
    await apiClient.acknowledgeAlert(alertId);
    addToast({
      title: "Alert Acknowledged",
      severity: "healthy",
      description: `Alert ticket ${alertId} marked as acknowledged.`,
      asset: "SIEM Console"
    });
  }, [addToast]);

  // RBAC Permission Helpers
  const canResolveThreats = role === "Administrator";
  const canManageFirewall = role === "Administrator";
  const canEditSettings = role === "Administrator";
  const canViewAdvancedSOC = role !== "Employee";

  const activeThreatsCount = threats.filter(t => t.status !== "Resolved").length;
  const unreadAlertsCount = alerts.filter(a => !a.is_acknowledged).length;

  return (
    <SOCContext.Provider
      value={{
        user,
        role,
        switchRole,
        isAuthenticated,
        login,
        logout,
        currentView,
        setCurrentView,
        canResolveThreats,
        canManageFirewall,
        canEditSettings,
        canViewAdvancedSOC,
        // Data
        metrics,
        nodes,
        threats,
        firewallRules,
        alerts,
        packets,
        logs,
        activeThreatsCount,
        unreadAlertsCount,
        refreshTelemetry,
        // Slide-over & Modals
        selectedNode,
        setSelectedNode,
        selectedThreatForResolve,
        setSelectedThreatForResolve,
        isAddRuleModalOpen,
        setIsAddRuleModalOpen,
        isNotificationDrawerOpen,
        setIsNotificationDrawerOpen,
        // Handlers
        resolveThreat,
        addFirewallRule,
        toggleFirewallRule,
        acknowledgeAlert,
        // Toasts
        toastQueue,
        visibleToasts,
        addToast,
        dismissToast,
        // WebSocket
        wsConnected,
        wsStreamActive,
        setWsStreamActive,
        // Site Loading State
        isSiteLoading,
        setIsSiteLoading
      }}
    >
      {children}
    </SOCContext.Provider>
  );
};

export const useSOC = () => {
  const context = useContext(SOCContext);
  if (!context) {
    throw new Error("useSOC must be used within a SOCProvider");
  }
  return context;
};
