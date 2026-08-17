'use client';

import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Info,
  Server,
  Building2,
  Monitor
} from 'lucide-react';
import ReportHeader from './ReportHeader';
import DeviceTypeIcon from './DeviceTypeIcon';
import { translations } from '@/lib/translations';
import { getDevicePlatform, isServerDevice } from '@/lib/device-classification';

interface PatchesPageProps {
  pageNumber: number;
  agents: any[];
  patchData: any[];
  reportPeriod: { start: string; end: string };
  totalPages?: number;
  dateRangeDisplay?: string;
  lang?: string;
  companyName?: string;
}

export default function PatchesPage({
  pageNumber,
  agents,
  patchData,
  reportPeriod,
  totalPages = 9,
  dateRangeDisplay,
  lang = 'th',
  companyName = 'Atera Client'
}: PatchesPageProps) {
  const t = translations[lang as 'th' | 'en'] || translations.th;

  const totalDevices = agents.length;
  
  // Date filter helper
  const isInRange = (dateStr?: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const start = new Date(reportPeriod.start + 'T00:00:00Z');
    const end = new Date(reportPeriod.end + 'T23:59:59Z');
    return d >= start && d <= end;
  };

  // Process Available (Missing) Patches
  const missingPatchesList: {
    deviceName: string;
    customerName: string;
    deviceType: string;
    os: string;
    kbId: string;
    title: string;
    classification: string;
  }[] = [];

  (patchData || []).forEach(agent => {
    if (agent.availablePatches && agent.availablePatches.length > 0) {
      agent.availablePatches.forEach((patch: any) => {
        missingPatchesList.push({
          deviceName: agent.agentName || 'Agent',
          customerName: agent.customerName || 'Unassigned',
          deviceType: agent.deviceType || '',
          os: agent.os || '',
          kbId: patch.kbId || patch.KBID || patch.name || patch.Title || 'N/A',
          title: patch.name || patch.Title || 'Unknown Update',
          classification: patch.class || patch.PatchClassification || 'Other Updates'
        });
      });
    }
  });

  // Count installed patches matching the selected report date range
  let totalInstalledPatches = 0;
  (patchData || []).forEach(agent => {
    const filtered = (agent.installedPatches || []).filter((p: any) => isInRange(p.installDate));
    totalInstalledPatches += filtered.length;
  });

  const totalPendingPatches = missingPatchesList.length;
  const totalFailedPatches = 0;
  const totalOSPatches = totalInstalledPatches + totalPendingPatches + totalFailedPatches;

  const totalMissingUpdates = totalPendingPatches;
  const uniqueDevicesNeedingUpdates = Array.from(new Set(missingPatchesList.map(p => p.deviceName))).length;

  // Calculate missing patches counts per device type
  const workstationMissingPatches = missingPatchesList.filter(p => !isServerDevice({ deviceType: p.deviceType }) && getDevicePlatform({ os: p.os }) !== 'linux').length;
  const serverMissingPatches = missingPatchesList.filter(p => isServerDevice({ deviceType: p.deviceType })).length;
  const linuxMissingPatches = missingPatchesList.filter(p => getDevicePlatform({ os: p.os }) === 'linux').length;

  // Group devices by number of pending patches and sort descending (Top 7)
  const topDevices = (patchData || [])
    .map(agent => {
      const pendingCount = (agent.availablePatches || []).length;
      return {
        name: agent.agentName || 'Agent',
        customer: agent.customerName || 'Unassigned',
        deviceType: agent.deviceType || '',
        os: agent.os || '',
        pendingCount
      };
    })
    .filter(d => d.pendingCount > 0)
    .sort((a, b) => b.pendingCount - a.pendingCount)
    .slice(0, 7);

  // Group customers by pending patches count (Top 7)
  const customerCounts: Record<string, { name: string; pendingCount: number; affectedDevices: Set<string> }> = {};
  (patchData || []).forEach(agent => {
    const custName = agent.customerName || 'Unassigned';
    const pendingCount = (agent.availablePatches || []).length;
    
    if (!customerCounts[custName]) {
      customerCounts[custName] = { name: custName, pendingCount: 0, affectedDevices: new Set() };
    }
    if (pendingCount > 0) {
      customerCounts[custName].pendingCount += pendingCount;
      customerCounts[custName].affectedDevices.add(agent.agentName || 'Agent');
    }
  });

  const topCustomers = Object.values(customerCounts)
    .map(c => ({
      name: c.name,
      pendingCount: c.pendingCount,
      affectedDevices: c.affectedDevices.size
    }))
    .filter(c => c.pendingCount > 0)
    .sort((a, b) => b.pendingCount - a.pendingCount)
    .slice(0, 7);

  // Group all pending patches across all devices by KB ID
  const patchDetailsMap: Record<string, {
    title: string;
    kbId: string;
    classification: string;
    severity: string;
    affectedDevices: Set<string>;
  }> = {};

  (patchData || []).forEach(agent => {
    (agent.availablePatches || []).forEach((patch: any) => {
      const kb = patch.kbId || patch.KBID || patch.name || patch.Title || 'N/A';
      const title = patch.name || patch.Title || 'Unknown Update';
      const classification = patch.class || patch.PatchClassification || 'Other Updates';
      
      let severity = 'Medium';
      if (classification === 'Security Updates' || classification === 'Critical Updates') {
        severity = 'High';
      } else if (classification === 'Updates') {
        severity = 'Medium';
      } else {
        severity = 'Low';
      }

      if (!patchDetailsMap[kb]) {
        patchDetailsMap[kb] = {
          title,
          kbId: kb,
          classification,
          severity,
          affectedDevices: new Set()
        };
      }
      patchDetailsMap[kb].affectedDevices.add(agent.agentName || 'Agent');
    });
  });

  const pendingOSPatchesDetails = Object.values(patchDetailsMap)
    .map(p => ({
      title: p.title,
      kbId: p.kbId,
      classification: p.classification,
      severity: p.severity,
      affectedCount: p.affectedDevices.size
    }))
    .filter(p => p.kbId && p.kbId !== 'N/A')
    .sort((a, b) => b.affectedCount - a.affectedCount);

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const headerSubtitle = t.patchesSubtitle;

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
        title={t.patchesTitle} 
        subtitle={headerSubtitle} 
        lang={lang}
        dateRangeDisplay={dateRangeDisplay}
      />

      <div className="page-content space-y-3.5 flex-1 flex flex-col justify-between overflow-hidden mt-3">
        
        {/* SECTION 1: SYSTEM KPI CARDS */}
        <div className="grid grid-cols-5 gap-2 ">
          {/* Card 1: Total OS Patches */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[64px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'OS PATCH ทั้งหมด' : 'TOTAL OS PATCHES'}
              </span>
              <Info className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800 leading-none">
                <span className="text-blue-700">{totalOSPatches}</span>{' '}
                <span className="text-[12px] font-bold text-slate-500">{lang === 'th' ? 'รายการ' : 'Patches'}</span>
              </h4>
            </div>
          </div>

          {/* Card 2: Installed Patches */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[64px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'ติดตั้งแล้ว (Installed)' : 'INSTALLED PATCHES'}
              </span>
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800 leading-none">
                <span className="text-emerald-700">{totalInstalledPatches}</span>{' '}
                <span className="text-[12px] font-bold text-slate-500">{lang === 'th' ? 'รายการ' : 'Patches'}</span>
              </h4>
            </div>
          </div>

          {/* Card 3: Pending Patches */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[64px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'ค้างอัปเดต (Pending)' : 'PENDING PATCHES'}
              </span>
              <Activity className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800 leading-none">
                <span className="text-amber-700">{totalPendingPatches}</span>{' '}
                <span className="text-[12px] font-bold text-slate-500">{lang === 'th' ? 'รายการ' : 'Patches'}</span>
              </h4>
            </div>
          </div>

          {/* Card 4: OS Patch Failed */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[64px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'ติดตั้งล้มเหลว (Failed)' : 'OS PATCH FAILED'}
              </span>
              <XCircle className="h-3.5 w-3.5 text-rose-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800 leading-none">
                <span className="text-rose-700">{totalFailedPatches}</span>{' '}
                <span className="text-[12px] font-bold text-slate-500">{lang === 'th' ? 'รายการ' : 'Patches'}</span>
              </h4>
            </div>
          </div>

          {/* Card 5: Devices Pending */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[64px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'อุปกรณ์ค้างติดตั้ง' : 'DEVICES PENDING'}
              </span>
              <Monitor className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800 leading-none">
                <span className="text-indigo-700">{uniqueDevicesNeedingUpdates}</span>{' '}
                <span className="text-[12px] font-bold text-slate-500">{lang === 'th' ? 'เครื่อง' : 'Devices'}</span>
              </h4>
            </div>
          </div>
        </div>

        {/* SECTION 2: TOP CUSTOMERS AND DEVICES WITH PENDING PATCHES */}
        <div className="grid grid-cols-2 gap-4 h-[190px]">
          
          {/* Customers with Most Pending Patches */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Building2 className="h-4 w-4 text-rose-500" />
              <span>{lang === 'th' ? 'ลูกค้าที่มีแพตช์ค้างมากที่สุด (Top 7 Customers)' : 'CUSTOMERS WITH MOST PENDING PATCHES'}</span>
            </h4>
            <div className="flex-1 overflow-hidden">
              <table className="min-w-full text-[9px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[7px]">
                    <th className="pb-1 w-[45%]">CUSTOMER</th>
                    <th className="pb-1 w-[35%]">PENDING PATCHES</th>
                    <th className="pb-1 text-right w-[20%]">AFFECTED DEVICES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                  {topCustomers.slice(0, 7).map((cust, idx) => {
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
                        <td className="py-1 text-right font-black text-slate-850 pr-1">{cust.affectedDevices}</td>
                      </tr>
                    );
                  })}
                  {topCustomers.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-slate-400 font-bold text-[8.5px]">
                        {lang === 'th' ? '✓ ไม่พบแพตช์ค้างตามเงื่อนไข' : '✓ No pending patches'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Devices with Most Pending Patches */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
              <Monitor className="h-4 w-4 text-blue-500" />
              <span>{lang === 'th' ? 'อุปกรณ์ที่มีแพตช์ค้างมากที่สุด (Top 7 Devices)' : 'DEVICES WITH MOST PENDING PATCHES'}</span>
            </h4>
            <div className="flex-1 overflow-hidden">
              <table className="min-w-full text-[9px] text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[7px]">
                    <th className="pb-1 w-[40%]">DEVICE NAME</th>
                    <th className="pb-1 w-[40%]">CUSTOMER</th>
                    <th className="pb-1 text-right w-[20%]">PENDING PATCHES</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-semibold text-slate-700">
                  {topDevices.slice(0, 7).map((dev, idx) => {
                    return (
                      <tr key={idx} className="align-middle">
                        <td className="py-1 flex items-center gap-1 font-bold text-slate-800">
                          <DeviceTypeIcon deviceType={dev.deviceType} os={dev.os} className="w-3.5 h-3.5 flex-shrink-0" />
                          <span className="truncate max-w-[100px]" title={dev.name}>{dev.name}</span>
                        </td>
                        <td className="py-1 text-slate-500 truncate max-w-[100px]" title={dev.customer}>{dev.customer}</td>
                        <td className="py-1 text-right">
                          <span className="inline-flex items-center justify-center font-black text-rose-600 bg-rose-50 border border-rose-100 rounded px-1.5 py-0.5 min-w-[24px] text-[8.5px]">
                            {dev.pendingCount}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {topDevices.length === 0 && (
                    <tr>
                      <td colSpan={3} className="text-center py-6 text-slate-400 font-bold text-[8.5px]">
                        {lang === 'th' ? '✓ ไม่พบเครื่องค้างติดตั้งแพตช์' : '✓ No devices missing patches'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* SECTION 3: SYSTEM PENDING PATCHES DETAILS TABLE */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-end">
          <div className="flex flex-col mb-1">
            <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5 text-blue-500" />
              <span>{lang === 'th' ? '3. รายละเอียดแพตช์ระบบปฏิบัติการที่ค้างการติดตั้ง (Pending OS Patches Details)' : '3. PENDING OS PATCHES DETAILS'}</span>
            </h3>
          </div>
          
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-[9.5px] text-left">
              <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7px]">
                <tr>
                  <th className="px-4 py-2 w-[45%]">PATCH TITLE</th>
                  <th className="px-4 py-2 w-[15%]">KB / ARTICLE</th>
                  <th className="px-4 py-2 text-center w-[12%]">SEVERITY</th>
                  <th className="px-4 py-2 w-[18%]">CLASSIFICATION</th>
                  <th className="px-4 py-2 text-right w-[10%]">PENDING DEVICES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
                {pendingOSPatchesDetails.slice(0, 11).map((p, idx) => {
                  return (
                    <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-4 py-2 font-bold text-slate-800 truncate max-w-[250px]" title={p.title}>{p.title}</td>
                      <td className="px-4 py-2 font-mono text-slate-500 font-bold">{p.kbId}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`inline-flex items-center rounded px-2 py-0.5 text-[8px] font-extrabold border ${
                          p.severity === 'High' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                          p.severity === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                          'bg-slate-50 text-slate-500 border-slate-205'
                        }`}>
                          {p.severity}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-slate-550 truncate max-w-[120px]" title={p.classification}>{p.classification}</td>
                      <td className="px-4 py-2 text-right font-black text-rose-650">{p.affectedCount}</td>
                    </tr>
                  );
                })}
                {pendingOSPatchesDetails.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400 font-bold text-[9.5px]">
                      {lang === 'th' ? '✓ ยินดีด้วย! อุปกรณ์ทั้งหมดได้รับการอัปเดตครบถ้วน' : '✓ Congratulations! All devices are fully patched'}
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
