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
}

export default function AlertsPage({
  pageNumber,
  alerts,
  criticalAlerts,
  warningAlerts
}: AlertsPageProps) {

  const totalAlerts = alerts.length;

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
        title="Alert Overview" 
        subtitle="Infrastructure Security & Alerts Audit | Reporting Period: 06 Jul 2026 - 05 Aug 2026" 
      />

      <div className="page-content space-y-4 flex-1 flex flex-col justify-between overflow-hidden mt-3">
        
        {/* SECTION 1: ALERT SUMMARY KPI CARDS */}
        <div className="grid grid-cols-4 gap-3 select-none">
          {/* Total Alerts */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Alerts</span>
              <Bell className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-800 leading-none">{totalAlerts} Alerts</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">System Wide Events</p>
            </div>
          </div>

          {/* Critical Alerts */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Critical</span>
              <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-rose-600 leading-none">{criticalAlerts} Alerts</h4>
              <p className="text-[6.5px] text-rose-400 font-bold uppercase mt-1">High Severity Alerts</p>
            </div>
          </div>

          {/* Warning Alerts */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Warnings</span>
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-amber-500 leading-none">{warningAlerts} Alerts</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">Medium Severity Alerts</p>
            </div>
          </div>

          {/* Unresolved Status */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Security Risk</span>
              {criticalAlerts > 0 ? (
                <ShieldAlert className="h-3.5 w-3.5 text-rose-500 animate-pulse" />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              )}
            </div>
            <div>
              <h4 className={`text-base font-black leading-none ${criticalAlerts > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {criticalAlerts > 0 ? 'Elevated' : 'Secured'}
              </h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">Threat Status</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: CHARTS SIDE-BY-SIDE */}
        <div className="grid grid-cols-2 gap-4 h-[190px] select-none">
          
          {/* Severity Distribution */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Activity className="h-4 w-4 text-blue-500" /> 1. สัดส่วนประเภทความร้ายแรงการเตือนภัย (Severity Share)
            </h4>
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {/* Critical Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8.5px] font-bold text-slate-600 leading-none">
                  <span>Critical Severity Alerts</span>
                  <span>{criticalAlerts} Cases ({critPercent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${critPercent}%` }}></div>
                </div>
              </div>
              {/* Warning Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8.5px] font-bold text-slate-600 leading-none">
                  <span>Warning Severity Alerts</span>
                  <span>{warningAlerts} Cases ({warnPercent}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${warnPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Alerts Category Distribution */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <ShieldAlert className="h-4 w-4 text-blue-500" /> 2. หมวดหมู่การแจ้งเตือนยอดนิยม (Top Alerts Categories)
            </h4>
            <div className="space-y-2 flex-1 flex flex-col justify-center">
              {categories.map((c, i) => {
                const percentage = totalAlerts > 0 ? Math.round((c.count / totalAlerts) * 100) : 0;
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[8px] font-bold text-slate-600 leading-none">
                      <span>{c.name}</span>
                      <span>{c.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`${c.color} h-full rounded-full`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* SECTION 3: ALERT DETAIL TABLE */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-end">
          <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 select-none">
            <Bell className="h-3.5 w-3.5 text-blue-500" /> 3. บันทึกการแจ้งเตือนระบบแบบละเอียด (Detailed System Alerts Log)
          </h3>
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
              <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px]">
                <tr>
                  <th className="px-4 py-2 w-[15%]">SEVERITY</th>
                  <th className="px-4 py-2 w-[25%]">DEVICE NAME</th>
                  <th className="px-4 py-2 w-[20%]">CUSTOMER</th>
                  <th className="px-4 py-2 w-[30%]">ALERT MESSAGE</th>
                  <th className="px-4 py-2 text-right w-[10%]">TIME</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
                {alerts.slice(0, 7).map((alert, idx) => {
                  const id = alert.AlertID || alert.id || idx + 1;
                  const device = alert.DeviceName || alert.deviceName || 'N/A';
                  const customer = alert.CustomerName || 'N/A';
                  const severity = alert.Severity || alert.severity || 'Warning';
                  const message = alert.Message || alert.message || 'No message';
                  const time = alert.CreatedDate || alert.created || new Date().toISOString();

                  const formattedTime = new Date(time).toLocaleTimeString('th-TH', {
                    hour: '2-digit',
                    minute: '2-digit'
                  }) + ' น.';

                  return (
                    <tr key={id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-4 py-2">
                        {getSeverityBadge(severity)}
                      </td>
                      <td className="px-4 py-2 font-bold text-slate-800">{device}</td>
                      <td className="px-4 py-2 text-slate-500 font-medium">{customer}</td>
                      <td className="px-4 py-2 text-slate-600 truncate max-w-[200px]" title={message}>{message}</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400 text-[9px] whitespace-nowrap">{formattedTime}</td>
                    </tr>
                  );
                })}
                {alerts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-medium">
                      <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                      ไม่พบการแจ้งเตือนระบบที่ตรวจพบในรอบรายงานนี้
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
        <span>หน้า {pageNumber} จาก 12</span>
      </div>
    </div>
  );
}
