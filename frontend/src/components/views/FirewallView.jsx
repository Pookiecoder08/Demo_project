import React from 'react';
import { useSOC } from '../../context/SOCContext';
import { ShieldBan, ShieldPlus, Check, X, ShieldAlert, Activity, Network } from 'lucide-react';

export const FirewallView = () => {
  const {
    firewallRules,
    toggleFirewallRule,
    setIsAddRuleModalOpen,
    canManageFirewall
  } = useSOC();

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main flex items-center space-x-2">
            <ShieldBan className="w-5 h-5 text-primary" />
            <span>Perimeter Firewall & ACL Policy Manager</span>
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Palo Alto PA-5250 NextGen Firewall HA cluster with stateful Layer 7 packet inspection and automated threat blackholing
          </p>
        </div>

        {/* Add Rule Button (Admin Only) */}
        <button
          disabled={!canManageFirewall}
          onClick={() => setIsAddRuleModalOpen(true)}
          title={!canManageFirewall ? 'Requires Administrator privileges' : 'Add New Rule'}
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            canManageFirewall
              ? 'bg-primary hover:bg-primary-hover text-white shadow-sm shadow-primary/20'
              : 'bg-surface-secondary text-text-subtle cursor-not-allowed border border-border'
          }`}
        >
          <ShieldPlus className="w-4 h-4" />
          <span>Add Security Rule</span>
        </button>
      </div>

      {/* 4 Interface Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { name: 'eth0 (WAN Gateway)', ip: '198.51.100.2', status: 'ONLINE', role: 'External Transit Link' },
          { name: 'eth1 (Corporate LAN)', ip: '192.168.1.1', status: 'ONLINE', role: 'VLAN 10 Internal Host' },
          { name: 'eth2 (App DMZ)', ip: '10.0.0.1', status: 'ONLINE', role: 'Server Farm Isolation' },
          { name: 'eth3 (HA Bus)', ip: '172.16.1.1', status: 'SYNCD', role: 'Active/Passive Mirror' }
        ].map((iface, idx) => (
          <div key={idx} className="p-4 bg-surface rounded-2xl border border-border">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-main">{iface.name}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-status-healthy-bg text-status-healthy border border-status-healthy-border">
                {iface.status}
              </span>
            </div>
            <div className="mt-2 text-xs font-mono font-bold text-primary">{iface.ip}</div>
            <p className="text-[10px] text-text-subtle mt-0.5">{iface.role}</p>
          </div>
        ))}
      </div>

      {/* Perimeter ACL Rules Table */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-surface-secondary flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-text-main uppercase tracking-wider">
              Active Access Control List (ACL) Policies
            </h3>
            <p className="text-[11px] text-text-muted">
              Hardware-accelerated packet filtering rules synchronized across Palo Alto cluster
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-text-muted">
            {firewallRules.filter((r) => r.is_active).length} Active / {firewallRules.length} Total Rules
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface border-b border-border text-text-subtle uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4">Rule #</th>
                <th className="py-3 px-4">Policy Name</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4">Source Subnet</th>
                <th className="py-3 px-4">Destination</th>
                <th className="py-3 px-4">Protocol</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Hit Counter</th>
                <th className="py-3 px-4 text-right">Policy Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {firewallRules.map((rule) => (
                <tr key={rule.id || rule.rule_number} className="hover:bg-surface-hover transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-text-main">#{rule.rule_number}</td>
                  <td className="py-3 px-4 font-semibold text-text-main">{rule.name}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        rule.direction === 'Inbound'
                          ? 'bg-blue-50 text-blue-600 border border-blue-200'
                          : 'bg-purple-50 text-purple-600 border border-purple-200'
                      }`}
                    >
                      {rule.direction}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-text-muted">{rule.source_subnet}</td>
                  <td className="py-3 px-4 font-mono text-text-muted">{rule.dest_subnet}</td>
                  <td className="py-3 px-4 font-medium text-text-main">{rule.protocol}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                        rule.action === 'DROP'
                          ? 'bg-status-critical-bg text-status-critical border-status-critical-border'
                          : 'bg-status-healthy-bg text-status-healthy border-status-healthy-border'
                      }`}
                    >
                      {rule.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-text-main">{rule.hits?.toLocaleString() || 0}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      disabled={!canManageFirewall}
                      onClick={() => toggleFirewallRule(rule.id || rule.rule_number)}
                      title={
                        !canManageFirewall
                          ? 'Requires Administrator privileges'
                          : rule.is_active
                          ? 'Click to Disable'
                          : 'Click to Enable'
                      }
                      className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                        rule.is_active
                          ? 'bg-status-healthy-bg text-status-healthy border border-status-healthy-border hover:bg-emerald-100'
                          : 'bg-surface-secondary text-text-subtle border border-border hover:bg-surface-hover'
                      } ${!canManageFirewall ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      {rule.is_active ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
