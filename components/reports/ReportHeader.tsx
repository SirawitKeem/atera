'use client';

import React from 'react';
import { Calendar } from 'lucide-react';

interface ReportHeaderProps {
  title: string;
  subtitle: string;
}

export default function ReportHeader({ title, subtitle }: ReportHeaderProps) {
  // Generate Thai dynamic dates
  const today = new Date();
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const currentMonthThai = thaiMonths[today.getMonth()];
  const currentYearAD = today.getFullYear();

  // Get days in current month
  const daysInMonth = new Date(currentYearAD, today.getMonth() + 1, 0).getDate();

  const currentDateStr = `${today.getDate()} ${currentMonthThai} ${currentYearAD}`;

  return (
    <div className="w-full flex justify-between items-start border-b border-slate-100 pb-4 mb-6 relative overflow-hidden select-none">
      
      {/* Wave Background Lines inside the header (top-right SVG absolute pattern matching screenshot) */}
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none -z-10">
        <svg width="100%" height="100%" viewBox="0 0 400 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 10C200 40 300 20 400 60" stroke="#E20074" strokeWidth="2" />
          <path d="M110 20C210 50 310 30 410 70" stroke="#E20074" strokeWidth="1.5" />
          <path d="M120 30C220 60 320 40 420 80" stroke="#E20074" strokeWidth="1" />
          <path d="M130 40C230 70 330 50 430 90" stroke="#E20074" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Left side: Logo & Title */}
      <div className="space-y-2">
        <img 
          src="/Logo_of_Atera_1.png" 
          alt="Atera Logo" 
          className="h-6 w-auto object-contain" 
        />
        <div className="pt-2">
          <h2 className="text-[#0F172A] font-extrabold text-[28px] tracking-tight leading-none">
            {title}
          </h2>
          <p className="text-slate-500 font-medium text-xs mt-1.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right side: Report Period Block */}
      <div className="flex flex-col items-end text-right">
        {/* Monthly Report pill */}
        <span className="inline-flex text-[9px] font-extrabold text-[#E20074] bg-[#FFEAF2] px-2.5 py-1 rounded-full uppercase tracking-wider">
          Monthly Report
        </span>

        {/* Date block */}
        <div className="border border-slate-200/80 rounded-lg py-1.5 px-3 flex items-center gap-2 bg-white/60 shadow-xs mt-2">
          <Calendar className="w-4 h-4 text-slate-600 flex-shrink-0" strokeWidth={2.2} />
          <span className="text-slate-800 font-bold text-xs">
            {currentDateStr}
          </span>
        </div>
      </div>
      
    </div>
  );
}
