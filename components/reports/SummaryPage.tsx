'use client';

import React from 'react';
import { 
  Users, 
  Monitor, 
  Ticket, 
  AlertOctagon, 
  ShieldAlert, 
  Activity, 
  AlertCircle,
  Info
} from 'lucide-react';
import ReportHeader from './ReportHeader';

interface SummaryPageProps {
  pageNumber: number;
  customers: any[];
  agents: any[];
  tickets: any[];
  alerts: any[];
  contracts: any[];
  workhours: any[];
  onlineRatio: number;
  totalCustomers: number;
  openTickets: number;
  totalDevices: number;
  totalTickets: number;
  resolvedTickets: number;
}

export default function SummaryPage({
  pageNumber,
  customers,
  agents,
  tickets,
  alerts,
  contracts,
  workhours,
  onlineRatio,
  totalCustomers,
  openTickets,
  totalDevices,
  totalTickets,
  resolvedTickets
}: SummaryPageProps) {

  // Helper to calculate age of a ticket in English
  const getTicketAge = (createdDateStr: string) => {
    if (!createdDateStr) return '1 day ago';
    const createdDate = new Date(createdDateStr);
    
    // Set fixed fallback context date to avoid SSR drift (matching the mock data date 2026-08-05)
    const now = new Date('2026-08-05T12:00:00Z');
    const diffMs = now.getTime() - createdDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      return `${Math.max(1, diffHours)} hr${diffHours > 1 ? 's' : ''} ago`;
    }
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // 1. Calculate KPI Metrics
  const onlineCount = agents.filter(a => a.Online === true || a.online === true || String(a.Online).toLowerCase() === 'true').length;
  const offlineCount = agents.length - onlineCount;
  
  const criticalAlertsCount = alerts.filter(a => (a.Severity || a.severity || '').toLowerCase() === 'critical').length;

  // 2. Process Customers and sort them by Device Count descending
  const sortedCustomers = customers.map((c, idx) => {
    const id = c.CustomerID || c.id || idx + 1;
    const name = c.CustomerName || c.name || 'N/A';
    
    // Count devices
    const custAgents = agents.filter(a => a.CustomerID === id || a.customerId === id);
    const totalCustDevices = custAgents.length;

    // Count Alerts for this customer
    const custAlerts = alerts.filter(a => a.CustomerID === id || a.customerId === id).length;

    // Count Tickets for this customer
    const custTickets = tickets.filter(t => t.CustomerID === id || t.customerId === id).length;

    // Count online devices for this customer to calculate availability
    const onlineCustCount = custAgents.filter(a => a.Online === true || a.online === true || String(a.Online).toLowerCase() === 'true').length;
    const custAvailability = totalCustDevices > 0 ? Math.round((onlineCustCount / totalCustDevices) * 100) : 100;

    // Determine Risk level dynamically based on alerts/tickets count
    let riskLevel = 'LOW';
    if (custAlerts >= 2 || custTickets >= 3) riskLevel = 'HIGH';
    else if (custAlerts >= 1 || custTickets >= 1) riskLevel = 'MEDIUM';

    return {
      id,
      name,
      totalCustDevices,
      custAlerts,
      custTickets,
      custAvailability,
      riskLevel
    };
  }).sort((a, b) => b.totalCustDevices - a.totalCustDevices);

  const topCustomers = sortedCustomers.slice(0, 8); // TOP 8 for grid layout

  // 3. Filter Active Tickets (Open/New/Pending) and cap at TOP 8
  const activeTickets = tickets.filter(t => {
    const status = (t.TicketStatus || t.status || '').toLowerCase();
    return status === 'open' || status === 'new' || status === 'pending';
  }).slice(0, 8);

  // Health Score Category
  const getHealthCategory = (score: number) => {
    if (score >= 95) return 'Excellent';
    if (score >= 90) return 'Good';
    if (score >= 75) return 'Warning';
    return 'Need Attention';
  };

  const healthCategory = getHealthCategory(onlineRatio);

  // Overall Risk calculation
  const getOverallRisk = (criticalCount: number) => {
    if (criticalCount >= 5) return 'CRITICAL';
    if (criticalCount >= 2) return 'HIGH';
    if (criticalCount >= 1) return 'MEDIUM';
    return 'LOW';
  };

  const overallRisk = getOverallRisk(criticalAlertsCount);

  // Render Risk Progress Slider line
  const renderRiskLine = (risk: string) => {
    const levels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const activeIdx = levels.indexOf(risk);
    
    return (
      <div className="flex items-center gap-1.5 text-[8.5px] font-black font-mono select-none">
        <span className={activeIdx === 0 ? 'text-emerald-600 font-extrabold' : 'text-slate-300'}>LOW</span>
        <span className="text-slate-300">──</span>
        <span className={activeIdx === 1 ? 'text-blue-600 font-extrabold' : 'text-slate-300'}>MED</span>
        <span className="text-slate-300">──</span>
        <span className={activeIdx === 2 ? 'text-amber-600 font-extrabold' : 'text-slate-300'}>HIGH</span>
        <span className="text-slate-300">──</span>
        <span className={activeIdx === 3 ? 'text-rose-600 font-black' : 'text-slate-300'}>CRITICAL</span>
      </div>
    );
  };

  return (
    <div 
      className="a4-page flex flex-col justify-between"
      style={{
        backgroundImage: 'url("/bgdesign.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '12mm 12mm'
      }}
    >
      {/* Report Header */}
      <ReportHeader 
        title="Executive Summary" 
        subtitle="Monthly Executive Report | Reporting Period: 06 Jul 2026 - 05 Aug 2026" 
      />

      <div className="page-content space-y-4 flex-1 flex flex-col justify-between overflow-hidden mt-2">
        
        {/* SECTION 1: 5 KPI CARDS GRID */}
        <div className="grid grid-cols-5 gap-3 select-none">
          {/* Customers */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[82px]">
            <div className="flex items-start justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block pr-4 truncate">
                Customers
              </span>
              <span className="text-[7px] font-bold text-slate-400 flex-shrink-0">
                ▲ +0%
              </span>
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-800 leading-none">{totalCustomers}</h4>
              <p className="text-[7px] text-slate-400 font-bold mt-1 uppercase">Active Clients</p>
            </div>
          </div>

          {/* Agent Connectivity */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[82px]">
            <div className="flex items-start justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block pr-4 truncate">
                Agent Connectivity
              </span>
              <span className="text-[7px] font-bold text-blue-600 flex-shrink-0">
                ▲ +1.2%
              </span>
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-800 leading-none">{onlineRatio}%</h4>
              <p className="text-[7px] text-slate-400 font-bold mt-1 uppercase">On: {onlineCount} / Off: {offlineCount}</p>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[82px]">
            <div className="flex items-start justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block pr-4 truncate">
                Critical Alerts
              </span>
              <span className="text-[7px] font-bold text-emerald-600 flex-shrink-0">
                ▼ -15%
              </span>
            </div>
            <div>
              <h4 className="text-xl font-black text-rose-600 leading-none">{criticalAlertsCount}</h4>
              <p className="text-[7px] text-rose-400 font-bold mt-1 uppercase">Active Cases</p>
            </div>
          </div>

          {/* Open Tickets */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[82px]">
            <div className="flex items-start justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block pr-4 truncate">
                Open Tickets
              </span>
              <span className="text-[7px] font-bold text-rose-600 flex-shrink-0">
                ▲ +8%
              </span>
            </div>
            <div>
              <h4 className="text-xl font-black text-blue-600 leading-none">{openTickets}</h4>
              <p className="text-[7px] text-blue-400 font-bold mt-1 uppercase">Pending Tickets</p>
            </div>
          </div>

          {/* Service Contracts */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[82px]">
            <div className="flex items-start justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block pr-4 truncate">
                Service Contracts
              </span>
              <span className="text-[7px] font-bold text-indigo-600 flex-shrink-0">
                ▲ +0%
              </span>
            </div>
            <div>
              <h4 className="text-xl font-black text-indigo-600 leading-none">{contracts.length}</h4>
              <p className="text-[7px] text-indigo-500 font-bold mt-1 uppercase">Active SLA Contracts</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: HEALTH SCORE & RISK METER (100% Symmetric Layout & Font Sizes) */}
        <div className="grid grid-cols-2 gap-4 select-none">
          {/* Overall Health Score Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between shadow-xs h-[92px]">
            <div className="flex items-baseline justify-between">
              <h3 className="text-xl font-black text-slate-800 leading-none">{onlineRatio}%</h3>
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[8.5px] font-black border ${
                onlineRatio >= 95 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                  : onlineRatio >= 90
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : onlineRatio >= 75
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {healthCategory}
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${
                onlineRatio >= 90 ? 'bg-emerald-500' : onlineRatio >= 75 ? 'bg-amber-500' : 'bg-rose-500'
              }`} style={{ width: `${onlineRatio}%` }}></div>
            </div>
            <span className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
              Overall Infrastructure Health
            </span>
          </div>

          {/* Overall Risk Status Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between shadow-xs h-[92px]">
            <div className="flex items-baseline justify-between">
              <h3 className={`text-xl font-black leading-none ${
                overallRisk === 'CRITICAL' ? 'text-rose-600' : 'text-slate-800'
              }`}>{overallRisk}</h3>
              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[8.5px] font-black border bg-slate-50 text-slate-600 border-slate-200">
                Risk Status
              </span>
            </div>
            <div>
              {renderRiskLine(overallRisk)}
            </div>
            <span className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
              Overall Risk Status
            </span>
          </div>
        </div>

        {/* SECTION 3: TOP CLIENTS AND ACTIVE TICKETS (Compact Spacing & Dynamic Columns) */}
        <div className="flex justify-between gap-4 flex-1">
          
          {/* Top Customers (Left Column) */}
          <div className="w-[49%] flex flex-col h-full">
            <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 select-none mb-1.5">
              <Users className="h-3.5 w-3.5 text-blue-500" /> 1. สรุปปริมาณอุปกรณ์แยกรายลูกค้า (Top Clients Inventory)
            </h3>
            <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
              <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
                <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[7.5px]">
                  <tr>
                    <th className="px-2.5 py-1.5 w-[35%]">Customer</th>
                    <th className="px-2.5 py-1.5 text-center w-[15%]">Devices</th>
                    <th className="px-2.5 py-1.5 text-center w-[15%]">Alerts</th>
                    <th className="px-2.5 py-1.5 text-center w-[15%]">Tickets</th>
                    <th className="px-2.5 py-1.5 text-center w-[10%]">Risk</th>
                    <th className="px-2.5 py-1.5 text-right w-[10%]">Avail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                  {topCustomers.map((c, idx) => {
                    let riskColor = 'text-emerald-600';
                    if (c.riskLevel === 'HIGH') riskColor = 'text-amber-500 font-bold';
                    else if (c.riskLevel === 'MEDIUM') riskColor = 'text-blue-500';

                    return (
                      <tr key={c.id} className="hover:bg-slate-50/20 transition-colors">
                        <td className="px-2.5 py-2 font-bold text-slate-800 truncate max-w-[85px]">{c.name}</td>
                        <td className="px-2.5 py-2 text-center text-slate-900 font-extrabold">{c.totalCustDevices}</td>
                        <td className="px-2.5 py-2 text-center text-slate-400 font-medium">{c.custAlerts}</td>
                        <td className="px-2.5 py-2 text-center text-slate-400 font-medium">{c.custTickets}</td>
                        <td className={`px-2.5 py-2 text-center ${riskColor}`}>{c.riskLevel}</td>
                        <td className="px-2.5 py-2 text-right text-slate-800 font-bold">{c.custAvailability}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Active Tickets Table (Right Column) */}
          <div className="w-[49%] flex flex-col h-full">
            <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 select-none mb-1.5">
              <Ticket className="h-3.5 w-3.5 text-blue-500" /> 2. รายการตั๋วปัญหาแจ้งซ่อม RMM ล่าสุด (Top Active Tickets)
            </h3>
            <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
              <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
                <thead className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider text-[7.5px]">
                  <tr>
                    <th className="px-2.5 py-1.5 w-[30%]">Ticket</th>
                    <th className="px-2.5 py-1.5 w-[25%]">Customer</th>
                    <th className="px-2.5 py-1.5 text-center w-[15%]">Priority</th>
                    <th className="px-2.5 py-1.5 text-center w-[15%]">Status</th>
                    <th className="px-2.5 py-1.5 text-right w-[15%]">Age</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                  {activeTickets.map((ticket, idx) => {
                    const title = ticket.TicketTitle || ticket.title || 'No Title';
                    const customer = ticket.CustomerName || 'N/A';
                    const priority = ticket.TicketPriority || ticket.priority || 'Low';
                    const status = ticket.TicketStatus || ticket.status || 'Open';
                    const age = getTicketAge(ticket.CreatedDate || ticket.createdDate);

                    let priorityColor = 'text-slate-400';
                    if (priority === 'Critical') priorityColor = 'text-rose-600 font-extrabold';
                    else if (priority === 'High') priorityColor = 'text-orange-500';
                    else if (priority === 'Medium') priorityColor = 'text-blue-500';

                    return (
                      <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                        <td className="px-2.5 py-2 font-bold text-slate-800 truncate max-w-[100px]" title={title}>{title}</td>
                        <td className="px-2.5 py-2 text-slate-500 truncate max-w-[80px]" title={customer}>{customer}</td>
                        <td className={`px-2.5 py-2 text-center font-bold ${priorityColor}`}>{priority}</td>
                        <td className="px-2.5 py-2 text-center text-slate-400 font-medium">{status}</td>
                        <td className="px-2.5 py-2 text-right text-slate-500 font-mono text-[9px] whitespace-nowrap">{age}</td>
                      </tr>
                    );
                  })}
                  {activeTickets.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-2.5 py-4 text-center text-slate-400 font-medium">
                        ไม่มีตั๋วงานค้างซ่อมในระบบ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>



      </div>

      {/* Page Footer (Dynamic, professional layout) */}
      <div className="page-footer text-[9px] text-slate-400 font-semibold border-t border-slate-100/60 pt-3 mt-3 select-none flex justify-between">
        <span>Generated from Atera API v3 | Powered by Power BI Report Builder | Confidential</span>
        <span>หน้า {pageNumber} จาก 8</span>
      </div>
    </div>
  );
}
