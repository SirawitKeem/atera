'use client';

import React from 'react';
import { Ticket } from 'lucide-react';
import ReportHeader from './ReportHeader';

interface DetailTicketsPageProps {
  pageNumber: number;
  tickets: any[];
}

export default function DetailTicketsPage({
  pageNumber,
  tickets
}: DetailTicketsPageProps) {

  // Date Formatting helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
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
        title="Detailed Tickets Log" 
        subtitle="Comprehensive Support Tickets Registry & SLA Audits | Reporting Period: 06 Jul 2026 - 05 Aug 2026" 
      />

      <div className="page-content space-y-3 flex-1 flex flex-col justify-between overflow-hidden mt-3">
        
        {/* SECTION 1: DETAILED TABLE */}
        <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
          <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
            <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px]">
              <tr>
                <th className="px-4 py-2.5 w-[15%]">TICKET ID</th>
                <th className="px-4 py-2.5 w-[40%]">TICKET SUBJECT / TITLE</th>
                <th className="px-4 py-2.5 w-[20%]">CUSTOMER</th>
                <th className="px-4 py-2.5 text-center w-[13%]">PRIORITY</th>
                <th className="px-4 py-2.5 text-center w-[12%]">STATUS</th>
                <th className="px-4 py-2.5 text-right w-[10%]">CREATED DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
              {tickets.map((t, idx) => {
                const id = t.TicketID || t.id || idx + 1;
                const title = t.TicketTitle || t.title || 'No Subject';
                const customer = t.CustomerName || 'N/A';
                const priority = t.TicketPriority || t.priority || 'Low';
                const status = t.TicketStatus || t.status || 'Open';
                const created = t.CreatedDate || t.createdDate || new Date().toISOString();

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
                    <td className="px-4 py-2.5 font-mono text-slate-400">#{id}</td>
                    <td className="px-4 py-2.5 font-bold text-slate-800 truncate max-w-[200px]" title={title}>{title}</td>
                    <td className="px-4 py-2.5 text-slate-500 font-medium">{customer}</td>
                    <td className={`px-4 py-2.5 text-center font-bold ${priorityColor}`}>{priority}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[8px] font-extrabold border ${statusBadge}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-400 text-[9px] whitespace-nowrap">{formatDate(created)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* Page Footer */}
      <div className="page-footer text-[9px] text-slate-400 font-semibold border-t border-slate-100/60 pt-3 mt-3 select-none flex justify-between">
        <span>Generated from Atera API v3 | Powered by Power BI Report Builder | Confidential</span>
        <span>หน้า {pageNumber} จาก 8</span>
      </div>
    </div>
  );
}
