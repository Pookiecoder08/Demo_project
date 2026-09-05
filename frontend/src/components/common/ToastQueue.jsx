import React, { useState, useEffect, useRef } from 'react';
import { useSOC } from '../../context/SOCContext';
import { X, ShieldAlert, AlertTriangle, AlertOctagon, Info, CheckCircle2 } from 'lucide-react';

const ToastItem = ({ toast, onDismiss, onViewThreat }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const duration = 8000; // 8 seconds
  const startTimeRef = useRef(Date.now());
  const remainingRef = useRef(duration);

  useEffect(() => {
    if (isPaused) return;

    const interval = 50;
    const timer = setInterval(() => {
      remainingRef.current -= interval;
      const pct = Math.max(0, (remainingRef.current / duration) * 100);
      setProgress(pct);

      if (remainingRef.current <= 0) {
        clearInterval(timer);
        onDismiss(toast.id);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, onDismiss, toast.id]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

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
      case 'healthy':
        return {
          icon: CheckCircle2,
          classes: 'bg-status-healthy-bg text-status-healthy border-status-healthy-border'
        };
      default:
        return {
          icon: Info,
          classes: 'bg-status-info-bg text-status-info border-status-info-border'
        };
    }
  };

  const badge = getSeverityBadge(toast.severity);
  const Icon = badge.icon;

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="w-84 max-w-sm bg-surface rounded-xl shadow-modal border border-border overflow-hidden transition-all duration-300 transform translate-y-0"
    >
      {/* Progress Bar */}
      <div className="h-1 w-full bg-surface-secondary">
        <div
          className="h-full bg-primary transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-3.5">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Icon className="w-4 h-4 shrink-0" />
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${badge.classes}`}>
              {toast.severity || 'INFO'}
            </span>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-text-subtle hover:text-text-main p-1 rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <h4 className="text-xs font-bold text-text-main mt-2 leading-tight">{toast.title}</h4>
        <p className="text-[11px] text-text-muted mt-1 leading-snug">{toast.description}</p>

        {toast.asset && (
          <div className="mt-2 text-[10px] text-text-subtle font-mono bg-surface-secondary px-2 py-0.5 rounded inline-block">
            Asset: {toast.asset}
          </div>
        )}

        <div className="mt-2.5 pt-2 border-t border-border flex items-center justify-between">
          <span className="text-[10px] text-text-subtle">{toast.timestamp}</span>
          <button
            onClick={() => onViewThreat(toast)}
            className="text-[11px] font-semibold text-primary hover:text-primary-hover hover:underline"
          >
            View Threat &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export const ToastQueue = () => {
  const { visibleToasts, toastQueue, dismissToast, setCurrentView } = useSOC();

  const handleViewThreat = (toast) => {
    setCurrentView('threats');
    dismissToast(toast.id);
  };

  return (
    <aside aria-label="Security notifications" className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none">
      {/* Queued Alerts Badge Indicator */}
      {toastQueue.length > 0 && (
        <div className="self-end pointer-events-auto bg-text-main text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg border border-border-strong flex items-center space-x-1.5 animate-bounce">
          <span className="badge-dot bg-status-warning"></span>
          <span>+{toastQueue.length} queued alert{toastQueue.length > 1 ? 's' : ''} waiting</span>
        </div>
      )}

      {/* Visible Toasts */}
      {visibleToasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem
            toast={toast}
            onDismiss={dismissToast}
            onViewThreat={handleViewThreat}
          />
        </div>
      ))}
    </aside>
  );
};
