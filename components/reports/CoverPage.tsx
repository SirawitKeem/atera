'use client';

import React from 'react';

interface CoverPageProps {
  totalCustomers: number;
  totalDevices: number;
  totalTickets: number;
  totalAlerts: number;
  currentDate: string;
  reportPeriod?: { start: string; end: string };
}

export default function CoverPage({
  totalCustomers,
  totalDevices,
  totalTickets,
  totalAlerts,
  currentDate,
  reportPeriod
}: CoverPageProps) {
  const formatDate = (dateStr: string, isStart: boolean) => {
    const date = new Date(dateStr);
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    const time = isStart ? '00:00' : '23:59';
    return `${d}/${m}/${y}, ${time}`;
  };

  const startDateStr = reportPeriod ? formatDate(reportPeriod.start, true) : 'N/A';
  const endDateStr = reportPeriod ? formatDate(reportPeriod.end, false) : 'N/A';

  return (
    <div 
      className="a4-page relative overflow-hidden flex flex-col justify-between"
      style={{
        backgroundImage: 'url("/covere.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '20mm 18mm'
      }}
    >
      {/* Top Left: Logo */}
      <div className="w-full flex justify-start">
        <img 
          src="/atera-box-logo.png" 
          alt="Atera Logo" 
          className="h-14 w-auto object-contain select-none" 
        />
      </div>

      {/* Middle Left: Title and Date Period */}
      <div className="my-auto space-y-6 max-w-sm pt-8">
        <div className="space-y-1">
          <span className="block text-[#E20074] font-black tracking-widest text-[20px] uppercase">
            ATERA
          </span>
          <h1 className="text-[#0F172A] font-black text-[72px] tracking-tight leading-none uppercase">
            MONTHLY
          </h1>
          <h1 className="text-[#E20074] font-black text-[72px] tracking-tight leading-none uppercase">
            REPORT
          </h1>
        </div>
        
        {/* Pink accent line */}
        <div className="w-16 h-[2px] bg-[#E20074]"></div>
        
        {/* Report Period Box */}
        <div className="flex items-center gap-3.5 pt-3">
          <div className="h-11 w-11 rounded-full border border-[#E20074]/70 flex items-center justify-center text-[#E20074] bg-white/40 backdrop-blur-xs flex-shrink-0 shadow-xs">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div className="space-y-0.5 select-none">
            <span className="block text-[#E20074] font-extrabold text-[10px] tracking-wider uppercase">
              REPORT PERIOD
            </span>
            <span className="block text-slate-700 font-bold text-[12px] leading-snug">
              {startDateStr} –
            </span>
            <span className="block text-slate-700 font-bold text-[12px] leading-snug">
              {endDateStr}
            </span>
          </div>
        </div>
      </div>

      {/* Spacer to maintain layout balance at the bottom */}
      <div className="mt-auto h-12"></div>

    </div>
  );
}
