import React, { useState } from 'react';
import { useSOC } from '../../context/SOCContext';
import { ScrollText, Search, Filter, ChevronDown, ChevronRight, FileJson } from 'lucide-react';

export const LogsView = () => {
  const { logs } = useSOC();

  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [expandedLogId, setExpandedLogId] = useState(1);

  const filteredLogs = logs.filter((l) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      l.message.toLowerCase().includes(term) ||
      l.component.toLowerCase().includes(term) ||
      l.device.toLowerCase().includes(term);

    const matchesLevel = levelFilter === 'ALL' || l.level.toUpperCase() === levelFilter;

    return matchesSearch && matchesLevel;
  });

  const getLevelBadge = (lvl) => {
    switch (lvl?.toUpperCase()) {
      case 'CRITICAL':
        return 'bg-status-critical-bg text-status-critical border-status-critical-border';
      case 'WARNING':
        return 'bg-status-warning-bg text-status-warning border-status-warning-border';
      default:
        return 'bg-status-info-bg text-status-info border-status-info-border';
    }
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main flex items-center space-x-2">
            <ScrollText className="w-5 h-5 text-primary" />
            <span>SIEM Security Audit Event Log Stream</span>
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Real-time ingestion pipeline for Suricata EVE-JSON events, firewall drops, and Linux systemd syslog
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-text-muted" />
            <input
              type="text"
              placeholder="Search SIEM logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-border bg-surface text-xs text-text-main focus:ring-2 focus:ring-primary focus:outline-none w-56"
            />
          </div>

          {/* Level Filter */}
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="p-1.5 rounded-xl border border-border bg-surface text-xs font-semibold text-text-main focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Levels</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary border-b border-border text-text-subtle uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Source Device</th>
                <th className="py-3 px-4">Component</th>
                <th className="py-3 px-4">Log Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLogs.map((log) => {
                const isExpanded = expandedLogId === log.id;
                return (
                  <React.Fragment key={log.id}>
                    <tr
                      onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                      className="hover:bg-surface-hover transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 text-text-subtle">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </td>
                      <td className="py-3 px-4 font-mono text-text-muted">{log.timestamp}</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getLevelBadge(log.level)}`}>
                          {log.level}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-text-main">{log.device}</td>
                      <td className="py-3 px-4 text-text-muted font-medium">{log.component}</td>
                      <td className="py-3 px-4 text-text-main font-medium">{log.message}</td>
                    </tr>

                    {/* Expandable JSON Body */}
                    {isExpanded && (
                      <tr className="bg-slate-950 text-slate-100">
                        <td colSpan={6} className="p-4">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2 text-xs text-slate-400">
                              <FileJson className="w-4 h-4 text-primary" />
                              <span className="font-bold text-white">Parsed EVE-JSON Event Payload</span>
                            </div>
                            <pre className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed">
                              {log.raw_json ? JSON.stringify(JSON.parse(log.raw_json), null, 2) : '{\n  "status": "RAW_LOG_CAPTURED"\n}'}
                            </pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
