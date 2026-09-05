import React, { useState } from 'react';
import { useSOC } from '../../context/SOCContext';
import {
  Settings as SettingsIcon,
  Shield,
  Users,
  Network,
  Radio,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Save,
  RefreshCw,
  Cpu
} from 'lucide-react';

export const SettingsView = () => {
  const { role, canEditSettings, addToast } = useSOC();

  const [activeTab, setActiveTab] = useState('detection'); // 'detection' | 'rbac' | 'interfaces' | 'engine'

  // Detection Rules State
  const [detectionRules, setDetectionRules] = useState([
    { id: 'sqli_detection', name: 'SQL Injection Signature Engine', category: 'Application Layer', desc: 'Inspects SQL tokens, UNION SELECT patterns, and blind time delays.', active: true, critical: true },
    { id: 'xss_heuristics', name: 'Cross-Site Scripting (XSS) Heuristics', category: 'Application Layer', desc: 'Detects script tags, SVG onload handlers, and DOM manipulation strings.', active: true, critical: false },
    { id: 'ddos_threshold_analysis', name: 'DDoS / Syn-Flood Threshold Rate Limiting', category: 'Transport Layer', desc: 'Triggers automated rate limiting when PPS exceeds 25,000 pps per subnet.', active: true, critical: true },
    { id: 'brute_force_mitigation', name: 'SSH & RDP Brute Force Detection', category: 'Authentication', desc: 'Flags source IPs with > 5 failed credential exchanges in 60 seconds.', active: true, critical: true },
    { id: 'port_scan_detection', name: 'Nmap & Stealth SYN Port Scan Analyzer', category: 'Reconnaissance', desc: 'Detects sequential port probes and TCP NULL/FIN scans.', active: true, critical: false },
    { id: 'dns_tunneling_inspection', name: 'DNS Exfiltration & Fast Flux Detection', category: 'DNS / Protocol', desc: 'Monitors long entropy subdomains and high-frequency TXT lookups.', active: true, critical: true },
    { id: 'zero_day_behavioral_model', name: 'Antigravity AI Zero-Day Anomaly Classifier', category: 'Machine Learning', desc: 'Deep autoencoder neural network detecting zero-day traffic aberrations.', active: false, critical: false }
  ]);

  // Network Interfaces State
  const [interfaces, setInterfaces] = useState([
    { name: 'eth0', alias: 'WAN / Internet Transit', promiscuous: true, mtu: 1500, status: 'UP', speed: '10 Gbps', rx_drops: 0 },
    { name: 'eth1', alias: 'LAN / Corporate Workstations', promiscuous: true, mtu: 1500, status: 'UP', speed: '1 Gbps', rx_drops: 12 },
    { name: 'eth2', alias: 'DMZ / Application Cluster', promiscuous: true, mtu: 1500, status: 'UP', speed: '10 Gbps', rx_drops: 0 },
    { name: 'eth3', alias: 'HA Heartbeat & Sync Bus', promiscuous: false, mtu: 9000, status: 'UP', speed: '25 Gbps', rx_drops: 0 }
  ]);

  // Engine Configuration State
  const [engineConfig, setEngineConfig] = useState({
    samplingRateHz: 10,
    ringBufferSizeMb: 2048,
    suricataSocket: '/var/run/suricata/suricata-command.socket',
    eveLogPath: '/var/log/suricata/eve.json',
    logRetentionDays: 90,
    wsBroadcastIntervalMs: 1000
  });

  const toggleRule = (ruleId) => {
    if (!canEditSettings) {
      addToast({
        title: 'Permission Denied',
        severity: 'critical',
        description: 'Requires Administrator privileges to modify intrusion detection rules.',
        asset: 'RBAC Policy Guard'
      });
      return;
    }

    setDetectionRules(prev =>
      prev.map(r => r.id === ruleId ? { ...r, active: !r.active } : r)
    );
  };

  const handleSaveSettings = () => {
    if (!canEditSettings) {
      addToast({
        title: 'Permission Denied',
        severity: 'critical',
        description: 'Requires Administrator privileges to save settings.',
        asset: 'RBAC Policy Guard'
      });
      return;
    }

    addToast({
      title: 'Settings Saved Successfully',
      severity: 'healthy',
      description: 'NIDS detection signatures, interface states, and engine parameters applied.',
      asset: 'System Config'
    });
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main flex items-center space-x-2">
            <SettingsIcon className="w-5 h-5 text-primary" />
            <span>Enterprise NIDS & SOC System Configuration</span>
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Role-Based Access Control matrix, heuristic detection signatures, physical interface bindings, and telemetry engine
          </p>
        </div>

        {/* Save Changes Button */}
        <button
          onClick={handleSaveSettings}
          disabled={!canEditSettings}
          title={!canEditSettings ? 'Requires Administrator privileges' : 'Commit changes to system'}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            canEditSettings
              ? 'bg-primary hover:bg-primary-hover text-white shadow-primary/20 cursor-pointer'
              : 'bg-surface-secondary text-text-subtle border border-border cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex border-b border-border space-x-6 text-xs font-bold">
        {[
          { id: 'detection', label: 'Intrusion Detection Signatures', icon: Shield },
          { id: 'rbac', label: 'RBAC Permissions Matrix', icon: Users },
          { id: 'interfaces', label: 'Network Interfaces & Tap Ports', icon: Network },
          { id: 'engine', label: 'NIDS Engine & Telemetry', icon: Sliders }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 pb-3 transition-colors border-b-2 ${
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-main'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Intrusion Detection Rules */}
      {activeTab === 'detection' && (
        <div className="space-y-4">
          <div className="p-4 bg-primary-light/50 border border-primary/20 rounded-2xl flex items-start space-x-3">
            <Cpu className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-bold text-primary">Suricata & Heuristic Engine Signatures</span>
              <p className="text-text-muted mt-0.5">
                Toggle active inspection rules across Layer 3 through Layer 7. Disabling critical rules may reduce SOC visibility.
                {!canEditSettings && (
                  <span className="text-status-warning font-semibold ml-1">
                    (Read-only: You are logged in as {role}).
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-border divide-y divide-border overflow-hidden">
            {detectionRules.map((rule) => (
              <div key={rule.id} className="p-4 flex items-center justify-between hover:bg-surface-secondary/40 transition-colors">
                <div className="space-y-1 pr-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-text-main">{rule.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-surface-secondary text-text-muted border border-border">
                      {rule.category}
                    </span>
                    {rule.critical && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-status-critical-bg text-status-critical border border-status-critical-border">
                        CRITICAL
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-text-muted">{rule.desc}</p>
                </div>

                {/* Toggle Switch */}
                <button
                  type="button"
                  onClick={() => toggleRule(rule.id)}
                  disabled={!canEditSettings}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    rule.active ? 'bg-primary' : 'bg-slate-200'
                  } ${!canEditSettings ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      rule.active ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: RBAC Permissions Matrix */}
      {activeTab === 'rbac' && (
        <div className="space-y-4">
          <div className="bg-surface rounded-2xl border border-border p-5">
            <h2 className="text-sm font-bold text-text-main mb-3">Enterprise Role-Based Access Control (RBAC) Matrix</h2>
            <p className="text-xs text-text-muted mb-5">
              Current system permission assignments enforced across UI view routes, threat containment execution, and ACL modification.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-surface-secondary text-text-subtle font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-3">Permission / Capability</th>
                    <th className="p-3">Scope Description</th>
                    <th className="p-3 text-center">Administrator</th>
                    <th className="p-3 text-center">Analyst</th>
                    <th className="p-3 text-center">Employee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    { perm: 'Dashboard & Status Telemetry', desc: 'Real-time 9 status cards, link metrics, active incident counters', admin: true, analyst: true, employee: true },
                    { perm: 'Network Topology View', desc: 'Interactive SVG fabric, live pulse animation, node inspection', admin: true, analyst: true, employee: true },
                    { perm: 'Monitored Devices Inventory', desc: 'Hardware asset health, RAM/CPU metrics, port listings', admin: true, analyst: true, employee: true },
                    { perm: 'Threat Monitor Read Access', desc: 'View intrusion tickets, attack vectors, source IPs, payloads', admin: true, analyst: true, employee: true },
                    { perm: 'Resolve Threats (Runbook Wizard)', desc: 'Execute firewall block, TCP session kill, or VLAN quarantine', admin: true, analyst: false, employee: false },
                    { perm: 'Deep Packet Inspection (PCAP)', desc: 'Promiscuous ring capture, frame search, Hex & ASCII decode', admin: true, analyst: true, employee: false },
                    { perm: 'Firewall Policy Management', desc: 'Add new ACL rules, toggle active states, drop blacklists', admin: true, analyst: false, employee: false },
                    { perm: 'Core Router & Switch Fabric', desc: '24-Port Switch matrix inspection, BGP status, routing table', admin: true, analyst: true, employee: false },
                    { perm: 'Server Cluster Metrics', desc: 'DB & App host systemd service status, socket listening ports', admin: true, analyst: true, employee: false },
                    { perm: 'Executive Report Export', desc: 'Generate CSV threat records and PDF printable security briefing', admin: true, analyst: true, employee: false },
                    { perm: 'SIEM Log Stream', desc: 'Search and inspect raw EVE-JSON events and systemd syslog', admin: true, analyst: true, employee: false },
                    { perm: 'System Settings & Signatures', desc: 'Modify detection rules, tap interfaces, and sensor params', admin: true, analyst: false, employee: false }
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface-secondary/40">
                      <td className="p-3 font-bold text-text-main">{row.perm}</td>
                      <td className="p-3 text-text-muted">{row.desc}</td>
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-status-healthy-bg text-status-healthy">
                          ✓
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {row.analyst ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-status-healthy-bg text-status-healthy">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-400">
                            ✕
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {row.employee ? (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-status-healthy-bg text-status-healthy">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 text-slate-400">
                            ✕
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Network Interfaces */}
      {activeTab === 'interfaces' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interfaces.map((iface) => (
              <div key={iface.name} className="p-5 bg-surface rounded-2xl border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center">
                      <Network className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-text-main font-mono">{iface.name}</h3>
                      <p className="text-xs text-text-muted">{iface.alias}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-status-healthy-bg text-status-healthy border border-status-healthy-border">
                    {iface.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border text-center">
                  <div className="p-2 bg-surface-secondary rounded-xl">
                    <span className="text-[9px] font-bold uppercase text-text-subtle">Speed</span>
                    <div className="text-xs font-bold text-text-main mt-0.5">{iface.speed}</div>
                  </div>
                  <div className="p-2 bg-surface-secondary rounded-xl">
                    <span className="text-[9px] font-bold uppercase text-text-subtle">MTU</span>
                    <div className="text-xs font-bold text-text-main mt-0.5">{iface.mtu}</div>
                  </div>
                  <div className="p-2 bg-surface-secondary rounded-xl">
                    <span className="text-[9px] font-bold uppercase text-text-subtle">Promiscuous</span>
                    <div className="text-xs font-bold text-primary mt-0.5">{iface.promiscuous ? 'YES' : 'NO'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Engine & Telemetry Parameters */}
      {activeTab === 'engine' && (
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-6">
          <h2 className="text-sm font-bold text-text-main">Telemetry Engine Parameters</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-1.5">
              <label className="font-bold text-text-main">Ring Buffer Size (MB)</label>
              <input
                type="number"
                disabled={!canEditSettings}
                value={engineConfig.ringBufferSizeMb}
                onChange={(e) => setEngineConfig({ ...engineConfig, ringBufferSizeMb: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-surface-secondary border border-border focus:outline-none focus:border-primary font-mono text-xs"
              />
              <p className="text-[11px] text-text-muted">Dedicated Linux kernel AF_PACKET memory pool</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-text-main">WebSocket Telemetry Push Frequency (ms)</label>
              <input
                type="number"
                disabled={!canEditSettings}
                value={engineConfig.wsBroadcastIntervalMs}
                onChange={(e) => setEngineConfig({ ...engineConfig, wsBroadcastIntervalMs: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-surface-secondary border border-border focus:outline-none focus:border-primary font-mono text-xs"
              />
              <p className="text-[11px] text-text-muted">Interval for live packet counter and chart broadcast updates</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-text-main">Suricata Command Unix Domain Socket</label>
              <input
                type="text"
                disabled={!canEditSettings}
                value={engineConfig.suricataSocket}
                onChange={(e) => setEngineConfig({ ...engineConfig, suricataSocket: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-surface-secondary border border-border focus:outline-none focus:border-primary font-mono text-xs"
              />
              <p className="text-[11px] text-text-muted">IPC interface for dynamic rule reloads and sensor telemetry</p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-text-main">EVE JSON Log Path</label>
              <input
                type="text"
                disabled={!canEditSettings}
                value={engineConfig.eveLogPath}
                onChange={(e) => setEngineConfig({ ...engineConfig, eveLogPath: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-surface-secondary border border-border focus:outline-none focus:border-primary font-mono text-xs"
              />
              <p className="text-[11px] text-text-muted">High-speed alert and protocol transaction audit file</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
