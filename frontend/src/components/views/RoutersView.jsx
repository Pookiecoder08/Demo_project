import React, { useState, useEffect } from 'react';
import { apiClient } from '../../api/client';
import { SEED_ROUTER_DATA } from '../../data/seedData';
import { Router as RouterIcon, Network, Activity, Cpu, CheckCircle2 } from 'lucide-react';

export const RoutersView = () => {
  const [routerData, setRouterData] = useState(SEED_ROUTER_DATA);
  const [selectedPort, setSelectedPort] = useState(null);

  useEffect(() => {
    apiClient.getRouterStatus().then((data) => {
      if (data) setRouterData(data);
    });
  }, []);

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main flex items-center space-x-2">
            <RouterIcon className="w-5 h-5 text-primary" />
            <span>Core Gateway Router & Distribution Switch Fabric</span>
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Cisco Catalyst 9500-48Y4C Core Gateway • 24-Port Switch Fabric Matrix • Layer 3 Routing Kernel
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs bg-surface border border-border px-3 py-1.5 rounded-xl shadow-sm">
          <span className="text-text-muted font-medium">BGP Peering:</span>
          <span className="font-bold text-status-healthy flex items-center space-x-1">
            <span className="badge-dot bg-status-healthy"></span>
            <span>{routerData.bgp_status || 'Established (AS 64512)'}</span>
          </span>
        </div>
      </div>

      {/* Hardware Telemetry Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-surface rounded-2xl border border-border">
          <span className="text-[10px] font-bold text-text-subtle uppercase">Routing Latency</span>
          <div className="text-xl font-extrabold text-status-healthy mt-1">
            {routerData.routing_latency_ms || 0.38} ms
          </div>
          <p className="text-[10px] text-text-muted mt-0.5">Ultra-Low Wire Speed</p>
        </div>

        <div className="p-4 bg-surface rounded-2xl border border-border">
          <span className="text-[10px] font-bold text-text-subtle uppercase">Fabric Throughput</span>
          <div className="text-xl font-extrabold text-primary mt-1">
            {routerData.throughput_gbps || 18.4} Gbps
          </div>
          <p className="text-[10px] text-text-muted mt-0.5">Backplane Bandwidth</p>
        </div>

        <div className="p-4 bg-surface rounded-2xl border border-border">
          <span className="text-[10px] font-bold text-text-subtle uppercase">Active Port Ratio</span>
          <div className="text-xl font-extrabold text-text-main mt-1">
            {routerData.active_ports_count || 19} / {routerData.total_ports_count || 24}
          </div>
          <p className="text-[10px] text-text-muted mt-0.5">Physical 10G/100G Interfaces</p>
        </div>

        <div className="p-4 bg-surface rounded-2xl border border-border">
          <span className="text-[10px] font-bold text-text-subtle uppercase">System Uptime</span>
          <div className="text-sm font-bold text-text-main mt-2 truncate">
            {routerData.uptime || '142 days'}
          </div>
          <p className="text-[10px] text-text-muted mt-0.5">{routerData.firmware}</p>
        </div>
      </div>

      {/* 24-Port Switch Fabric Matrix */}
      <div className="p-5 bg-surface rounded-2xl border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-text-main flex items-center space-x-2">
              <Network className="w-4 h-4 text-primary" />
              <span>24-Port Physical Switch Fabric Matrix</span>
            </h3>
            <p className="text-[11px] text-text-muted mt-0.5">
              Click any port socket to inspect VLAN assignments, duplex negotiation, and TX/RX counters
            </p>
          </div>
          <span className="text-xs text-text-subtle font-mono">10GBASE-T / SFP+ Fabric</span>
        </div>

        {/* Port Grid: 2 rows of 12 ports like a physical switch */}
        <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <div className="grid grid-cols-12 gap-2">
            {routerData.ports?.slice(0, 12).map((p) => {
              const isUp = p.status === 'UP';
              const isSelected = selectedPort?.port === p.port;
              return (
                <div
                  key={p.port}
                  onClick={() => setSelectedPort(p)}
                  className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/20'
                      : isUp
                      ? 'border-emerald-500/40 bg-slate-900 hover:bg-slate-800'
                      : 'border-slate-800 bg-slate-950/60 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span className={`badge-dot ${isUp ? 'bg-status-healthy' : 'bg-slate-600'}`}></span>
                    <span className="text-[10px] font-mono font-bold text-white">{p.port}</span>
                  </div>
                  <div className="text-[8px] font-mono text-slate-400 mt-1 truncate">{p.speed}</div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-12 gap-2">
            {routerData.ports?.slice(12, 24).map((p) => {
              const isUp = p.status === 'UP';
              const isSelected = selectedPort?.port === p.port;
              return (
                <div
                  key={p.port}
                  onClick={() => setSelectedPort(p)}
                  className={`p-2 rounded-lg border text-center cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/20'
                      : isUp
                      ? 'border-emerald-500/40 bg-slate-900 hover:bg-slate-800'
                      : 'border-slate-800 bg-slate-950/60 opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span className={`badge-dot ${isUp ? 'bg-status-healthy' : 'bg-slate-600'}`}></span>
                    <span className="text-[10px] font-mono font-bold text-white">{p.port}</span>
                  </div>
                  <div className="text-[8px] font-mono text-slate-400 mt-1 truncate">{p.speed}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Port Inspection Drawer */}
        {selectedPort && (
          <div className="mt-4 p-4 rounded-xl bg-surface-secondary border border-border flex items-center justify-between text-xs animate-fadeIn">
            <div>
              <span className="font-bold text-text-main">
                Interface {selectedPort.name} (Port #{selectedPort.port})
              </span>
              <div className="flex items-center space-x-3 text-text-muted mt-1">
                <span>VLAN: {selectedPort.vlan}</span>
                <span>•</span>
                <span>Speed: {selectedPort.speed}</span>
                <span>•</span>
                <span>Status: {selectedPort.status}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 font-mono">
              <div>
                <span className="text-text-subtle text-[10px] block">TX Rate</span>
                <span className="font-bold text-status-healthy">{selectedPort.tx_mbps} Mbps</span>
              </div>
              <div>
                <span className="text-text-subtle text-[10px] block">RX Rate</span>
                <span className="font-bold text-primary">{selectedPort.rx_mbps} Mbps</span>
              </div>
              <button
                onClick={() => setSelectedPort(null)}
                className="text-text-subtle hover:text-text-main text-xs p-1"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Layer 3 Routing Table */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-secondary">
          <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">
            Kernel Layer 3 IP Routing Table (FIB)
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-surface border-b border-border text-text-subtle uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Destination Subnet</th>
                <th className="py-3 px-4">Next Hop Gateway</th>
                <th className="py-3 px-4">Netmask</th>
                <th className="py-3 px-4">Flags</th>
                <th className="py-3 px-4">Outbound Interface</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {routerData.routes?.map((r, idx) => (
                <tr key={idx} className="hover:bg-surface-hover transition-colors">
                  <td className="py-3 px-4 font-bold text-text-main">{r.destination}</td>
                  <td className="py-3 px-4 text-text-muted">{r.gateway}</td>
                  <td className="py-3 px-4 text-text-muted">{r.netmask}</td>
                  <td className="py-3 px-4 text-primary font-bold">{r.flags}</td>
                  <td className="py-3 px-4 text-text-main">{r.interface}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
