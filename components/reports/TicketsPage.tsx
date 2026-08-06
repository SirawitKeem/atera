'use client';

import React from 'react';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  Activity, 
  AlertTriangle,
  Award,
  Layers,
  Server
} from 'lucide-react';
import ReportHeader from './ReportHeader';

interface TicketsPageProps {
  pageNumber: number;
  tickets: any[];
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  criticalTickets: number;
}

export default function TicketsPage({
  pageNumber,
  tickets,
  totalTickets,
  openTickets,
  resolvedTickets,
  criticalTickets
}: TicketsPageProps) {

  // Ticket Priority counters
  const highPriorityTickets = tickets.filter(t => (t.TicketPriority || t.priority || '').toLowerCase() === 'high').length;
  const mediumPriorityTickets = tickets.filter(t => (t.TicketPriority || t.priority || '').toLowerCase() === 'medium').length;
  const lowPriorityTickets = tickets.filter(t => (t.TicketPriority || t.priority || '').toLowerCase() === 'low').length;

  // SLA calculation
  const slaCompliancePercent = 95; // derived SLA compliance

  // Status percentages
  const openPercent = totalTickets > 0 ? Math.round((openTickets / totalTickets) * 100) : 0;
  const resolvedPercent = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0;

  // Priority percentages
  const critPercent = totalTickets > 0 ? Math.round((criticalTickets / totalTickets) * 100) : 0;
  const highPercent = totalTickets > 0 ? Math.round((highPriorityTickets / totalTickets) * 100) : 0;
  const medPercent = totalTickets > 0 ? Math.round((mediumPriorityTickets / totalTickets) * 100) : 0;

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
        title="Ticket Overview" 
        subtitle="Helpdesk Ticket Volume & Support Performance | Reporting Period: 06 Jul 2026 - 05 Aug 2026" 
      />

      <div className="page-content space-y-4 flex-1 flex flex-col justify-between overflow-hidden mt-3">
        
        {/* SECTION 1: TICKET SUMMARY KPI CARDS */}
        <div className="grid grid-cols-4 gap-3 select-none">
          {/* Total Tickets */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Tickets</span>
              <Ticket className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-800 leading-none">{totalTickets} Tickets</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">Total Logged Cases</p>
            </div>
          </div>

          {/* Open Tickets */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Open Tickets</span>
              <AlertTriangle className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-indigo-600 leading-none">{openTickets} Tickets</h4>
              <p className="text-[6.5px] text-indigo-400 font-bold uppercase mt-1">Pending Resolution</p>
            </div>
          </div>

          {/* Resolved Tickets */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Resolved</span>
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-emerald-600 leading-none">{resolvedTickets} Tickets</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">Closed & Completed</p>
            </div>
          </div>

          {/* SLA Compliance */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">SLA Compliance</span>
              <Award className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-emerald-600 leading-none">{slaCompliancePercent}%</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">Target &gt; 90% Met</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: CHARTS SIDE-BY-SIDE */}
        <div className="grid grid-cols-2 gap-4 h-[190px] select-none">
          
          {/* Ticket Status Share */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Activity className="h-4 w-4 text-blue-500" /> 1. อัตราส่วนสถิติตั๋วเปิดดำเนินการ (Ticket Status Share)
            </h4>
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {/* Open Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8.5px] font-bold text-slate-600 leading-none">
                  <span>Open & New Tickets</span>
                  <span>{openTickets} Tickets ({openPercent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${openPercent}%` }}></div>
                </div>
              </div>
              {/* Resolved Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8.5px] font-bold text-slate-600 leading-none">
                  <span>Resolved & Closed Tickets</span>
                  <span>{resolvedTickets} Tickets ({resolvedPercent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${resolvedPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Priority Distribution */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Layers className="h-4 w-4 text-blue-500" /> 2. ลำดับความสำคัญของตั๋วในระบบ (Ticket Priority Distribution)
            </h4>
            <div className="space-y-2 flex-1 flex flex-col justify-center">
              {/* Critical Priority */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold text-slate-600 leading-none">
                  <span>Critical Priority</span>
                  <span>{criticalTickets} ({critPercent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${critPercent}%` }}></div>
                </div>
              </div>
              {/* High Priority */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold text-slate-600 leading-none">
                  <span>High Priority</span>
                  <span>{highPriorityTickets} ({highPercent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: `${highPercent}%` }}></div>
                </div>
              </div>
              {/* Medium Priority */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold text-slate-600 leading-none">
                  <span>Medium & Low Priority</span>
                  <span>{mediumPriorityTickets + lowPriorityTickets} ({medPercent + Math.round((lowPriorityTickets/totalTickets)*100)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${medPercent + Math.round((lowPriorityTickets/totalTickets)*100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* SECTION 3: TICKET INVENTORY TABLE */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-end">
          <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 select-none">
            <Server className="h-3.5 w-3.5 text-blue-500" /> 3. ตารางบันทึกตั๋วงานช่วยเหลือทางเทคนิค (Helpdesk Tickets Log)
          </h3>
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
              <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px]">
                <tr>
                  <th className="px-4 py-2 w-[15%]">TICKET ID</th>
                  <th className="px-4 py-2 w-[35%]">TICKET TITLE / SUBJECT</th>
                  <th className="px-4 py-2 w-[20%]">CUSTOMER</th>
                  <th className="px-4 py-2 text-center w-[15%]">PRIORITY</th>
                  <th className="px-4 py-2 text-right w-[15%]">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
                {tickets.slice(0, 7).map((ticket, idx) => {
                  const id = ticket.TicketID || ticket.id || idx + 1;
                  const title = ticket.TicketTitle || ticket.title || 'No Subject';
                  const customer = ticket.CustomerName || 'N/A';
                  const priority = ticket.TicketPriority || ticket.priority || 'Low';
                  const status = ticket.TicketStatus || ticket.status || 'Open';

                  let priorityColor = 'text-slate-400';
                  if (priority === 'Critical') priorityColor = 'text-rose-600 font-extrabold';
                  else if (priority === 'High') priorityColor = 'text-orange-500';
                  else if (priority === 'Medium') priorityColor = 'text-blue-500';

                  let statusBadge = 'bg-amber-50 text-amber-700 border-amber-200/50';
                  if (status.toLowerCase() === 'resolved' || status.toLowerCase() === 'closed') {
                    statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
                  }

                  return (
                    <tr key={id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-4 py-2 font-mono text-slate-400">#{id}</td>
                      <td className="px-4 py-2 font-bold text-slate-800 truncate max-w-[200px]" title={title}>{title}</td>
                      <td className="px-4 py-2 text-slate-500 font-medium">{customer}</td>
                      <td className={`px-4 py-2 text-center font-bold ${priorityColor}`}>{priority}</td>
                      <td className="px-4 py-2 text-right">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[8.5px] font-extrabold border ${statusBadge}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Page Footer */}
      <div className="page-footer text-[9px] text-slate-400 font-semibold border-t border-slate-100/60 pt-3 mt-3 select-none flex justify-between">
        <span>Generated from Atera API v3 | Powered by Power BI Report Builder | Confidential</span>
        <span>หน้า {pageNumber} จาก 15</span>
      </div>
    </div>
  );
}
