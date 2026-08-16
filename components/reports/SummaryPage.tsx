'use client';

import React from 'react';
import { 
  Monitor, 
  Ticket, 
  AlertOctagon, 
  Users2,
  Bell,
  Clipboard,
  HardDrive,
  Laptop,
  Server,
  Wifi
} from 'lucide-react';
import ReportHeader from './ReportHeader';
import { translations } from '@/lib/translations';
import DeviceTypeIcon from './DeviceTypeIcon';

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
  totalPages?: number;
  dateRangeDisplay?: string;
  lang?: string;
  companyName?: string;
}

export default function SummaryPage({
  pageNumber,
  agents,
  alerts,
  totalCustomers,
  openTickets,
  totalDevices,
  totalTickets,
  resolvedTickets,
  totalPages = 9,
  dateRangeDisplay,
  lang = 'th',
  companyName = 'Atera Client'
}: SummaryPageProps) {
  const t = translations[lang as 'th' | 'en'] || translations.th;

  const normalizeDeviceTypeValue = (value: unknown) => {
    const raw = String(value ?? '').trim();
    return raw.replace(/\s+/g, ' ');
  };

  const deviceTypeCounts = agents.reduce<Record<string, number>>((acc, agent) => {
    const candidates = [
      agent.DeviceType,
      agent.deviceType,
      agent.Type,
      agent.type,
      agent.AgentType,
      agent.agentType,
      agent.DeviceCategory,
      agent.deviceCategory,
      agent.OperatingSystem,
      agent.operatingSystem,
      agent.OS,
      agent.os,
      agent.Name,
      agent.name
    ];

    const selected = candidates.find(v => normalizeDeviceTypeValue(v) !== '');
    const label = normalizeDeviceTypeValue(selected) || 'Unspecified';

    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  const deviceTypeBreakdown = Object.entries(deviceTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const totalDeviceCount = Math.max(agents.length, 1);

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
        title={t.summaryTitle} 
        subtitle={t.summarySubtitle} 
        dateRangeDisplay={dateRangeDisplay}
        lang={lang}
      />

      <div className="page-content space-y-4 flex-1 flex flex-col justify-between overflow-hidden mt-2">

        {/* SECTION 1: KPI CARDS (4 Cards: Customers, Devices, Alerts, Tickets) */}
        <div className="grid grid-cols-4 gap-3 ">
          
          {/* Card 1: Customers */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex flex-col flex-1">
                <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-1">{lang === 'th' ? 'ลูกค้า' : 'Customers'}</span>
                <h3 className="text-3xl font-black text-slate-900 leading-none">{totalCustomers}</h3>
                <p className="text-[10px] text-slate-500 font-medium mt-1">{t.totalCustomers}</p>
              </div>
              <Users2 className="h-8 w-8 text-blue-500 flex-shrink-0" strokeWidth={1.5} />
            </div>
          </div>

          {/* Card 2: Devices */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex flex-col flex-1">
                <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-1">{lang === 'th' ? 'อุปกรณ์' : 'Devices'}</span>
                <h3 className="text-3xl font-black text-slate-900 leading-none">{totalDevices.toLocaleString()}</h3>
                <p className="text-[10px] text-slate-500 font-medium mt-1">{t.monitoredDevices}</p>
              </div>
              <Monitor className="h-8 w-8 text-blue-500 flex-shrink-0" strokeWidth={1.5} />
            </div>
          </div>

          {/* Card 3: Alerts */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex flex-col flex-1">
                <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wider mb-1">{lang === 'th' ? 'การแจ้งเตือน' : 'Alerts'}</span>
                <h3 className="text-3xl font-black text-slate-900 leading-none">{alerts.length}</h3>
                <p className="text-[10px] text-slate-500 font-medium mt-1">{t.activeAlerts}</p>
              </div>
              <Bell className="h-8 w-8 text-orange-500 flex-shrink-0" strokeWidth={1.5} />
            </div>
          </div>

          {/* Card 4: Tickets */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex flex-col flex-1">
                <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider mb-1">{lang === 'th' ? 'ตั๋วงาน' : 'Tickets'}</span>
                <h3 className="text-3xl font-black text-slate-900 leading-none">{totalTickets}</h3>
                <p className="text-[10px] text-slate-500 font-medium mt-1">{t.totalTickets}</p>
              </div>
              <Clipboard className="h-8 w-8 text-emerald-500 flex-shrink-0" strokeWidth={1.5} />
            </div>
          </div>

        </div>

        {/* SECTION 2: SERVICE DESK & MONITORING SUMMARY (Side-by-side) */}
        <div className="grid grid-cols-2 gap-4 ">
          
          {/* Tickets Overview Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between shadow-xs h-[120px]">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <Ticket className="h-4 w-4 text-emerald-500" />
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">{t.ticketsAndService}</h4>
              </div>
              <span className="text-[9px] font-bold text-slate-500">
                {t.resolutionRate}: {totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0}%
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-2 flex-1">
              <div className="flex flex-col justify-center">
                <span className="text-[8px] font-extrabold text-slate-400 uppercase">{lang === 'th' ? 'ตั๋วงานทั้งหมด' : 'Total Tickets'}</span>
                <span className="text-lg font-black text-slate-800 leading-none">{totalTickets}</span>
              </div>
              <div className="flex flex-col justify-center border-x border-slate-100 px-2">
                <span className="text-[8px] font-extrabold text-slate-400 uppercase">{lang === 'th' ? 'ค้างอยู่/รอดำเนินการ' : 'Open / Pending'}</span>
                <span className="text-lg font-black text-rose-500 leading-none">{openTickets}</span>
              </div>
              <div className="flex flex-col justify-center pl-2">
                <span className="text-[8px] font-extrabold text-slate-400 uppercase">{lang === 'th' ? 'แก้ไขแล้ว' : 'Resolved'}</span>
                <span className="text-lg font-black text-emerald-600 leading-none">{resolvedTickets}</span>
              </div>
            </div>

            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0}%` }}></div>
            </div>
          </div>

          {/* Alerts Overview Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between shadow-xs h-[120px]">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-2">
              <div className="flex items-center gap-2">
                <AlertOctagon className="h-4 w-4 text-orange-500" />
                <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">{t.alertsAndMonitoring}</h4>
              </div>
              <span className="text-[9px] font-bold text-slate-500">
                {t.activeAlertsTitle}: {alerts.length}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 flex-1">
              <div className="flex flex-col justify-center">
                <span className="text-[8px] font-extrabold text-rose-500 uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block"></span>
                  {lang === 'th' ? 'วิกฤต' : 'Critical'}
                </span>
                <span className="text-lg font-black text-rose-600 leading-none">
                  {alerts.filter(a => (a.Severity || a.severity || '').toLowerCase() === 'critical').length}
                </span>
              </div>
              <div className="flex flex-col justify-center border-x border-slate-100 px-2">
                <span className="text-[8px] font-extrabold text-amber-500 uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
                  {lang === 'th' ? 'เตือนภัย' : 'Warning'}
                </span>
                <span className="text-lg font-black text-amber-600 leading-none">
                  {alerts.filter(a => (a.Severity || a.severity || '').toLowerCase() === 'warning').length}
                </span>
              </div>
              <div className="flex flex-col justify-center pl-2">
                <span className="text-[8px] font-extrabold text-blue-500 uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
                  {lang === 'th' ? 'ข้อมูล' : 'Info'}
                </span>
                <span className="text-lg font-black text-blue-600 leading-none">
                  {alerts.filter(a => (a.Severity || a.severity || '').toLowerCase() === 'info').length}
                </span>
              </div>
            </div>
            
            <p className="text-[8px] text-slate-400 font-bold mt-2 uppercase leading-none">
              {lang === 'th' ? 'ระบบตรวจสอบเหตุการณ์แบบเรียลไทม์ 24/7' : '24/7 Realtime Monitoring System'}
            </p>
          </div>

        </div>

        {/* SECTION 3: DEVICE TYPE DISTRIBUTION (Full Width) */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between shadow-xs flex-1">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-50 pb-2 mb-2">
              <Monitor className="h-4 w-4 text-blue-500" />
              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-wider">{t.deviceTypeBreakdown}</h4>
            </div>

            <table className="min-w-full text-[9.5px] text-left text-slate-700">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[8px]">
                  <th className="pb-1.5 w-[50%]">{t.deviceType}</th>
                  <th className="pb-1.5 text-center w-[20%]">{lang === 'th' ? 'จำนวน' : 'Count'}</th>
                  <th className="pb-1.5 text-right w-[30%]">{t.ratio}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {deviceTypeBreakdown.length > 0 ? (
                  deviceTypeBreakdown.map(([label, count]) => {
                    const percentage = totalDeviceCount > 0 ? Math.round((count / totalDeviceCount) * 1000) / 10 : 0;

                    const getTranslatedLabel = (rawLabel: string) => {
                      if (lang !== 'th') return rawLabel;
                      const low = rawLabel.toLowerCase();
                      if (low.includes('workstation') || low.includes('desktop') || low.includes('laptop') || low === 'pc') return 'เครื่องผู้ใช้ทั่วไป (Workstation)';
                      if (low.includes('server')) return 'เครื่องแม่ข่าย (Server)';
                      if (low.includes('virtual') || low.includes('vm')) return 'เครื่องเสมือน (Virtual Machine)';
                      if (low.includes('network') || low.includes('router') || low.includes('switch')) return 'อุปกรณ์เครือข่าย (Network Device)';
                      return rawLabel;
                    };

                    return (
                      <tr key={label} className="align-middle">
                        <td className="py-3.5 font-bold text-slate-800">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <DeviceTypeIcon deviceType={label} className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate" title={label}>{getTranslatedLabel(label)}</span>
                          </div>
                        </td>
                        <td className="py-3.5 text-center text-slate-800 font-black text-xs">{count}</td>
                        <td className="py-3.5 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-blue-500" style={{ width: `${Math.min(percentage, 100)}%` }} />
                            </div>
                            <span className="w-10 text-right text-slate-800 font-black text-xs">{percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="py-3.5 text-slate-400 font-semibold">{lang === 'th' ? 'ไม่มีข้อมูลอุปกรณ์' : 'No device type data'}</td>
                    <td className="py-3.5 text-center text-slate-800 font-black">0</td>
                    <td className="py-3.5 text-right text-slate-700 font-bold">0%</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <p className="text-[8px] text-slate-400 font-bold uppercase leading-none mt-4">
            รวม RMM Agents ทั้งหมด {totalDevices} เครื่องในระบบ
          </p>
        </div>



      </div>

      {/* Page Footer (Dynamic, professional layout) */}
      <div className="page-footer text-[9px] text-slate-400 font-semibold border-t border-slate-100/60 pt-3 mt-3  flex justify-between">
        <span>Generated from Atera API v3 | Powered by Ally Assist</span>
        <span>หน้า {pageNumber} จาก {totalPages}</span>
      </div>
    </div>
  );
}
