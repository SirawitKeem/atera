'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Terminal,
  Activity,
  Server,
  Laptop,
  Cpu,
  Monitor,
  CheckCircle,
  ShieldAlert
} from 'lucide-react';
import ReportHeader from './ReportHeader';
import { translations } from '@/lib/translations';
import DeviceTypeIcon from './DeviceTypeIcon';

interface Patch {
  name: string;
  class: string;
  kbId: string;
  installDate?: string;
}

interface AgentData {
  agentName: string;
  deviceGuid: string;
  os: string;
  deviceType: string;
  installedPatches?: Patch[];
  availablePatches?: any[];
}

interface PatchesPageProps {
  pageNumber: number;
  agents: any[];
  patchData: AgentData[];
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
  
  // Process Available (Missing) Patches
  const missingPatchesList: {
    deviceName: string;
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
          deviceType: agent.deviceType || 'Workstation',
          os: agent.os || 'Windows',
          kbId: patch.kbId || patch.KBID || 'N/A',
          title: patch.name || patch.Title || 'Unknown Update',
          classification: patch.class || patch.PatchClassification || 'Other Updates'
        });
      });
    }
  });

  const totalMissingUpdates = missingPatchesList.length;
  const uniqueDevicesNeedingUpdates = Array.from(new Set(missingPatchesList.map(p => p.deviceName)));
  const totalDevicesNeedingUpdates = uniqueDevicesNeedingUpdates.length;

  // Group devices needing updates by Device Type
  const serverNeedingCount = patchData.filter(p => {
    if ((p.availablePatches || []).length === 0) return false;
    const type = String(p.deviceType || '').toLowerCase();
    const os = String(p.os || '').toLowerCase();
    return type.includes('server') || os.includes('server');
  }).length;

  const workstationNeedingCount = patchData.filter(p => {
    if ((p.availablePatches || []).length === 0) return false;
    const type = String(p.deviceType || '').toLowerCase();
    const os = String(p.os || '').toLowerCase();
    return !type.includes('server') && !os.includes('server') && !os.includes('linux');
  }).length;

  const linuxNeedingCount = patchData.filter(p => {
    if ((p.availablePatches || []).length === 0) return false;
    const os = String(p.os || '').toLowerCase();
    return os.includes('linux') || os.includes('ubuntu') || os.includes('debian');
  }).length;

  // Calculate missing patches counts per device type
  const workstationMissingPatches = missingPatchesList.filter(p => !p.deviceType.toLowerCase().includes('server') && !p.os.toLowerCase().includes('linux')).length;
  const serverMissingPatches = missingPatchesList.filter(p => p.deviceType.toLowerCase().includes('server') || p.os.toLowerCase().includes('server')).length;
  const linuxMissingPatches = missingPatchesList.filter(p => p.os.toLowerCase().includes('linux') || p.os.toLowerCase().includes('ubuntu')).length;

  // Group devices by number of pending patches and sort descending
  const devicesRanking = (patchData || [])
    .map((agent: any) => {
      const count = (agent.availablePatches || []).length;
      return {
        name: agent.agentName || 'Agent',
        deviceType: agent.deviceType || 'Workstation',
        os: agent.os || 'Windows',
        count
      };
    })
    .filter(d => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const securityMissingCount = missingPatchesList.filter(p => p.classification === 'Security Updates').length;
  const criticalMissingCount = missingPatchesList.filter(p => p.classification === 'Critical Updates').length;
  const otherMissingCount = totalMissingUpdates - securityMissingCount - criticalMissingCount;

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formattedPeriod = `${formatDateDisplay(reportPeriod.start)} - ${formatDateDisplay(reportPeriod.end)}`;
  const headerSubtitle = `${t.patchesSubtitle} | Client: ${companyName} | Period: ${dateRangeDisplay || formattedPeriod}`;

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

      <div className="page-content space-y-4 flex-1 flex flex-col justify-between overflow-hidden mt-3">
        
        {/* SECTION 1: SYSTEM KPI CARDS */}
        <div className="grid grid-cols-4 gap-3 select-none">
          {/* Total Pending Patches */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'จำนวนแพตช์ค้างติดตั้ง' : 'Total Pending Patches'}
              </span>
              <CheckCircle className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800 leading-none">
                {lang === 'th' ? `${totalMissingUpdates} อัปเดต` : `${totalMissingUpdates} Updates`}
              </h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? 'ค้างอัปเดตสะสม' : 'Pending OS Updates'}
              </p>
            </div>
          </div>

          {/* Devices Needing Action */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'อุปกรณ์ที่ค้างการอัปเดต' : 'Devices Needing Patches'}
              </span>
              <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-rose-600 leading-none">
                {lang === 'th' ? `${totalDevicesNeedingUpdates} เครื่อง` : `${totalDevicesNeedingUpdates} Devices`}
              </h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? 'ต้องได้รับการติดตั้ง' : 'Action Required'}
              </p>
            </div>
          </div>

          {/* Servers Needing Patches */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'เซิร์ฟเวอร์ที่ค้างอัปเดต' : 'Servers Needing Patches'}
              </span>
              <Server className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800 leading-none">
                {lang === 'th' ? `${serverNeedingCount} เครื่อง` : `${serverNeedingCount} Servers`}
              </h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? `เซิร์ฟเวอร์ค้าง Patch` : 'Servers Pending'}
              </p>
            </div>
          </div>

          {/* Workstations Needing Patches */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'เครื่องผู้ใช้ทั่วไปที่ค้าง' : 'Workstations Pending'}
              </span>
              <Laptop className="h-3.5 w-3.5 text-sky-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800 leading-none">
                {lang === 'th' ? `${workstationNeedingCount} เครื่อง` : `${workstationNeedingCount} Workstations`}
              </h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? 'เครื่องทั่วไปค้าง Patch' : 'Workstations Pending'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: CHARTS & PENDING PATCHES */}
        <div className="grid grid-cols-5 gap-4 h-[190px] select-none">
          
          {/* Top Devices Needing Updates */}
          <div className="col-span-2 bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Activity className="h-4 w-4 text-rose-500" /> {lang === 'th' ? '1. อุปกรณ์ที่ค้างติดตั้งสะสมสูงสุด (Top Devices Needing Updates)' : '1. TOP DEVICES NEEDING UPDATES'}
            </h4>
            <div className="space-y-2 flex-1 flex flex-col justify-center overflow-hidden">
              {devicesRanking.map((dev, idx) => {
                const percentage = totalMissingUpdates > 0 ? Math.round((dev.count / totalMissingUpdates) * 100) : 0;
                return (
                  <div key={idx} className="space-y-0.5">
                    <div className="flex justify-between text-[8px] font-bold text-slate-600 leading-none">
                      <span className="flex items-center gap-1">
                        <DeviceTypeIcon deviceType={dev.deviceType} os={dev.os} className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate max-w-[100px]">{dev.name}</span>
                      </span>
                      <span className="text-rose-600">
                        {lang === 'th' ? `${dev.count} แพตช์ (${percentage}%)` : `${dev.count} Patches (${percentage}%)`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
              {devicesRanking.length === 0 && (
                <div className="text-center py-6 text-slate-400 font-bold text-[8.5px]">
                  {lang === 'th' ? '✓ ไม่พบเครื่องค้างติดตั้งแพตช์' : '✓ No devices missing patches'}
                </div>
              )}
            </div>
          </div>

          {/* Pending Patches Breakdown */}
          <div className="col-span-3 bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" /> {lang === 'th' ? '2. สัดส่วนประเภทและระดับความสำคัญของแพตช์ที่ค้าง' : '2. PENDING PATCHES BREAKDOWN'}
            </h4>
            <div className="grid grid-cols-2 gap-4 flex-1 items-center overflow-hidden">
              {/* Left Column: Device Type Breakdown */}
              <div className="space-y-2">
                <p className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {lang === 'th' ? 'แยกตามประเภทเครื่อง (Device Type)' : 'By Device Type'}
                </p>
                {/* Workstations */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[8px] font-bold text-slate-500 leading-none">
                    <span>Workstations</span>
                    <span>{workstationMissingPatches}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: totalMissingUpdates > 0 ? `${(workstationMissingPatches / totalMissingUpdates) * 100}%` : '0%' }}></div>
                  </div>
                </div>
                {/* Servers */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[8px] font-bold text-slate-500 leading-none">
                    <span>Servers</span>
                    <span>{serverMissingPatches}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full rounded-full" style={{ width: totalMissingUpdates > 0 ? `${(serverMissingPatches / totalMissingUpdates) * 100}%` : '0%' }}></div>
                  </div>
                </div>
                {/* Linux */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[8px] font-bold text-slate-500 leading-none">
                    <span>Linux / Others</span>
                    <span>{linuxMissingPatches}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: totalMissingUpdates > 0 ? `${(linuxMissingPatches / totalMissingUpdates) * 100}%` : '0%' }}></div>
                  </div>
                </div>
              </div>

              {/* Right Column: Severity Breakdown */}
              <div className="space-y-2 border-l border-slate-105 pl-4">
                <p className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider">
                  {lang === 'th' ? 'แยกตามระดับความสำคัญ (Severity)' : 'By Classification'}
                </p>
                {/* Security Updates */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[8px] font-bold text-slate-500 leading-none">
                    <span>Security Updates</span>
                    <span className="text-rose-600">{securityMissingCount}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full" style={{ width: totalMissingUpdates > 0 ? `${(securityMissingCount / totalMissingUpdates) * 100}%` : '0%' }}></div>
                  </div>
                </div>
                {/* Critical Updates */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[8px] font-bold text-slate-500 leading-none">
                    <span>Critical Updates</span>
                    <span className="text-orange-500">{criticalMissingCount}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: totalMissingUpdates > 0 ? `${(criticalMissingCount / totalMissingUpdates) * 100}%` : '0%' }}></div>
                  </div>
                </div>
                {/* Other Updates */}
                <div className="space-y-0.5">
                  <div className="flex justify-between text-[8px] font-bold text-slate-500 leading-none">
                    <span>Other Updates</span>
                    <span>{otherMissingCount}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-slate-400 h-full rounded-full" style={{ width: totalMissingUpdates > 0 ? `${(otherMissingCount / totalMissingUpdates) * 100}%` : '0%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* SECTION 3: SYSTEM PENDING PATCHES TABLE */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-end">
          <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 select-none">
            <Server className="h-3.5 w-3.5 text-blue-500" /> {lang === 'th' ? '3. บันทึกรายละเอียดอุปกรณ์และแพตช์ที่ค้างอัปเดต (Pending OS Patches Registry)' : '3. PENDING OS PATCHES REGISTRY'}
          </h3>
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
              <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px]">
                <tr>
                  <th className="px-4 py-2 w-[22%]">{lang === 'th' ? 'ชื่ออุปกรณ์' : 'DEVICE NAME'}</th>
                  <th className="px-4 py-2 w-[18%]">{lang === 'th' ? 'ประเภทเครื่อง' : 'DEVICE TYPE'}</th>
                  <th className="px-4 py-2 text-center w-[12%]">KB ID</th>
                  <th className="px-4 py-2 w-[33%]">{lang === 'th' ? 'ชื่อแพตช์ที่ค้างติดตั้ง' : 'PENDING PATCH NAME'}</th>
                  <th className="px-4 py-2 text-right w-[15%]">{lang === 'th' ? 'ประเภทอัปเดต' : 'CLASSIFICATION'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
                {missingPatchesList.slice(0, 7).map((p, idx) => {
                  return (
                    <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-4 py-2 font-bold text-slate-800 flex items-center gap-2">
                        <DeviceTypeIcon deviceType={p.deviceType} os={p.os} className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate max-w-[120px]">{p.deviceName}</span>
                      </td>
                      <td className="px-4 py-2 text-slate-400 font-bold uppercase text-[8px]">{p.deviceType}</td>
                      <td className="px-4 py-2 text-center font-mono text-slate-500 font-bold">{p.kbId}</td>
                      <td className="px-4 py-2 text-slate-650 truncate max-w-[200px]" title={p.title}>{p.title}</td>
                      <td className="px-4 py-2 text-right">
                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8px] font-extrabold border ${
                          p.classification === 'Security Updates' ? 'bg-[#ffebee] text-red-700 border-red-200' : 
                          p.classification === 'Critical Updates' ? 'bg-[#fff3e0] text-orange-700 border-orange-200' :
                          'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                          {p.classification}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {missingPatchesList.length === 0 && (
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
      <div className="page-footer text-[9px] text-slate-400 font-semibold border-t border-slate-100/60 pt-3 mt-3 select-none flex justify-between">
        <span>Generated from Atera API v3 | Powered by Power BI Report Builder | Confidential</span>
        <span>
          {lang === 'th' ? `หน้า ${pageNumber} จาก ${totalPages}` : `Page ${pageNumber} of ${totalPages}`}
        </span>
      </div>
    </div>
  );
}
