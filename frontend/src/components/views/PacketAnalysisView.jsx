import React, { useState } from 'react';
import { useSOC } from '../../context/SOCContext';
import { Cpu, Search, Radio, ChevronDown, ChevronRight, Binary, Filter } from 'lucide-react';

export const PacketAnalysisView = () => {
  const { packets, wsStreamActive, setWsStreamActive } = useSOC();

  const [searchTerm, setSearchTerm] = useState('');
  const [protocolFilter, setProtocolFilter] = useState('ALL');
  const [expandedFrameId, setExpandedFrameId] = useState(1482910); // Default expand first packet

  const filteredPackets = packets.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      p.src_ip.toLowerCase().includes(term) ||
      p.dst_ip.toLowerCase().includes(term) ||
      p.protocol.toLowerCase().includes(term) ||
      String(p.frame_id).includes(term) ||
      (p.flags && p.flags.toLowerCase().includes(term));

    const matchesProto =
      protocolFilter === 'ALL' || p.protocol.toUpperCase().includes(protocolFilter);

    return matchesSearch && matchesProto;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'BLOCKED':
        return 'bg-status-critical-bg text-status-critical border-status-critical-border';
      case 'RATE_LIMITED':
        return 'bg-status-warning-bg text-status-warning border-status-warning-border';
      default:
        return 'bg-status-healthy-bg text-status-healthy border-status-healthy-border';
    }
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-primary" />
            <span>Deep Packet Inspection & Frame Analysis</span>
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Promiscuous ring capture buffer, Layer 2-7 frame decoding, hex dumps, and protocol dissection
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Live Capture Stream Toggle Button */}
          <button
            onClick={() => setWsStreamActive(!wsStreamActive)}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-sm transition-all ${
              wsStreamActive
                ? 'bg-status-healthy-bg border-status-healthy-border text-status-healthy'
                : 'bg-surface border-border text-text-muted hover:bg-surface-hover'
            }`}
          >
            <span className="relative flex h-2 w-2">
              {wsStreamActive && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-healthy opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${wsStreamActive ? 'bg-status-healthy' : 'bg-text-subtle'}`}></span>
            </span>
            <span>{wsStreamActive ? 'Live Ring Capture Active' : 'Capture Buffer Paused'}</span>
          </button>

          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-text-muted" />
            <input
              type="text"
              placeholder="Search IP, port, flags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl border border-border bg-surface text-xs text-text-main focus:ring-2 focus:ring-primary focus:outline-none w-48"
            />
          </div>

          {/* Protocol Filter */}
          <select
            value={protocolFilter}
            onChange={(e) => setProtocolFilter(e.target.value)}
            className="p-1.5 rounded-xl border border-border bg-surface text-xs font-semibold text-text-main focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Protocols</option>
            <option value="TCP">TCP</option>
            <option value="UDP">UDP</option>
            <option value="HTTP">HTTP/S</option>
            <option value="DNS">DNS</option>
          </select>
        </div>
      </div>

      {/* Frame Captures Table */}
      <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary border-b border-border text-text-subtle uppercase text-[10px] font-bold">
              <tr>
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4">Frame ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Source Socket</th>
                <th className="py-3 px-4">Destination Socket</th>
                <th className="py-3 px-4">Protocol</th>
                <th className="py-3 px-4">Length</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">TCP Flags</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPackets.map((pkt) => {
                const isExpanded = expandedFrameId === pkt.frame_id;
                return (
                  <React.Fragment key={pkt.id || pkt.frame_id}>
                    <tr
                      onClick={() => setExpandedFrameId(isExpanded ? null : pkt.frame_id)}
                      className="hover:bg-surface-hover transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 text-text-subtle">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-text-main">#{pkt.frame_id}</td>
                      <td className="py-3 px-4 font-mono text-text-muted">{pkt.timestamp}</td>
                      <td className="py-3 px-4 font-mono font-medium text-text-main">
                        {pkt.src_ip}:{pkt.src_port}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-text-main">
                        {pkt.dst_ip}:{pkt.dst_port}
                      </td>
                      <td className="py-3 px-4 font-bold text-primary">{pkt.protocol}</td>
                      <td className="py-3 px-4 font-mono text-text-muted">{pkt.length} B</td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getStatusBadge(pkt.status)}`}>
                          {pkt.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-text-subtle">{pkt.flags}</td>
                    </tr>

                    {/* Expandable Hex / ASCII Payload Inspector */}
                    {isExpanded && (
                      <tr className="bg-slate-950 text-slate-100">
                        <td colSpan={9} className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                              <div className="flex items-center space-x-2">
                                <Binary className="w-4 h-4 text-emerald-400" />
                                <span className="font-bold text-white">
                                  Decoded Hex & ASCII Frame Payload Dissection (Frame #{pkt.frame_id})
                                </span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                Capture Size: {pkt.length} bytes • Promiscuous Sniffer
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px]">
                              {/* Hex Dump */}
                              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto">
                                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                                  Raw Hex View:
                                </span>
                                <p className="text-sky-400 tracking-widest break-all whitespace-pre-wrap leading-relaxed">
                                  {pkt.payload_hex || '45 00 00 3c 1c 46 40 00 40 06 b1 e6 c0 a8 01 32 c0 a8 01 01'}
                                </p>
                              </div>

                              {/* ASCII Decoded */}
                              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 overflow-x-auto">
                                <span className="text-slate-400 text-[10px] uppercase font-bold block mb-1">
                                  Decoded ASCII Stream:
                                </span>
                                <p className="text-emerald-300 break-all whitespace-pre-wrap leading-relaxed">
                                  {pkt.payload_ascii || 'E..<.F@.@.........2......'}
                                </p>
                              </div>
                            </div>
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
