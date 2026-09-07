import React, { useState } from 'react';
import { useSOC } from '../../context/SOCContext';
import { Activity, ShieldAlert, Cpu, HardDrive, ArrowUpRight } from 'lucide-react';

export const TOPOLOGY_NODE_CONFIG = {
  internet: {
    id: 'internet',
    x: 130,
    y: 190,
    r: 25,
    ringColor: '#0ea5e9',
    title: 'Internet (WAN)',
    subtitle: '0.0.0.0/0',
    subtitleColor: '#64748b',
    labelPos: 'bottom',
    status: 'healthy',
  },
  firewall: {
    id: 'firewall',
    x: 255,
    y: 190,
    r: 25,
    ringColor: '#f59e0b',
    title: 'Palo Alto FW',
    subtitle: 'PA-5250 (Warning)',
    subtitleColor: '#d97706',
    labelPos: 'bottom',
    status: 'warning',
  },
  router: {
    id: 'router',
    x: 380,
    y: 190,
    r: 25,
    ringColor: '#10b981',
    title: 'Cisco Core Router',
    subtitle: '192.168.1.254',
    subtitleColor: '#16a34a',
    labelPos: 'bottom',
    status: 'healthy',
  },
  switch: {
    id: 'switch',
    x: 505,
    y: 190,
    r: 25,
    ringColor: '#0ea5e9',
    title: 'Arista Core Switch',
    subtitle: '192.168.1.2',
    subtitleColor: '#64748b',
    labelPos: 'bottom',
    status: 'healthy',
  },
  'db-server': {
    id: 'db-server',
    x: 650,
    y: 65,
    r: 25,
    ringColor: '#dc2626',
    title: 'PostgreSQL DB Host',
    subtitle: 'CRITICAL THREAT',
    subtitleColor: '#dc2626',
    labelPos: 'right',
    status: 'critical',
  },
  'app-server': {
    id: 'app-server',
    x: 650,
    y: 145,
    r: 25,
    ringColor: '#10b981',
    title: 'App Cluster Node',
    subtitle: '192.168.1.60 (Normal)',
    subtitleColor: '#16a34a',
    labelPos: 'right',
    status: 'healthy',
  },
  ids: {
    id: 'ids',
    x: 650,
    y: 230,
    r: 25,
    ringColor: '#7c3aed',
    title: 'Suricata NIDS Probe',
    subtitle: '38,400 Rules Active',
    subtitleColor: '#7c3aed',
    labelPos: 'right',
    status: 'healthy',
  },
  pcs: {
    id: 'pcs',
    x: 650,
    y: 310,
    r: 25,
    ringColor: '#f59e0b',
    title: 'Workstations Subnet',
    subtitle: '192.168.1.0/24 (Warning)',
    subtitleColor: '#d97706',
    labelPos: 'right',
    status: 'warning',
  },
};

const LINKS = [
  { from: 'internet', to: 'firewall', stroke: '#0ea5e9' },
  { from: 'firewall', to: 'router', stroke: '#0ea5e9' },
  { from: 'router', to: 'switch', stroke: '#0ea5e9' },
  { from: 'switch', to: 'db-server', stroke: '#ef4444' },
  { from: 'switch', to: 'app-server', stroke: '#10b981' },
  { from: 'switch', to: 'ids', stroke: '#8b5cf6' },
  { from: 'switch', to: 'pcs', stroke: '#f59e0b' },
];

function getLinkCoords(fromNode, toNode) {
  const r = fromNode.r || 25;
  const dx = toNode.x - fromNode.x;
  const dy = toNode.y - fromNode.y;
  const dist = Math.hypot(dx, dy) || 1;
  return {
    x1: fromNode.x + (dx / dist) * r,
    y1: fromNode.y + (dy / dist) * r,
    x2: toNode.x - (dx / dist) * r,
    y2: toNode.y - (dy / dist) * r,
  };
}

