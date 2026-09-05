import React, { useState } from 'react';
import { useSOC } from '../../context/SOCContext';
import {
  X,
  ShieldCheck,
  ShieldBan,
  Radio,
  ServerOff,
  FileText,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const ResolveThreatModal = () => {
  const {
    selectedThreatForResolve,
    setSelectedThreatForResolve,
    resolveThreat,
    user
  } = useSOC();

  const [step, setStep] = useState(1);
  const [selectedAction, setSelectedAction] = useState('Block Source IP on Perimeter Firewall');
  const [adminNotes, setAdminNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedThreatForResolve) return null;

  const threat = selectedThreatForResolve;

  const actionOptions = [
    {
      id: 'Block Source IP on Perimeter Firewall',
      title: 'Block Source IP on Perimeter Firewall',
      desc: 'Appends source IP address to the perimeter Palo Alto PA-5250 DROP ACL blacklist.',
      icon: ShieldBan,
      recommended: true
    },
    {
      id: 'Terminate Active Suspicious TCP Session',
      title: 'Terminate Active Suspicious TCP Session',
      desc: 'Injects TCP RST packets into the socket stream to immediately severed adversary communication.',
      icon: Radio
    },
    {
      id: 'Isolate Target Endpoint Machine',
      title: 'Isolate Target Endpoint Machine',
      desc: 'Moves the victim host to Quarantine VLAN 99 to prevent lateral malware propagation.',
      icon: ServerOff
    }
  ];

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleConfirmResolve = async () => {
    setIsSubmitting(true);
    await resolveThreat(threat.id || threat.ticket_id, selectedAction, adminNotes);
    setIsSubmitting(false);
    setSelectedThreatForResolve(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-text-main/40 backdrop-blur-sm transition-opacity"
        onClick={() => setSelectedThreatForResolve(null)}
      />

      {/* Modal Container */}
      <div className="relative bg-surface rounded-2xl shadow-modal border border-border w-full max-w-xl overflow-hidden z-10">
        {/* Header */}
        <div className="p-5 border-b border-border bg-surface-secondary flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-status-critical-bg text-status-critical flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-main">Incident Remediation Wizard</h3>
              <p className="text-[11px] text-text-muted">Ticket: {threat.ticket_id} • 4-Step Resolution</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedThreatForResolve(null)}
            className="text-text-muted hover:text-text-main p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Progress Indicator */}
        <div className="px-6 py-3 bg-surface border-b border-border flex items-center justify-between text-xs font-semibold">
          {[
            { num: 1, label: 'Threat Info' },
            { num: 2, label: 'Suggested Action' },
            { num: 3, label: 'Admin Notes' },
            { num: 4, label: 'Confirm' }
          ].map((s) => (
            <div key={s.num} className="flex items-center space-x-2">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s.num
                    ? 'bg-primary text-white'
                    : step > s.num
                    ? 'bg-status-healthy text-white'
                    : 'bg-surface-secondary text-text-subtle'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </span>
              <span className={step === s.num ? 'text-primary font-bold' : 'text-text-muted'}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Modal Body Per Step */}
        <div className="p-6">
          {/* STEP 1: Threat Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-status-critical-bg border border-status-critical-border">
                <div className="flex items-center space-x-2">
                  <AlertOctagon className="w-5 h-5 text-status-critical" />
                  <span className="text-xs font-bold text-status-critical">
                    Severity: {threat.severity.toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-text-main">{threat.ticket_id}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-surface-secondary border border-border">
                  <span className="text-text-subtle font-medium">Source Adversary IP:</span>
                  <div className="font-mono font-bold text-text-main mt-1">{threat.source_ip}</div>
                </div>
                <div className="p-3 rounded-xl bg-surface-secondary border border-border">
                  <span className="text-text-subtle font-medium">Destination Host:</span>
                  <div className="font-mono font-bold text-text-main mt-1">{threat.destination_host}</div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text-main block mb-1">Attack Classification:</label>
                <div className="p-2.5 rounded-lg bg-surface-secondary border border-border text-xs font-medium text-text-main">
                  {threat.attack_vector}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text-main block mb-1">
                  Captured Raw Attack Payload / Signature:
                </label>
                <div className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto whitespace-pre leading-relaxed border border-slate-800 max-h-32">
                  {threat.raw_payload || 'TCP Payload exfiltration stream captured by Suricata sensor.'}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Suggested Action */}
          {step === 2 && (
            <div className="space-y-3">
              <p className="text-xs text-text-muted">
                Select the containment policy to execute across the SOC infrastructure fabric:
              </p>
              {actionOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedAction === opt.id;
                return (
                  <label
                    key={opt.id}
                    onClick={() => setSelectedAction(opt.id)}
                    className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary-light/40 shadow-sm'
                        : 'border-border bg-surface hover:bg-surface-hover'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="resolutionAction"
                        checked={isSelected}
                        onChange={() => setSelectedAction(opt.id)}
                        className="mt-1 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-text-main">{opt.title}</span>
                          {opt.recommended && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary text-white">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-text-muted mt-1 leading-normal">{opt.desc}</p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {/* STEP 3: Admin Notes */}
          {step === 3 && (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-text-main block mb-1">
                  Root Cause Analysis (RCA) & Resolution Audit Notes:
                </label>
                <textarea
                  rows={5}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="e.g. Adversary SQL injection payload neutralized at WAF. Source IP added to permanent DROP rule #101. Verified no database records exfiltrated."
                  className="w-full p-3 rounded-xl border border-border bg-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="p-3 bg-surface-secondary rounded-xl border border-border flex items-center space-x-2 text-xs text-text-muted">
                <FileText className="w-4 h-4 text-primary shrink-0" />
                <span>Notes are cryptographically logged to the permanent SIEM audit trail.</span>
              </div>
            </div>
          )}

          {/* STEP 4: Confirm */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-surface-secondary border border-border space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-text-muted">Threat Ticket:</span>
                  <span className="font-mono font-bold text-text-main">{threat.ticket_id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-text-muted">Target Host:</span>
                  <span className="font-mono text-text-main">{threat.destination_host}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-text-muted">Remediation Action:</span>
                  <span className="font-semibold text-primary">{selectedAction}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-text-muted">Resolving Officer:</span>
                  <span className="font-semibold text-text-main">
                    {user?.name} ({user?.role})
                  </span>
                </div>
                <div className="py-1">
                  <span className="text-text-muted block mb-1">Audit Notes:</span>
                  <p className="text-[11px] text-text-main italic bg-surface p-2 rounded border border-border">
                    {adminNotes || 'Incident resolved and mitigated per enterprise standard SOC runbook.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-border bg-surface-secondary flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center space-x-1 px-4 py-2 rounded-lg border border-border bg-surface text-xs font-semibold text-text-main hover:bg-surface-hover transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={() => setSelectedThreatForResolve(null)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-text-muted hover:text-text-main transition-colors"
            >
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center space-x-1 px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              disabled={isSubmitting}
              onClick={handleConfirmResolve}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-status-healthy hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Resolving...' : 'Confirm & Resolve Threat'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
