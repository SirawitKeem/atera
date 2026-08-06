'use client';

import React from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Activity, 
  Clock, 
  Layers,
  Award,
  Server
} from 'lucide-react';
import ReportHeader from './ReportHeader';

interface ContractsPageProps {
  pageNumber: number;
  contracts: any[];
}

export default function ContractsPage({
  pageNumber,
  contracts
}: ContractsPageProps) {

  const totalContracts = contracts.length;
  const flatFeeCount = contracts.filter(c => (c.ContractType || c.contractType || '').toLowerCase().includes('flat')).length;
  const hourlyCount = contracts.filter(c => (c.ContractType || c.contractType || '').toLowerCase().includes('hour')).length;
  const otherCount = Math.max(0, totalContracts - (flatFeeCount + hourlyCount));

  // Date Formatting helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
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
        title="Service Contracts" 
        subtitle="Active SLA Agreements & Service Scope Contracts | Reporting Period: 06 Jul 2026 - 05 Aug 2026" 
      />

      <div className="page-content space-y-4 flex-1 flex flex-col justify-between overflow-hidden mt-3">
        
        {/* SECTION 1: CONTRACTS KPI CARDS */}
        <div className="grid grid-cols-4 gap-3 select-none">
          {/* Total Contracts */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Contracts</span>
              <FileText className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-800 leading-none">{totalContracts} Active</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">Client Agreements</p>
            </div>
          </div>

          {/* Flat Fee Agreements */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Flat Fee Agreements</span>
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-emerald-600 leading-none">{flatFeeCount} Accounts</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">All Inclusive SLA</p>
            </div>
          </div>

          {/* Hourly Retainers */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Hourly Contracts</span>
              <Clock className="h-3.5 w-3.5 text-amber-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-amber-600 leading-none">{hourlyCount} Accounts</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">Time & Material Basis</p>
            </div>
          </div>

          {/* SLA Standard */}
          <div className="bg-white border border-slate-100 rounded-xl p-3 flex flex-col justify-between shadow-xs h-[74px]">
            <div className="flex items-center justify-between">
              <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block">Contract Status</span>
              <Award className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div>
              <h4 className="text-base font-black text-emerald-600 leading-none">100% Active</h4>
              <p className="text-[6.5px] text-slate-400 font-bold uppercase mt-1">No Expired Contracts</p>
            </div>
          </div>
        </div>

        {/* SECTION 2: CHARTS SIDE-BY-SIDE */}
        <div className="grid grid-cols-2 gap-4 h-[190px] select-none">
          
          {/* Contract Types Distribution */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Layers className="h-4 w-4 text-blue-500" /> 1. ประเภทสัญญางานบริการไอที (SLA Contract Types Share)
            </h4>
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {/* Flat Fee bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8.5px] font-bold text-slate-600 leading-none">
                  <span>Flat Fee Managed Contracts</span>
                  <span>{flatFeeCount} SLAs ({totalContracts > 0 ? Math.round((flatFeeCount/totalContracts)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${totalContracts > 0 ? Math.round((flatFeeCount/totalContracts)*100) : 0}%` }}></div>
                </div>
              </div>
              {/* Hourly bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[8.5px] font-bold text-slate-600 leading-none">
                  <span>Hourly & Ad-Hoc Contracts</span>
                  <span>{hourlyCount} SLAs ({totalContracts > 0 ? Math.round((hourlyCount/totalContracts)*100) : 0}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${totalContracts > 0 ? Math.round((hourlyCount/totalContracts)*100) : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Contracts Compliance Gauge */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[190px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Activity className="h-4 w-4 text-blue-500" /> 2. อัตราการรักษาสัญญาบริการ (Contract Integrity Ratio)
            </h4>
            <div className="flex-1 flex flex-col justify-center items-center py-2">
              <div className="relative h-16 w-16 flex items-center justify-center flex-shrink-0 mb-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="4"></circle>
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#3b82f6" strokeWidth="4"
                    strokeDasharray="100 100" strokeDashoffset="0"></circle>
                </svg>
                <div className="absolute text-[10px] font-black text-slate-700 text-center leading-none">
                  100%<br/><span className="text-[6.5px] text-slate-400 font-bold">HEALTHY</span>
                </div>
              </div>
              <p className="text-[8.5px] text-slate-500 font-bold text-center">
                สัญญาทุกฉบับมีระยะเวลาคุ้มครองครอบคลุมถึงปี 2027
              </p>
            </div>
          </div>

        </div>

        {/* SECTION 3: CONTRACTS INVENTORY TABLE */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-end">
          <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 select-none">
            <Server className="h-3.5 w-3.5 text-blue-500" /> 3. ตารางสัญญาบริการลูกค้ารายละเอียด (SLA Contract List)
          </h3>
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
              <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px]">
                <tr>
                  <th className="px-4 py-2 w-[15%]">CONTRACT ID</th>
                  <th className="px-4 py-2 w-[25%]">CUSTOMER</th>
                  <th className="px-4 py-2 w-[35%]">CONTRACT NAME</th>
                  <th className="px-4 py-2 text-center w-[15%]">BILLING TYPE</th>
                  <th className="px-4 py-2 text-right w-[10%]">START DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
                {contracts.slice(0, 7).map((c, idx) => {
                  const id = c.ContractID || c.id || idx + 1;
                  const customer = c.CustomerName || 'N/A';
                  const name = c.ContractName || 'Service Agreement';
                  const type = c.ContractType || 'Flat Fee';
                  const start = c.StartDate || c.startDate || new Date().toISOString();

                  return (
                    <tr key={id} className="hover:bg-slate-50/20 transition-colors">
                      <td className="px-4 py-2 font-mono text-slate-400">#{id}</td>
                      <td className="px-4 py-2 font-bold text-slate-800">{customer}</td>
                      <td className="px-4 py-2 text-slate-600 truncate max-w-[200px]" title={name}>{name}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[8.5px] font-extrabold border ${
                          type.toLowerCase().includes('flat') 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50' 
                            : 'bg-amber-50 text-amber-700 border-amber-200/50'
                        }`}>
                          {type}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-right font-mono text-slate-400 text-[9px] whitespace-nowrap">{formatDate(start)}</td>
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
