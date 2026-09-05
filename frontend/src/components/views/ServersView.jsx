import React, { useState, useEffect } from 'react';
import { Server, Cpu, HardDrive, Activity, Radio, CheckCircle2, AlertOctagon, AlertTriangle } from 'lucide-react';

export const ServersView = () => {
  const [servers, setServers] = useState([
    {
      id: "db-server",
      name: "Primary PostgreSQL DB Server",
      role: "Database Core Host",
      ip: "192.168.1.50",
      status: "critical",
      cpu_usage: 89,
      ram_usage: 92,
      disk_usage: 74,
      os: "Ubuntu 22.04 LTS (Kernel 5.15)",
      uptime: "84 days",
      services: [
        { name: "postgresql-15.service", status: "active", pid: 1420 },
        { name: "pgpool-II.service", status: "active", pid: 1488 },
        { name: "node_exporter.service", status: "active", pid: 2041 }
      ],
      listening_ports: [
        { port: 5432, protocol: "TCP", service: "PostgreSQL" },
        { port: 9100, protocol: "TCP", service: "NodeExporter" },
        { port: 22, protocol: "TCP", service: "OpenSSH" }
      ]
    },
    {
      id: "app-server",
      name: "Enterprise App Cluster Host",
      role: "Application Gateway & API",
      ip: "192.168.1.60",
      status: "healthy",
      cpu_usage: 34,
      ram_usage: 58,
      disk_usage: 45,
      os: "Debian 12 Bookworm",
      uptime: "99.99% (41 days)",
      services: [
        { name: "k3s-agent.service", status: "active", pid: 982 },
        { name: "nginx.service", status: "active", pid: 1104 },
        { name: "fastapi-core.service", status: "active", pid: 1289 }
      ],
      listening_ports: [
        { port: 443, protocol: "TCP", service: "HTTPS (Nginx)" },
        { port: 80, protocol: "TCP", service: "HTTP" },
        { port: 8000, protocol: "TCP", service: "FastAPI Core" }
      ]
    },
    {
      id: "ids",
      name: "Suricata NIDS Sensor Node",
      role: "Intrusion Detection Sensor",
      ip: "192.168.1.100",
      status: "healthy",
      cpu_usage: 22,
      ram_usage: 44,
      disk_usage: 30,
      os: "Alpine Linux 3.19 (Hardened)",
      uptime: "112 days",
      services: [
        { name: "suricata.service", status: "active", pid: 654 },
        { name: "evebox.service", status: "active", pid: 780 },
        { name: "filebeat.service", status: "active", pid: 890 }
      ],
      listening_ports: [
        { port: 9000, protocol: "TCP", service: "EveBox Web UI" },
        { port: 5044, protocol: "TCP", service: "Filebeat Shipper" }
      ]
    },
    {
      id: "pcs",
      name: "Corporate Workstation Subnet",
      role: "Client Workstations (VLAN 10)",
      ip: "192.168.1.100 - 192.168.1.200",
      status: "warning",
      cpu_usage: 48,
      ram_usage: 62,
      disk_usage: 55,
      os: "Mixed (Windows 11 / macOS / Ubuntu)",
      uptime: "DHCP Lease Pool Active",
      services: [
        { name: "dhcp-server.service", status: "active", pid: 412 },
        { name: "ad-domain-sync.service", status: "active", pid: 530 }
      ],
      listening_ports: [
        { port: 67, protocol: "UDP", service: "DHCP Server" },
        { port: 53, protocol: "UDP", service: "Local DNS Proxy" }
      ]
    }
  ]);

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-text-main flex items-center space-x-2">
          <Server className="w-5 h-5 text-primary" />
          <span>Server Farm & Infrastructure Node Health</span>
        </h1>
        <p className="text-xs text-text-muted mt-0.5">
          Real-time systemd daemon status, compute resource utilization, and socket listening daemons
        </p>
      </div>

      {/* Grid of Servers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {servers.map((srv) => {
          const isCrit = srv.status === 'critical';
          const isWarn = srv.status === 'warning';
          const badgeClass = isCrit
            ? 'bg-status-critical-bg text-status-critical border-status-critical-border'
            : isWarn
            ? 'bg-status-warning-bg text-status-warning border-status-warning-border'
            : 'bg-status-healthy-bg text-status-healthy border-status-healthy-border';

          return (
            <div
              key={srv.id}
              className="bg-surface rounded-2xl border border-border p-5 hover:border-border-strong transition-all shadow-sm"
            >
              {/* Top Row */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-text-main">{srv.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${badgeClass}`}>
                      {srv.status}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    {srv.role} • <span className="font-mono text-primary">{srv.ip}</span>
                  </p>
                </div>
                <span className="text-[10px] font-mono text-text-subtle">{srv.uptime}</span>
              </div>

              {/* Hardware Progress Bars */}
              <div className="mt-4 space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-muted font-medium">CPU Utilization:</span>
                    <span className={`font-bold ${srv.cpu_usage > 80 ? 'text-status-critical' : 'text-text-main'}`}>
                      {srv.cpu_usage}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        srv.cpu_usage > 80 ? 'bg-status-critical' : 'bg-primary'
                      }`}
                      style={{ width: `${srv.cpu_usage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-muted font-medium">RAM Memory Allocation:</span>
                    <span className={`font-bold ${srv.ram_usage > 80 ? 'text-status-critical' : 'text-text-main'}`}>
                      {srv.ram_usage}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        srv.ram_usage > 80 ? 'bg-status-critical' : 'bg-accent'
                      }`}
                      style={{ width: `${srv.ram_usage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Systemd Services */}
              <div className="mt-4 pt-3 border-t border-border">
                <span className="text-[10px] font-bold text-text-subtle uppercase tracking-wider block mb-2">
                  Monitored Systemd Services
                </span>
                <div className="flex flex-wrap gap-2">
                  {srv.services.map((svc, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-surface-secondary border border-border text-[11px] font-mono text-text-main flex items-center space-x-1.5"
                    >
                      <span className="badge-dot bg-status-healthy"></span>
                      <span>{svc.name}</span>
                      <span className="text-[9px] text-text-subtle">(pid:{svc.pid})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Listening Ports */}
              <div className="mt-3 pt-3 border-t border-border">
                <span className="text-[10px] font-bold text-text-subtle uppercase tracking-wider block mb-2">
                  Active Listening Ports
                </span>
                <div className="flex flex-wrap gap-2">
                  {srv.listening_ports.map((lp, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-surface-hover text-[11px] font-mono text-text-muted"
                    >
                      <strong className="text-text-main">{lp.port}</strong>/{lp.protocol} ({lp.service})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
