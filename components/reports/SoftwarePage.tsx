'use client';

import React from 'react';
import { 
  Download, 
  Shield, 
  RefreshCw, 
  Monitor,
  CheckCircle
} from 'lucide-react';
import ReportHeader from './ReportHeader';
import { translations } from '@/lib/translations';

interface Patch {
  name: string;
  class: string;
  kbId: string;
  status: string;
}

interface AgentData {
  agentName: string;
  deviceGuid: string;
  os: string;
  deviceType: string;
  availablePatches: Patch[];
}

interface SoftwarePageProps {
  pageNumber: number;
  patchData: AgentData[];
  reportPeriod: { start: string; end: string };
  totalPages?: number;
  dateRangeDisplay?: string;
  lang?: string;
  companyName?: string;
}

export default function SoftwarePage({
  pageNumber,
  patchData,
  reportPeriod,
  totalPages = 9,
  dateRangeDisplay,
  lang = 'th',
  companyName = 'Atera Client'
}: SoftwarePageProps) {
  const t = translations[lang as 'th' | 'en'] || translations.th;

  // KPI Calculations
  let totalAvailableUpdates = 0;
  let securityUpdates = 0;
  let definitionUpdates = 0;
  
  const agentsWithUpdates = patchData.filter(agent => {
    if (agent.availablePatches && agent.availablePatches.length > 0) {
      totalAvailableUpdates += agent.availablePatches.length;
      
      agent.availablePatches.forEach(patch => {
        if (patch.class === 'Security Updates') securityUpdates++;
        if (patch.class === 'Definition Updates') definitionUpdates++;
      });
      
      return true;
    }
    return false;
  });

  const devicesNeedingUpdates = agentsWithUpdates.length;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formattedPeriod = `${formatDate(reportPeriod.start)} - ${formatDate(reportPeriod.end)}`;

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
        title={t.softwareTitle} 
        subtitle={`${t.softwareSubtitle} | Client: ${companyName} | Period: ${dateRangeDisplay || 'N/A'}`} 
        lang={lang}
        dateRangeDisplay={dateRangeDisplay}
      />

      <div className="page-content space-y-4 flex-1 flex flex-col justify-start overflow-hidden mt-3">
        
        {/* SECTION 1: SYSTEM KPI CARDS */}
        <div className="grid grid-cols-4 gap-3 select-none">
          {/* Total Available Updates */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'อัปเดตที่พร้อมใช้งานทั้งหมด' : 'Total Available Updates'}
              </span>
              <Download className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-indigo-600 leading-none">
                {lang === 'th' ? `${totalAvailableUpdates} อัปเดต` : `${totalAvailableUpdates} Updates`}
              </h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? 'อัปเดตทั้งหมดที่รอการติดตั้ง' : 'Pending updates to install'}
              </p>
            </div>
          </div>

          {/* Security Updates */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'อัปเดตความปลอดภัย' : 'Security Updates'}
              </span>
              <Shield className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-blue-600 leading-none">
                {lang === 'th' ? `${securityUpdates} อัปเดต` : `${securityUpdates} Updates`}
              </h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? 'อัปเดตด้านความปลอดภัย' : 'Security patches'}
              </p>
            </div>
          </div>

          {/* Definition Updates */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'อัปเดตฐานข้อมูล' : 'Definition Updates'}
              </span>
              <RefreshCw className="h-3.5 w-3.5 text-blue-400" />
            </div>
            <div>
              <h4 className="text-lg font-black text-blue-500 leading-none">
                {lang === 'th' ? `${definitionUpdates} อัปเดต` : `${definitionUpdates} Updates`}
              </h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? 'อัปเดตฐานข้อมูลไวรัส' : 'Virus database updates'}
              </p>
            </div>
          </div>

          {/* Devices Needing Updates */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'อุปกรณ์ที่ต้องได้รับการอัปเดต' : 'Devices Needing Updates'}
              </span>
              <Monitor className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-indigo-600 leading-none">
                {lang === 'th' ? `${devicesNeedingUpdates} เครื่อง` : `${devicesNeedingUpdates} Devices`}
              </h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? 'อุปกรณ์ที่ต้องอัปเดต' : 'Devices needing patches'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: SOFTWARE UPDATES TABLE */}
        <div className="space-y-1.5 flex-1 flex flex-col overflow-hidden mt-2">
          <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 select-none">
            <Download className="h-3.5 w-3.5 text-indigo-500" /> {lang === 'th' ? 'รายการซอฟต์แวร์ที่ต้องอัปเดตแยกตามอุปกรณ์ (Software Updates by Device)' : 'SOFTWARE UPDATES BY DEVICE'}
          </h3>
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1 flex flex-col">
            <div className="overflow-y-auto flex-1">
              <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
                <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px] sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 w-[20%]">{lang === 'th' ? 'ชื่ออุปกรณ์' : 'DEVICE NAME'}</th>
                    <th className="px-4 py-2 w-[15%]">OS</th>
                    <th className="px-4 py-2 w-[15%]">{lang === 'th' ? 'ประเภท' : 'CLASSIFICATION'}</th>
                    <th className="px-4 py-2 w-[15%]">KB ID</th>
                    <th className="px-4 py-2 w-[25%]">{lang === 'th' ? 'ชื่อแพตช์' : 'PATCH NAME'}</th>
                    <th className="px-4 py-2 text-right w-[10%]">{lang === 'th' ? 'สถานะ' : 'STATUS'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
                  {agentsWithUpdates.map((agent, agentIdx) => (
                    <React.Fragment key={agent.deviceGuid || agentIdx}>
                      {/* Agent Header Row */}
                      <tr className="bg-slate-100/80">
                        <td colSpan={6} className="px-4 py-1.5 font-extrabold text-slate-800 text-[9px] border-b border-slate-200">
                          {agent.agentName} <span className="text-slate-500 font-medium">({lang === 'th' ? `ค้าง ${agent.availablePatches.length} อัปเดต` : `${agent.availablePatches.length} updates`})</span>
                        </td>
                      </tr>
                      {/* Patches Rows */}
                      {agent.availablePatches.map((patch, patchIdx) => (
                        <tr key={`${agent.deviceGuid}-${patch.kbId}-${patchIdx}`} className="hover:bg-slate-50/20 transition-colors">
                          <td className="px-4 py-2 font-bold text-slate-800 pl-8 text-[9px]">
                            {/* Empty device name for patch rows since it's grouped */}
                          </td>
                          <td className="px-4 py-2 text-slate-500 truncate max-w-[120px]" title={agent.os}>{agent.os}</td>
                          <td className="px-4 py-2 text-slate-600">
                            <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8px] font-extrabold border ${
                              patch.class === 'Security Updates' ? 'bg-rose-50 text-rose-700 border-rose-200/50' : 
                              patch.class === 'Definition Updates' ? 'bg-blue-50 text-blue-700 border-blue-200/50' :
                              'bg-slate-50 text-slate-600 border-slate-200'
                            }`}>
                              {patch.class === 'Security Updates' ? (lang === 'th' ? 'อัปเดตความปลอดภัย' : 'Security Updates') : 
                               patch.class === 'Definition Updates' ? (lang === 'th' ? 'อัปเดตฐานข้อมูล' : 'Definition Updates') :
                               (patch.class || 'Update')}
                            </span>
                          </td>
                          <td className="px-4 py-2 font-mono text-slate-500">{patch.kbId || 'N/A'}</td>
                          <td className="px-4 py-2 text-slate-600 truncate max-w-[200px]" title={patch.name}>{patch.name}</td>
                          <td className="px-4 py-2 text-right">
                            <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[8.5px] font-extrabold border bg-amber-50 text-amber-700 border-amber-200/50">
                              {patch.status || (lang === 'th' ? 'รอดำเนินการ' : 'Pending')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                  {agentsWithUpdates.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-400 font-medium">
                        <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                        {lang === 'th' ? 'อุปกรณ์ทั้งหมดได้รับการอัปเดตเป็นรุ่นล่าสุดแล้ว' : 'All devices are up to date.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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
