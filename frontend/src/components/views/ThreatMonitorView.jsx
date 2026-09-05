import React, { useState } from 'react';
import { useSOC } from '../../context/SOCContext';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Eye,
  FileCode,
  ShieldCheck
} from 'lucide-react';

export const ThreatMonitorView = () => {
  const { threats, setSelectedThreatForResolve, canResolveThreats } = useSOC();

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [inspectedPayload, setInspectedPayload] = useState(null);

  const filteredThreats = threats.filter((t) => {
    const matchesSearch =
      t.ticket_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.attack_vector.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.source_ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.destination_host.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || t.severity.toUpperCase() === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || t.status.toUpperCase() === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-status-critical" />
            <span>NIDS Threat Incident Monitor & Triage</span>
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Real-time heuristic intrusion detection signatures, malicious payload exfiltration analysis, and containment runbooks
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-text-muted" />
            <input
              type="text"
              placeholder="Search vector, IP, ticket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-border bg-surface text-xs text-text-main focus:ring-2 focus:ring-primary focus:outline-none w-48"
            />
          </div>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="p-1.5 rounded-xl border border-border bg-surface text-xs font-semibold text-text-main focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 rounded-xl border border-border bg-surface text-xs font-semibold text-text-main focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Threats Table */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary border-b border-border text-text-subtle uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Ticket ID</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Attack Classification</th>
                <th className="py-3 px-4">Adversary Source</th>
                <th className="py-3 px-4">Target Host</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Payload</th>
                <th className="py-3 px-4 text-right">Containment Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredThreats.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-text-muted text-xs">
                    No threat incident tickets match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredThreats.map((t) => (
                  <tr key={t.id || t.ticket_id} className="hover:bg-surface-hover transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-text-main">{t.ticket_id}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                          t.severity === 'Critical'
                            ? 'bg-status-critical-bg text-status-critical border-status-critical-border'
                            : t.severity === 'High'
                            ? 'bg-orange-50 text-orange-600 border-orange-200'
                            : t.severity === 'Medium'
                            ? 'bg-status-warning-bg text-status-warning border-status-warning-border'
                            : 'bg-status-info-bg text-status-info border-status-info-border'
                        }`}
                      >
                        {t.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-text-main">{t.attack_vector}</td>
                    <td className="py-3 px-4 font-mono text-text-muted">{t.source_ip}</td>
                    <td className="py-3 px-4 font-mono text-text-muted">{t.destination_host}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          t.status === 'Resolved'
                            ? 'text-status-healthy'
                            : t.status === 'Active'
                            ? 'text-status-critical'
                            : 'text-status-warning'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setInspectedPayload(t)}
                        className="flex items-center space-x-1 px-2 py-1 rounded bg-surface-secondary hover:bg-surface-hover border border-border text-[11px] font-medium text-text-muted hover:text-text-main transition-colors"
                      >
                        <FileCode className="w-3.5 h-3.5 text-primary" />
                        <span>Inspect</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {t.status !== 'Resolved' ? (
                        <button
                          disabled={!canResolveThreats}
                          onClick={() => setSelectedThreatForResolve(t)}
                          title={
                            !canResolveThreats
                              ? 'Requires Administrator privileges'
                              : 'Open Resolution Wizard'
                          }
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            canResolveThreats
                              ? 'bg-status-healthy hover:bg-emerald-600 text-white shadow-sm'
                              : 'bg-surface-secondary text-text-subtle cursor-not-allowed border border-border'
                          }`}
                        >
                          Resolve Threat
                        </button>
                      ) : (
                        <span className="text-[11px] text-status-healthy font-semibold inline-flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Mitigated</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Raw Payload Inspector Modal */}
      {inspectedPayload && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-text-main/40 backdrop-blur-sm"
            onClick={() => setInspectedPayload(null)}
          />
          <div className="relative bg-surface rounded-2xl shadow-modal border border-border w-full max-w-xl p-6 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-sm font-bold text-text-main">
                  Raw Signature & Payload Inspector: {inspectedPayload.ticket_id}
                </h3>
                <p className="text-[11px] text-text-muted mt-0.5">
                  {inspectedPayload.source_ip} &rarr; {inspectedPayload.destination_host}
                </p>
              </div>
              <button
                onClick={() => setInspectedPayload(null)}
                className="text-text-muted hover:text-text-main text-xs font-bold p-1"
              >
                Close
              </button>
            </div>

            <div className="mt-4">
              <label className="text-xs font-bold text-text-main block mb-1">
                Decoded Attack Vector String:
              </label>
              <div className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre leading-relaxed border border-slate-800 max-h-56">
                {inspectedPayload.raw_payload || 'Suricata Signature: No raw bytes captured.'}
              </div>
            </div>

            {inspectedPayload.action_taken && (
              <div className="mt-4 p-3 bg-surface-secondary rounded-xl border border-border text-xs">
                <span className="font-bold text-text-main">Resolution Record:</span>
                <p className="text-text-muted mt-0.5">Action: {inspectedPayload.action_taken}</p>
                {inspectedPayload.admin_notes && (
                  <p className="text-text-muted mt-0.5">Notes: {inspectedPayload.admin_notes}</p>
                )}
                <p className="text-text-subtle text-[10px] mt-1">
                  Resolved by {inspectedPayload.resolved_by || 'Alex Vance'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
