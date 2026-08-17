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
import { translations } from '@/lib/translations';
import { SeverityBadge } from '@/components/ui/SeverityBadge';
import { StatCard } from '@/components/ui/StatCard';

interface AlertsPageProps {
  pageNumber: number;
  alerts: any[];
  criticalAlerts: number;
  warningAlerts: number;
  totalPages?: number;
  dateRangeDisplay?: string;
  lang?: string;
  companyName?: string;
}

export default function AlertsPage({
  pageNumber,
  alerts,
  criticalAlerts,
  warningAlerts,
  totalPages = 9,
  dateRangeDisplay,
  lang = 'th',
  companyName = 'Atera Client'
}: AlertsPageProps) {
  const t = translations[lang as 'th' | 'en'] || translations.th;

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
    { name: lang === 'th' ? 'ภาระการประมวลผลและซีพียู' : 'Processor & CPU Load', count: cpuCount, color: 'bg-blue-500' },
    { name: lang === 'th' ? 'พื้นที่จัดเก็บข้อมูลดิสก์' : 'Storage Disk Space', count: diskCount, color: 'bg-amber-500' },
    { name: lang === 'th' ? 'บันทึกความปลอดภัยและการยืนยันตัวตน' : 'Security & Auth Log', count: securityCount, color: 'bg-rose-500 animate-pulse' },
    { name: lang === 'th' ? 'ข้อผิดพลาดอื่นๆ ของระบบ' : 'Other System Errors', count: otherCount, color: 'bg-slate-400' }
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
      <ReportHeader 
        title={t.alertsTitle} 
        subtitle={t.alertsSubtitle} 
        lang={lang}
        dateRangeDisplay={dateRangeDisplay}
      />

      <div className="page-content space-y-4 flex-1 flex flex-col justify-between overflow-hidden mt-3">
        
        {/* SECTION 1: SYSTEM ALERT KPI CARDS */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard
            label="Total Alerts"
            value={<span className="text-blue-700">{totalAlerts}</span>}
            detail="Active notifications"
            icon={<Bell />}
            tone="moderate"
          />
          <StatCard
            label="Critical Alerts"
            value={<span className="text-rose-700">{criticalAlerts}</span>}
            detail={`${critPercent}% of total volume`}
            icon={<AlertTriangle />}
            tone="critical"
          />
          <StatCard
            label="Warning Alerts"
            value={<span className="text-amber-700">{warningAlerts}</span>}
            detail={`${warnPercent}% of total volume`}
            icon={<ShieldAlert />}
            tone="important"
          />
          <StatCard
            label="System Status"
            value={
              <span className={criticalAlerts > 0 ? 'text-rose-700' : 'text-emerald-700'}>
                {criticalAlerts > 0 ? 'Attention Required' : 'Stable'}
              </span>
            }
            detail="Automated monitoring"
            icon={<ShieldCheck />}
            tone={criticalAlerts > 0 ? 'critical' : 'online'}
          />
        </div>
        {/* SECTION 2: RECENT ALERTS DETAIL TABLE */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-end">
          <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 ">
            <FileCheck className="h-3.5 w-3.5 text-blue-500" /> {lang === 'th' ? 'บันทึกรายการแจ้งเตือนล่าสุดในระบบ (Real-Time Security & System Events)' : 'REAL-TIME SECURITY & SYSTEM EVENTS'}
          </h3>
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
              <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px]">
                <tr>
                  <th className="px-4 py-2 w-[18%]">{lang === 'th' ? 'ชื่ออุปกรณ์' : 'DEVICE NAME'}</th>
                  <th className="px-4 py-2 w-[22%]">{lang === 'th' ? 'ลูกค้า' : 'CUSTOMER'}</th>
                  <th className="px-4 py-2 text-center w-[15%]">{lang === 'th' ? 'ระดับความรุนแรง' : 'SEVERITY'}</th>
                  <th className="px-4 py-2 w-[30%]">{lang === 'th' ? 'ข้อความแจ้งเตือน' : 'ALERT MESSAGE'}</th>
                  <th className="px-4 py-2 text-right w-[15%]">{lang === 'th' ? 'วันที่สร้าง' : 'CREATED DATE'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
                {alerts.slice(0, 10).map((a, idx) => {
                  const device = a.DeviceName || a.device || 'Not reported';
                  const customer = a.CustomerName || a.customer || 'Not reported';
                  const severity = a.Severity || a.severity || '';
                  const msg = a.AlertMessage || a.Message || a.message || 'Not reported';
                  const created = a.Created || a.CreatedDate || a.created || 'N/A';

                  return (
                    <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-4 py-2 font-bold text-slate-800 truncate max-w-[100px]">{device}</td>
                      <td className="px-4 py-2 text-slate-500 truncate max-w-[120px]">{customer}</td>
                      <td className="px-4 py-2 text-center">
                        <SeverityBadge severity={severity} />
                      </td>
                      <td className="px-4 py-2 text-slate-600 font-normal truncate max-w-[200px]" title={msg}>{msg}</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400 text-[9px]">{created.substring(0, 10)}</td>
                    </tr>
                  );
                })}
                {alerts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400 font-bold text-[9.5px]">
                      {lang === 'th' ? '✓ ไม่พบรายการแจ้งเตือน (Alerts) ในช่วงเวลาที่เลือก' : '✓ No alerts found in the selected period'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Page Footer */}
      <div className="page-footer text-[9px] text-slate-400 font-semibold border-t border-slate-100/60 pt-3 mt-3  flex justify-between">
        <span>Generated from Atera API v3 | Powered by Ally Assist</span>
        <span>
          {lang === 'th' ? `หน้า ${pageNumber} จาก ${totalPages}` : `Page ${pageNumber} of ${totalPages}`}
        </span>
      </div>
    </div>
  );
}
