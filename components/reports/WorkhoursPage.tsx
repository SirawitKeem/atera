'use client';

import React from 'react';
import { 
  Clock, 
  UserCheck, 
  DollarSign, 
  Award, 
  Activity, 
  Briefcase,
  Server
} from 'lucide-react';
import ReportHeader from './ReportHeader';

interface WorkhoursPageProps {
  pageNumber: number;
  workhours: any[];
  tickets: any[];
}

export default function WorkhoursPage({
  pageNumber,
  workhours,
  tickets
}: WorkhoursPageProps) {

  const totalLoggedHours = workhours.reduce((sum, w) => sum + (w.LoggedHours || w.loggedHours || 0), 0);
  const billableHours = workhours.filter(w => w.Billable === true || w.billable === true || String(w.Billable).toLowerCase() === 'true')
                                 .reduce((sum, w) => sum + (w.LoggedHours || w.loggedHours || 0), 0);
  const nonBillableHours = Math.max(0, totalLoggedHours - billableHours);
  const billablePercent = totalLoggedHours > 0 ? Math.round((billableHours / totalLoggedHours) * 100) : 0;

  // SLA compliance calculation from active tickets (dynamic from API)
  const slaMetCount = tickets.filter(t => {
    const onSlaMins = t.OnSLADurationMinutes || 0;
    return onSlaMins === 0 || onSlaMins < 480; 
  }).length;
  const slaPercent = tickets.length > 0 ? Math.round((slaMetCount / tickets.length) * 100) : 100;

  // Technician statistics
  const techHours: Record<string, number> = {};
  workhours.forEach(w => {
    const tech = w.TechnicianName || w.technicianName || 'Support Agent';
    techHours[tech] = (techHours[tech] || 0) + (w.LoggedHours || w.loggedHours || 0);
  });

  const topTechs = Object.entries(techHours).map(([name, hours]) => ({
    name,
    hours: Math.round(hours * 10) / 10
  })).sort((a, b) => b.hours - a.hours);

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
        title="Workhours & SLA" 
        subtitle="Helpdesk Operations & Technician Efficiency | Reporting Period: 06 Jul 2026 - 05 Aug 2026" 
      />

      <div className="page-content space-y-4 flex-1 flex flex-col justify-between overflow-hidden mt-3">
        
        {/* SECTION 1: WORKHOUR KPI CARDS */}
        <div className="grid grid-cols-4 gap-3 select-none">
          {/* Total Hours */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Hours</span>
              <Clock className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-800 leading-none">{totalLoggedHours} Hrs</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">Logged Labor Time</p>
            </div>
          </div>

          {/* Billable Hours */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Billable</span>
              <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-emerald-600 leading-none">{billableHours} Hrs</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">{billablePercent}% Billability Ratio</p>
            </div>
          </div>

          {/* Non-Billable */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Non-Billable</span>
              <Briefcase className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-600 leading-none">{nonBillableHours} Hrs</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">Maintenance & Internal</p>
            </div>
          </div>

          {/* SLA Performance */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">SLA Target</span>
              <Award className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-emerald-600 leading-none">{slaPercent}%</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">Resolution SLAs Met</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: CHARTS SIDE-BY-SIDE */}
        <div className="grid grid-cols-2 gap-4 h-[190px] select-none">
          
          {/* Technician Efficiency */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <UserCheck className="h-4 w-4 text-blue-500" /> 1. ชั่วโมงการทำงานแยกตามวิศวกร (Hours by Technician)
            </h4>
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {topTechs.map((t, idx) => {
                const maxHours = topTechs[0]?.hours || 1;
                const percentage = Math.round((t.hours / maxHours) * 100);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[8.5px] font-bold text-slate-600 leading-none">
                      <span>{t.name}</span>
                      <span>{t.hours} Hrs</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
              {topTechs.length === 0 && (
                <p className="text-center text-slate-400 text-xs">ไม่มีบันทึกข้อมูลวิศวกรไอที</p>
              )}
            </div>
          </div>

          {/* Billable Ratio Gauge */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Activity className="h-4 w-4 text-blue-500" /> 2. สัดส่วนงานที่เรียกเก็บเงินได้ (Billability Ratio)
            </h4>
            <div className="flex-1 flex flex-col justify-center items-center py-2">
              {/* Simple progress ring representation */}
              <div className="relative h-16 w-16 flex items-center justify-center flex-shrink-0 mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="4"></circle>
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#10b981" strokeWidth="4"
                    strokeDasharray={`${billablePercent} 100`} strokeDashoffset="0"></circle>
                </svg>
                <div className="absolute text-[10px] font-black text-slate-700 text-center leading-none">
                  {billablePercent}%<br/><span className="text-[6.5px] text-slate-400 font-bold">BILLABLE</span>
                </div>
              </div>
              <p className="text-[8.5px] text-slate-500 font-bold text-center">
                ชั่วโมงงานวิศวกรสนับสนุนลูกค้าคิดเป็นรายได้ตามข้อตกลง SLA
              </p>
            </div>
          </div>

        </div>

        {/* SECTION 3: WORKHOUR LOG TABLE */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-end">
          <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 select-none">
            <Server className="h-3.5 w-3.5 text-blue-500" /> 3. บันทึกประวัติชั่วโมงทำงานจริงแยกรายละเอียด (Technician Labor Logs)
          </h3>
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
              <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px]">
                <tr>
                  <th className="px-4 py-2 w-[25%]">TECHNICIAN</th>
                  <th className="px-4 py-2 w-[25%]">CUSTOMER</th>
                  <th className="px-4 py-2 w-[30%]">TICKET Subject / DESCRIPTION</th>
                  <th className="px-4 py-2 text-center w-[10%]">HOURS</th>
                  <th className="px-4 py-2 text-right w-[10%]">BILLABLE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
                {workhours.slice(0, 7).map((w, idx) => {
                  const tech = w.TechnicianName || w.technicianName || 'Support Agent';
                  const cust = w.CustomerName || 'N/A';
                  const description = w.TicketTitle || w.ticketTitle || 'System Maintenance Support';
                  const hours = w.LoggedHours || w.loggedHours || 0;
                  const isBillable = w.Billable === true || w.billable === true || String(w.Billable).toLowerCase() === 'true';

                  return (
                    <tr key={idx} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-4 py-2 font-bold text-slate-800">{tech}</td>
                      <td className="px-4 py-2 text-slate-500 font-medium">{cust}</td>
                      <td className="px-4 py-2 text-slate-600 truncate max-w-[200px]" title={description}>{description}</td>
                      <td className="px-4 py-2 text-center font-mono text-slate-900 font-extrabold">{hours} Hrs</td>
                      <td className="px-4 py-2 text-right">
                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8.5px] font-extrabold border ${
                          isBillable 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' 
                            : 'bg-slate-50 text-slate-400 border-slate-200'
                        }`}>
                          {isBillable ? 'Billable' : 'Free / SLA'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                 {workhours.length === 0 && (
                   <tr>
                     <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-bold">
                       ไม่พบข้อมูลบันทึกเวลาทำงานของวิศวกรในระบบ API (No technician labor logs found)
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
        <span>หน้า {pageNumber} จาก 15</span>
      </div>
    </div>
  );
}
