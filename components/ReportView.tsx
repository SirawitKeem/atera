'use client';

import React, { useState, useMemo } from 'react';
import { Printer, Calendar, Mail } from 'lucide-react';
import EmailScheduleModal from './EmailScheduleModal';
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
    contacts: any[];
    patchData: any[];
    accountInfo: any;
  };
  isMock: boolean;
  errorMsg: string | null;
}

export default function ReportView({ data, isMock, errorMsg }: ReportViewProps) {
  const { customers, agents, tickets, alerts: rawAlerts, contracts, workhours, contacts, patchData } = data;

  // ===== TOTAL PAGES CONSTANT =====
  const totalPages = 9;

  // ===== DATE RANGE PICKER STATE (default: 30 days back from today) =====
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const formatISODate = (d: Date) => d.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(formatISODate(thirtyDaysAgo));
  const [endDate, setEndDate] = useState(formatISODate(today));
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const reportPeriod = useMemo(() => ({ start: startDate, end: endDate }), [startDate, endDate]);

  // ===== DATE FILTER HELPER =====
  const isInRange = (dateStr: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    return d >= new Date(startDate + 'T00:00:00Z') && d <= new Date(endDate + 'T23:59:59Z');
  };

  // ===== FILTER DATA BY DATE RANGE =====
  const alerts = useMemo(() => {
    const activeAlerts = isMock 
      ? rawAlerts 
      : rawAlerts.filter(a => a.Archived === false || a.archived === false || String(a.Archived).toLowerCase() === 'false');
    return activeAlerts.filter(a => isInRange(a.Created || a.CreatedDate || a.created));
  }, [rawAlerts, isMock, startDate, endDate]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => isInRange(t.TicketCreatedDate || t.CreatedDate || t.created));
  }, [tickets, startDate, endDate]);

  const handlePrint = () => {
    window.print();
  };

  // Format report period for display
  const thaiMonths = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
  const formatThaiDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getDate()} ${thaiMonths[d.getMonth()]} ${d.getFullYear()}`;
  };
  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  const dateRangeDisplay = `${formatDateDisplay(startDate)} - ${formatDateDisplay(endDate)}`;

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Calculate statistics
  const totalCustomers = customers.length;
  const totalDevices = agents.length;
  const onlineDevices = agents.filter(a => a.Online === true || a.online === true || String(a.Online).toLowerCase() === 'true').length;
  const onlineRatio = totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 100;

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

  const totalAlerts = alerts.length;
  const criticalAlerts = alerts.filter(a => {
    const severity = (a.Severity || a.severity || '').toLowerCase();
    return severity === 'critical';
  }).length;
  const warningAlerts = totalAlerts - criticalAlerts;

  return (
    <div className="a4-container min-h-screen">
      
      {/* Floating Action Bar (Hidden in Print) */}
      <div className="no-print sticky top-4 z-50 bg-white/80 backdrop-blur-xl text-slate-800 px-5 py-4 rounded-2xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-5xl mx-auto flex items-center justify-between transition-all duration-300">
        
        {/* Left side: Status */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-4 w-4 rounded-full bg-emerald-400 animate-ping opacity-75" />
            <div className="relative h-3 w-3 rounded-full bg-emerald-500 shadow-sm" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-bold text-sm text-slate-800 tracking-tight">
              Live API Connected
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {errorMsg ? errorMsg : 'เชื่อมต่อและดึงข้อมูลจาก Atera เรียลไทม์'}
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

          {/* Auto Email Schedule Button */}
          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 text-xs font-bold shadow-md hover:shadow-slate-800/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Mail className="h-4 w-4 text-blue-400" /> 
            <span>Auto Email</span>
          </button>

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

      {/* Email Schedule Modal */}
      <EmailScheduleModal 
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        companyName={data.accountInfo?.CompanyName || 'Atera Client'}
        dateRangeDisplay={dateRangeDisplay}
      />

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
        totalPages={totalPages}
      />

      {/* PAGE 3: INFRASTRUCTURE & CUSTOMER OVERVIEW */}
      <DevicesPage 
        pageNumber={3}
        customers={customers}
        agents={agents}
        contracts={contracts}
        contacts={contacts}
        dateRangeDisplay={dateRangeDisplay}
        totalPages={totalPages}
      />

      {/* PAGE 4: OS PATCH SUMMARY */}
      <PatchesPage 
        pageNumber={4}
        agents={agents}
        patchData={patchData}
        reportPeriod={reportPeriod}
        dateRangeDisplay={dateRangeDisplay}
        totalPages={totalPages}
      />

      {/* PAGE 5: AVAILABLE OS PATCHES */}
      <SoftwarePage 
        pageNumber={5}
        patchData={patchData}
        reportPeriod={reportPeriod}
        dateRangeDisplay={dateRangeDisplay}
        totalPages={totalPages}
      />

      {/* PAGE 6: ALERT OVERVIEW */}
      <AlertsPage 
        pageNumber={6}
        alerts={alerts}
        criticalAlerts={criticalAlerts}
        warningAlerts={warningAlerts}
        dateRangeDisplay={dateRangeDisplay}
        totalPages={totalPages}
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
        totalPages={totalPages}
      />

      {/* PAGE 8: SECURITY & VULNERABILITY ASSESSMENT */}
      <RiskScorecardPage 
        pageNumber={8}
        customers={customers}
        agents={agents}
        alerts={alerts}
        tickets={filteredTickets}
        patchData={patchData}
        dateRangeDisplay={dateRangeDisplay}
        totalPages={totalPages}
      />

      {/* PAGE 9: DEVICE AVAILABILITY & HEALTH */}
      <HealthPage 
        pageNumber={9}
        agents={agents}
        dateRangeDisplay={dateRangeDisplay}
        totalPages={totalPages}
      />

    </div>
  );
}
