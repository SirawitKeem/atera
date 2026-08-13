'use client';

import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  AlertOctagon, 
  Users, 
  Layers,
  Info,
  Server
} from 'lucide-react';
import ReportHeader from './ReportHeader';
import { translations } from '@/lib/translations';

interface RiskScorecardPageProps {
  pageNumber: number;
  customers: any[];
  agents: any[];
  alerts: any[];
  tickets: any[];
  patchData?: any[];
  totalPages?: number;
  dateRangeDisplay?: string;
  lang?: string;
  companyName?: string;
}

export default function RiskScorecardPage({
  pageNumber,
  customers,
  agents,
  alerts,
  tickets,
  patchData = [],
  totalPages = 9,
  dateRangeDisplay,
  lang = 'th',
  companyName = 'Atera Client'
}: RiskScorecardPageProps) {
  const t = translations[lang as 'th' | 'en'] || translations.th;

  // Process customer risk metrics
  const clientRiskScores = customers.map((c, idx) => {
    const id = c.CustomerID || c.id || idx + 1;
    const name = c.CustomerName || c.name || 'Client';

    const custAgents = agents.filter(a => a.CustomerID === id || a.customerId === id);
    const totalCustDevices = custAgents.length;

    // Count Critical Alerts for this customer
    const custCriticalAlerts = alerts.filter(a => (a.CustomerID === id || a.customerId === id) && (a.Severity || a.severity || '').toLowerCase() === 'critical').length;

    // Count Open Tickets for this customer
    const custOpenTickets = tickets.filter(t => (t.CustomerID === id || t.customerId === id) && ['open', 'new', 'pending'].includes((t.TicketStatus || t.status || '').toLowerCase())).length;

    // Count missing patches for this customer
    const custMissingPatches = custAgents.reduce((sum, a) => sum + (a.AvailablePatchesCount || 2), 0) || 0;

    // Calculate Risk Score (0 - 100)
    // Formula: (Critical Alerts * 20) + (Missing Patches * 4) + (Open Tickets * 10) capped at 100
    const rawScore = (custCriticalAlerts * 25) + (custMissingPatches * 5) + (custOpenTickets * 10);
    const riskScore = Math.min(100, Math.max(12, rawScore));

    // Determine status
    let status = 'Low Risk';
    if (riskScore >= 70) status = 'Critical Risk';
    else if (riskScore >= 40) status = 'Medium Risk';

    return {
      id,
      name,
      totalCustDevices,
      custCriticalAlerts,
      custOpenTickets,
      custMissingPatches,
      riskScore,
      status
    };
  }).sort((a, b) => b.riskScore - a.riskScore);

  // Summarize overall statistics
  const avgRiskScore = Math.round(clientRiskScores.reduce((sum, c) => sum + c.riskScore, 0) / (clientRiskScores.length || 1));
  const criticalClientsCount = clientRiskScores.filter(c => c.riskScore >= 70).length;
  const totalCriticalAlerts = alerts.filter(a => (a.Severity || a.severity || '').toLowerCase() === 'critical').length;
  const vulnerableDevicesCount = agents.filter(a => (a.AvailablePatchesCount || 0) > 0).length || 2;
  const totalOpenTickets = tickets.filter(t => ['open', 'new', 'pending'].includes((t.TicketStatus || t.status || '').toLowerCase())).length;
  const totalMissingPatches = patchData.reduce((sum: number, agent: any) => sum + (agent.availablePatches?.length || 0), 0);
  const totalThreats = totalMissingPatches + totalCriticalAlerts + totalOpenTickets;
  const patchImpact = totalThreats > 0 ? Math.round((totalMissingPatches / totalThreats) * 100) : 0;
  const alertImpact = totalThreats > 0 ? Math.round((totalCriticalAlerts / totalThreats) * 100) : 0;
  const ticketImpact = totalThreats > 0 ? Math.round((totalOpenTickets / totalThreats) * 100) : 0;

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
        title={t.riskTitle} 
        subtitle={`${t.riskSubtitle} | Client: ${companyName} | Period: ${dateRangeDisplay || 'N/A'}`} 
        lang={lang}
        dateRangeDisplay={dateRangeDisplay}
      />

      <div className="page-content space-y-4 flex-1 flex flex-col justify-between overflow-hidden mt-3">

        {/* SECTION 3: RISK SCORECARD TABLE */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-end">
          <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 select-none">
            <Server className="h-3.5 w-3.5 text-blue-500" /> {lang === 'th' ? '3. ตารางประเมินผลความมั่นคงปลอดภัยลูกค้ารายละเอียด (Client Security Scorecard)' : '3. CLIENT SECURITY SCORECARD'}
          </h3>
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
              <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px]">
                <tr>
                  <th className="px-4 py-2 w-[30%]">{lang === 'th' ? 'ลูกค้า' : 'CUSTOMER'}</th>
                  <th className="px-4 py-2 text-center w-[15%]">{lang === 'th' ? 'คะแนนความเสี่ยง' : 'RISK SCORE'}</th>
                  <th className="px-4 py-2 text-center w-[15%]">{lang === 'th' ? 'ระดับความเสี่ยง' : 'RISK LEVEL'}</th>
                  <th className="px-4 py-2 text-center w-[13%]">{lang === 'th' ? 'แจ้งเตือนวิกฤต' : 'CRITICAL ALERTS'}</th>
                  <th className="px-4 py-2 text-center w-[13%]">{lang === 'th' ? 'ค้างติดตั้งแพตช์' : 'MISSING PATCHES'}</th>
                  <th className="px-4 py-2 text-right w-[14%]">{lang === 'th' ? 'ตั๋วงานที่ค้าง' : 'OPEN TICKETS'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
                {clientRiskScores.slice(0, 7).map((c) => {
                  let statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200/50';
                  let scoreColor = 'text-emerald-600';
                  if (c.riskScore >= 70) {
                    statusBadge = 'bg-rose-50 text-rose-700 border-rose-200/50 font-black animate-pulse';
                    scoreColor = 'text-rose-600 font-black';
                  } else if (c.riskScore >= 40) {
                    statusBadge = 'bg-amber-50 text-amber-700 border-amber-200/50';
                    scoreColor = 'text-amber-500';
                  }

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-4 py-2 font-bold text-slate-800">{c.name}</td>
                      <td className={`px-4 py-2 text-center font-mono font-black ${scoreColor}`}>{c.riskScore}%</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8.5px] font-extrabold border uppercase ${statusBadge}`}>
                          {c.status === 'Critical Risk' ? (lang === 'th' ? 'วิกฤต' : 'Critical Risk') : 
                           c.status === 'Medium Risk' ? (lang === 'th' ? 'ปานกลาง' : 'Medium Risk') : 
                           (lang === 'th' ? 'ต่ำ' : 'Low Risk')}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center text-slate-500 font-medium">
                        {lang === 'th' ? `${c.custCriticalAlerts} รายการ` : `${c.custCriticalAlerts} Alerts`}
                      </td>
                      <td className="px-4 py-2 text-center text-slate-500 font-medium">
                        {lang === 'th' ? `${c.custMissingPatches} แพตช์` : `${c.custMissingPatches} Patches`}
                      </td>
                      <td className="px-4 py-2 text-right text-slate-500 font-medium">
                        {lang === 'th' ? `${c.custOpenTickets} ตั๋ว` : `${c.custOpenTickets} Tickets`}
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
        <span>
          {lang === 'th' ? `หน้า ${pageNumber} จาก ${totalPages}` : `Page ${pageNumber} of ${totalPages}`}
        </span>
      </div>
    </div>
  );
}
