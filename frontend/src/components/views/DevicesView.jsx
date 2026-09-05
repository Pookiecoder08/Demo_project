import React, { useState } from 'react';
import { useSOC } from '../../context/SOCContext';
import { HardDrive, Server, Cpu, Activity, LayoutGrid, List, ArrowUpRight } from 'lucide-react';

export const DevicesView = () => {
  const { nodes, setSelectedNode } = useSOC();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  return (
    <div className="space-y-6 pb-12 select-none">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main flex items-center space-x-2">
            <HardDrive className="w-5 h-5 text-primary" />
            <span>Monitored Hardware & Infrastructure Assets</span>
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Active NIDS sensor endpoints, perimeter firewalls, core routing gateways, and server clusters
          </p>
        </div>

        <div className="flex items-center bg-surface-secondary border border-border p-1 rounded-xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
              viewMode === 'grid' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
              viewMode === 'table' ? 'bg-surface text-primary shadow-sm' : 'text-text-muted'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {nodes.map((device) => {
            const isCrit = device.status === 'critical';
            const isWarn = device.status === 'warning';
            const badgeClass = isCrit
              ? 'bg-status-critical-bg text-status-critical border-status-critical-border'
              : isWarn
              ? 'bg-status-warning-bg text-status-warning border-status-warning-border'
              : 'bg-status-healthy-bg text-status-healthy border-status-healthy-border';

            return (
              <div
                key={device.id}
                onClick={() => setSelectedNode(device)}
                className="bg-surface border border-border rounded-2xl p-5 hover:border-primary hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center font-bold">
                      <Server className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${badgeClass}`}>
                      {device.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-text-main mt-3">{device.name}</h3>
                  <div className="text-xs font-mono text-text-muted mt-0.5">{device.ip}</div>
                  <div className="text-[11px] text-text-subtle mt-1">{device.model}</div>
                </div>

                <div className="mt-5 pt-3 border-t border-border space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">CPU Load:</span>
                    <span className="font-bold text-text-main">{device.cpu_usage || 20}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">RAM Memory:</span>
                    <span className="font-bold text-text-main">{device.ram_usage || 35}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Throughput:</span>
                    <span className="font-bold text-primary font-mono">{device.throughput}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary border-b border-border text-text-subtle uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Device Node</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">CPU %</th>
                <th className="py-3 px-4">RAM %</th>
                <th className="py-3 px-4">Throughput</th>
                <th className="py-3 px-4 text-right">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {nodes.map((node) => (
                <tr
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className="hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  <td className="py-3 px-4 font-bold text-text-main">{node.name}</td>
                  <td className="py-3 px-4 font-mono text-text-muted">{node.ip}</td>
                  <td className="py-3 px-4 text-text-muted">{node.type}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                        node.status === 'critical'
                          ? 'bg-status-critical-bg text-status-critical border-status-critical-border'
                          : node.status === 'warning'
                          ? 'bg-status-warning-bg text-status-warning border-status-warning-border'
                          : 'bg-status-healthy-bg text-status-healthy border-status-healthy-border'
                      }`}
                    >
                      {node.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-text-main">{node.cpu_usage}%</td>
                  <td className="py-3 px-4 font-semibold text-text-main">{node.ram_usage}%</td>
                  <td className="py-3 px-4 font-mono font-bold text-primary">{node.throughput}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="text-primary hover:underline font-semibold flex items-center justify-end space-x-1 ml-auto">
                      <span>Inspect</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
