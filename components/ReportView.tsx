'use client';

import React, { useState, useMemo } from 'react';
import { Printer, Calendar } from 'lucide-react';
import CoverPage from './reports/CoverPage';
import SummaryPage from './reports/SummaryPage';
import DevicesPage from './reports/DevicesPage';
import HealthPage from './reports/HealthPage';
import AlertsPage from './reports/AlertsPage';
import PatchesPage from './reports/PatchesPage';
import SoftwarePage from './reports/SoftwarePage';
import TicketsPage from './reports/TicketsPage';
import RiskScorecardPage from './reports/RiskScorecardPage';

interface ReportViewProps {
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

export default function ReportView({ data, isMock, errorMsg }: ReportViewProps) {
  const { customers, agents, tickets, alerts: rawAlerts, contracts, workhours, patchData } = data;

  // ===== DATE RANGE PICKER STATE =====
  const [startDate, setStartDate] = useState('2026-07-13');
  const [endDate, setEndDate] = useState('2026-08-13');

  const reportPeriod = useMemo(() => ({ start: startDate, end: endDate }), [startDate, endDate]);

  // ===== DATE FILTER HELPER =====
  const isInRange = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d >= new Date(startDate + 'T00:00:00Z') && d <= new Date(endDate + 'T23:59:59Z');
  };

  // ===== FILTER DATA BY DATE RANGE =====
  // Filter active alerts only (Archived: false) AND within date range
  const alerts = useMemo(() => {
    const activeAlerts = isMock 
      ? rawAlerts 
      : rawAlerts.filter(a => a.Archived === false || a.archived === false || String(a.Archived).toLowerCase() === 'false');
    return activeAlerts.filter(a => isInRange(a.Created || a.CreatedDate || a.created));
  }, [rawAlerts, isMock, startDate, endDate]);

