import React, { useState } from 'react';
import { useSOC } from '../../context/SOCContext';
import { EnterpriseTopologyMap } from '../common/EnterpriseTopologyMap';
import {
  Network,
  Activity,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  RotateCcw,
  Zap,
  Radio,
  Server
} from 'lucide-react';

export const NetworkTopologyView = () => {
  const { nodes, setSelectedNode } = useSOC();
  const [activeFilter, setActiveFilter] = useState('ALL');

  const healthyCount = nodes.filter((n) => n.status === 'healthy').length || 5;
  const warningCount = nodes.filter((n) => n.status === 'warning').length || 2;
  const criticalCount = nodes.filter((n) => n.status === 'critical').length || 1;

  const handleFilterClick = (filter) => {
    if (activeFilter === filter) {
      setActiveFilter('ALL');
    } else {
      setActiveFilter(filter);
    }
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Main Enterprise Network Infrastructure Topology Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 md:p-8">
        {/* Header matching user design */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
              Enterprise Network Infrastructure Topology
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1 flex items-center space-x-1.5">
              <span>Real-time node telemetry • Click any element to inspect interfaces, rules, &amp; throughput</span>
            </p>
          </div>

          {/* Top-right Status Filter Pills */}
          <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
            {/* Healthy Pill */}
            <button
              onClick={() => handleFilterClick('HEALTHY')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm ${
                activeFilter === 'HEALTHY'
                  ? 'bg-emerald-100 border-emerald-500 text-emerald-800 ring-2 ring-emerald-400/30'
                  : 'bg-emerald-50/90 border-emerald-300 text-emerald-600 hover:bg-emerald-100/80 hover:border-emerald-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>Healthy ({healthyCount})</span>
            </button>

            {/* Warning Pill */}
            <button
              onClick={() => handleFilterClick('WARNING')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm ${
                activeFilter === 'WARNING'
                  ? 'bg-amber-100 border-amber-500 text-amber-900 ring-2 ring-amber-400/30'
                  : 'bg-amber-50/90 border-amber-300 text-amber-700 hover:bg-amber-100/80 hover:border-amber-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              <span>Warning ({warningCount})</span>
            </button>

            {/* Critical Pill */}
            <button
              onClick={() => handleFilterClick('CRITICAL')}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm ${
                activeFilter === 'CRITICAL'
                  ? 'bg-rose-100 border-rose-500 text-rose-900 ring-2 ring-rose-400/30'
                  : 'bg-rose-50/90 border-rose-300 text-rose-600 hover:bg-rose-100/80 hover:border-rose-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
              <span>Critical ({criticalCount})</span>
            </button>

            {/* Reset Filter Button if active */}
            {activeFilter !== 'ALL' && (
              <button
                onClick={() => setActiveFilter('ALL')}
                className="px-2.5 py-1 rounded-full text-xs font-medium text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center space-x-1"
                title="Reset filter to view all nodes"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Show All</span>
              </button>
            )}
          </div>
        </div>

        {/* The Interactive SVG Canvas */}
        <div className="w-full bg-white rounded-xl pt-2 pb-6 px-2 overflow-x-auto relative">
          <EnterpriseTopologyMap activeFilter={activeFilter} />
        </div>

        {/* Bottom Legend & Fabric Telemetry Summary */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-5">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-slate-700 font-medium">Optimal Uplink (10GbE / HA)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
              <span className="text-slate-700 font-medium">Elevated Traffic / Policy Warning</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              <span className="text-slate-700 font-medium">Host Compromised / SQL Injection Attack</span>
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
            <span>Interactive Fabric Active • Click any node to inspect interfaces, rules, &amp; throughput</span>
          </div>
        </div>
      </div>

      {/* Network Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-sky-50 text-sky-600">
            <Network className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">WAN Throughput</span>
            <p className="text-base font-bold text-slate-900">10.2 Gbps</p>
            <span className="text-[10px] text-emerald-600 font-medium">0% packet drop</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Core Fabric Latency</span>
            <p className="text-base font-bold text-slate-900">0.42 ms</p>
            <span className="text-[10px] text-emerald-600 font-medium">Catalyst 9500 RTR</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Suricata Rules</span>
            <p className="text-base font-bold text-slate-900">38,400 Active</p>
            <span className="text-[10px] text-slate-500 font-medium">1.48M pkts analyzed</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">Target Host Alert</span>
            <p className="text-base font-bold text-rose-600">192.168.1.50</p>
            <span className="text-[10px] text-rose-500 font-medium">SQL Injection Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
};
