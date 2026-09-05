import React, { useState } from 'react';
import { useSOC } from '../../context/SOCContext';
import { X, ShieldPlus, CheckCircle2 } from 'lucide-react';

export const AddFirewallRuleModal = () => {
  const { isAddRuleModalOpen, setIsAddRuleModalOpen, addFirewallRule, firewallRules } = useSOC();

  const nextRuleNum = firewallRules.length
    ? Math.max(...firewallRules.map((r) => r.rule_number || 100)) + 1
    : 105;

  const [ruleName, setRuleName] = useState('');
  const [direction, setDirection] = useState('Inbound');
  const [sourceSubnet, setSourceSubnet] = useState('Any');
  const [destSubnet, setDestSubnet] = useState('Any');
  const [protocol, setProtocol] = useState('TCP');
  const [action, setAction] = useState('DROP');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAddRuleModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!ruleName.trim()) return;

    setIsSubmitting(true);
    await addFirewallRule({
      rule_number: nextRuleNum,
      name: ruleName.trim(),
      direction,
      source_subnet: sourceSubnet.trim() || 'Any',
      dest_subnet: destSubnet.trim() || 'Any',
      protocol,
      action
    });
    setIsSubmitting(false);
    setIsAddRuleModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-text-main/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAddRuleModalOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative bg-surface rounded-2xl shadow-modal border border-border w-full max-w-lg overflow-hidden z-10">
        <div className="p-5 border-b border-border bg-surface-secondary flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center font-bold">
              <ShieldPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-text-main">Add Firewall Security Rule</h3>
              <p className="text-[11px] text-text-muted">PA-5250 Perimeter ACL Engine • Rule #{nextRuleNum}</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddRuleModalOpen(false)}
            className="text-text-muted hover:text-text-main p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-bold text-text-main block mb-1">Rule Policy Name</label>
            <input
              type="text"
              required
              value={ruleName}
              onChange={(e) => setRuleName(e.target.value)}
              placeholder="e.g. Block-Tor-Exit-Nodes"
              className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-text-main block mb-1">Direction</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Inbound">Inbound (WAN &rarr; LAN)</option>
                <option value="Outbound">Outbound (LAN &rarr; WAN)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-text-main block mb-1">Action</label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="DROP">DROP (Silently Discard)</option>
                <option value="ACCEPT">ACCEPT (Permit Traffic)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-text-main block mb-1">Source Subnet / CIDR</label>
              <input
                type="text"
                value={sourceSubnet}
                onChange={(e) => setSourceSubnet(e.target.value)}
                placeholder="e.g. 198.51.100.0/24 or Any"
                className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs font-mono focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text-main block mb-1">Destination Subnet</label>
              <input
                type="text"
                value={destSubnet}
                onChange={(e) => setDestSubnet(e.target.value)}
                placeholder="e.g. 192.168.1.60 or Any"
                className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs font-mono focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-text-main block mb-1">Protocol / Port</label>
            <select
              value={protocol}
              onChange={(e) => setProtocol(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-surface text-xs focus:ring-2 focus:ring-primary focus:outline-none"
            >
              <option value="ALL">ALL Protocols (IP Any)</option>
              <option value="TCP">TCP (Any Port)</option>
              <option value="TCP (443)">TCP (443 / HTTPS)</option>
              <option value="TCP (80)">TCP (80 / HTTP)</option>
              <option value="TCP (22)">TCP (22 / SSH)</option>
              <option value="UDP">UDP (Any Port)</option>
              <option value="UDP (53)">UDP (53 / DNS)</option>
              <option value="ICMP">ICMP (Ping / Trace)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setIsAddRuleModalOpen(false)}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-text-muted hover:text-text-main transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-sm transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Applying...' : 'Deploy Rule Policy'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
