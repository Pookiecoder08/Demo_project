import React from 'react';
import { useSOC } from './context/SOCContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { ToastQueue } from './components/common/ToastQueue';
import { DeviceSlideOver } from './components/common/DeviceSlideOver';
import { ResolveThreatModal } from './components/modals/ResolveThreatModal';
import { AddFirewallRuleModal } from './components/modals/AddFirewallRuleModal';

// Views
import { LoginView } from './components/views/LoginView';
import { DashboardView } from './components/views/DashboardView';
import { NetworkTopologyView } from './components/views/NetworkTopologyView';
import { DevicesView } from './components/views/DevicesView';
import { ThreatMonitorView } from './components/views/ThreatMonitorView';
import { AlertsView } from './components/views/AlertsView';
import { PacketAnalysisView } from './components/views/PacketAnalysisView';
import { FirewallView } from './components/views/FirewallView';
import { RoutersView } from './components/views/RoutersView';
import { ServersView } from './components/views/ServersView';
import { ReportsView } from './components/views/ReportsView';
import { LogsView } from './components/views/LogsView';
import { SettingsView } from './components/views/SettingsView';

export const App = () => {
  const { isAuthenticated, currentView } = useSOC();

  if (!isAuthenticated || currentView === 'login') {
    return <LoginView />;
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'topology':
        return <NetworkTopologyView />;
      case 'devices':
        return <DevicesView />;
      case 'threats':
        return <ThreatMonitorView />;
      case 'alerts':
        return <AlertsView />;
      case 'packets':
        return <PacketAnalysisView />;
      case 'firewall':
        return <FirewallView />;
      case 'routers':
        return <RoutersView />;
      case 'servers':
        return <ServersView />;
      case 'reports':
        return <ReportsView />;
      case 'logs':
        return <LogsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-app text-text-main flex flex-col antialiased selection:bg-primary selection:text-white font-sans">
      {/* Top Header */}
      <Header />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex w-full">
        {/* Fixed Navigation Sidebar */}
        <Sidebar />

        {/* Scrollable View Content Canvas */}
        <main className="flex-1 min-w-0 p-6 md:p-8 overflow-y-auto bg-app">
          <div className="max-w-7xl mx-auto w-full">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Slide-overs, Drawers, Modals & Toast Queue */}
      <NotificationDrawer />
      <DeviceSlideOver />
      <ResolveThreatModal />
      <AddFirewallRuleModal />
      <ToastQueue />
    </div>
  );
};

export default App;
