'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Printer, Settings, Mail } from 'lucide-react';
import SettingsWizardModal from './SettingsWizardModal';
import CoverPage from './reports/CoverPage';
import SummaryPage from './reports/SummaryPage';
import DevicesPage from './reports/DevicesPage';
import PatchesPage from './reports/PatchesPage';
import CVEPage from './reports/CVEPage';
import AlertsPage from './reports/AlertsPage';
import TicketsPage from './reports/TicketsPage';

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
    cveData?: any;
  };
  isMock: boolean;
  errorMsg: string | null;
}

export default function ReportView({ data, isMock, errorMsg }: ReportViewProps) {
  const { customers, agents, tickets, alerts: rawAlerts, contracts, workhours, contacts, patchData, cveData } = data;

  // ===== TOTAL PAGES CONSTANT =====
  const totalPages = 7;

  // ===== DATE RANGE PICKER STATE (default: 30 days back from today) =====
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const formatISODate = (d: Date) => d.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(formatISODate(thirtyDaysAgo));
  const [endDate, setEndDate] = useState(formatISODate(today));
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Dynamic report details
  const [reportTitle, setReportTitle] = useState('Executive Summary');
  const [reportSubtitle, setReportSubtitle] = useState('Monthly Executive Report');
  const [companyName, setCompanyName] = useState(data.accountInfo?.CompanyName || 'Atera Client');

  // Selected step for Settings Wizard
  const [wizardStep, setWizardStep] = useState(1);

  // Reports are English-only. The wider type remains for legacy settings.
  const [language, setLanguage] = useState<'th' | 'en'>('en');

  // Scroll visibility for the floating header bar
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Mounting state to prevent Next.js hydration flash
  const [hasMounted, setHasMounted] = useState(false);

  // Load saved report settings on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('atera_unified_report_settings');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed.reportTitle) setReportTitle(parsed.reportTitle);
        if (parsed.reportSubtitle) setReportSubtitle(parsed.reportSubtitle);
        if (parsed.companyName) setCompanyName(parsed.companyName);
        if (parsed.startDate) setStartDate(parsed.startDate);
        if (parsed.endDate) setEndDate(parsed.endDate);
        setLanguage('en');
      } catch (e) {
        console.error('Failed to load saved report settings', e);
      }
    }
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMounted, lastScrollY]);

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

  const normalizeStatus = (value: unknown) => String(value ?? '').trim().toLowerCase();
  const isOpenTicket = (ticket: Record<string, unknown>) => {
    const status = normalizeStatus(ticket.TicketStatus ?? ticket.status ?? ticket.Status ?? ticket.StatusName);
    return ['open', 'new', 'pending', 'in progress', 'in-progress', 'waiting', 'waiting on user', 'on hold', 'active'].includes(status)
      || status.includes('open')
      || status.includes('pending')
      || status.includes('progress');
  };

  const isResolvedTicket = (ticket: Record<string, unknown>) => {
    const status = normalizeStatus(ticket.TicketStatus ?? ticket.status ?? ticket.Status ?? ticket.StatusName);
    return ['resolved', 'closed', 'completed', 'done', 'solved', 'cancelled', 'canceled'].includes(status)
      || status.includes('resolved')
      || status.includes('closed')
      || status.includes('completed')
      || status.includes('solved');
  };

  const totalTickets = filteredTickets.length;
  const openTickets = filteredTickets.filter(ticket => isOpenTicket(ticket as Record<string, unknown>)).length;
  const resolvedTickets = filteredTickets.filter(ticket => isResolvedTicket(ticket as Record<string, unknown>)).length;
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

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-600 font-sans">
        <div className="h-8 w-8 border-4 border-slate-300 border-t-[#E20074] rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-bold tracking-wide">กำลังเตรียมข้อมูลรายงาน...</p>
      </div>
    );
  }

  return (
    <div className="a4-container min-h-screen">
      
      {/* Floating Action Bar (Hidden in Print) - Smart Scroll Show/Hide Header */}
      <div className={`no-print sticky top-4 z-50 bg-white/90 backdrop-blur-xl text-slate-800 px-6 py-3.5 rounded-2xl border border-slate-200/60 shadow-[0_12px_40px_rgba(0,0,0,0.1)] flex items-center justify-between transition-all duration-500 ease-in-out ${
        showHeader ? 'translate-y-0 opacity-100' : '-translate-y-28 opacity-0 pointer-events-none'
      }`} style={{ width: '210mm', marginLeft: 'auto', marginRight: 'auto' }}>
        
        {/* Left side: Logo + Status */}
        <div className="flex items-center gap-5">
          
          {/* Atera Logo */}
          <div className="flex-shrink-0 pr-4 border-r border-slate-200/60">
            <img 
              src="/atera-box-logo.png" 
              alt="Atera Logo" 
              className="h-8 w-auto object-contain"
            />
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="absolute h-3 w-3 rounded-full bg-emerald-400 animate-pulse opacity-75" />
              <div className="relative h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-bold text-sm text-slate-900 tracking-tight">
                {language === 'th' ? 'เชื่อมต่อ API สำเร็จ' : 'Live API Connected'}
              </h3>
              <p className="text-[10.5px] text-slate-500 font-medium">
                {errorMsg ? errorMsg : (language === 'th' ? 'เชื่อมต่อและดึงข้อมูลจาก Atera เรียลไทม์' : 'Connected and fetching live data from Atera')}
              </p>
            </div>
          </div>
        </div>

        {/* Right side: Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setWizardStep(1);
              setIsSettingsModalOpen(true);
            }}
            title={language === 'th' ? 'ตั้งค่าหลัก' : 'Settings'}
            className="flex items-center gap-2 rounded-xl border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 px-4 py-2 text-xs font-bold hover:bg-slate-50 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Settings className="h-4 w-4" /> 
            <span>{language === 'th' ? 'ตั้งค่าหลัก' : 'Settings'}</span>
          </button>

          {/* Auto Email Schedule Button */}
          <button
            onClick={() => {
              setWizardStep(2);
              setIsSettingsModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl border-2 border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 px-4 py-2 text-xs font-bold hover:bg-slate-50 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Mail className="h-4 w-4" /> 
            <span>Auto Email</span>
          </button>

          {/* Print Button - Pink/Magenta */}
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-pink-600 hover:from-pink-700 hover:to-pink-700 px-6 py-2 text-xs font-bold text-white shadow-lg shadow-pink-500/30 hover:shadow-pink-500/45 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <Printer className="h-4 w-4" /> 
            <span>{language === 'th' ? 'บันทึก PDF / พิมพ์' : 'Save PDF / Print'}</span>
          </button>
        </div>
      </div>

      {/* Settings Wizard Modal */}
      <SettingsWizardModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        initialStartDate={startDate}
        initialEndDate={endDate}
        initialCompanyName={companyName}
        initialReportTitle={reportTitle}
        initialReportSubtitle={reportSubtitle}
        initialDisplayLanguage={language}
        initialStep={wizardStep}
        onSave={(config) => {
          setStartDate(config.startDate);
          setEndDate(config.endDate);
          setCompanyName(config.companyName);
          setReportTitle(config.reportTitle);
          setReportSubtitle(config.reportSubtitle);
          setLanguage('en');
        }}
      />

      {/* PAGE 1: COVER PAGE */}
      <CoverPage 
        totalCustomers={totalCustomers}
        totalDevices={totalDevices}
        totalTickets={totalTickets}
        totalAlerts={totalAlerts}
        currentDate={currentDate}
        reportPeriod={reportPeriod}
        reportTitle={reportTitle}
        companyName={companyName}
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
        lang="en"
        companyName={companyName}
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
        lang="en"
        companyName={companyName}
      />

      {/* PAGE 4: OS PATCH SUMMARY */}
      <PatchesPage 
        pageNumber={4}
        agents={agents}
        patchData={patchData}
        reportPeriod={reportPeriod}
        dateRangeDisplay={dateRangeDisplay}
        totalPages={totalPages}
        lang="en"
        companyName={companyName}
      />

      {/* PAGE 5: VULNERABILITY & CVE ASSESSMENT */}
      <CVEPage 
        pageNumber={5}
        agents={agents}
        patchData={patchData}
        cveData={cveData}
        reportPeriod={reportPeriod}
        dateRangeDisplay={dateRangeDisplay}
        totalPages={totalPages}
        lang="en"
        companyName={companyName}
      />

      {/* PAGE 6: ALERT OVERVIEW */}
      <AlertsPage 
        pageNumber={6}
        alerts={alerts}
        criticalAlerts={criticalAlerts}
        warningAlerts={warningAlerts}
        dateRangeDisplay={dateRangeDisplay}
        totalPages={totalPages}
        lang="en"
        companyName={companyName}
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
        lang="en"
        companyName={companyName}
        agents={agents}
      />
    </div>
  );
}
