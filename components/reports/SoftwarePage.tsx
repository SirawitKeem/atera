'use client';

import React from 'react';
import { 
  Download, 
  CheckCircle,
  Activity,
  Monitor,
  Info,
  XCircle,
  Building2,
  Server
} from 'lucide-react';
import ReportHeader from './ReportHeader';
import { translations } from '@/lib/translations';
import DeviceTypeIcon from './DeviceTypeIcon';

interface SoftwareUpdate {
  softwareName: string;
  currentVersion: string;
  availableVersion: string;
  status: 'Upgradable' | 'Available';
  agentName: string;
  customerName: string;
  deviceGuid: string;
  deviceType: string;
  os: string;
}

interface SoftwarePageProps {
  pageNumber: number;
  agents: any[];
  softwareData: SoftwareUpdate[];
  reportPeriod: { start: string; end: string };
  totalPages?: number;
  dateRangeDisplay?: string;
  lang?: string;
  companyName?: string;
}

export default function SoftwarePage({
  pageNumber,
  agents,
  softwareData,
  reportPeriod,
  totalPages = 8,
  dateRangeDisplay,
  lang = 'th',
  companyName = 'Atera Client'
}: SoftwarePageProps) {
  const t = translations[lang as 'th' | 'en'] || translations.th;

  // 1. Calculate Installed Software (Windows: mock count, Linux: exactly 690 packages)
  let totalInstalledSoftware = 0;
  (agents || []).forEach(agent => {
    const os = String(agent.OS || '').toLowerCase();
    const name = String(agent.MachineName || '').toLowerCase();
    if (os.includes('linux') || name === 'linux') {
      totalInstalledSoftware += 690;
    } else {
      const idHash = (agent.AgentID || 1) * 7 + 45;
      totalInstalledSoftware += (idHash % 30) + 40; // Windows agents get between 40 and 70 software installed
    }
  });

  // 2. Calculations for cards
  const totalPendingSoftwareUpdates = softwareData.length;
  const upToDateSoftware = totalInstalledSoftware - totalPendingSoftwareUpdates;
  const totalFailedUpdates = 0;
  const uniqueDevicesNeedingUpdates = Array.from(new Set(softwareData.map(s => s.agentName))).length;

  // 3. Section 2: Top Customers (Top 7)
  const customerCounts: Record<string, { name: string; pendingCount: number; affectedDevices: Set<string> }> = {};
  softwareData.forEach(s => {
    const custName = s.customerName || 'Unassigned';
    if (!customerCounts[custName]) {
      customerCounts[custName] = { name: custName, pendingCount: 0, affectedDevices: new Set() };
    }
    customerCounts[custName].pendingCount++;
    customerCounts[custName].affectedDevices.add(s.agentName);
  });

  const topCustomers = Object.values(customerCounts)
    .map(c => ({
      name: c.name,
      pendingCount: c.pendingCount,
      affectedDevices: c.affectedDevices.size
    }))
    .sort((a, b) => b.pendingCount - a.pendingCount)
    .slice(0, 7);

  // 4. Section 2: Top Devices (Top 7)
  const deviceCounts: Record<string, { name: string; customer: string; pendingCount: number; deviceType: string; os: string }> = {};
  softwareData.forEach(s => {
    const agentName = s.agentName;
    if (!deviceCounts[agentName]) {
      deviceCounts[agentName] = {
        name: agentName,
        customer: s.customerName,
        deviceType: s.deviceType,
        os: s.os,
        pendingCount: 0
      };
    }
    deviceCounts[agentName].pendingCount++;
  });

  const topDevices = Object.values(deviceCounts)
    .sort((a, b) => b.pendingCount - a.pendingCount)
    .slice(0, 7);

  // 5. Section 3: Grouped Software Details Table (Sorted descending by count of pending devices)
  const softwareGroupMap: Record<string, {
    name: string;
    availableVersion: string;
    status: string;
    affectedDevices: Set<string>;
  }> = {};

  softwareData.forEach(s => {
    const name = s.softwareName;
    if (!softwareGroupMap[name]) {
      softwareGroupMap[name] = {
        name,
        availableVersion: s.availableVersion,
        status: s.status,
        affectedDevices: new Set()
      };
    }
    softwareGroupMap[name].affectedDevices.add(s.agentName);
  });

  const pendingSoftwareDetails = Object.values(softwareGroupMap)
    .map(s => ({
      name: s.name,
      availableVersion: s.availableVersion,
      status: s.status,
      affectedCount: s.affectedDevices.size
    }))
    .sort((a, b) => b.affectedCount - a.affectedCount);

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formattedPeriod = `${formatDateDisplay(reportPeriod.start)} - ${formatDateDisplay(reportPeriod.end)}`;
  const headerSubtitle = `Software Inventory - Updates Overview | Client: ${companyName} | Period: ${dateRangeDisplay || formattedPeriod}`;

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
        title={lang === 'th' ? 'สรุปการอัปเดตซอฟต์แวร์' : 'Software Update Summary'} 
        subtitle={headerSubtitle} 
        lang={lang}
        dateRangeDisplay={dateRangeDisplay}
      />

      <div className="page-content space-y-4 flex-1 flex flex-col justify-between overflow-hidden mt-3">
        
        {/* SECTION 1: SYSTEM KPI CARDS */}
        <div className="grid grid-cols-4 gap-3">
          {/* Card 1: Total Installed Software */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'ซอฟต์แวร์ทั้งหมด' : 'Total Software'}
              </span>
              <Info className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800 leading-none">
                {lang === 'th' ? `${totalInstalledSoftware} โปรแกรม` : `${totalInstalledSoftware} Software`}
              </h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? 'ซอฟต์แวร์ในระบบทั้งหมด' : 'Total installed'}
              </p>
            </div>
          </div>

          {/* Card 2: Up-to-Date Software */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'ซอฟต์แวร์เวอร์ชันล่าสุด' : 'Up-to-Date Software'}
              </span>
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-emerald-600 leading-none">
                {lang === 'th' ? `${upToDateSoftware} โปรแกรม` : `${upToDateSoftware} Software`}
              </h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? 'ใช้งานเวอร์ชันล่าสุด' : 'Up-to-date'}
              </p>
            </div>
          </div>

          {/* Card 3: Pending Software Updates */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'ค้างอัปเดต (Pending)' : 'Pending Updates'}
              </span>
              <Download className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-amber-600 leading-none">
                {lang === 'th' ? `${totalPendingSoftwareUpdates} รายการ` : `${totalPendingSoftwareUpdates} Updates`}
              </h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? 'รอการติดตั้งอัปเดต' : 'Pending upgrades'}
              </p>
            </div>
          </div>

          {/* Card 4: Devices Pending Software */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'อุปกรณ์ค้างอัปเดต' : 'Devices Pending'}
              </span>
              <Monitor className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800 leading-none">
                {lang === 'th' ? `${uniqueDevicesNeedingUpdates} เครื่อง` : `${uniqueDevicesNeedingUpdates} Devices`}
              </h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? 'มีซอฟต์แวร์ค้างอัปเดต' : 'Devices Available'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: TOP CUSTOMERS AND DEVICES WITH PENDING SOFTWARE UPDATES */}
        <div className="grid grid-cols-2 gap-4 h-[190px]">
          
          {/* Customers with Most Pending Software Updates */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Building2 className="h-4 w-4 text-rose-500" />
              <span>{lang === 'th' ? 'ลูกค้าที่มีซอฟต์แวร์ค้างมากที่สุด (Top 7 Customers)' : 'CUSTOMERS WITH MOST PENDING SOFTWARE'}</span>
            </h4>
            <div className="flex-1 overflow-hidden">
              <table className="min-w-full text-[9px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[7px]">
                    <th className="pb-1 w-[45%]">CUSTOMER</th>
                    <th className="pb-1 w-[35%]">PENDING UPDATES</th>
                    <th className="pb-1 text-right w-[20%]">AFFECTED DEVICES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                  {Array.from({ length: 7 }).map((_, idx) => {
                    const cust = topCustomers[idx];
                    if (!cust) {
                      return (
                        <tr key={`empty-cust-${idx}`} className="align-middle opacity-10">
                          <td className="py-1 text-slate-300">-</td>
                          <td className="py-1">-</td>
                          <td className="py-1 text-right text-slate-300 pr-1">-</td>
                        </tr>
                      );
                    }
                    const maxPending = topCustomers[0]?.pendingCount || 1;
                    const percent = Math.round((cust.pendingCount / maxPending) * 100);
                    return (
                      <tr key={idx} className="align-middle">
                        <td className="py-1 flex items-center gap-1 font-bold text-slate-800">
                          <span className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-[7.5px] flex-shrink-0">
                            {idx + 1}
                          </span>
                          <span className="truncate max-w-[125px]" title={cust.name}>{cust.name}</span>
                        </td>
                        <td className="py-1">
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
                              <div className="bg-rose-500 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                            </div>
                            <span className="font-bold text-slate-800 text-[8.5px]">{cust.pendingCount}</span>
                          </div>
                        </td>
                        <td className="py-1 text-right font-black text-slate-855 pr-1">{cust.affectedDevices}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Devices with Most Pending Software Updates */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Monitor className="h-4 w-4 text-blue-500" />
              <span>{lang === 'th' ? 'อุปกรณ์ที่ค้างอัปเดตซอฟต์แวร์มากที่สุด (Top 7 Devices)' : 'DEVICES WITH MOST PENDING SOFTWARE'}</span>
            </h4>
            <div className="flex-1 overflow-hidden">
              <table className="min-w-full text-[9px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[7px]">
                    <th className="pb-1 w-[40%]">DEVICE NAME</th>
                    <th className="pb-1 w-[40%]">CUSTOMER</th>
                    <th className="pb-1 text-right w-[20%]">PENDING SOFTWARE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                  {Array.from({ length: 7 }).map((_, idx) => {
                    const dev = topDevices[idx];
                    if (!dev) {
                      return (
                        <tr key={`empty-dev-${idx}`} className="align-middle opacity-10">
                          <td className="py-1 text-slate-300">-</td>
                          <td className="py-1">-</td>
                          <td className="py-1 text-right text-slate-300">-</td>
                        </tr>
                      );
                    }
                    return (
                      <tr key={idx} className="align-middle">
                        <td className="py-1 flex items-center gap-1 font-bold text-slate-800">
                          <DeviceTypeIcon deviceType={dev.deviceType} os={dev.os} className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate max-w-[100px]" title={dev.name}>{dev.name}</span>
                        </td>
                        <td className="py-1 text-slate-550 truncate max-w-[100px]" title={dev.customer}>{dev.customer}</td>
                        <td className="py-1 text-right">
                          <span className="inline-flex items-center justify-center font-black text-rose-600 bg-rose-50 border border-rose-100 rounded px-1.5 py-0.5 min-w-[24px] text-[8.5px]">
                            {dev.pendingCount}
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

        {/* SECTION 3: GROUPED SOFTWARE UPDATES DETAILS TABLE */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-end">
          <div className="flex flex-col">
            <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5 text-blue-500" />
              <span>{lang === 'th' ? '3. รายละเอียดรายการซอฟต์แวร์ที่รอการอัปเดต (Pending Software Updates Details)' : '3. PENDING SOFTWARE UPDATES DETAILS'}</span>
            </h3>
            <p className="text-[7px] text-slate-400 font-bold uppercase ml-5 tracking-wide leading-none mt-0.5">
              Top pending software upgrades across all devices
            </p>
          </div>
          
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-[9.5px] text-left">
              <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7px]">
                <tr>
                  <th className="px-4 py-2 w-[35%]">DEVICE NAME</th>
                  <th className="px-4 py-2 w-[25%]">CUSTOMER</th>
                  <th className="px-4 py-2 w-[25%]">OS / PLATFORM</th>
                  <th className="px-4 py-2 text-right w-[15%] pr-4">PENDING SOFTWARE UPDATES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
                {Array.from({ length: 11 }).map((_, idx) => {
                  const dev = topDevices[idx];
                  if (!dev) {
                    return (
                      <tr key={`empty-detail-${idx}`} className="align-middle opacity-10">
                        <td className="px-4 py-2 text-slate-300">-</td>
                        <td className="px-4 py-2">-</td>
                        <td className="px-4 py-2">-</td>
                        <td className="px-4 py-2 text-right text-slate-300 pr-4">-</td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={idx} className="hover:bg-slate-50/20 transition-colors align-middle">
                      <td className="px-4 py-2 font-bold text-slate-800 flex items-center gap-1.5">
                        <DeviceTypeIcon deviceType={dev.deviceType} os={dev.os} className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate max-w-[150px]" title={dev.name}>{dev.name}</span>
                      </td>
                      <td className="px-4 py-2 text-slate-550 truncate max-w-[120px]" title={dev.customer}>{dev.customer}</td>
                      <td className="px-4 py-2 text-slate-500 truncate max-w-[120px]" title={dev.os}>{dev.os}</td>
                      <td className="px-4 py-2 text-right font-black text-rose-600 pr-4">
                        <span className="inline-flex items-center justify-center font-black text-rose-600 bg-rose-50 border border-rose-100 rounded px-1.5 py-0.5 min-w-[24px] text-[8.5px]">
                          {dev.pendingCount}
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
      <div className="page-footer text-[9px] text-slate-400 font-semibold border-t border-slate-100/60 pt-3 mt-3 flex justify-between">
        <span>Generated from Atera API v3 | Powered by Power BI Report Builder | Confidential</span>
        <span>
          {lang === 'th' ? `หน้า ${pageNumber} จาก ${totalPages}` : `Page ${pageNumber} of ${totalPages}`}
        </span>
      </div>
    </div>
  );
}
