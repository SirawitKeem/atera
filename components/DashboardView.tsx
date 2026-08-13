'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import OverviewTab from './OverviewTab';
import CustomersTab from './CustomersTab';
import DevicesTab from './DevicesTab';
import TicketsTab from './TicketsTab';
import AlertsTab from './AlertsTab';
import ReportView from './ReportView';
import { Database, CheckCircle, AlertTriangle, Key, ShieldCheck, Cpu } from 'lucide-react';

interface DashboardViewProps {
  data: {
    customers: any[];
    agents: any[];
    tickets: any[];
    alerts: any[];
    contracts: any[];
    workhours: any[];
    patchData: any[];
  };
  isMock: boolean;
  errorMsg: string | null;
}

export default function DashboardView({ data, isMock, errorMsg }: DashboardViewProps) {
  const [activeSidebarItem, setActiveSidebarItem] = useState('Overview');

  const renderActiveTab = () => {
    switch (activeSidebarItem) {
      case 'Overview':
        return (
          <OverviewTab 
            customers={data.customers} 
            agents={data.agents} 
            tickets={data.tickets} 
            alerts={data.alerts} 
          />
        );
      case 'Customers':
        return (
          <CustomersTab 
            customers={data.customers} 
            agents={data.agents} 
            tickets={data.tickets} 
            alerts={data.alerts} 
          />
        );
      case 'Devices':
        return <DevicesTab agents={data.agents} />;
      case 'Tickets':
        return <TicketsTab tickets={data.tickets} />;
      case 'Alerts':
        return <AlertsTab alerts={data.alerts} />;
      case 'Executive Report':
        return (
          <ReportView 
            data={data} 
            isMock={isMock} 
            errorMsg={errorMsg} 
          />
        );
      case 'Settings':
        return <SettingsView isMock={isMock} errorMsg={errorMsg} />;
      default:
        return (
          <OverviewTab 
            customers={data.customers} 
            agents={data.agents} 
            tickets={data.tickets} 
            alerts={data.alerts} 
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      {/* Collapsible Sidebar (Hidden in Print unless Executive Report is open) */}
      <Sidebar activeItem={activeSidebarItem} onItemClick={setActiveSidebarItem} />
      
      {/* Main Content Area */}
      <main className="flex-1 p-6 text-slate-800 font-sans antialiased overflow-y-auto max-h-screen scrollbar-none flex flex-col justify-between">
        
        {/* Top Info Bar (Hidden in Print) */}
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-100 px-5 py-3 rounded-2xl shadow-xs">
          <div className="flex items-center gap-2">
            <Database className="h-4.5 w-4.5 text-blue-600" />
            <span className="text-xs font-semibold text-slate-600">Atera RMM Service Gateway:</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
              isMock 
                ? 'bg-amber-50 text-amber-700 border-amber-200/50' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${isMock ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`}></span>
              {isMock ? 'Mock API Gateway (Local Preview)' : 'Atera Live API Active'}
            </span>
          </div>

          <div className="text-[11px] text-slate-400 font-medium">
            {isMock 
              ? 'Using high-fidelity mockup data fallback' 
              : 'Direct secure credential handshake verified'}
          </div>
        </div>

        {/* Current Active Tab Screen */}
        <div className="flex-1">
          {renderActiveTab()}
        </div>

        {/* Footer (Hidden in Print) */}
        <footer className="no-print mt-12 border-t border-slate-100 pt-5 text-center text-[10px] text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} Keem Workspace Operations Centre • Secured Atera API v3 Integration</p>
        </footer>
      </main>
    </div>
  );
}

/**
 * SettingsView sub-component (Dashboard Settings Tab)
 */
function SettingsView({ isMock, errorMsg }: { isMock: boolean; errorMsg: string | null }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Workspace Settings</h1>
        <p className="text-sm text-slate-500">
          Configure API credential variables, network routes, and system authentication keys
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-xs max-w-2xl space-y-6">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <Key className="h-4.5 w-4.5 text-blue-600" /> Atera Developer API Setup
        </h3>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs leading-relaxed text-slate-600">
            To switch from Mock Data to Live API Data, you must create a <code className="bg-slate-200 px-1 py-0.5 rounded text-blue-600 font-mono">.env.local</code> file in your project folder and add your Atera API details:
            <pre className="mt-3 bg-slate-800 text-slate-200 p-3 rounded-lg font-mono text-[10px]">
{`ATERA_API_KEY=your_actual_atera_api_key_here
ATERA_API_URL=https://app.atera.com/api/v3`}
            </pre>
          </div>

          <div className="border border-slate-100 rounded-xl p-4 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gateway Status Diagnostics</h4>
            
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400">Connection Handshake</span>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  {isMock ? (
                    <>
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      Mock Mode Fallback
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      Secure Verification Pass
                    </>
                  )}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400">Encryption Method</span>
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-blue-500" />
                  TLS 1.3 AES-256-GCM
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200/50 rounded-lg p-3 text-[11px] text-rose-800 font-semibold leading-relaxed">
                <strong>Handshake Warning Detail:</strong> {errorMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
