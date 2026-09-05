import React, { useState } from 'react';
import { useSOC } from '../../context/SOCContext';
import {
  BellRing,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Check,
  ShieldAlert,
  ArrowRight,
  Clock
} from 'lucide-react';

export const AlertsView = () => {
  const {
    alerts,
    acknowledgeAlert,
    setCurrentView,
    setSelectedThreatForResolve,
    threats,
    addToast
  } = useSOC();

  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'UNREAD' | 'ACKNOWLEDGED'

  const filteredAlerts = alerts.filter((a) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      a.title.toLowerCase().includes(term) ||
      a.description.toLowerCase().includes(term) ||
      a.asset.toLowerCase().includes(term) ||
      (a.rule_triggered && a.rule_triggered.toLowerCase().includes(term));

    const matchesSeverity =
      severityFilter === 'ALL' || a.severity.toUpperCase() === severityFilter;

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'UNREAD' && !a.is_acknowledged) ||
      (statusFilter === 'ACKNOWLEDGED' && a.is_acknowledged);

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const criticalCount = alerts.filter((a) => a.severity === 'critical').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning').length;
  const unreadCount = alerts.filter((a) => !a.is_acknowledged).length;

  const handleAcknowledgeAll = async () => {
    const unread = alerts.filter((a) => !a.is_acknowledged);
    for (const item of unread) {
      await acknowledgeAlert(item.id || item.alert_id);
    }
    addToast({
      title: 'All Alerts Acknowledged',
      severity: 'healthy',
      description: `Marked ${unread.length} pending alert items as acknowledged.`,
      asset: 'SIEM Incident Bus'
    });
  };

  const handleViewThreat = (threatId) => {
    const matched = threats.find(
      (t) => t.ticket_id === threatId || t.id === threatId
    );
    if (matched) {
      setSelectedThreatForResolve(matched);
      setCurrentView('threats');
    }
  };

  const getSeverityBadge = (sev) => {
    switch (sev?.toLowerCase()) {
      case 'critical':
        return {
          icon: AlertOctagon,
          classes: 'bg-status-critical-bg text-status-critical border-status-critical-border'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          classes: 'bg-status-warning-bg text-status-warning border-status-warning-border'
        };
      default:
        return {
          icon: Info,
          classes: 'bg-status-info-bg text-status-info border-status-info-border'
        };
    }
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main flex items-center space-x-2">
            <BellRing className="w-5 h-5 text-primary" />
            <span>Real-Time Security Alerts & Telemetry Feed</span>
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            SIEM event notifications, heuristic intrusion anomalies, and perimeter threshold violations
          </p>
        </div>

        {/* Batch Acknowledge Action */}
        {unreadCount > 0 && (
          <button
            onClick={handleAcknowledgeAll}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-surface-secondary border border-border text-xs font-bold text-text-main hover:bg-surface-hover transition-colors shadow-sm"
          >
            <Check className="w-4 h-4 text-status-healthy" />
            <span>Acknowledge All Pending ({unreadCount})</span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-surface rounded-2xl border border-border">
          <span className="text-[10px] font-bold text-text-subtle uppercase">Total Alert Events</span>
          <div className="text-2xl font-extrabold text-text-main mt-1">{alerts.length}</div>
          <p className="text-[10px] text-text-muted mt-0.5">All ingested notifications</p>
        </div>

        <div className="p-4 bg-surface rounded-2xl border border-border">
          <span className="text-[10px] font-bold text-text-subtle uppercase">Pending Review</span>
          <div className="text-2xl font-extrabold text-status-warning mt-1">{unreadCount}</div>
          <p className="text-[10px] text-text-muted mt-0.5">Unacknowledged items</p>
        </div>

        <div className="p-4 bg-surface rounded-2xl border border-border">
          <span className="text-[10px] font-bold text-text-subtle uppercase">Critical Severity</span>
          <div className="text-2xl font-extrabold text-status-critical mt-1">{criticalCount}</div>
          <p className="text-[10px] text-text-muted mt-0.5">High-priority incidents</p>
        </div>

        <div className="p-4 bg-surface rounded-2xl border border-border">
          <span className="text-[10px] font-bold text-text-subtle uppercase">Warning Severity</span>
          <div className="text-2xl font-extrabold text-status-warning mt-1">{warningCount}</div>
          <p className="text-[10px] text-text-muted mt-0.5">Elevated traffic thresholds</p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-3 rounded-2xl border border-border">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-subtle" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search alerts by title, description, asset, or rule..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-surface-secondary border border-border text-xs text-text-main placeholder:text-text-subtle focus:outline-none focus:border-primary"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2">
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                severityFilter === sev
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface-secondary text-text-muted border-border hover:bg-surface-hover'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 border-l border-border pl-3">
          {['ALL', 'UNREAD', 'ACKNOWLEDGED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                statusFilter === st
                  ? 'bg-text-main text-white border-text-main shadow-sm'
                  : 'bg-surface-secondary text-text-muted border-border hover:bg-surface-hover'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-surface rounded-2xl border border-border">
            <CheckCircle2 className="w-10 h-10 text-status-healthy mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-bold text-text-main">No alerts matching filter</h3>
            <p className="text-xs text-text-muted mt-1">All systems operating within nominal baseline parameters.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const badge = getSeverityBadge(alert.severity);
            const Icon = badge.icon;
            const isAck = alert.is_acknowledged;

            return (
              <div
                key={alert.id || alert.alert_id}
                className={`p-4 bg-surface rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isAck
                    ? 'border-border opacity-70 bg-surface/80'
                    : 'border-border shadow-sm hover:border-primary/40'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${badge.classes}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-text-main">{alert.title}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${badge.classes}`}>
                        {alert.severity}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-secondary text-text-muted border border-border">
                        {alert.asset}
                      </span>
                      {isAck ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-status-healthy-bg text-status-healthy border border-status-healthy-border flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Acknowledged</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-status-warning-bg text-status-warning border border-status-warning-border">
                          Pending Review
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-text-muted leading-relaxed">{alert.description}</p>

                    <div className="flex items-center space-x-4 text-[10px] text-text-subtle pt-1 font-mono">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{alert.timestamp || 'Recent'}</span>
                      </span>
                      {alert.rule_triggered && (
                        <span>Rule: <strong className="text-text-muted">{alert.rule_triggered}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 self-end md:self-center shrink-0">
                  {alert.threat_id && (
                    <button
                      onClick={() => handleViewThreat(alert.threat_id)}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-primary-light text-primary hover:bg-primary/20 text-xs font-bold transition-colors"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Investigate Ticket</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {!isAck && (
                    <button
                      onClick={() => acknowledgeAlert(alert.id || alert.alert_id)}
                      className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-surface-secondary border border-border hover:bg-surface-hover text-text-main text-xs font-bold transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 text-status-healthy" />
                      <span>Acknowledge</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