  // Filter tickets within date range
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => isInRange(t.TicketCreatedDate || t.CreatedDate || t.created));
  }, [tickets, startDate, endDate]);

  const handlePrint = () => {
    window.print();
  };

  // Format report period for display
  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
  const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const formatThaiDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()} ${thaiMonths[d.getMonth()]} ${d.getFullYear()}`;
  };
  const dateRangeDisplay = `${formatThaiDate(startDate)} - ${formatThaiDate(endDate)}`;

  const totalCustomers = customers.length;
  const totalDevices = agents.length;
  const onlineDevices = agents.filter(a => a.Online === true || a.online === true || String(a.Online).toLowerCase() === 'true').length;
  const offlineDevices = totalDevices - onlineDevices;
  const onlineRatio = totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 100;

  // Ticket stats (from filtered tickets)
  const totalTickets = filteredTickets.length;
  const openTickets = filteredTickets.filter(t => {
    const status = (t.TicketStatus || t.status || '').toLowerCase();
    return status === 'open' || status === 'new' || status === 'pending';
  }).length;
  const resolvedTickets = totalTickets - openTickets;
  const criticalTickets = filteredTickets.filter(t => {
    const priority = (t.TicketPriority || t.priority || '').toLowerCase();
    return priority === 'critical';
  }).length;

  // Alert stats (from filtered alerts)
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
      <div className="no-print sticky top-4 z-50 bg-white/80 backdrop-blur-xl text-slate-800 px-5 py-4 rounded-2xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-5xl mx-auto flex items-center justify-between transition-all duration-300">
        
        {/* Left side: Status */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className={`absolute h-4 w-4 rounded-full ${isMock ? 'bg-amber-400' : 'bg-emerald-400'} animate-ping opacity-75`} />
            <div className={`relative h-3 w-3 rounded-full ${isMock ? 'bg-amber-500' : 'bg-emerald-500'} shadow-sm`} />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-sm text-slate-800 tracking-tight">
              {isMock ? 'Mock Data Mode' : 'Live API Connected'}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {isMock 
                ? `ตรวจสอบไฟล์ .env.local (${errorMsg || 'Missing API Key'})`
                : 'เชื่อมต่อและดึงข้อมูลจาก Atera เรียลไทม์'}
            </p>
          </div>
        </div>

        {/* Right side: Controls */}
        <div className="flex items-center gap-3">
          
          {/* Date Filter Group */}
          <div className="flex items-center bg-slate-100/70 p-1.5 rounded-xl border border-slate-200/60 shadow-inner">
            <div className="flex items-center px-3 gap-2">
              <Calendar className="h-4 w-4 text-blue-500" strokeWidth={2.5} />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Period</span>
            </div>
            
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-white border border-slate-200/80 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all cursor-pointer shadow-sm"
            />
            
            <div className="px-2 text-slate-400 font-medium text-xs">
              →
            </div>
            
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-white border border-slate-200/80 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition-all cursor-pointer shadow-sm mr-1"
            />
          </div>

          <div className="w-px h-8 bg-slate-200 mx-1"></div>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Printer className="h-4 w-4" /> 
            <span>Save PDF / Print</span>
          </button>
        </div>
      </div>

      {/* PAGE 1: COVER PAGE */}
      <CoverPage 
        totalCustomers={totalCustomers}
        totalDevices={totalDevices}
        totalTickets={totalTickets}
        totalAlerts={totalAlerts}
        currentDate={currentDate}
        reportPeriod={reportPeriod}
      />

      {/* PAGE 2: SUMMARY & CUSTOMERS */}
      <SummaryPage 
        pageNumber={2}
        customers={customers}
        agents={agents}
        tickets={filteredTickets}
        alerts={alerts}
        contracts={contracts}
        workhours={workhours}
        onlineRatio={onlineRatio}
        totalCustomers={totalCustomers}
        openTickets={openTickets}
        totalDevices={totalDevices}
        totalTickets={totalTickets}
        resolvedTickets={resolvedTickets}
      dateRangeDisplay={dateRangeDisplay}
      />

      {/* PAGE 3: INFRASTRUCTURE & CUSTOMER OVERVIEW */}
      <DevicesPage 
        pageNumber={3}
        customers={customers}
        agents={agents}
        contracts={contracts}
      dateRangeDisplay={dateRangeDisplay}
      />

      {/* PAGE 4: OS PATCH SUMMARY */}
      <PatchesPage 
        pageNumber={4}
        agents={agents}
        patchData={patchData}
        reportPeriod={reportPeriod}
      dateRangeDisplay={dateRangeDisplay}
      />

      {/* PAGE 5: SOFTWARE UPDATES REQUIRED */}
      <SoftwarePage 
        pageNumber={5}
        patchData={patchData}
        reportPeriod={reportPeriod}
      dateRangeDisplay={dateRangeDisplay}
      />

      {/* PAGE 6: ALERT OVERVIEW */}
      <AlertsPage 
        pageNumber={6}
        alerts={alerts}
        criticalAlerts={criticalAlerts}
        warningAlerts={warningAlerts}
      dateRangeDisplay={dateRangeDisplay}
      />

      {/* PAGE 7: TICKET OVERVIEW */}
      <TicketsPage 
        pageNumber={7}
        tickets={filteredTickets}
        totalTickets={totalTickets}
        openTickets={openTickets}
        resolvedTickets={resolvedTickets}
        criticalTickets={criticalTickets}
      dateRangeDisplay={dateRangeDisplay}
      />

      {/* PAGE 8: SECURITY & VULNERABILITY ASSESSMENT */}
      <RiskScorecardPage 
        pageNumber={8}
        customers={customers}
        agents={agents}
        alerts={alerts}
        tickets={filteredTickets}
      dateRangeDisplay={dateRangeDisplay}
      />

      {/* PAGE 9: DEVICE AVAILABILITY & HEALTH (LAST) */}
      <HealthPage 
        pageNumber={9}
        agents={agents}
      dateRangeDisplay={dateRangeDisplay}
      />

    </div>
  );
}
