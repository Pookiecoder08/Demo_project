import React, { useState } from 'react';
import { useSOC } from '../../context/SOCContext';
import {
  RefreshCw,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Cpu,
  Server,
  Network,
  Radio,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { EnterpriseTopologyMap } from '../common/EnterpriseTopologyMap';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const DashboardView = () => {
  const {
    metrics,
    threats,
    nodes,
    setSelectedNode,
    setSelectedThreatForResolve,
    setCurrentView,
    refreshTelemetry,
    canResolveThreats
  } = useSOC();

  const [timeFilter, setTimeFilter] = useState('24H');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshTelemetry();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // 4 Chart.js Data Configurations
  // 1. Packets Per Second (PPS) Line Chart
  const ppsData = {
    labels: ['18:00', '18:10', '18:20', '18:30', '18:40', '18:50', '19:00'],
    datasets: [
      {
        label: 'Packets / Sec (PPS)',
        data: [12800, 13400, 14100, 13900, 14600, 14200, 14850],
        borderColor: '#0284c7',
        backgroundColor: 'rgba(2, 132, 199, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 6
      }
    ]
  };

  // 2. Inbound & Outbound Bandwidth
  const bandwidthData = {
    labels: ['18:00', '18:10', '18:20', '18:30', '18:40', '18:50', '19:00'],
    datasets: [
      {
        label: 'Inbound Traffic (Mbps)',
        data: [540, 680, 890, 1240, 920, 840, 860],
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.3
      },
      {
        label: 'Outbound Traffic (Mbps)',
        data: [320, 340, 390, 410, 380, 360, 390],
        borderColor: '#10b981',
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.3
      }
    ]
  };

  // 3. Network Protocol Distribution
  const protocolData = {
    labels: ['TCP', 'UDP', 'HTTP/S', 'DNS', 'ICMP'],
    datasets: [
      {
        data: [58, 22, 12, 6, 2],
        backgroundColor: ['#0284c7', '#4f46e5', '#10b981', '#f59e0b', '#64748b'],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };

  // 4. Threat Severity Breakdown
  const severityData = {
    labels: ['Critical', 'High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Incidents',
        data: [
          threats.filter(t => t.severity === 'Critical').length || 2,
          threats.filter(t => t.severity === 'High').length || 3,
          threats.filter(t => t.severity === 'Medium').length || 4,
          threats.filter(t => t.severity === 'Low').length || 5
        ],
        backgroundColor: ['#ef4444', '#f97316', '#f59e0b', '#3b82f6'],
        borderRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { boxWidth: 12, font: { size: 10, family: 'Inter' } }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { font: { size: 9 } } },
      y: { grid: { color: '#f1f5f9' }, ticks: { font: { size: 9 } } }
    }
  };

  const activeThreats = threats.filter(t => t.status !== 'Resolved').slice(0, 5);

  const getStatusBadgeClass = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-status-critical-bg text-status-critical border-status-critical-border';
      case 'warning':
        return 'bg-status-warning-bg text-status-warning border-status-warning-border';
      case 'info':
        return 'bg-status-info-bg text-status-info border-status-info-border';
      default:
        return 'bg-status-healthy-bg text-status-healthy border-status-healthy-border';
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text-main flex items-center space-x-2">
            <span>Enterprise Security Operations Center (SOC)</span>
            <span className="badge-dot bg-status-healthy animate-pulse"></span>
          </h1>
          <p className="text-xs text-text-muted mt-0.5">
            Real-time Suricata NIDS telemetry, automated heuristic analysis, and perimeter ACL containment
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Time Filter Buttons */}
          <div className="flex items-center bg-surface-secondary border border-border p-1 rounded-xl">
            {['1H', '24H', '7D'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  timeFilter === tf
                    ? 'bg-surface text-primary shadow-sm'
                    : 'text-text-muted hover:text-text-main'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-hover text-xs font-semibold text-text-main shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-text-muted ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* 9 Live Status Telemetry Cards (3x3 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.cards.map((card, idx) => (
          <div
            key={idx}
            className="p-4 bg-surface rounded-2xl border border-border hover:border-border-strong hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                {card.title}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getStatusBadgeClass(
                  card.badgeType
                )}`}
              >
                {card.badge}
              </span>
            </div>

            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-xl font-extrabold text-text-main tracking-tight">{card.value}</span>
            </div>

            <p className="text-[11px] text-text-muted mt-1 leading-snug">{card.subtext}</p>
          </div>
        ))}
      </div>

      {/* Interactive Enterprise Network Topology Section */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Network className="w-4 h-4 text-sky-600" />
              <span>Enterprise Network Infrastructure Topology</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time node telemetry • Click any element to inspect interfaces, rules, &amp; throughput
            </p>
          </div>
          <button
            onClick={() => setCurrentView('topology')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline flex items-center space-x-1 self-start sm:self-auto"
          >
            <span>Full Canvas View</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Enterprise Topology Map */}
        <div className="w-full bg-white rounded-xl overflow-x-auto relative">
          <EnterpriseTopologyMap />
        </div>
      </div>

      {/* 4 SOC Telemetry Charts (2x2 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Chart 1: Packets Per Second (PPS) */}
        <div className="p-4 bg-surface rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-text-main flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-primary" />
              <span>Real-Time Packets Per Second (PPS)</span>
            </h3>
            <span className="text-[10px] font-mono text-primary font-bold">14.2k PPS</span>
          </div>
          <div className="h-48">
            <Line data={ppsData} options={chartOptions} />
          </div>
        </div>

        {/* Chart 2: Bandwidth */}
        <div className="p-4 bg-surface rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-text-main flex items-center space-x-1.5">
              <Radio className="w-4 h-4 text-status-critical" />
              <span>Inbound vs Outbound Bandwidth (Mbps)</span>
            </h3>
            <span className="text-[10px] font-mono text-text-muted">Peak: 12.4 Gbps</span>
          </div>
          <div className="h-48">
            <Line data={bandwidthData} options={chartOptions} />
          </div>
        </div>

        {/* Chart 3: Protocol Breakdown */}
        <div className="p-4 bg-surface rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-text-main flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-accent" />
              <span>Network Protocol Distribution</span>
            </h3>
            <span className="text-[10px] text-text-subtle font-medium">Layer 4/7</span>
          </div>
          <div className="h-48 flex items-center justify-center">
            <Doughnut data={protocolData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Chart 4: Threat Severity */}
        <div className="p-4 bg-surface rounded-2xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-text-main flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-status-warning" />
              <span>Incident Severity Breakdown</span>
            </h3>
            <span className="text-[10px] text-text-subtle font-medium">Total: 14 Tickets</span>
          </div>
          <div className="h-48">
            <Bar data={severityData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Active Security Incidents Quick Triage Table */}
      <div className="p-5 bg-surface rounded-2xl border border-border shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-text-main flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-status-critical" />
              <span>Active Security Incidents Quick Triage</span>
            </h3>
            <p className="text-[11px] text-text-muted mt-0.5">
              Incident queue requiring investigation and containment authorization
            </p>
          </div>
          <button
            onClick={() => setCurrentView('threats')}
            className="text-xs font-semibold text-primary hover:underline"
          >
            View All Incident Tickets &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-secondary border-y border-border text-text-subtle uppercase text-[10px] font-bold">
              <tr>
                <th className="py-2.5 px-3">Ticket ID</th>
                <th className="py-2.5 px-3">Severity</th>
                <th className="py-2.5 px-3">Attack Vector</th>
                <th className="py-2.5 px-3">Adversary Source</th>
                <th className="py-2.5 px-3">Target Host</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {activeThreats.map((t) => (
                <tr key={t.id || t.ticket_id} className="hover:bg-surface-hover transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-text-main">{t.ticket_id}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                        t.severity === 'Critical'
                          ? 'bg-status-critical-bg text-status-critical border-status-critical-border'
                          : t.severity === 'High'
                          ? 'bg-orange-50 text-orange-600 border-orange-200'
                          : 'bg-status-warning-bg text-status-warning border-status-warning-border'
                      }`}
                    >
                      {t.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-text-main">{t.attack_vector}</td>
                  <td className="py-3 px-3 font-mono text-text-muted">{t.source_ip}</td>
                  <td className="py-3 px-3 font-mono text-text-muted">{t.destination_host}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-bold text-status-warning uppercase">
                      {t.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setCurrentView('threats')}
                        className="px-2.5 py-1 rounded bg-surface-secondary hover:bg-surface-hover text-text-main text-xs font-semibold border border-border"
                      >
                        Investigate
                      </button>
                      <button
                        disabled={!canResolveThreats}
                        onClick={() => setSelectedThreatForResolve(t)}
                        title={
                          !canResolveThreats
                            ? 'Requires Administrator privileges'
                            : 'Open Resolution Wizard'
                        }
                        className={`px-2.5 py-1 rounded text-xs font-bold transition-colors ${
                          canResolveThreats
                            ? 'bg-status-healthy hover:bg-emerald-600 text-white shadow-sm'
                            : 'bg-surface-secondary text-text-subtle cursor-not-allowed border border-border'
                        }`}
                      >
                        Resolve
                      </button>
                    </div>
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
