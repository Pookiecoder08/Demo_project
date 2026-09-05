import React from 'react';
import { useSOC } from '../../context/SOCContext';
import { X, Check, BellRing, AlertTriangle, AlertOctagon, Info } from 'lucide-react';

export const NotificationDrawer = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    alerts,
    acknowledgeAlert,
    setCurrentView,
    setSelectedThreatForResolve,
    threats
  } = useSOC();

  if (!isNotificationDrawerOpen) return null;

  const getSeverityIcon = (sev) => {
    switch (sev) {
      case 'critical':
        return <AlertOctagon className="w-4 h-4 text-status-critical" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-status-warning" />;
      default:
        return <Info className="w-4 h-4 text-status-info" />;
    }
  };

  const getSeverityClass = (sev) => {
    switch (sev) {
      case 'critical':
        return 'bg-status-critical-bg text-status-critical border-status-critical-border';
      case 'warning':
        return 'bg-status-warning-bg text-status-warning border-status-warning-border';
      default:
        return 'bg-status-info-bg text-status-info border-status-info-border';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-text-main/20 backdrop-blur-sm transition-opacity"
        onClick={() => setIsNotificationDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md bg-surface shadow-modal border-l border-border flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-surface-secondary">
            <div className="flex items-center space-x-2">
              <BellRing className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold text-text-main">Security Alerts & Telemetry</h2>
            </div>
            <button
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="p-1 rounded-lg text-text-muted hover:text-text-main hover:bg-surface-hover transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of alerts */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-12 text-text-muted text-xs">
                No active security alerts recorded.
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id || alert.alert_id}
                  className={`p-3 rounded-xl border transition-all ${
                    alert.is_acknowledged
                      ? 'bg-surface-secondary border-border opacity-70'
                      : 'bg-surface border-border-strong shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      {getSeverityIcon(alert.severity)}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getSeverityClass(
                          alert.severity
                        )}`}
                      >
                        {alert.severity}
                      </span>
                    </div>
                    <span className="text-[10px] text-text-subtle font-mono">
                      {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-text-main mt-2">{alert.title}</h3>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed">{alert.description}</p>
                  <div className="mt-2 text-[10px] font-mono text-text-subtle bg-surface-secondary px-2 py-1 rounded inline-block">
                    Target: {alert.asset}
                  </div>

                  <div className="mt-3 pt-2 border-t border-border flex items-center justify-between">
                    <button
                      onClick={() => {
                        setIsNotificationDrawerOpen(false);
                        setCurrentView('threats');
                      }}
                      className="text-[11px] font-semibold text-primary hover:underline"
                    >
                      View Threat Board &rarr;
                    </button>
                    {!alert.is_acknowledged ? (
                      <button
                        onClick={() => acknowledgeAlert(alert.id || alert.alert_id)}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-surface-hover hover:bg-primary-light hover:text-primary transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Acknowledge</span>
                      </button>
                    ) : (
                      <span className="text-[10px] text-status-healthy font-semibold">Acknowledged</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
