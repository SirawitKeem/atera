'use client';

import React from 'react'; 
import { 
  ShieldAlert, 
  Terminal,
  Activity,
  Server,
  Laptop,
  Cpu,
  Monitor,
  CheckCircle,
  Info,
  XCircle,
  Building2,
  AlertTriangle,
  ShieldX
} from 'lucide-react';
import ReportHeader from './ReportHeader';
import { translations } from '@/lib/translations';

interface CVEPageProps {
  pageNumber: number;
  agents: any[];
  patchData: any[];
  cveData: {
    kbCveMap: Record<string, any[]>;
    cveCache: any;
  };
  reportPeriod: { start: string; end: string };
  totalPages?: number;
  dateRangeDisplay?: string;
  lang?: string;
  companyName?: string;
}

export default function CVEPage({
  pageNumber,
  agents,
  patchData,
  cveData,
  reportPeriod,
  totalPages = 8,
  dateRangeDisplay,
  lang = 'th',
  companyName = 'Atera Client'
}: CVEPageProps) {
  const t = translations[lang as 'th' | 'en'] || translations.th;

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // 1. Group by unique KB globally, tracking affected devices and its max CVE score/severity
  const kbMap = new Map<string, {
    kbId: string;
    score: number;
    severity: string;
    affectedDevices: Set<string>;
    cveIds: Set<string>;
  }>();

  // 2. Track per-device metrics for the table
  const deviceRiskProfile = new Map<string, {
    deviceName: string;
    deviceType: string;
    os: string;
    totalAvailablePatches: number;
    pendingPatchesWithCve: Set<string>; // Set of KB IDs
    uniqueCveIds: Map<string, string>; // Map of cveId -> level
  }>();

  // Process data from patchData (which represents available/pending patches from getAvailablePatches)
  (patchData || []).forEach((agent: any) => {
    const available = (agent.availablePatches || []).filter((patch: any) => {
      const status = String(patch.status || '').toLowerCase();
      return !status || status === 'available' || status === 'pending';
    });

    if (!available.length) return;

    const deviceName = String(agent.agentName || 'Agent');
    const deviceType = String(agent.deviceType || '');
    const os = String(agent.os || '');
    const totalAvailablePatches = available.length;

    available.forEach((patch: any) => {
      const kbId = String(patch.kbId || patch.KBID || '');
      if (!kbId) return;

      // Only include patches that map to CVEs
      const cveRecords = cveData?.kbCveMap?.[kbId] || [];
      if (!cveRecords.length) return;

      // Initialize device profile if not exists
      if (!deviceRiskProfile.has(deviceName)) {
        deviceRiskProfile.set(deviceName, {
          deviceName,
          deviceType,
          os,
          totalAvailablePatches,
          pendingPatchesWithCve: new Set(),
          uniqueCveIds: new Map()
        });
      }

      const profile = deviceRiskProfile.get(deviceName)!;
      profile.pendingPatchesWithCve.add(kbId);

      // Initialize global KB map entry if not exists
      if (!kbMap.has(kbId)) {
        kbMap.set(kbId, {
          kbId,
          score: 0,
          severity: 'Low',
          affectedDevices: new Set(),
          cveIds: new Set()
        });
      }

      const kbEntry = kbMap.get(kbId)!;
      kbEntry.affectedDevices.add(deviceName);

      cveRecords.forEach((cve: any) => {
        const cveId = String(cve.cveId || 'N/A');
        const score = Number(cve.baseScore || 0);
        const severity = String(cve.level || cve.severity || 'Low');

        // Track max score and severity for this KB
        if (score > kbEntry.score) {
          kbEntry.score = score;
        }
        kbEntry.cveIds.add(cveId);

        // Add to device unique CVE list
        profile.uniqueCveIds.set(cveId, severity);
      });
    });
  });

  // Calculate KB severity based on its max score
  kbMap.forEach((entry) => {
    if (entry.score >= 9.0) entry.severity = 'Critical';
    else if (entry.score >= 7.0) entry.severity = 'Important';
    else if (entry.score >= 4.0) entry.severity = 'Moderate';
    else if (entry.score > 0) entry.severity = 'Low';
    else entry.severity = 'None';
  });

  const allKbs = Array.from(kbMap.values());

  // Sort helper: score descending, then by number of affected devices descending, then KB ID alphabetically
  const sortKbs = (a: any, b: any) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.affectedDevices.size !== a.affectedDevices.size) return b.affectedDevices.size - a.affectedDevices.size;
    return a.kbId.localeCompare(b.kbId);
  };

  const criticalKbs = allKbs.filter(k => k.severity === 'Critical').sort(sortKbs);
  const importantKbs = allKbs.filter(k => k.severity === 'Important').sort(sortKbs);
  const moderateLowKbs = allKbs.filter(k => k.severity === 'Moderate' || k.severity === 'Low').sort(sortKbs);

  // Calculate unique CVE IDs globally for each severity level to show in the header badges
  const criticalCveIds = new Set<string>();
  criticalKbs.forEach(kb => kb.cveIds.forEach(id => criticalCveIds.add(id)));

  const importantCveIds = new Set<string>();
  importantKbs.forEach(kb => kb.cveIds.forEach(id => importantCveIds.add(id)));

  const moderateLowCveIds = new Set<string>();
  moderateLowKbs.forEach(kb => kb.cveIds.forEach(id => moderateLowCveIds.add(id)));

  // Global metric totals for top summary cards
  const totalVulnerableDevices = deviceRiskProfile.size;
  const totalSecurityPatches = allKbs.length;
  const totalActiveCves = criticalCveIds.size + importantCveIds.size + moderateLowCveIds.size;
  const totalCriticalCves = criticalCveIds.size;

  // Transform vulnerable devices profile to array and sort by critical desc, total CVE desc
  const vulnerableDevices = Array.from(deviceRiskProfile.values()).map(profile => {
    let critCount = 0;
    let impCount = 0;
    
    profile.uniqueCveIds.forEach((level) => {
      if (level === 'Critical') critCount++;
      if (level === 'Important') impCount++;
    });

    return {
      deviceName: profile.deviceName,
      deviceType: profile.deviceType,
      os: profile.os,
      pendingPatches: profile.totalAvailablePatches,
      patchesWithCve: profile.pendingPatchesWithCve.size,
      totalCves: profile.uniqueCveIds.size,
      criticalCves: critCount,
      importantCves: impCount
    };
  }).sort((a, b) => {
    if (b.criticalCves !== a.criticalCves) return b.criticalCves - a.criticalCves;
    if (b.totalCves !== a.totalCves) return b.totalCves - a.totalCves;
    return b.pendingPatches - a.pendingPatches;
  });

  const headerSubtitle = lang === 'th' ? 'รายงาน CVE / CVSS ของ OS Patch ที่ยังค้างอัปเดต' : 'OS Patch CVE / CVSS Summary for pending updates';

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
        title={lang === 'th' ? 'OS Patch CVE / CVSS' : 'OS Patch CVE / CVSS'}
        subtitle={headerSubtitle}
        lang={lang}
        dateRangeDisplay={dateRangeDisplay}
      />

      <div className="page-content space-y-2.5 flex-1 flex flex-col justify-between overflow-hidden mt-2.5">
        
        {/* KPI SUMMARY ROW */}
        <div className="grid grid-cols-4 gap-2.5">
          {/* Card 1: Vulnerable Devices */}
          <div className="bg-white border border-slate-100 rounded-xl p-3.5 flex flex-col justify-between shadow-xs h-[78px]">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'อุปกรณ์ที่มีช่องโหว่' : 'VULNERABLE DEVICES'}
              </span>
              <Server className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-800 leading-none">
                <span className="text-blue-700">{totalVulnerableDevices}</span>{' '}
                <span className="text-[12px] font-bold text-slate-500">{lang === 'th' ? 'เครื่อง' : 'Devices'}</span>
              </h4>
            </div>
          </div>

          {/* Card 2: Security KB Patches */}
          <div className="bg-white border border-slate-100 rounded-xl p-3.5 flex flex-col justify-between shadow-xs h-[78px]">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'แพตช์ความปลอดภัย (KBs)' : 'SECURITY PATCHES (KBS)'}
              </span>
              <ShieldAlert className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-800 leading-none">
                <span className="text-amber-700">{totalSecurityPatches}</span>{' '}
                <span className="text-[12px] font-bold text-slate-500">{lang === 'th' ? 'รายการ' : 'Patches'}</span>
              </h4>
            </div>
          </div>

          {/* Card 3: Total Active CVEs */}
          <div className="bg-white border border-slate-100 rounded-xl p-3.5 flex flex-col justify-between shadow-xs h-[78px]">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'CVE ทั้งหมดที่พบ' : 'TOTAL ACTIVE CVES'}
              </span>
              <Activity className="h-4 w-4 text-indigo-500" />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-800 leading-none">
                <span className="text-indigo-700">{totalActiveCves}</span>{' '}
                <span className="text-[12px] font-bold text-slate-500">CVEs</span>
              </h4>
            </div>
          </div>

          {/* Card 4: Critical CVEs */}
          <div className="bg-white border border-slate-100 rounded-xl p-3.5 flex flex-col justify-between shadow-xs h-[78px]">
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'CVE ระดับวิกฤต (9.0+)' : 'CRITICAL CVES (9.0+)'}
              </span>
              <XCircle className="h-4 w-4 text-rose-500" />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-800 leading-none">
                <span className="text-rose-700">{totalCriticalCves}</span>{' '}
                <span className="text-[12px] font-bold text-slate-500">CVEs</span>
              </h4>
            </div>
          </div>
        </div>

        {/* SECTION 1: ACTIVE CVES GROUPED BY SEVERITY (SEPARATE CARDS) */}
        <div className="space-y-2 flex-1 flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between">
            <h4 className="text-[9.5px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="h-4 w-4 text-blue-600" />
              <span>{lang === 'th' ? 'ช่องโหว่ความเสี่ยงแยกตามระดับความรุนแรง (Active CVEs Grouped by Severity)' : 'Active CVEs Grouped by Severity'}</span>
            </h4>
            <span className="text-[8px] font-semibold text-slate-400">
              * {lang === 'th' ? 'แพตช์ OS 1 รายการอาจครอบคลุมหลายช่องโหว่ CVE' : '1 OS Patch (KB) may address multiple CVEs'}
            </span>
          </div>

          <div className="space-y-2 flex-1 flex flex-col justify-between overflow-hidden">
            
            {/* Box 1: Critical Severity Vulnerabilities (CVSS 9.0+) */}
            <div className="border border-rose-200 bg-rose-50/20 rounded-xl p-3 space-y-1">
              <div className="flex items-center justify-between pb-1 border-b border-rose-100">
                <div className="flex items-center gap-1.5">
                  <XCircle className="h-3.5 w-3.5 text-rose-600" />
                  <span className="text-[9.5px] font-extrabold text-slate-800 tracking-tight">
                    {lang === 'th' ? 'ช่องโหว่ระดับวิกฤต (Critical Severity Vulnerabilities: CVSS 9.0+)' : 'Critical Severity Vulnerabilities (CVSS 9.0+)'}
                  </span>
                </div>
                <span className="bg-rose-100 text-rose-800 border border-rose-200 font-black text-[8.5px] px-2.5 py-0.5 rounded-full">
                  {criticalCveIds.size} CVEs ({criticalKbs.length} {criticalKbs.length > 1 ? 'Patches' : 'Patch'})
                </span>
              </div>
              <div className="space-y-1 pt-1">
                {criticalKbs.slice(0, 4).map((kb, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-[9px] py-0.5 border-b border-dashed border-rose-100/60 last:border-b-0">
                    <span className="font-mono font-bold text-slate-900 w-24 flex-shrink-0">{kb.kbId}</span>
                    <span className="inline-flex justify-center font-black text-rose-700 bg-rose-50 border border-rose-200 rounded px-1.5 w-8 text-center flex-shrink-0">
                      {kb.score.toFixed(1)}
                    </span>
                    <span className="text-slate-500 font-bold w-16 flex-shrink-0">
                      {kb.affectedDevices.size} {kb.affectedDevices.size > 1 ? 'Devices' : 'Device'}
                    </span>
                    <div className="flex flex-wrap gap-1 items-center flex-1 overflow-hidden">
                      {Array.from(kb.affectedDevices).slice(0, 4).map((dev, dIdx) => (
                        <span key={dIdx} className="inline-flex rounded border border-rose-200 bg-white text-rose-700 text-[8px] font-bold px-1.5 py-0.1">
                          {dev}
                        </span>
                      ))}
                      {kb.affectedDevices.size > 4 && (
                        <span className="text-[8px] text-slate-400 font-bold pl-0.5">
                          +{kb.affectedDevices.size - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {criticalKbs.length === 0 && (
                  <div className="text-[8.5px] text-emerald-600 font-bold py-0.5 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>{lang === 'th' ? 'ไม่พบช่องโหว่ระดับวิกฤตค้างอัปเดต' : 'No active critical vulnerabilities'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Box 2: Important Severity Vulnerabilities (CVSS 7.0 - 8.9) */}
            <div className="border border-amber-200 bg-amber-50/20 rounded-xl p-3 space-y-1">
              <div className="flex items-center justify-between pb-1 border-b border-amber-100">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  <span className="text-[9.5px] font-extrabold text-slate-800 tracking-tight">
                    {lang === 'th' ? 'ช่องโหว่ระดับสำคัญ (Important Severity Vulnerabilities: CVSS 7.0 - 8.9)' : 'Important Severity Vulnerabilities (CVSS 7.0 - 8.9)'}
                  </span>
                </div>
                <span className="bg-amber-100 text-amber-800 border border-amber-200 font-black text-[8.5px] px-2.5 py-0.5 rounded-full">
                  {importantCveIds.size} CVEs ({importantKbs.length} {importantKbs.length > 1 ? 'Patches' : 'Patch'})
                </span>
              </div>
              <div className="space-y-1 pt-1">
                {importantKbs.slice(0, 4).map((kb, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-[9px] py-0.5 border-b border-dashed border-amber-100/60 last:border-b-0">
                    <span className="font-mono font-bold text-slate-900 w-24 flex-shrink-0">{kb.kbId}</span>
                    <span className="inline-flex justify-center font-black text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 w-8 text-center flex-shrink-0">
                      {kb.score.toFixed(1)}
                    </span>
                    <span className="text-slate-500 font-bold w-16 flex-shrink-0">
                      {kb.affectedDevices.size} {kb.affectedDevices.size > 1 ? 'Devices' : 'Device'}
                    </span>
                    <div className="flex flex-wrap gap-1 items-center flex-1 overflow-hidden">
                      {Array.from(kb.affectedDevices).slice(0, 4).map((dev, dIdx) => (
                        <span key={dIdx} className="inline-flex rounded border border-amber-200 bg-white text-amber-700 text-[8px] font-bold px-1.5 py-0.1">
                          {dev}
                        </span>
                      ))}
                      {kb.affectedDevices.size > 4 && (
                        <span className="text-[8px] text-slate-400 font-bold pl-0.5">
                          +{kb.affectedDevices.size - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {importantKbs.length === 0 && (
                  <div className="text-[8.5px] text-emerald-600 font-bold py-0.5 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>{lang === 'th' ? 'ไม่พบช่องโหว่ระดับสำคัญค้างอัปเดต' : 'No active important vulnerabilities'}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Box 3: Moderate & Low Severity Vulnerabilities (CVSS < 7.0) */}
            <div className="border border-slate-200 bg-slate-50/40 rounded-xl p-3 space-y-1">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
                <div className="flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-slate-500" />
                  <span className="text-[9.5px] font-extrabold text-slate-800 tracking-tight">
                    {lang === 'th' ? 'ช่องโหว่ระดับปานกลางและต่ำ (Moderate & Low Severity Vulnerabilities: CVSS < 7.0)' : 'Moderate & Low Severity Vulnerabilities (CVSS < 7.0)'}
                  </span>
                </div>
                <span className="bg-slate-100 text-slate-800 border border-slate-200 font-black text-[8.5px] px-2.5 py-0.5 rounded-full">
                  {moderateLowCveIds.size} CVEs ({moderateLowKbs.length} {moderateLowKbs.length > 1 ? 'Patches' : 'Patch'})
                </span>
              </div>
              <div className="space-y-1 pt-1">
                {moderateLowKbs.slice(0, 2).map((kb, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-[9px] py-0.5 border-b border-dashed border-slate-200/60 last:border-b-0">
                    <span className="font-mono font-bold text-slate-900 w-24 flex-shrink-0">{kb.kbId}</span>
                    <span className="inline-flex justify-center font-black text-slate-700 bg-slate-100 border border-slate-200 rounded px-1.5 w-8 text-center flex-shrink-0">
                      {kb.score.toFixed(1)}
                    </span>
                    <span className="text-slate-500 font-bold w-16 flex-shrink-0">
                      {kb.affectedDevices.size} {kb.affectedDevices.size > 1 ? 'Devices' : 'Device'}
                    </span>
                    <div className="flex flex-wrap gap-1 items-center flex-1 overflow-hidden">
                      {Array.from(kb.affectedDevices).slice(0, 4).map((dev, dIdx) => (
                        <span key={dIdx} className="inline-flex rounded border border-slate-300 bg-white text-slate-700 text-[8px] font-bold px-1.5 py-0.1">
                          {dev}
                        </span>
                      ))}
                      {kb.affectedDevices.size > 4 && (
                        <span className="text-[8px] text-slate-400 font-bold pl-0.5">
                          +{kb.affectedDevices.size - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {moderateLowKbs.length === 0 && (
                  <div className="text-[8.5px] text-emerald-600 font-bold py-0.5 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-emerald-500" />
                    <span>{lang === 'th' ? 'ไม่พบช่องโหว่ระดับปานกลาง/ต่ำค้างอัปเดต' : 'No active moderate or low vulnerabilities'}</span>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: VULNERABLE MONITORED DEVICES (RISK PROFILE) */}
        <div className="space-y-1 flex-1 flex flex-col justify-end overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-[9.5px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Server className="h-4 w-4 text-blue-500" />
              <span>{lang === 'th' ? 'ข้อมูลความเสี่ยงของอุปกรณ์ที่เฝ้าระวัง (Vulnerable Monitored Devices: Risk Profile)' : 'Vulnerable Monitored Devices (Risk Profile)'}</span>
            </h3>
          </div>

          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-[9.5px] text-left">
              <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7px]">
                <tr>
                  <th className="px-3 py-1.5 w-[30%]">{lang === 'th' ? 'ชื่ออุปกรณ์' : 'DEVICE NAME'}</th>
                  <th className="px-3 py-1.5 w-[25%]">{lang === 'th' ? 'ประเภทอุปกรณ์' : 'DEVICE TYPE'}</th>
                  <th className="px-3 py-1.5 text-center w-[18%]">{lang === 'th' ? 'แพตช์ค้างติดตั้ง' : 'PENDING PATCHES'}</th>
                  <th className="px-3 py-1.5 text-center w-[14%]">{lang === 'th' ? 'CVE ทั้งหมด' : 'TOTAL CVES'}</th>
                  <th className="px-3 py-1.5 text-center w-[13%]">{lang === 'th' ? 'ระดับวิกฤต' : 'CRITICAL CVES'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
                {vulnerableDevices.slice(0, 5).map((dev, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                    <td className="px-3 py-1 font-bold text-slate-800">{dev.deviceName}</td>
                    <td className="px-3 py-1 text-slate-500 font-bold">{dev.deviceType}</td>
                    <td className="px-3 py-1 text-center font-bold text-slate-800">
                      <span className="inline-flex items-center justify-center font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded px-1.5 min-w-[22px] text-[8.5px]">
                        {dev.pendingPatches}
                      </span>
                    </td>
                    <td className="px-3 py-1 text-center font-black text-indigo-700">{dev.totalCves}</td>
                    <td className="px-3 py-1 text-center">
                      {dev.criticalCves > 0 ? (
                        <span className="inline-flex items-center justify-center font-black text-rose-700 bg-rose-50 border border-rose-200 rounded min-w-[22px] px-1 h-4 text-[8.5px]">
                          {dev.criticalCves}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-bold">-</span>
                      )}
                    </td>
                  </tr>
                ))}
                {vulnerableDevices.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-slate-400 font-bold text-[9px]">
                      {lang === 'th' ? '✓ ไม่พบอุปกรณ์ที่มีช่องโหว่ค้างอัปเดต' : '✓ No vulnerable devices found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="text-[7.5px] text-slate-400 italic text-right">
            * {lang === 'th' ? 'PENDING PATCHES แสดงจำนวนแพตช์ OS ทั้งหมดที่ค้างอัปเดต | 1 แพตช์ (KB) ครอบคลุมหลายช่องโหว่ CVE' : 'PENDING PATCHES shows total pending OS updates. 1 patch (KB) addresses 1+ CVE vulnerabilities.'}
          </p>
        </div>

      </div>

      <div className="page-footer text-[9px] text-slate-400 font-semibold border-t border-slate-100/60 pt-2 mt-2 flex justify-between">
        <span>Generated from Atera API v3 | Powered by Ally Assist</span>
        <span>
          {lang === 'th' ? `หน้า ${pageNumber} จาก ${totalPages}` : `Page ${pageNumber} of ${totalPages}`}
        </span>
      </div>
    </div>
  );
}
