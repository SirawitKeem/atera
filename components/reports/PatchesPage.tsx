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
  CheckCircle
} from 'lucide-react';
import ReportHeader from './ReportHeader';

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
}

interface PatchesPageProps {
  pageNumber: number;
  agents: any[];
  patchData: AgentData[];
  reportPeriod: { start: string; end: string };
  totalPages?: number;
  dateRangeDisplay?: string;
}

export default function PatchesPage({
  pageNumber,
  agents,
  patchData,
  reportPeriod,
  totalPages = 9,
  dateRangeDisplay
}: PatchesPageProps) {

  const totalDevices = agents.length;
  
  // OS Distribution calculation based on real agents data
  const winPcCount = agents.filter(a => {
    const os = (a.OS || a.os || '').toLowerCase();
    const type = (a.DeviceType || a.deviceType || '').toLowerCase();
    return os.includes('win') && !os.includes('server') && !type.includes('server');
  }).length;

  const winServerCount = agents.filter(a => {
    const os = (a.OS || a.os || '').toLowerCase();
    const type = (a.DeviceType || a.deviceType || '').toLowerCase();
    return os.includes('server') || type.includes('server');
  }).length;

  const linuxCount = agents.filter(a => {
    const os = (a.OS || a.os || '').toLowerCase();
    return os.includes('linux') || os.includes('ubuntu') || os.includes('debian');
  }).length;

  // Date filter helper
  const isInRange = (dateStr?: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const start = new Date(reportPeriod.start + 'T00:00:00Z');
    const end = new Date(reportPeriod.end + 'T23:59:59Z');
    return d >= start && d <= end;
  };

  // Process Installed Patches Data
  let totalInstalled = 0;
  let securityInstalled = 0;
  let definitionInstalled = 0;
  let devicesUpdated = 0;

  const allInstalledPatches: (Patch & { agentName: string })[] = [];
  
  // OS Patches Installed count
  let winPcPatches = 0;
  let winServerPatches = 0;
  let linuxPatches = 0;

  (patchData || []).forEach(agent => {
    if (agent.installedPatches && agent.installedPatches.length > 0) {
      const filteredPatches = agent.installedPatches.filter(p => isInRange(p.installDate));
      
      if (filteredPatches.length > 0) {
        devicesUpdated++;
        totalInstalled += filteredPatches.length;
        
        filteredPatches.forEach(patch => {
          if (patch.class === 'Security Updates') securityInstalled++;
          if (patch.class === 'Definition Updates') definitionInstalled++;
          
          allInstalledPatches.push({ ...patch, agentName: agent.agentName });

          const os = (agent.os || '').toLowerCase();
          const type = (agent.deviceType || '').toLowerCase();
          
          if (os.includes('win') && !os.includes('server') && !type.includes('server')) {
            winPcPatches++;
          } else if (os.includes('server') || type.includes('server')) {
            winServerPatches++;
          } else if (os.includes('linux') || os.includes('ubuntu') || os.includes('debian')) {
            linuxPatches++;
          }
        });
      }
    }
  });

  // Sort all installed patches by date descending
  allInstalledPatches.sort((a, b) => {
    return new Date(b.installDate || '').getTime() - new Date(a.installDate || '').getTime();
  });

  // Take top 5 for the summary table
  const recentPatches = allInstalledPatches.slice(0, 5);

  // Date Formatting helper for reboot time
  const formatRebootTime = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatDateShort = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // OS Icon Helper
  const getOsIcon = (osName?: string) => {
    const cls = (osName || '').toLowerCase();
    if (cls.includes('win')) {
      return (
        <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.1zM10.8 1.95L24 0v11.55H10.8V1.95zM10.8 12.45H24v11.55l-13.2-1.95v-9.6z" />
        </svg>
      );
    }
    if (cls.includes('mac') || cls.includes('apple') || cls.includes('darwin')) {
      return (
        <svg className="w-3.5 h-3.5 text-slate-700 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z" />
        </svg>
      );
    }
    return <Terminal className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />;
  };

  // Format the report period for the header
  const formatDateDisplay = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };
  const headerSubtitle = `Operating Systems and Build Version Compliance Audit | Reporting Period: ${formatDateDisplay(reportPeriod.start)} - ${formatDateDisplay(reportPeriod.end)}`;

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
        title="OS Patches Summary" 
        subtitle={headerSubtitle} 
        dateRangeDisplay={dateRangeDisplay}
      />

      <div className="page-content space-y-4 flex-1 flex flex-col justify-between overflow-hidden mt-3">
        
        {/* SECTION 1: SYSTEM KPI CARDS */}
        <div className="grid grid-cols-4 gap-3 select-none">
          {/* Total Installed Patches */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Installed Patches</span>
              <CheckCircle className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-800 leading-none">{totalInstalled} Patches</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">Successfully Installed</p>
            </div>
          </div>

          {/* Security Updates */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Security Updates</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-emerald-600 leading-none">{securityInstalled} Updates</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">Critical & Security</p>
            </div>
          </div>

          {/* Definition Updates */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Definition Updates</span>
              <Activity className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-indigo-600 leading-none">{definitionInstalled} Updates</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">Antivirus / Malware</p>
            </div>
          </div>

          {/* Devices Updated */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Devices Updated</span>
              <Monitor className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-amber-600 leading-none">{devicesUpdated} Nodes</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">Received Updates</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: CHARTS & RECENT PATCHES */}
        <div className="grid grid-cols-5 gap-4 h-[190px] select-none">
          
          {/* Installed Patches by OS */}
          <div className="col-span-2 bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Activity className="h-4 w-4 text-blue-500" /> 1. แพทช์ที่ติดตั้งแล้วแยกตาม OS
            </h4>
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {/* Windows PC */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8.5px] font-bold text-slate-600 leading-none">
                  <span>Windows Workstation ({winPcCount})</span>
                  <span className="text-blue-600">{winPcPatches} Patches</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: totalInstalled > 0 ? `${(winPcPatches / totalInstalled) * 100}%` : '0%' }}></div>
                </div>
              </div>
              {/* Windows Server */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8.5px] font-bold text-slate-600 leading-none">
                  <span>Windows Server ({winServerCount})</span>
                  <span className="text-emerald-600">{winServerPatches} Patches</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: totalInstalled > 0 ? `${(winServerPatches / totalInstalled) * 100}%` : '0%' }}></div>
                </div>
              </div>
              {/* Linux */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8.5px] font-bold text-slate-600 leading-none">
                  <span>Linux Systems ({linuxCount})</span>
                  <span className="text-indigo-600">{linuxPatches} Patches</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: totalInstalled > 0 ? `${(linuxPatches / totalInstalled) * 100}%` : '0%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Patches List */}
          <div className="col-span-3 bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" /> 2. รายการแพทช์ที่ติดตั้งล่าสุด (Top Recent Installs)
            </h4>
            <div className="flex-1 overflow-hidden">
              {recentPatches.length > 0 ? (
                <div className="space-y-1.5 mt-1">
                  {recentPatches.map((patch, idx) => (
                    <div key={idx} className="flex items-center justify-between p-1.5 rounded-md bg-slate-50 border border-slate-100">
                      <div className="flex flex-col overflow-hidden mr-2">
                        <span className="text-[8.5px] font-bold text-slate-700 truncate" title={patch.name}>
                          {patch.kbId && patch.kbId !== 'undefined' ? `[${patch.kbId}] ${patch.name}` : patch.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[7px] font-medium text-slate-500">{patch.agentName}</span>
                          <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-sm ${
                            patch.class === 'Security Updates' ? 'bg-rose-100 text-rose-700' :
                            patch.class === 'Definition Updates' ? 'bg-indigo-100 text-indigo-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {patch.class}
                          </span>
                        </div>
                      </div>
                      <div className="text-[8px] font-bold text-slate-400 whitespace-nowrap">
                        {formatDateShort(patch.installDate)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <ShieldCheck className="h-6 w-6 mb-1 opacity-20" />
                  <p className="text-[9px] font-medium">ไม่มีการติดตั้ง Patch ในช่วงเวลาที่เลือก</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* SECTION 3: SYSTEM INVENTORY TABLE */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-end">
          <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 select-none">
            <Server className="h-3.5 w-3.5 text-blue-500" /> 3. ทะเบียนตรวจเช็ครุ่นระบบปฏิบัติการ (Operating System Build Registry)
          </h3>
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
              <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px]">
                <tr>
                  <th className="px-4 py-2 w-[30%]">DEVICE NAME</th>
                  <th className="px-4 py-2 w-[35%]">OPERATING SYSTEM NAME</th>
                  <th className="px-4 py-2 text-center w-[12%]">OS BUILD</th>
                  <th className="px-4 py-2 text-center w-[13%]">LAST REBOOT</th>
                  <th className="px-4 py-2 text-right w-[10%]">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
                {agents.slice(0, 7).map((a, idx) => {
                  const name = a.MachineName || a.name || 'N/A';
                  const os = a.OS || a.os || 'Windows';
                  const build = a.OSBuild || a.osBuild || 'N/A';
                  const reboot = a.LastRebootTime || a.lastReboot || '';
                  const isOnline = a.Online === true || a.online === true || String(a.Online).toLowerCase() === 'true';

                  return (
                    <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-4 py-2 font-bold text-slate-800 flex items-center gap-2">
                        {getOsIcon(os)}
                        <span className="truncate max-w-[120px]">{name}</span>
                      </td>
                      <td className="px-4 py-2 text-slate-500 truncate max-w-[200px]" title={os}>{os}</td>
                      <td className="px-4 py-2 text-center font-mono text-slate-400">{build}</td>
                      <td className="px-4 py-2 text-center font-mono text-slate-400">{formatRebootTime(reboot)}</td>
                      <td className="px-4 py-2 text-right">
                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8.5px] font-extrabold border ${
                          isOnline 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' 
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}>
                          {isOnline ? 'Online' : 'Offline'}
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
        <span>หน้า {pageNumber} จาก {totalPages}</span>
      </div>
    </div>
  );
}
