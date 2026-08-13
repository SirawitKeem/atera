'use client';

import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  ShieldAlert, 
  Bell, 
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import ReportHeader from './ReportHeader';

interface AlertsPageProps {
  pageNumber: number;
  alerts: any[];
  criticalAlerts: number;
  warningAlerts: number;
  totalPages?: number;
  dateRangeDisplay?: string;
}

export default function AlertsPage({
  pageNumber,
  alerts,
  criticalAlerts,
  warningAlerts,
  totalPages = 9,
  dateRangeDisplay
}: AlertsPageProps) {
  // OS Icon / Severity helper
  const getSeverityBadge = (severity: string) => {
    let cls = 'bg-slate-50 text-slate-700 border-slate-200';
    if (severity.toLowerCase() === 'critical') {
      cls = 'bg-rose-50 text-rose-800 border-rose-200/50 font-extrabold';
    } else if (severity.toLowerCase() === 'warning') {
      cls = 'bg-amber-50 text-amber-700 border-amber-200/50';
    }
    return (
      <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8.5px] font-extrabold border uppercase ${cls}`}>
        {severity}
      </span>
    );
  };

  const totalAlerts = alerts.length;

  // Severity Distribution Percentages
  const critPercent = totalAlerts > 0 ? Math.round((criticalAlerts / totalAlerts) * 100) : 0;
  const warnPercent = totalAlerts > 0 ? Math.round((warningAlerts / totalAlerts) * 100) : 0;

  // Process alert messages for categorization (CPU, Disk, Memory, Security)
  let cpuCount = 0;
  let diskCount = 0;
  let securityCount = 0;
  let otherCount = 0;

  alerts.forEach(a => {
    const msg = (a.Message || a.message || '').toLowerCase();
    if (msg.includes('cpu') || msg.includes('processor')) cpuCount++;
    else if (msg.includes('disk') || msg.includes('space') || msg.includes('storage')) diskCount++;
    else if (msg.includes('login') || msg.includes('auth') || msg.includes('security') || msg.includes('ssh')) securityCount++;
    else otherCount++;
  });

  const categories = [
    { name: 'Processor & CPU Load', count: cpuCount, color: 'bg-blue-500' },
    { name: 'Storage Disk Space', count: diskCount, color: 'bg-amber-500' },
    { name: 'Security & Auth Log', count: securityCount, color: 'bg-rose-500 animate-pulse' },
    { name: 'Other System Errors', count: otherCount, color: 'bg-slate-400' }
  ].sort((a, b) => b.count - a.count);

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
        title="Alert Overview & Severity" 
        subtitle={`System Alert Analytics & Severity Categorization | Reporting Period: ${dateRangeDisplay || 'N/A'}`} 
        dateRangeDisplay={dateRangeDisplay}
      />

      <div className="page-content space-y-4 flex-1 flex flex-col justify-between overflow-hidden mt-3">
        
        {/* SECTION 1: SYSTEM ALERT KPI CARDS */}
        <div className="grid grid-cols-4 gap-3 select-none">
          {/* Total Active Alerts */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Alerts Volume</span>
              <Bell className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-800 leading-none">{totalAlerts}</h4>
              <p className="text-[7px] text-slate-400 font-bold mt-1 uppercase">Active Notifications</p>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Critical Alerts</span>
              <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />
            </div>
            <div>
              <h4 className="text-xl font-black text-rose-600 leading-none">{criticalAlerts}</h4>
              <p className="text-[7px] text-slate-400 font-bold mt-1 uppercase">{critPercent}% of Total Volume</p>
            </div>
          </div>

          {/* Warning Alerts */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Warning Alerts</span>
              <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-xl font-black text-amber-600 leading-none">{warningAlerts}</h4>
              <p className="text-[7px] text-slate-400 font-bold mt-1 uppercase">{warnPercent}% of Total Volume</p>
            </div>
          </div>

          {/* Network Health Standard */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">System Status</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-sm font-black text-emerald-600 leading-none">{criticalAlerts > 0 ? 'ATTENTION REQ.' : 'STABLE'}</h4>
              <p className="text-[7px] text-slate-400 font-bold mt-1 uppercase">Automated Monitoring</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: ALERT CATEGORIES BREAKDOWN */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[125px]">
          <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2 select-none">
            <Activity className="h-3.5 w-3.5 text-blue-500" /> สถิติตามหมวดหมู่อุปกรณ์ (Alert Impact Categories)
          </h4>
          <div className="grid grid-cols-4 gap-3 flex-1 items-center">
            {categories.map((cat, idx) => {
              const pct = totalAlerts > 0 ? Math.round((cat.count / totalAlerts) * 100) : 0;
              return (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-2.5 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] font-extrabold text-slate-500 truncate max-w-[90px]">{cat.name}</span>
                    <span className="text-[8px] font-black text-slate-700">{cat.count}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden my-1">
                    <div className={`${cat.color} h-full rounded-full`} style={{ width: `${pct}%` }}></div>
                  </div>
                  <span className="text-[7px] text-slate-400 font-bold text-right">{pct}% total</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: RECENT ALERTS DETAIL TABLE */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-end">
          <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 select-none">
            <FileCheck className="h-3.5 w-3.5 text-blue-500" /> บันทึกรายการแจ้งเตือนล่าสุดในระบบ (Real-Time Security & System Events)
          </h3>
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
              <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px]">
                <tr>
                  <th className="px-4 py-2 w-[18%]">DEVICE NAME</th>
                  <th className="px-4 py-2 w-[22%]">CUSTOMER</th>
                  <th className="px-4 py-2 text-center w-[15%]">SEVERITY</th>
                  <th className="px-4 py-2 w-[30%]">ALERT MESSAGE</th>
                  <th className="px-4 py-2 text-right w-[15%]">CREATED DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
                {alerts.slice(0, 6).map((a, idx) => {
                  const device = a.DeviceName || a.device || 'N/A';
                  const customer = a.CustomerName || a.customer || 'Unassigned';
                  const severity = a.Severity || a.severity || 'Warning';
                  const msg = a.AlertMessage || a.Message || a.message || 'System Notification';
                  const created = a.Created || a.CreatedDate || a.created || 'N/A';

                  return (
                    <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-4 py-2 font-bold text-slate-800 truncate max-w-[100px]">{device}</td>
                      <td className="px-4 py-2 text-slate-500 truncate max-w-[120px]">{customer}</td>
                      <td className="px-4 py-2 text-center">
                        {getSeverityBadge(severity)}
                      </td>
                      <td className="px-4 py-2 text-slate-600 font-normal truncate max-w-[200px]" title={msg}>{msg}</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400 text-[9px]">{created.substring(0, 10)}</td>
                    </tr>
                  );
                })}
                {alerts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400 font-bold text-[9.5px]">
                      ✓ ไม่พบรายการแจ้งเตือน (Alerts) ในช่วงเวลาที่เลือก
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Page Footer */}
      <div className="page-footer text-[9px] text-slate-400 font-semibold border-t border-slate-100/60 pt-3 mt-3 select-none flex justify-between">
        <span>Generated from Atera API v3 | Powered by Power BI Report Builder | Confidential</span>
        <span>{`หน้า ${pageNumber} จาก ${totalPages}`}</span>
      </div>
    </div>
  );
}
