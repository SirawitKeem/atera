'use client';

import React from 'react';
import { Server, Terminal, Laptop } from 'lucide-react';
import ReportHeader from './ReportHeader';

interface DetailAssetsPageProps {
  pageNumber: number;
  agents: any[];
}

export default function DetailAssetsPage({
  pageNumber,
  agents
}: DetailAssetsPageProps) {

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
        title="Detailed Assets Inventory" 
        subtitle="Full Network IT Asset Registry & Node Diagnostics | Reporting Period: 06 Jul 2026 - 05 Aug 2026" 
      />

      <div className="page-content space-y-3 flex-1 flex flex-col justify-between overflow-hidden mt-3">
        
        {/* SECTION 1: DETAILED TABLE */}
        <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
          <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
            <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px]">
              <tr>
                <th className="px-4 py-2.5 w-[25%]">DEVICE NAME</th>
                <th className="px-4 py-2.5 w-[20%]">CUSTOMER</th>
                <th className="px-4 py-2.5 w-[20%]">OPERATING SYSTEM</th>
                <th className="px-4 py-2.5 text-center w-[15%]">IP ADDRESS</th>
                <th className="px-4 py-2.5 text-center w-[10%]">DEVICE TYPE</th>
                <th className="px-4 py-2.5 text-right w-[10%]">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
              {agents.map((a, idx) => {
                const name = a.MachineName || a.name || 'N/A';
                const customer = a.CustomerName || 'N/A';
                const os = a.OS || a.os || 'Windows';
                const ip = a.IPAddress || a.ip || '0.0.0.0';
                const type = a.DeviceType || a.deviceType || 'Workstation';
                const isOnline = a.Online === true || a.online === true || String(a.Online).toLowerCase() === 'true';

                return (
                  <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                    <td className="px-4 py-2.5 font-bold text-slate-800 flex items-center gap-2">
                      {getOsIcon(os)}
                      <span className="truncate max-w-[140px]">{name}</span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-500 font-semibold">{customer}</td>
                    <td className="px-4 py-2.5 text-slate-400 truncate max-w-[120px]" title={os}>{os}</td>
                    <td className="px-4 py-2.5 text-center font-mono text-slate-400">{ip}</td>
                    <td className="px-4 py-2.5 text-center text-slate-500">{type}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[8px] font-bold border ${
                        isOnline 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' 
                          : 'bg-slate-50 text-slate-400 border-slate-200'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
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

      {/* Page Footer */}
      <div className="page-footer text-[9px] text-slate-400 font-semibold border-t border-slate-100/60 pt-3 mt-3 select-none flex justify-between">
        <span>Generated from Atera API v3 | Powered by Power BI Report Builder | Confidential</span>
        <span>หน้า {pageNumber} จาก 16</span>
      </div>
    </div>
  );
}
