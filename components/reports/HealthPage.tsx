'use client';

import React from 'react';
import { 
  Heart, 
  Activity, 
  Cpu, 
  Layers, 
  Laptop, 
  Server,
  AlertTriangle,
  Monitor,
  Terminal
} from 'lucide-react';
import ReportHeader from './ReportHeader';
import { translations } from '@/lib/translations';
import DeviceTypeIcon from './DeviceTypeIcon';

interface HealthPageProps {
  pageNumber: number;
  agents: any[];
  totalPages?: number;
  dateRangeDisplay?: string;
  lang?: string;
  companyName?: string;
}

export default function HealthPage({
  pageNumber,
  agents,
  totalPages = 9,
  dateRangeDisplay,
  lang = 'th',
  companyName = 'Atera Client'
}: HealthPageProps) {
  const t = translations[lang as 'th' | 'en'] || translations.th;

  const totalDevices = agents.length;
  
  // Calculations
  const onlineCount = agents.filter(a => a.Online === true || a.online === true || String(a.Online).toLowerCase() === 'true').length;
  const offlineCount = totalDevices - onlineCount;
  const onlineRatio = totalDevices > 0 ? Math.round((onlineCount / totalDevices) * 100) : 100;

  // Real capacity metrics derived from agent fields
  const deviceHealthList = agents.map((a) => {
    const name = a.MachineName || a.name || 'Not reported';
    const os = a.OS || a.os || '';
    const disks = Array.isArray(a.HardwareDisks) ? a.HardwareDisks : [];
    const diskTotal = disks.reduce((sum: number, disk: any) => sum + Number(disk.Total || 0), 0);
    const diskUsed = disks.reduce((sum: number, disk: any) => sum + Number(disk.Used || 0), 0);
    const disk = diskTotal > 0 && Number.isFinite(diskUsed)
      ? Math.round(((diskTotal - diskUsed) / diskTotal) * 100)
      : null;

    return {
      name,
      os,
      deviceType: a.DeviceType || a.deviceType || '',
      osType: a.OSType || a.osType || '',
      // No verified CPU/RAM utilisation field is mapped by this app.
      cpu: null,
      ram: null,
      disk,
      status: disk === null ? 'No data' : disk < 15 ? 'Warning' : 'Healthy'
    };
  });

  // KPI calculations use only metrics returned by the API.
  const ramHealthPercent: number | null = null;
  const diskReportedCount = deviceHealthList.filter(d => d.disk !== null).length;
  const diskHealthyCount = deviceHealthList.filter(d => d.disk !== null && d.disk >= 15).length;
  const diskHealthPercent = diskReportedCount > 0 ? Math.round((diskHealthyCount / diskReportedCount) * 100) : null;
  const healthyHardwareCount = deviceHealthList.filter(d => d.status === 'Healthy').length;



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
        title={t.healthTitle} 
        subtitle={t.healthSubtitle} 
        lang={lang}
        dateRangeDisplay={dateRangeDisplay}
      />

      <div className="page-content space-y-4 flex-1 flex flex-col justify-between overflow-hidden mt-3">
        
        {/* SECTION 1: SYSTEM HEALTH OVERVIEW */}
        <div className="grid grid-cols-3 gap-3 ">
          {/* RAM Health Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'ความสมบูรณ์ของ RAM' : 'RAM Capacity Health'}
              </span>
              <Cpu className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800 leading-none">{ramHealthPercent === null ? 'No data' : String(ramHealthPercent) + '%'}</h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? 'ภาระโหลด RAM <= 85%' : 'RAM load <= 85%'}
              </p>
            </div>
          </div>

          {/* Disk Health Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'ความสมบูรณ์ของพื้นที่ดิสก์' : 'Disk Space Health'}
              </span>
              <Layers className="h-3.5 w-3.5 text-indigo-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-slate-800 leading-none">{diskHealthPercent === null ? 'No data' : String(diskHealthPercent) + '%'}</h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? 'พื้นที่ดิสก์ว่าง >= 15%' : 'Disk free >= 15%'}
              </p>
            </div>
          </div>

          {/* Healthy Hardware Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                {lang === 'th' ? 'อุปกรณ์ฮาร์ดแวร์ปกติ' : 'Healthy Hardware'}
              </span>
              <Heart className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-lg font-black text-emerald-600 leading-none">
                {lang === 'th' ? `${healthyHardwareCount} เครื่อง` : `${healthyHardwareCount} Devices`}
              </h4>
              <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                {lang === 'th' ? 'สุขภาพฮาร์ดแวร์ปกติ' : 'Hardware Healthy'}
              </p>
            </div>
          </div>
        </div>

        {/* High Resource Warnings Log */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[190px]">
          <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> {lang === 'th' ? '2. บันทึกสัญญาณเตือนทรัพยากรสูง (High Resource Warnings Log)' : '2. HIGH RESOURCE WARNINGS LOG'}
          </h4>
          <div className="flex-1 flex flex-col justify-center space-y-2 overflow-hidden">
            {deviceHealthList.filter(dev => (dev.ram !== null && dev.ram > 85) || (dev.disk !== null && dev.disk < 15)).slice(0, 3).map((d, i) => {
              const name = d.name;
              const warningType = (d.disk !== null && d.disk < 15) ? `Low Disk Free: ${d.disk}%` : 'No data';
              return (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg text-[9px]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 animate-ping"></span>
                    <div>
                      <p className="font-bold text-slate-800">{name}</p>
                      <p className="text-slate-400 font-medium">{d.os}</p>
                    </div>
                  </div>
                  <span className="font-mono text-amber-600 font-bold">
                    {warningType}
                  </span>
                </div>
              );
            })}
            {deviceHealthList.filter(d => d.ram !== null && d.ram > 85 || d.disk !== null && d.disk < 15).length === 0 && (
              <div className="text-center py-6 text-slate-400 font-bold text-[9.5px]">
                {lang === 'th' ? '✓ ไม่พบปัญหาอุปกรณ์ใช้ทรัพยากรสูง' : '✓ No high resource usage detected'}
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: DEVICE HEALTH DETAIL TABLE */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-end">
          <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 ">
            <Server className="h-3.5 w-3.5 text-blue-500" /> {lang === 'th' ? '3. รายละเอียดสุขภาพอุปกรณ์เฝ้าระวัง RMM (Hardware Health Log)' : '3. HARDWARE HEALTH LOG'}
          </h3>
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
              <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px]">
                <tr>
                  <th className="px-4 py-2 w-[30%]">{lang === 'th' ? 'ชื่ออุปกรณ์' : 'DEVICE NAME'}</th>
                  <th className="px-4 py-2 w-[25%]">{lang === 'th' ? 'ระบบปฏิบัติการ' : 'OPERATING SYSTEM'}</th>
                  <th className="px-4 py-2 text-center w-[12%] font-mono">{lang === 'th' ? 'หน่วยความจำ' : 'MEMORY'}</th>
                  <th className="px-4 py-2 text-center w-[12%] font-mono">{lang === 'th' ? 'ภาระ RAM' : 'RAM LOAD'}</th>
                  <th className="px-4 py-2 text-center w-[11%] font-mono">{lang === 'th' ? 'พื้นที่ดิสก์' : 'DISK FREE'}</th>
                  <th className="px-4 py-2 text-right w-[10%]">{lang === 'th' ? 'สถานะ' : 'STATUS'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
                {deviceHealthList.slice(0, 7).map((d, idx) => {
                  let statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
                  if (d.status === 'Warning') statusColor = 'bg-amber-50 text-amber-700 border-amber-200/50';

                  return (
                    <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-4 py-2 font-bold text-slate-800 flex items-center gap-2">
                        <DeviceTypeIcon deviceType={d.deviceType} osType={d.osType} os={d.os} className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate max-w-[120px]">{d.name}</span>
                      </td>
                      <td className="px-4 py-2 text-slate-400 truncate max-w-[120px]">{d.os}</td>
                      <td className="px-4 py-2 text-center font-mono">{d.ram === null ? 'No data' : String(d.ram) + '%'}</td>
                      <td className="px-4 py-2 text-center font-mono">{d.ram === null ? 'No data' : String(d.ram) + '%'}</td>
                      <td className="px-4 py-2 text-center font-mono">{d.disk === null ? 'No data' : String(d.disk) + '%'}</td>
                      <td className="px-4 py-2 text-right">
                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8.5px] font-extrabold border ${statusColor}`}>
                          {d.status === 'Healthy' ? (lang === 'th' ? 'ปกติ' : 'Healthy') : 
                           d.status === 'Warning' ? (lang === 'th' ? 'เตือนภัย' : 'Warning') : 
                           d.status}
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
      <div className="page-footer text-[9px] text-slate-400 font-semibold border-t border-slate-100/60 pt-3 mt-3  flex justify-between">
        <span>Generated from Atera API v3 | Powered by Ally Assist</span>
        <span>
          {lang === 'th' ? `หน้า ${pageNumber} จาก ${totalPages}` : `Page ${pageNumber} of ${totalPages}`}
        </span>
      </div>
    </div>
  );
}