export const EnterpriseTopologyMap = ({ activeFilter = 'ALL', compact = false }) => {
  const { nodes, setSelectedNode } = useSOC();
  const [hoveredNode, setHoveredNode] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Node lookup map
  const nodesMap = {};
  nodes.forEach((n) => {
    nodesMap[n.id] = n;
  });

  const handleMouseEnter = (cfg, e) => {
    const matchedNode = nodesMap[cfg.id] || {
      id: cfg.id,
      name: cfg.title,
      ip: cfg.subtitle,
      status: cfg.status,
      cpu_usage: 35,
      ram_usage: 48,
      throughput: '1.2 Gbps',
      vendor: 'Enterprise Standard',
    };
    setHoveredNode({ ...matchedNode, config: cfg });

    // Calculate relative tooltip placement
    const rect = e.currentTarget.closest('svg').getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    setTooltipPos({ x: mouseX, y: mouseY });
  };

  const handleMouseMove = (e) => {
    if (!hoveredNode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setHoveredNode(null);
  };

  const handleNodeClick = (cfg) => {
    const matchedNode = nodesMap[cfg.id] || {
      id: cfg.id,
      name: cfg.title,
      ip: cfg.subtitle,
      status: cfg.status,
      type: 'Network Node',
      cpu_usage: 32,
      ram_usage: 45,
      throughput: '1.2 Gbps',
      interfaces: [{ name: 'eth0', ip: cfg.subtitle, status: 'UP' }],
      ports: [{ port: 443, proto: 'TCP', service: 'HTTPS' }],
      details: { role: cfg.title },
    };
    setSelectedNode(matchedNode);
  };

  return (
    <div
      className="w-full relative overflow-x-auto select-none bg-white rounded-xl"
      onMouseMove={handleMouseMove}
    >
      <svg
        viewBox="0 0 940 370"
        className="w-full min-w-[840px] h-[370px] overflow-visible"
      >
        <defs>
          <filter id="nodeGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Connecting Links with Animated Dashed Flow */}
        {LINKS.map((link, idx) => {
          const fromCfg = TOPOLOGY_NODE_CONFIG[link.from];
          const toCfg = TOPOLOGY_NODE_CONFIG[link.to];
          if (!fromCfg || !toCfg) return null;

          const { x1, y1, x2, y2 } = getLinkCoords(fromCfg, toCfg);
          const isHighlighted =
            hoveredNode &&
            (hoveredNode.config?.id === link.from || hoveredNode.config?.id === link.to);

          return (
            <g key={`link-${idx}`}>
              {/* Highlight background track */}
              {isHighlighted && (
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={link.stroke}
                  strokeWidth="6"
                  strokeOpacity="0.25"
                  strokeLinecap="round"
                />
              )}
              {/* Animated Dashed Pulse Line */}
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={link.stroke}
                strokeWidth={isHighlighted ? 3.5 : 2.6}
                strokeDasharray="5, 5"
                className="animated-pulse-line"
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* Render Topology Nodes */}
        {Object.values(TOPOLOGY_NODE_CONFIG).map((cfg) => {
          const matchedNode = nodesMap[cfg.id];
          const currentStatus = matchedNode?.status || cfg.status;
          const isHovered = hoveredNode?.config?.id === cfg.id;

          // Filter evaluation
          const matchesFilter =
            activeFilter === 'ALL' ||
            (activeFilter === 'HEALTHY' && currentStatus === 'healthy') ||
            (activeFilter === 'WARNING' && currentStatus === 'warning') ||
            (activeFilter === 'CRITICAL' && currentStatus === 'critical');

          const opacityClass = matchesFilter ? 'opacity-100' : 'opacity-25';

          return (
            <g
              key={cfg.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-110 ${opacityClass}`}
              style={{
                transformOrigin: `${cfg.x}px ${cfg.y}px`,
              }}
              onMouseEnter={(e) => handleMouseEnter(cfg, e)}
              onMouseLeave={handleMouseLeave}
              onClick={() => handleNodeClick(cfg)}
            >
              {/* Pulsing ring for filtered active node or critical node */}
              {currentStatus === 'critical' && (
                <circle
                  cx={cfg.x}
                  cy={cfg.y}
                  r={cfg.r + 7}
                  fill="none"
                  stroke={cfg.ringColor}
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                  className="animate-ping"
                  style={{ animationDuration: '2.5s' }}
                />
              )}

              {/* Outer Glow Ring on Hover */}
              {isHovered && (
                <circle
                  cx={cfg.x}
                  cy={cfg.y}
                  r={cfg.r + 5}
                  fill="none"
                  stroke={cfg.ringColor}
                  strokeWidth="2"
                  strokeOpacity="0.5"
                  filter="url(#nodeGlow)"
                />
              )}

              {/* Main Circular Node Ring */}
              <circle
                cx={cfg.x}
                cy={cfg.y}
                r={isHovered ? cfg.r + 1.5 : cfg.r}
                fill={isHovered ? `${cfg.ringColor}10` : '#ffffff'}
                stroke={cfg.ringColor}
                strokeWidth={isHovered ? 4.2 : 3.6}
                className="transition-all duration-150"
              />

              {/* Node Labels */}
              {cfg.labelPos === 'bottom' ? (
                // Horizontal Backbone Nodes (Labels Below)
                <g>
                  <text
                    x={cfg.x}
                    y={cfg.y + cfg.r + 20}
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="12.5"
                    fontFamily="Inter, sans-serif"
                    fontWeight="700"
                    className="select-none"
                  >
                    {cfg.title}
                  </text>
                  <text
                    x={cfg.x}
                    y={cfg.y + cfg.r + 35}
                    textAnchor="middle"
                    fill={cfg.subtitleColor}
                    fontSize="10.5"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight={cfg.subtitle.includes('Warning') ? '600' : '500'}
                    className="select-none"
                  >
                    {cfg.subtitle}
                  </text>
                </g>
              ) : (
                // Leaf Nodes (Labels to the Right)
                <g>
                  <text
                    x={cfg.x + cfg.r + 16}
                    y={cfg.y - 3}
                    textAnchor="start"
                    fill="#0f172a"
                    fontSize="12.5"
                    fontFamily="Inter, sans-serif"
                    fontWeight="700"
                    className="select-none"
                  >
                    {cfg.title}
                  </text>
                  <text
                    x={cfg.x + cfg.r + 16}
                    y={cfg.y + 13}
                    textAnchor="start"
                    fill={cfg.subtitleColor}
                    fontSize="10.5"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight={cfg.subtitle.includes('CRITICAL') ? '800' : '600'}
                    letterSpacing={cfg.subtitle.includes('CRITICAL') ? '0.5px' : '0px'}
                    className="select-none"
                  >
                    {cfg.subtitle}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Interactive Telemetry HUD Tooltip on Hover */}
      {hoveredNode && (
        <div
          className="absolute z-30 pointer-events-none transition-all duration-150 transform -translate-x-1/2 -translate-y-full mb-3"
          style={{
            left: Math.min(Math.max(tooltipPos.x, 140), 780),
            top: Math.max(tooltipPos.y - 12, 10),
          }}
        >
          <div className="bg-slate-900/95 backdrop-blur-md text-white px-3.5 py-2.5 rounded-xl shadow-xl border border-slate-700/60 text-xs w-60 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
              <span className="font-bold text-slate-100 flex items-center space-x-1.5">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: hoveredNode.config?.ringColor || '#0ea5e9' }}
                />
                <span className="truncate">{hoveredNode.name || hoveredNode.config?.title}</span>
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase ${
                  hoveredNode.status === 'critical'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : hoveredNode.status === 'warning'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {hoveredNode.status || 'healthy'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px] mb-2 text-slate-300">
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-mono">IP Address</span>
                <span className="font-mono text-white text-[10px]">{hoveredNode.ip}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px] uppercase font-mono">Throughput</span>
                <span className="font-mono text-emerald-400 text-[10px] font-semibold">
                  {hoveredNode.throughput || '10.2 Gbps'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 border-t border-slate-800/80 pt-1.5 text-[10px]">
              <div className="flex items-center justify-between text-slate-300">
                <span className="flex items-center space-x-1 text-slate-400">
                  <Cpu className="w-3 h-3 text-sky-400" />
                  <span>CPU Load</span>
                </span>
                <span className="font-mono">{hoveredNode.cpu_usage || 24}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    (hoveredNode.cpu_usage || 24) > 80
                      ? 'bg-red-500'
                      : (hoveredNode.cpu_usage || 24) > 50
                      ? 'bg-amber-500'
                      : 'bg-sky-500'
                  }`}
                  style={{ width: `${hoveredNode.cpu_usage || 24}%` }}
                />
              </div>
            </div>

            <div className="mt-2.5 pt-1.5 border-t border-slate-800 text-[9px] text-sky-400 font-medium text-center flex items-center justify-center space-x-1">
              <span>Click to inspect interfaces & rules</span>
              <ArrowUpRight className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
