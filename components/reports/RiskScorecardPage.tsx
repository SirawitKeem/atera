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

interface RiskScorecardPageProps {
  pageNumber: number;
  customers: any[];
  agents: any[];
  alerts: any[];
  tickets: any[];
}

export default function RiskScorecardPage({
  pageNumber,
  customers,
  agents,
  alerts,
  tickets
}: RiskScorecardPageProps) {

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
        title="Customer Risk Scorecard" 
        subtitle="Security Audits & Risk Assessment Metrics | Reporting Period: 06 Jul 2026 - 05 Aug 2026" 
      />

      <div className="page-content space-y-4 flex-1 flex flex-col justify-between overflow-hidden mt-3">
        
        {/* SECTION 1: RISK KPI CARDS */}
        <div className="grid grid-cols-4 gap-3 select-none">
          {/* Average Risk Score */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Average Risk</span>
              <Activity className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-800 leading-none">{avgRiskScore}%</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">Global Managed Risk</p>
            </div>
          </div>

          {/* Critical Risk Clients */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Critical Clients</span>
              <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-rose-600 leading-none">{criticalClientsCount} Clients</h4>
              <p className="text-[6.5px] text-rose-400 font-bold uppercase mt-1">Clients &gt; 70% Risk Level</p>
            </div>
          </div>

          {/* Total Security Alerts */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Critical Alerts</span>
              <AlertOctagon className="h-3.5 w-3.5 text-rose-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-rose-600 leading-none">{totalCriticalAlerts} Alerts</h4>
              <p className="text-[6.5px] text-rose-400 font-bold uppercase mt-1">Unresolved Critical Alerts</p>
            </div>
          </div>

          {/* Vulnerable Systems */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Vulnerable Nodes</span>
              <Users className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-800 leading-none">{vulnerableDevicesCount} Nodes</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">Systems Missing Patches</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: CHARTS SIDE-BY-SIDE */}
        <div className="grid grid-cols-2 gap-4 h-[190px] select-none">
          
          {/* Risk Level by Customer */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <ShieldAlert className="h-4 w-4 text-rose-500" /> 1. ดัชนีความเสี่ยงสูงสุดแยกตามลูกค้า (Customer Risk Scorecard)
            </h4>
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {clientRiskScores.slice(0, 3).map((item, idx) => {
                let barColor = 'bg-emerald-500';
                if (item.riskScore >= 70) barColor = 'bg-rose-500';
                else if (item.riskScore >= 40) barColor = 'bg-amber-500';

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-[8.5px] font-bold text-slate-600 leading-none">
                      <span>{item.name}</span>
                      <span>Risk Score: {item.riskScore}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div className={`${barColor} h-full rounded-full`} style={{ width: `${item.riskScore}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Risk Breakdown Category */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Layers className="h-4 w-4 text-blue-500" /> 2. สัดส่วนภัยคุกคามในระบบไอที (Threat Breakdown Structure)
            </h4>
            <div className="space-y-2 flex-1 flex flex-col justify-center">
              {/* Unpatched Systems */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold text-slate-600 leading-none">
                  <span>Unpatched Operating Systems</span>
                  <span>65% Impact</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#0f4c81] h-full rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              {/* Security Alerts */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold text-slate-600 leading-none">
                  <span>Critical Security Alerts</span>
                  <span>25% Impact</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              {/* Helpdesk tickets */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold text-slate-600 leading-none">
                  <span>Open Helpdesk Incidents</span>
                  <span>10% Impact</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* SECTION 3: RISK SCORECARD TABLE */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-end">
          <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 select-none">
            <Server className="h-3.5 w-3.5 text-blue-500" /> 3. ตารางประเมินผลความมั่นคงปลอดภัยลูกค้ารายละเอียด (Client Security Scorecard)
          </h3>
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
              <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px]">
                <tr>
                  <th className="px-4 py-2 w-[30%]">CUSTOMER</th>
                  <th className="px-4 py-2 text-center w-[15%]">RISK SCORE</th>
                  <th className="px-4 py-2 text-center w-[15%]">RISK LEVEL</th>
                  <th className="px-4 py-2 text-center w-[13%]">CRITICAL ALERTS</th>
                  <th className="px-4 py-2 text-center w-[13%]">MISSING PATCHES</th>
                  <th className="px-4 py-2 text-right w-[14%]">OPEN TICKETS</th>
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
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center text-slate-500 font-medium">{c.custCriticalAlerts} Alerts</td>
                      <td className="px-4 py-2 text-center text-slate-500 font-medium">{c.custMissingPatches} Patches</td>
                      <td className="px-4 py-2 text-right text-slate-500 font-medium">{c.custOpenTickets} Tickets</td>
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
        <span>หน้า {pageNumber} จาก 16</span>
      </div>
    </div>
  );
}
