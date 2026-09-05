import React from 'react';
import { useSOC } from '../../context/SOCContext';
import { FileBarChart, Download, Printer, ShieldCheck, CheckCircle2, FileText } from 'lucide-react';

export const ReportsView = () => {
  const { threats, metrics, addToast } = useSOC();

  const handleExportCSV = () => {
    try {
      const headers = [
        'Ticket ID',
        'Severity',
        'Attack Vector',
        'Source IP',
        'Destination Host',
        'Status',
        'Timestamp',
        'Action Taken',
        'Admin Notes',
        'Resolved By'
      ];

      const rows = threats.map((t) => [
        `"${t.ticket_id}"`,
        `"${t.severity}"`,
        `"${t.attack_vector.replace(/"/g, '""')}"`,
        `"${t.source_ip}"`,
        `"${t.destination_host}"`,
        `"${t.status}"`,
        `"${t.timestamp}"`,
        `"${(t.action_taken || 'N/A').replace(/"/g, '""')}"`,
        `"${(t.admin_notes || 'N/A').replace(/"/g, '""')}"`,
        `"${t.resolved_by || 'Unassigned'}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `securenet_soc_threat_report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addToast({
        title: 'Report Exported Successfully',
        severity: 'healthy',
        description: 'Threat incident log (.CSV) has been generated and downloaded.',
        asset: 'Reporting Engine'
      });
    } catch (e) {
      console.error('CSV export failed:', e);
    }
  };

  const handlePrintBriefing = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12 select-none print:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main flex items-center space-x-2">
            <FileBarChart className="w-5 h-5 text-primary" />
            <span>Compliance Reports & Executive Security Briefings</span>
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Audit-ready SOC incident documentation, regulatory compliance extracts, and executive briefs
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-surface border border-border hover:bg-surface-hover text-xs font-bold text-text-main shadow-sm transition-all"
          >
            <Download className="w-4 h-4 text-primary" />
            <span>Export Threat Log (.CSV)</span>
          </button>
          <button
            onClick={handlePrintBriefing}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm shadow-primary/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Executive Briefing (.PDF)</span>
          </button>
        </div>
      </div>

      {/* Printable Executive Briefing Document Card */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-base font-extrabold text-text-main">
              SecureNetAI — Executive Security Incident Briefing
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              Target Frameworks: NIST CSF v2.0 • ISO/IEC 27001 • PCI-DSS v4.0
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-primary">AUDIT REPORT v4.2</span>
            <p className="text-[10px] text-text-subtle">{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Executive Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] font-bold text-text-subtle uppercase">Total Threat Tickets</span>
            <div className="text-xl font-extrabold text-text-main mt-1">{threats.length}</div>
            <span className="text-[10px] text-text-muted">Recorded incidents</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] font-bold text-text-subtle uppercase">Resolution Efficacy</span>
            <div className="text-xl font-extrabold text-status-healthy mt-1">
              {((threats.filter((t) => t.status === 'Resolved').length / (threats.length || 1)) * 100).toFixed(1)}%
            </div>
            <span className="text-[10px] text-text-muted">Avg resolution: 6m 12s</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] font-bold text-text-subtle uppercase">Critical Containment</span>
            <div className="text-xl font-extrabold text-status-critical mt-1">
              {threats.filter((t) => t.severity === 'Critical').length}
            </div>
            <span className="text-[10px] text-text-muted">SQLi & DDoS vectors</span>
          </div>

          <div className="p-4 rounded-xl bg-surface-secondary border border-border">
            <span className="text-[10px] font-bold text-text-subtle uppercase">Suricata Inspection</span>
            <div className="text-xl font-extrabold text-primary mt-1">38,400</div>
            <span className="text-[10px] text-text-muted">Signatures active</span>
          </div>
        </div>

        {/* Audit Trail Summary Table */}
        <div>
          <h3 className="text-xs font-bold text-text-main uppercase tracking-wider mb-3">
            Threat Incident Registry (Audit Extract)
          </h3>
          <div className="overflow-x-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-secondary border-b border-border text-text-subtle uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-3">Ticket ID</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Attack Classification</th>
                  <th className="py-2.5 px-3">Adversary Source</th>
                  <th className="py-2.5 px-3">Target Host</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Action Applied</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {threats.map((t) => (
                  <tr key={t.id || t.ticket_id} className="hover:bg-surface-hover">
                    <td className="py-2.5 px-3 font-mono font-bold text-text-main">{t.ticket_id}</td>
                    <td className="py-2.5 px-3 font-semibold">{t.severity}</td>
                    <td className="py-2.5 px-3">{t.attack_vector}</td>
                    <td className="py-2.5 px-3 font-mono text-text-muted">{t.source_ip}</td>
                    <td className="py-2.5 px-3 font-mono text-text-muted">{t.destination_host}</td>
                    <td className="py-2.5 px-3 font-bold">{t.status}</td>
                    <td className="py-2.5 px-3 text-text-muted text-[11px]">{t.action_taken || 'Under Triage'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
