import React, { useState } from 'react';
import { useSOC } from '../../context/SOCContext';
import { Network, Server, ShieldCheck, Activity, Eye, HardDrive, Info } from 'lucide-react';

export const NetworkTopologyView = () => {
  const { nodes, setSelectedNode } = useSOC();
  const [filterType, setFilterType] = useState('ALL');

  const filteredNodes = nodes.filter((n) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'CRITICAL') return n.status === 'critical';
    if (filterType === 'WARNING') return n.status === 'warning';
    if (filterType === 'HEALTHY') return n.status === 'healthy';
    return true;
  });

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main flex items-center space-x-2">
            <Network className="w-5 h-5 text-primary" />
            <span>Infrastructure Network Topology Fabric</span>
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Full-mesh logical and physical link mapping with real-time latency, throughput, and packet loss telemetry
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2">
          {['ALL', 'CRITICAL', 'WARNING', 'HEALTHY'].map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                filterType === f
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface text-text-muted border-border hover:bg-surface-hover'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Main Canvas Card */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
        <div className="w-full bg-slate-950 rounded-xl p-4 overflow-x-auto relative border border-slate-800">
          <svg viewBox="0 0 900 420" className="w-full min-w-[800px] h-[400px]">
            <defs>
              <filter id="glow-full" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Connecting Links with animated dash stroke */}
            <line x1="120" y1="210" x2="240" y2="210" stroke="#0284c7" strokeWidth="3" className="animated-pulse-line" />
            <line x1="300" y1="210" x2="420" y2="210" stroke="#f59e0b" strokeWidth="3" className="animated-pulse-line" />
            <line x1="480" y1="210" x2="600" y2="210" stroke="#10b981" strokeWidth="3" className="animated-pulse-line" />

            <line x1="660" y1="210" x2="780" y2="70" stroke="#ef4444" strokeWidth="2.5" className="animated-pulse-line" />
            <line x1="660" y1="210" x2="780" y2="160" stroke="#10b981" strokeWidth="2.5" className="animated-pulse-line" />
            <line x1="660" y1="210" x2="780" y2="250" stroke="#0284c7" strokeWidth="2.5" className="animated-pulse-line" />
            <line x1="660" y1="210" x2="780" y2="340" stroke="#f59e0b" strokeWidth="2.5" className="animated-pulse-line" />

            {/* Link Telemetry Annotations */}
            <text x="180" y="200" fill="#38bdf8" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
              10.2 Gbps
            </text>
            <text x="360" y="200" fill="#fde047" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
              4.8 Gbps (HA)
            </text>
            <text x="540" y="200" fill="#4ade80" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
              0.4ms • 18 Gbps
            </text>
            <text x="735" y="125" fill="#f87171" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">
              SQLi Spike
            </text>

            {/* Render Nodes */}
            {filteredNodes.map((node) => {
              const isCrit = node.status === 'critical';
              const isWarn = node.status === 'warning';
              const strokeColor = isCrit ? '#ef4444' : isWarn ? '#f59e0b' : '#10b981';

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x || 100}, ${(node.y || 100) + 20})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer transition-transform hover:scale-110"
                >
                  <circle
                    r="32"
                    fill="#0f172a"
                    stroke={strokeColor}
                    strokeWidth="3.5"
                    filter="url(#glow-full)"
                  />
                  <circle r="25" fill="#1e293b" />
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill="#ffffff"
                    fontSize="11"
                    fontFamily="JetBrains Mono"
                    fontWeight="bold"
                  >
                    {node.id === 'internet' ? 'WAN' :
                     node.id === 'firewall' ? 'FW' :
                     node.id === 'router' ? 'RTR' :
                     node.id === 'switch' ? 'SW' :
                     node.id === 'db-server' ? 'DB' :
                     node.id === 'app-server' ? 'APP' :
                     node.id === 'ids' ? 'IDS' : 'PC'}
                  </text>
                  <text
                    textAnchor="middle"
                    y="46"
                    fill="#f8fafc"
                    fontSize="11"
                    fontFamily="Inter"
                    fontWeight="600"
                  >
                    {node.name.length > 20 ? node.name.slice(0, 18) + '...' : node.name}
                  </text>
                  <text
                    textAnchor="middle"
                    y="60"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                  >
                    {node.ip}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-border flex flex-wrap items-center justify-between text-xs text-text-muted gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="badge-dot bg-status-healthy"></span>
              <span>Healthy / Optimal Link</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="badge-dot bg-status-warning"></span>
              <span>Elevated Load / Warning</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="badge-dot bg-status-critical"></span>
              <span>Critical / Attack Vector Detected</span>
            </span>
          </div>
          <span className="text-[11px] text-text-subtle">
            Click any node on the canvas to open live telemetry inspector
          </span>
        </div>
      </div>
    </div>
  );
};
