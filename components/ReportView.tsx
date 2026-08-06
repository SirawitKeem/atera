'use client';

import React from 'react';
import { Printer } from 'lucide-react';
import CoverPage from './reports/CoverPage';
import SummaryPage from './reports/SummaryPage';
import DevicesPage from './reports/DevicesPage';
import HealthPage from './reports/HealthPage';
import AlertsPage from './reports/AlertsPage';
import PatchesPage from './reports/PatchesPage';
import TicketsPage from './reports/TicketsPage';
import BackCoverPage from './reports/BackCoverPage';

interface ReportViewProps {
  data: {
    customers: any[];
    agents: any[];
    tickets: any[];
    alerts: any[];
    contracts: any[];
    workhours: any[];
  };
  isMock: boolean;
  errorMsg: string | null;
}

export default function ReportView({ data, isMock, errorMsg }: ReportViewProps) {
  const { customers, agents, tickets, alerts, contracts, workhours } = data;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Calculate statistics from the provided data
  const totalCustomers = customers.length;
  const totalDevices = agents.length;
  const onlineDevices = agents.filter(a => a.Online === true || a.online === true || String(a.Online).toLowerCase() === 'true').length;
  const offlineDevices = totalDevices - onlineDevices;
  const onlineRatio = totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 100;

  // Ticket stats
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => {
    const status = (t.TicketStatus || t.status || '').toLowerCase();
    return status === 'open' || status === 'new' || status === 'pending';
  }).length;
  const resolvedTickets = totalTickets - openTickets;
  const criticalTickets = tickets.filter(t => {
    const priority = (t.TicketPriority || t.priority || '').toLowerCase();
    return priority === 'critical';
  }).length;

  // Alert stats
  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter(a => {
    const severity = (a.Severity || a.severity || '').toLowerCase();
    return severity === 'critical';
  }).length;
  const warningAlerts = totalAlerts - criticalAlerts;

  // OS Distribution calculation based on real agents data
  const osCounts: Record<string, number> = {};
  agents.forEach(a => {
    const os = (a.OS || a.os || 'Unknown OS').toLowerCase();
    if (os.includes('win') && os.includes('server')) {
      osCounts['Windows Server'] = (osCounts['Windows Server'] || 0) + 1;
    } else if (os.includes('win')) {
      osCounts['Windows Workstation'] = (osCounts['Windows Workstation'] || 0) + 1;
    } else if (os.includes('mac') || os.includes('darwin')) {
      osCounts['macOS'] = (osCounts['macOS'] || 0) + 1;
    } else if (os.includes('linux') || os.includes('ubuntu') || os.includes('debian')) {
      osCounts['Linux'] = (osCounts['Linux'] || 0) + 1;
    } else {
      osCounts['Other'] = (osCounts['Other'] || 0) + 1;
    }
  });

  // Calculate OS percentages
  const osPercentages = Object.entries(osCounts).map(([name, count]) => ({
    name,
    count,
    percentage: totalDevices > 0 ? Math.round((count / totalDevices) * 100) : 0
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="a4-container min-h-screen">
      
      {/* Floating Action Bar (Hidden in Print) */}
      <div className="no-print sticky top-4 z-50 flex items-center justify-between gap-4 bg-white/95 backdrop-blur-md text-slate-800 px-6 py-4 rounded-xl border border-slate-200/80 shadow-2xl w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className={`h-3.5 w-3.5 rounded-full ${isMock ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
          <div>
            <h3 className="font-bold text-sm text-slate-800">
              {isMock ? 'ระบบแสดงตัวอย่างข้อมูล (Mock Data)' : 'เชื่อมต่อ API สำเร็จ (Live Data)'}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {isMock 
                ? `ดึงข้อมูลไม่ได้เนื่องจาก API Key ไม่พบหรือเป็นบัญชีทดลอง (${errorMsg || 'กรุณาตรวจสอบไฟล์ .env.local'})`
                : 'แสดงข้อมูลเรียลไทม์ส่งตรงมาจากระบบ Atera API ของคุณ'}
            </p>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/20 hover:bg-blue-500 active:scale-95 transition-all cursor-pointer"
        >
          <Printer className="h-4 w-4" /> Save PDF / Print Report
        </button>
      </div>

      {/* PAGE 1: COVER PAGE */}
      <CoverPage 
        totalCustomers={totalCustomers}
        totalDevices={totalDevices}
        totalTickets={totalTickets}
        totalAlerts={totalAlerts}
        currentDate={currentDate}
      />

      {/* PAGE 2: SUMMARY & CUSTOMERS */}
      <SummaryPage 
        pageNumber={2}
        customers={customers}
        agents={agents}
        tickets={tickets}
        alerts={alerts}
        contracts={contracts}
        workhours={workhours}
        onlineRatio={onlineRatio}
        totalCustomers={totalCustomers}
        openTickets={openTickets}
        totalDevices={totalDevices}
        totalTickets={totalTickets}
        resolvedTickets={resolvedTickets}
      />

      {/* PAGE 3: INFRASTRUCTURE & CUSTOMER OVERVIEW */}
      <DevicesPage 
        pageNumber={3}
        customers={customers}
        agents={agents}
        contracts={contracts}
      />

      {/* PAGE 4: DEVICE AVAILABILITY & HEALTH */}
      <HealthPage 
        pageNumber={4}
        agents={agents}
      />

      {/* PAGE 5: ALERT OVERVIEW */}
      <AlertsPage 
        pageNumber={5}
        alerts={alerts}
        criticalAlerts={criticalAlerts}
        warningAlerts={warningAlerts}
      />

      {/* PAGE 6: PATCH MANAGEMENT */}
      <PatchesPage 
        pageNumber={6}
        agents={agents}
      />

      {/* PAGE 7: TICKET OVERVIEW */}
      <TicketsPage 
        pageNumber={7}
        tickets={tickets}
        totalTickets={totalTickets}
        openTickets={openTickets}
        resolvedTickets={resolvedTickets}
        criticalTickets={criticalTickets}
      />

      {/* PAGE 8: BACK COVER */}
      <BackCoverPage />

    </div>
  );
}
