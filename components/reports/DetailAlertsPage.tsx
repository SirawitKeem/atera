'use client';

import React from 'react';
import { AlertOctagon } from 'lucide-react';
import ReportHeader from './ReportHeader';

interface DetailAlertsPageProps {
  pageNumber: number;
  alerts: any[];
}

export default function DetailAlertsPage({
  pageNumber,
  alerts
}: DetailAlertsPageProps) {

  // Severity style helper
  const getSeverityBadge = (severity: string) => {
    let cls = 'bg-slate-50 text-slate-700 border-slate-200';
    if (severity.toLowerCase() === 'critical') {
      cls = 'bg-rose-50 text-rose-800 border-rose-200/50 font-extrabold';
    } else if (severity.toLowerCase() === 'warning') {
      cls = 'bg-amber-50 text-amber-700 border-amber-200/50';
    }
    return (
      <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8px] font-extrabold border uppercase ${cls}`}>
        {severity}
      </span>
    );
  };

  // Date Formatting helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit'
      }) + ' น.';
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
        title="Detailed Alerts Log" 
        subtitle="Full Security Alerts History & Network Events Registry | Reporting Period: 06 Jul 2026 - 05 Aug 2026" 
      />

      <div className="page-content space-y-3 flex-1 flex flex-col justify-between overflow-hidden mt-3">
        
        {/* SECTION 1: DETAILED TABLE */}
        <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
          <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
            <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px]">
              <tr>
                <th className="px-4 py-2.5 w-[15%]">SEVERITY</th>
                <th className="px-4 py-2.5 w-[25%]">DEVICE NAME</th>
                <th className="px-4 py-2.5 w-[20%]">CUSTOMER</th>
                <th className="px-4 py-2.5 w-[30%]">ALERT MESSAGE / EVENT</th>
                <th className="px-4 py-2.5 text-right w-[10%]">TIME DETECTED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
              {alerts.map((alert, idx) => {
                const id = alert.AlertID || alert.id || idx + 1;
                const device = alert.DeviceName || alert.deviceName || 'N/A';
                const customer = alert.CustomerName || 'N/A';
                const severity = alert.Severity || alert.severity || 'Warning';
                const message = alert.Message || alert.message || 'No message';
                const time = alert.CreatedDate || alert.created || new Date().toISOString();

                return (
                  <tr key={id} className="hover:bg-slate-50/20 transition-colors">
                    <td className="px-4 py-2.5">
                      {getSeverityBadge(severity)}
                    </td>
                    <td className="px-4 py-2.5 font-bold text-slate-800">{device}</td>
                    <td className="px-4 py-2.5 text-slate-500 font-medium">{customer}</td>
                    <td className="px-4 py-2.5 text-slate-600 truncate max-w-[200px]" title={message}>{message}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-400 text-[9px] whitespace-nowrap">{formatDate(time)}</td>
                  </tr>
                );
              })}
              {alerts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-medium">
                    ไม่พบแจ้งเตือนระบบใด ๆ ในบัญชี
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Page Footer */}
      <div className="page-footer text-[9px] text-slate-400 font-semibold border-t border-slate-100/60 pt-3 mt-3 select-none flex justify-between">
        <span>Generated from Atera API v3 | Powered by Power BI Report Builder | Confidential</span>
        <span>หน้า {pageNumber} จาก 16</span>
      </div>
    </div>
  );
}
