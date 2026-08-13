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
import { translations } from '@/lib/translations';

interface TicketsPageProps {
  pageNumber: number;
  tickets: any[];
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  criticalTickets: number;
  totalPages?: number;
  dateRangeDisplay?: string;
  lang?: string;
  companyName?: string;
  agents?: any[];
}

export default function TicketsPage({
  pageNumber,
  tickets,
  totalTickets,
  openTickets,
  resolvedTickets,
  criticalTickets,
  totalPages = 9,
  dateRangeDisplay,
  lang = 'th',
  companyName = 'Atera Client',
  agents = []
}: TicketsPageProps) {
  const t = translations[lang as 'th' | 'en'] || translations.th;

  const getTicketDeviceName = (ticket: any) => {
    const directDev = ticket.DeviceName || ticket.deviceName || ticket.Device || ticket.device;
    if (directDev) return directDev;

    const title = String(ticket.TicketTitle || ticket.title || '').toLowerCase();
    const comment = String(ticket.FirstComment || ticket.description || '').toLowerCase();
    
    for (const agent of agents) {
      const mName = String(agent.MachineName || agent.AgentName || '').toLowerCase();
      if (!mName) continue;
      if (title.includes(mName) || comment.includes(mName)) {
        return agent.MachineName || agent.AgentName;
      }
    }
    return 'N/A';
  };

  const highPriorityTickets = tickets.filter(t => (t.TicketPriority || t.priority || '').toLowerCase() === 'high').length;
  const mediumPriorityTickets = tickets.filter(t => (t.TicketPriority || t.priority || '').toLowerCase() === 'medium').length;
  const lowPriorityTickets = tickets.filter(t => (t.TicketPriority || t.priority || '').toLowerCase() === 'low').length;

  // KPIs
  const slaCompliancePercent = totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 100;
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
        title={t.ticketsTitle} 
        subtitle={`${t.ticketsSubtitle} | Client: ${companyName} | Period: ${dateRangeDisplay || 'N/A'}`} 
        lang={lang}
        dateRangeDisplay={dateRangeDisplay}
      />

      <div className="page-content space-y-4 flex-1 flex flex-col justify-between overflow-hidden mt-3">
        
        {/* SECTION 1: TICKET SUMMARY KPI CARDS */}
        <div className="grid grid-cols-4 gap-3 select-none">
          {/* Total Tickets */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {t.totalTickets}
              </span>
              <Ticket className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800 leading-none">
                {lang === 'th' ? `${totalTickets} ตั๋ว` : `${totalTickets} Tickets`}
              </h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? 'กรณีที่บันทึกทั้งหมด' : 'Total Logged Cases'}
              </p>
            </div>
          </div>

          {/* Open Tickets */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {t.openTickets}
              </span>
              <AlertTriangle className="h-3.5 w-3.5 text-slate-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800 leading-none">
                {lang === 'th' ? `${openTickets} ตั๋ว` : `${openTickets} Tickets`}
              </h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? 'กำลังรอการแก้ไข' : 'Pending Resolution'}
              </p>
            </div>
          </div>

          {/* Resolved Tickets */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'แก้ไขแล้ว' : 'Resolved'}
              </span>
              <CheckCircle className="h-3.5 w-3.5 text-slate-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800 leading-none">
                {lang === 'th' ? `${resolvedTickets} ตั๋ว` : `${resolvedTickets} Tickets`}
              </h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? 'ปิดและเสร็จสิ้น' : 'Closed & Completed'}
              </p>
            </div>
          </div>

          {/* SLA Compliance */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {t.slaCompliance}
              </span>
              <Award className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-emerald-600 leading-none">{slaCompliancePercent}%</h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? 'บรรลุเป้าหมาย > 90%' : 'Target > 90% Met'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: CHARTS SIDE-BY-SIDE */}
        <div className="grid grid-cols-2 gap-4 h-[190px] select-none">
          
          {/* Ticket Status Share */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Activity className="h-4 w-4 text-blue-500" /> {lang === 'th' ? '1. อัตราส่วนสถิติตั๋วเปิดดำเนินการ (Ticket Status Share)' : '1. TICKET STATUS SHARE'}
            </h4>
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {/* Open Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8.5px] font-bold text-slate-600 leading-none">
                  <span>{lang === 'th' ? 'ตั๋วเปิดใหม่และรอดำเนินการ' : 'Open & New Tickets'}</span>
                  <span>
                    {lang === 'th' ? `${openTickets} ตั๋ว (${openPercent}%)` : `${openTickets} Tickets (${openPercent}%)`}
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${openPercent}%` }}></div>
                </div>
              </div>
              {/* Resolved Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8.5px] font-bold text-slate-600 leading-none">
                  <span>{lang === 'th' ? 'ตั๋วที่แก้ไขและปิดแล้ว' : 'Resolved & Closed Tickets'}</span>
                  <span>
                    {lang === 'th' ? `${resolvedTickets} ตั๋ว (${resolvedPercent}%)` : `${resolvedTickets} Tickets (${resolvedPercent}%)`}
                  </span>
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
              <Layers className="h-4 w-4 text-blue-500" /> {lang === 'th' ? '2. ลำดับความสำคัญของตั๋วในระบบ (Ticket Priority Distribution)' : '2. TICKET PRIORITY DISTRIBUTION'}
            </h4>
            <div className="space-y-2 flex-1 flex flex-col justify-center">
              {/* Critical Priority */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold text-slate-600 leading-none">
                  <span>{lang === 'th' ? 'ระดับวิกฤต' : 'Critical Priority'}</span>
                  <span>{criticalTickets} ({critPercent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${critPercent}%` }}></div>
                </div>
              </div>
              {/* High Priority */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold text-slate-600 leading-none">
                  <span>{lang === 'th' ? 'ระดับสูง' : 'High Priority'}</span>
                  <span>{highPriorityTickets} ({highPercent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full" style={{ width: `${highPercent}%` }}></div>
                </div>
              </div>
              {/* Medium Priority */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold text-slate-600 leading-none">
                  <span>{lang === 'th' ? 'ระดับปานกลางและต่ำ' : 'Medium & Low Priority'}</span>
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
            <Server className="h-3.5 w-3.5 text-blue-500" /> {lang === 'th' ? '3. ตารางบันทึกตั๋วงานช่วยเหลือทางเทคนิค (Helpdesk Tickets Log)' : '3. HELPDESK TICKETS LOG'}
          </h3>
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
              <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px]">
                <tr>
                  <th className="px-4 py-2 w-[12%]">TICKET ID</th>
                  <th className="px-4 py-2 w-[28%]">{t.ticketTitle}</th>
                  <th className="px-4 py-2 w-[20%]">{lang === 'th' ? 'อุปกรณ์' : 'DEVICE'}</th>
                  <th className="px-4 py-2 w-[15%]">{lang === 'th' ? 'ลูกค้า' : 'CUSTOMER'}</th>
                  <th className="px-4 py-2 text-center w-[12%]">{lang === 'th' ? 'ความสำคัญ' : 'PRIORITY'}</th>
                  <th className="px-4 py-2 text-right w-[13%]">{lang === 'th' ? 'สถานะ' : 'STATUS'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
                {tickets.slice(0, 7).map((ticket, idx) => {
                  const id = ticket.TicketID || ticket.id || idx + 1;
                  const title = ticket.TicketTitle || ticket.title || 'No Subject';
                  const customer = ticket.CustomerName || 'N/A';
                  const priority = ticket.TicketPriority || ticket.priority || 'Low';
                  const status = ticket.TicketStatus || ticket.status || 'Open';
                  const deviceName = getTicketDeviceName(ticket);

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
                      <td className="px-4 py-2 font-bold text-slate-800 truncate max-w-[150px]" title={title}>{title}</td>
                      <td className="px-4 py-2 text-slate-650 font-bold truncate max-w-[120px]">{deviceName}</td>
                      <td className="px-4 py-2 text-slate-500 font-medium truncate max-w-[90px]">{customer}</td>
                      <td className={`px-4 py-2 text-center font-bold ${priorityColor}`}>
                        {priority === 'Critical' ? (lang === 'th' ? 'วิกฤต' : 'Critical') : 
                         priority === 'High' ? (lang === 'th' ? 'สูง' : 'High') : 
                         priority === 'Medium' ? (lang === 'th' ? 'ปานกลาง' : 'Medium') : 
                         (lang === 'th' ? 'ต่ำ' : 'Low')}
                      </td>
                      <td className="px-4 py-2 text-right">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[8.5px] font-extrabold border ${statusBadge}`}>
                          {status.toLowerCase() === 'open' || status.toLowerCase() === 'pending' ? (lang === 'th' ? 'รอดำเนินการ' : 'Pending') : 
                           status.toLowerCase() === 'closed' ? (lang === 'th' ? 'ปิด' : 'Closed') : 
                           status.toLowerCase() === 'resolved' ? (lang === 'th' ? 'แก้ไขแล้ว' : 'Resolved') : 
                           status}
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
        <span>
          {lang === 'th' ? `หน้า ${pageNumber} จาก ${totalPages}` : `Page ${pageNumber} of ${totalPages}`}
        </span>
      </div>
    </div>
  );
}
