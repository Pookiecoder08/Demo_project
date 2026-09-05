import React from 'react';
import { useSOC } from '../../context/SOCContext';
import {
  X,
  Cpu,
  HardDrive,
  Activity,
  Server,
  Network,
  ShieldAlert,
  Terminal,
  Radio,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon
} from 'lucide-react';

export const DeviceSlideOver = () => {
  const { selectedNode, setSelectedNode, setCurrentView, addToast } = useSOC();

  if (!selectedNode) return null;

  const getStatusBadge = (st) => {
    switch (st?.toLowerCase()) {
      case 'critical':
        return {
          icon: AlertOctagon,
          text: 'CRITICAL',
          classes: 'bg-status-critical-bg text-status-critical border-status-critical-border'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          text: 'WARNING',
          classes: 'bg-status-warning-bg text-status-warning border-status-warning-border'
        };
      default:
        return {
          icon: CheckCircle2,
          text: 'HEALTHY',
          classes: 'bg-status-healthy-bg text-status-healthy border-status-healthy-border'
        };
    }
  };

  const status = getStatusBadge(selectedNode.status);
  const StatusIcon = status.icon;

  const handleInspectTraffic = () => {
    setCurrentView('packets');
    setSelectedNode(null);
  };

  const handleRunPing = () => {
    addToast({
      title: `Ping Diagnostic: ${selectedNode.name}`,
      severity: 'healthy',
      description: `ICMP Echo 64 bytes to ${selectedNode.ip}: 0% packet loss, RTT avg = 0.42ms.`,
      asset: selectedNode.ip
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-text-main/20 backdrop-blur-sm transition-opacity"
        onClick={() => setSelectedNode(null)}
      />

      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md bg-surface shadow-modal border-l border-border flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-border flex items-center justify-between bg-surface-secondary">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-main">{selectedNode.name}</h3>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-xs font-mono text-text-muted">{selectedNode.ip}</span>
                  <span className="text-[10px] text-text-subtle">•</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${status.classes}`}>
                    {status.text}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* 3 Metrics Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-surface-secondary p-3 rounded-xl border border-border text-center">
                <span className="text-[10px] font-bold text-text-subtle uppercase">CPU Load</span>
                <div className="text-lg font-extrabold text-text-main mt-1">
                  {selectedNode.cpu_usage || 24}%
                </div>
                <div className="w-full bg-surface-hover h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      (selectedNode.cpu_usage || 24) > 80 ? 'bg-status-critical' : 'bg-primary'
                    }`}
                    style={{ width: `${selectedNode.cpu_usage || 24}%` }}
                  />
                </div>
              </div>

              <div className="bg-surface-secondary p-3 rounded-xl border border-border text-center">
                <span className="text-[10px] font-bold text-text-subtle uppercase">RAM Memory</span>
                <div className="text-lg font-extrabold text-text-main mt-1">
                  {selectedNode.ram_usage || 48}%
                </div>
                <div className="w-full bg-surface-hover h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      (selectedNode.ram_usage || 48) > 80 ? 'bg-status-critical' : 'bg-accent'
                    }`}
                    style={{ width: `${selectedNode.ram_usage || 48}%` }}
                  />
                </div>
              </div>

              <div className="bg-surface-secondary p-3 rounded-xl border border-border text-center">
                <span className="text-[10px] font-bold text-text-subtle uppercase">Throughput</span>
                <div className="text-sm font-extrabold text-text-main mt-2 truncate">
                  {selectedNode.throughput || '420 Mbps'}
                </div>
                <span className="text-[9px] text-status-healthy font-semibold mt-1 inline-block">Active Wire</span>
              </div>
            </div>

            {/* Hardware & OS Specs */}
            <div className="bg-surface border border-border rounded-xl p-4 space-y-2.5">
              <h4 className="text-xs font-bold text-text-main uppercase tracking-wider flex items-center space-x-1.5">
                <HardDrive className="w-4 h-4 text-text-muted" />
                <span>Hardware & System Telemetry</span>
              </h4>
              <div className="divide-y divide-border text-xs">
                <div className="py-2 flex justify-between">
                  <span className="text-text-muted">Vendor:</span>
                  <span className="font-semibold text-text-main">{selectedNode.vendor || 'Enterprise Standard'}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-text-muted">Model / Chassis:</span>
                  <span className="font-semibold text-text-main">{selectedNode.model || 'Node'}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-text-muted">Operating System:</span>
                  <span className="font-semibold text-text-main">{selectedNode.os || 'Linux'}</span>
                </div>
                <div className="py-2 flex justify-between">
                  <span className="text-text-muted">MAC Address:</span>
                  <span className="font-mono text-text-main">{selectedNode.mac || '00:1A:2B:3C:4D:5E'}</span>
                </div>
              </div>
            </div>

            {/* Active Interfaces */}
            <div className="bg-surface border border-border rounded-xl p-4">
              <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <Network className="w-4 h-4 text-text-muted" />
                <span>Active Network Interfaces</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {(selectedNode.interfaces || [{ name: 'eth0', status: 'UP' }]).map((iface, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-surface-secondary border border-border text-xs font-mono font-medium text-text-main flex items-center space-x-1.5"
                  >
                    <span className="badge-dot bg-status-healthy"></span>
                    <span>{iface.name}</span>
                    {iface.alias && <span className="text-text-subtle">({iface.alias})</span>}
                  </span>
                ))}
              </div>
            </div>

            {/* Listening Ports & Services */}
            <div className="bg-surface border border-border rounded-xl p-4">
              <h4 className="text-xs font-bold text-text-main uppercase tracking-wider mb-3 flex items-center space-x-1.5">
                <Radio className="w-4 h-4 text-text-muted" />
                <span>Listening Ports & Daemons</span>
              </h4>
              <div className="space-y-2">
                {(selectedNode.ports || [{ port: 80, proto: 'TCP', service: 'HTTP' }]).map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-surface-secondary text-xs"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-primary">{p.port}</span>
                      <span className="text-text-subtle font-mono">{p.proto || 'TCP'}</span>
                      <span className="font-medium text-text-main">{p.service}</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-status-healthy-bg text-status-healthy border border-status-healthy-border">
                      LISTEN
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-border bg-surface-secondary flex items-center space-x-3">
            <button
              onClick={handleInspectTraffic}
              className="flex-1 flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Activity className="w-4 h-4" />
              <span>Inspect Raw Traffic</span>
            </button>
            <button
              onClick={handleRunPing}
              className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-surface border border-border hover:bg-surface-hover text-xs font-semibold text-text-main transition-colors"
            >
              <Terminal className="w-4 h-4 text-text-muted" />
              <span>Ping Test</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
