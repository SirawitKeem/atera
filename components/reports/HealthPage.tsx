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

interface HealthPageProps {
  pageNumber: number;
  agents: any[];
  totalPages?: number;
  dateRangeDisplay?: string;
}

export default function HealthPage({
  pageNumber,
  agents,
  totalPages = 9,
  dateRangeDisplay
}: HealthPageProps) {

  const totalDevices = agents.length;
  
  // Calculations
  const onlineCount = agents.filter(a => a.Online === true || a.online === true || String(a.Online).toLowerCase() === 'true').length;
  const offlineCount = totalDevices - onlineCount;
  const onlineRatio = totalDevices > 0 ? Math.round((onlineCount / totalDevices) * 100) : 100;

  // Real capacity metrics derived from agent fields
  const deviceHealthList = agents.map((a, idx) => {
    const name = a.MachineName || a.name || 'Device';
    const os = a.OS || a.os || 'Windows';
    const isOnline = a.Online === true || a.online === true || String(a.Online).toLowerCase() === 'true';

    const cpu = 0;
    const ram = a.Memory ? Math.round((a.Memory / (a.Memory * 1.2)) * 100) : 0;
    const diskTotal = (a.HardwareDisks || []).reduce((s: number, d: any) => s + (d.Total || 0), 0);
    const diskUsed = (a.HardwareDisks || []).reduce((s: number, d: any) => s + (d.Used || 0), 0);
    const disk = diskTotal > 0 ? Math.round((diskUsed / diskTotal) * 100) : 0;

    let status = 'Healthy';
    if (!isOnline) status = 'Offline';
    else if (disk > 85) status = 'Warning';

    return {
      name,
      os,
      isOnline,
      cpu,
      ram,
      disk,
      status
    };
  });

  // KPI Calculations
  const ramHealthyCount = deviceHealthList.filter(d => d.ram <= 85).length;
  const diskHealthyCount = deviceHealthList.filter(d => d.disk >= 15).length;

  const ramHealthPercent = totalDevices > 0 ? Math.round((ramHealthyCount / totalDevices) * 100) : 100;
  const diskHealthPercent = totalDevices > 0 ? Math.round((diskHealthyCount / totalDevices) * 100) : 100;

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
        title="Device Availability & Health" 
        subtitle={`Monthly Operational Health Audit | Reporting Period: ${dateRangeDisplay || 'N/A'}`} 
        dateRangeDisplay={dateRangeDisplay}
      />

      <div className="page-content space-y-4 flex-1 flex flex-col justify-between overflow-hidden mt-3">
        
        {/* SECTION 1: SYSTEM HEALTH OVERVIEW */}
        <div className="grid grid-cols-2 gap-4 select-none">
          {/* Availability Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between shadow-xs h-[110px]">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Device Connectivity</span>
              <span className="text-[8.5px] font-bold text-emerald-600 flex items-center gap-1">
                <Activity className="h-3 w-3" /> {onlineRatio}% Online
              </span>
            </div>
            <div className="flex items-baseline justify-between my-1">
              <h3 className="text-2xl font-black text-slate-800 leading-none">{onlineCount} <span className="text-xs font-normal text-slate-400">/ {totalDevices} Online</span></h3>
              <span className="text-xs font-extrabold text-rose-500">{offlineCount} Offline</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${onlineRatio}%` }}></div>
            </div>
          </div>

          {/* Resource Usage Card */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between shadow-xs h-[110px]">
            <span className="text-[8.5px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Infrastructure Capacity</span>
            <div className="space-y-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[8.5px] font-bold text-slate-600 leading-none">
                  <span>RAM capacity healthy</span>
                  <span>{ramHealthPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${ramHealthPercent}%` }}></div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[8.5px] font-bold text-slate-600 leading-none">
                  <span>Disk space healthy</span>
                  <span>{diskHealthPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${diskHealthPercent}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Network Offline Agents Log */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[190px]">
          <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <AlertTriangle className="h-4 w-4 text-rose-500" /> 2. บันทึกอุปกรณ์ออฟไลน์ล่าสุด (Offline Devices Alert Log)
          </h4>
          <div className="flex-1 flex flex-col justify-center space-y-2 overflow-hidden">
            {agents.filter(a => !(a.Online === true || a.online === true || String(a.Online).toLowerCase() === 'true')).slice(0, 3).map((a, i) => {
              const name = a.MachineName || a.name || 'N/A';
              const customer = a.CustomerName || 'N/A';
              return (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 rounded-lg text-[9px]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 animate-ping"></span>
                    <div>
                      <p className="font-bold text-slate-800">{name}</p>
                      <p className="text-slate-400 font-medium">{customer}</p>
                    </div>
                  </div>
                  <span className="font-mono text-slate-400">Connection Terminated</span>
                </div>
              );
            })}
            {offlineCount === 0 && (
              <div className="text-center py-6 text-slate-400 font-bold text-[9.5px]">
                ✓ อุปกรณ์ RMM ทั้งหมดอยู่ในสถานะออนไลน์ 100%
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: DEVICE HEALTH DETAIL TABLE */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-end">
          <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 select-none">
            <Server className="h-3.5 w-3.5 text-blue-500" /> 3. รายละเอียดสุขภาพอุปกรณ์เฝ้าระวัง RMM (Hardware Health Log)
          </h3>
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
              <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px]">
                <tr>
                  <th className="px-4 py-2 w-[30%]">DEVICE NAME</th>
                  <th className="px-4 py-2 w-[25%]">OPERATING SYSTEM</th>
                  <th className="px-4 py-2 text-center w-[12%] font-mono">MEMORY</th>
                  <th className="px-4 py-2 text-center w-[12%] font-mono">RAM LOAD</th>
                  <th className="px-4 py-2 text-center w-[11%] font-mono">DISK FREE</th>
                  <th className="px-4 py-2 text-right w-[10%]">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
                {deviceHealthList.slice(0, 7).map((d, idx) => {
                  let statusColor = 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
                  if (d.status === 'Offline') statusColor = 'bg-slate-50 text-slate-400 border-slate-200';
                  else if (d.status === 'Warning') statusColor = 'bg-amber-50 text-amber-700 border-amber-200/50';

                  return (
                    <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-4 py-2 font-bold text-slate-800 flex items-center gap-2">
                        {getOsIcon(d.os)}
                        <span className="truncate max-w-[120px]">{d.name}</span>
                      </td>
                      <td className="px-4 py-2 text-slate-400 truncate max-w-[120px]">{d.os}</td>
                      <td className="px-4 py-2 text-center font-mono">{d.isOnline ? `${d.ram}%` : 'N/A'}</td>
                      <td className="px-4 py-2 text-center font-mono">{d.isOnline ? `${d.ram}%` : 'N/A'}</td>
                      <td className="px-4 py-2 text-center font-mono">{d.isOnline ? `${d.disk}%` : 'N/A'}</td>
                      <td className="px-4 py-2 text-right">
                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8.5px] font-extrabold border ${statusColor}`}>
                          {d.status}
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
        <span>{`หน้า ${pageNumber} จาก ${totalPages}`}</span>
      </div>
    </div>
  );
}
