'use client';

import React from 'react';
import { 
  Users, 
  Monitor, 
  Laptop, 
  Server, 
  Activity,
  Info
} from 'lucide-react';
import { FaLinux } from 'react-icons/fa';
import ReportHeader from './ReportHeader';
import { translations } from '@/lib/translations';
import { StatCard } from '@/components/ui/StatCard';

interface DevicesPageProps {
  pageNumber: number;
  customers: any[];
  agents: any[];
  contracts: any[];
  contacts?: any[];
  totalPages?: number;
  dateRangeDisplay?: string;
  lang?: string;
  companyName?: string;
}

export default function DevicesPage({
  pageNumber,
  customers,
  agents,
  contracts,
  contacts = [],
  totalPages = 9,
  dateRangeDisplay,
  lang = 'th',
  companyName = 'Atera Client'
}: DevicesPageProps) {
  const t = translations[lang as 'th' | 'en'] || translations.th;

  const totalCustomers = customers.length;
  const totalDevices = agents.length;
  
  // 1. Mutually Exclusive OS / Device Counts
  const linuxCount = agents.filter(a => {
    const os = (a.OS || a.os || '').toLowerCase();
    const type = (a.DeviceType || a.deviceType || '').toLowerCase();
    return os.includes('linux') || type.includes('linux');
  }).length;

  const serverCount = agents.filter(a => {
    const os = (a.OS || a.os || '').toLowerCase();
    const type = (a.DeviceType || a.deviceType || '').toLowerCase();
    const osType = (a.OSType || a.osType || '').toLowerCase();
    const isLinux = os.includes('linux') || type.includes('linux');
    return !isLinux && (type.includes('server') || osType.includes('server') || os.includes('server'));
  }).length;

  const pcCount = totalDevices - (linuxCount + serverCount);

  // 2. Process Customers data (Device counts per customer)
  const customerList = customers.map((c, idx) => {
    const id = c.CustomerID || c.id || idx + 1;
    const name = c.CustomerName || c.name || 'N/A';
    
    const custAgents = agents.filter(a => a.CustomerID === id || a.customerId === id);
    const totalCustDevices = custAgents.length;
    
    const linuxCust = custAgents.filter(a => {
      const os = (a.OS || a.os || '').toLowerCase();
      const type = (a.DeviceType || a.deviceType || '').toLowerCase();
      return os.includes('linux') || type.includes('linux');
    }).length;

    const serverCust = custAgents.filter(a => {
      const os = (a.OS || a.os || '').toLowerCase();
      const type = (a.DeviceType || a.deviceType || '').toLowerCase();
      const osType = (a.OSType || a.osType || '').toLowerCase();
      const isLinux = os.includes('linux') || type.includes('linux');
      return !isLinux && (type.includes('server') || osType.includes('server') || os.includes('server'));
    }).length;

    const pcCust = totalCustDevices - (linuxCust + serverCust);

    return {
      id,
      name,
      totalCustDevices,
      pcCust,
      serverCust,
      linuxCust
    };
  }).sort((a, b) => b.totalCustDevices - a.totalCustDevices);

  const topCustomersChart = customerList.slice(0, 5);

  const activeCustomerList = customerList.filter(c => c.totalCustDevices > 0);
  const displayedCustomers = activeCustomerList.slice(0, 5);
  const otherCustomers = activeCustomerList.slice(5);
  const hasOthers = otherCustomers.length > 0;

  const othersTotalDevices = otherCustomers.reduce((sum, c) => sum + c.totalCustDevices, 0);
  const othersPC = otherCustomers.reduce((sum, c) => sum + c.pcCust, 0);
  const othersServer = otherCustomers.reduce((sum, c) => sum + c.serverCust, 0);
  const othersLinux = otherCustomers.reduce((sum, c) => sum + c.linuxCust, 0);

  // 3. Device Category Distribution percentages
  const pcPercent = totalDevices > 0 ? Math.round((pcCount / totalDevices) * 100) : 0;
  const serverPercent = totalDevices > 0 ? Math.round((serverCount / totalDevices) * 100) : 0;
  const linuxPercent = totalDevices > 0 ? Math.round((linuxCount / totalDevices) * 100) : 0;

  // Horizontal bar scale calculation
  const maxDevices = topCustomersChart.length > 0
    ? Math.max(...topCustomersChart.map(c => c.totalCustDevices))
    : 1;
  const safeMaxDevices = isNaN(maxDevices) || maxDevices <= 0 || maxDevices === -Infinity || maxDevices === Infinity ? 1 : maxDevices;
  const scaleTicks = Array.from({ length: 6 }, (_, idx) => Math.round((safeMaxDevices / 5) * idx));

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
      <ReportHeader 
        title={t.devicesTitle} 
        subtitle={t.devicesSubtitle} 
        lang={lang}
        dateRangeDisplay={dateRangeDisplay}
      />

      <div className="page-content space-y-4 flex-1 flex flex-col justify-between overflow-hidden mt-3">
        
        {/* SECTION 1: CUSTOMER SUMMARY & DEVICE SUMMARY */}
        <div className="space-y-1.5">
          <div className="grid grid-cols-5 gap-2">
            <StatCard label="Customers" value={totalCustomers} detail={t.totalCustomers} icon={<Users />} tone="moderate" />
            <StatCard label="Total Devices" value={totalDevices} detail="Managed RMM" icon={<Monitor />} tone="moderate" />
            <StatCard label="PC" value={pcCount} detail="Windows, macOS" icon={<Laptop />} tone="moderate" />
            <StatCard label="Server" value={serverCount} detail="Windows Server" icon={<Server />} tone="moderate" />
            <StatCard label="Linux" value={linuxCount} detail="Linux OS" icon={<FaLinux />} tone="moderate" />
          </div>
        </div>

        {/* SECTION 2: CHARTS SIDE-BY-SIDE */}
        <div className="grid grid-cols-2 gap-4 h-[210px] ">
          
          {/* Customer Distribution Chart */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[210px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Users className="h-4 w-4 text-blue-500" /> {lang === 'th' ? 'CUSTOMER DISTRIBUTION' : 'CUSTOMER DISTRIBUTION'}
            </h4>
            <div className="space-y-2.5 flex-1 flex flex-col justify-center">
              {topCustomersChart.map((c) => {
                const percentage = totalDevices > 0 ? Math.round((c.totalCustDevices / totalDevices) * 100) : 0;
                return (
                  <div key={c.id} className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-bold text-slate-600 leading-none">
                      <span className="truncate max-w-[150px]">{c.name}</span>
                      <span>
                        {lang === 'th' ? `${c.totalCustDevices} เครื่อง (${percentage}%)` : `${c.totalCustDevices} Devices (${percentage}%)`}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                      <div className="bg-[#0f4c81] h-full rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Chart Grid Ticks */}
            <div className="mt-2 pt-1 border-t border-slate-100 flex justify-between text-[8px] font-black text-slate-400 font-mono px-1">
              {scaleTicks.map((tick, i) => (
                <span key={i} className="w-4 text-center">{tick}</span>
              ))}
            </div>
            <p className="text-center text-[8px] font-bold text-slate-400 mt-0.5 uppercase">
              {lang === 'th' ? 'จำนวนอุปกรณ์ (Devices)' : 'Devices'}
            </p>
          </div>

          {/* Device Category Distribution Chart */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[210px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Activity className="h-4 w-4 text-blue-500" /> {lang === 'th' ? 'DEVICE SHARE' : 'DEVICE SHARE'}
            </h4>
            
            <div className="flex items-center gap-6 flex-1 justify-center py-1">
              {/* Doughnut SVG Representation */}
              <div className="relative h-20 w-20 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="3.5"></circle>
                  
                  {/* PC Segment */}
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#3b82f6" strokeWidth="3.5"
                    strokeDasharray={`${pcPercent} 100`} strokeDashoffset="0"></circle>
                  
                  {/* Server Segment */}
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#475569" strokeWidth="3.5"
                    strokeDasharray={`${serverPercent} 100`} strokeDashoffset={`-${pcPercent}`}></circle>
                  
                  {/* Linux Segment */}
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#94a3b8" strokeWidth="3.5"
                    strokeDasharray={`${linuxPercent} 100`} strokeDashoffset={`-${pcPercent + serverPercent}`}></circle>
                </svg>
                <div className="absolute text-[9.5px] font-black text-slate-700 text-center leading-none">
                  Device<br/>Share
                </div>
              </div>

              {/* Legends with dynamic counts */}
              <div className="space-y-1 text-[9.5px] font-bold text-slate-600 flex-1">
                <div className="flex items-center justify-between border-b border-slate-50 pb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-blue-500"></span>
                    <span>PC</span>
                  </div>
                  <span className="text-slate-800 font-extrabold">
                    {lang === 'th' ? `${pcCount} เครื่อง (${pcPercent}%)` : `${pcCount} (${pcPercent}%)`}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-50 pb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-slate-600"></span>
                    <span>Server</span>
                  </div>
                  <span className="text-slate-800 font-extrabold">
                    {lang === 'th' ? `${serverCount} เครื่อง (${serverPercent}%)` : `${serverCount} (${serverPercent}%)`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-slate-400"></span>
                    <span>Linux</span>
                  </div>
                  <span className="text-slate-800 font-extrabold">
                    {lang === 'th' ? `${linuxCount} เครื่อง (${linuxPercent}%)` : `${linuxCount} (${linuxPercent}%)`}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Message Box */}
            <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-2 flex items-start gap-1.5 text-[8.5px] text-blue-700 font-medium">
              <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-blue-500" />
              <span>
                {lang === 'th'
                  ? `Server เป็นอุปกรณ์หลักที่ใช้งาน คิดเป็น ${serverPercent}% ของอุปกรณ์ทั้งหมดในเครือข่าย`
                  : `Server is the primary device type, representing ${serverPercent}% of all network devices.`}
              </span>
            </div>
          </div>

        </div>

        {/* SECTION 3: TOP CUSTOMERS INVENTORY TABLE */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-end">
          <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 ">
            <Server className="h-3.5 w-3.5 text-blue-500" /> {lang === 'th' ? 'TOP CUSTOMER INVENTORY' : 'TOP CUSTOMER INVENTORY'}
          </h3>
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
              <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px]">
                <tr>
                  <th className="px-4 py-2 w-[40%]">{lang === 'th' ? 'ลูกค้า' : 'CUSTOMER'}</th>
                  <th className="px-4 py-2 text-center w-[20%]">{lang === 'th' ? 'อุปกรณ์ทั้งหมด' : 'DEVICES (TOTAL)'}</th>
                  <th className="px-4 py-2 text-center w-[15%]">PC</th>
                  <th className="px-4 py-2 text-center w-[15%]">SERVER</th>
                  <th className="px-4 py-2 text-center w-[10%] font-bold">LINUX</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
                {displayedCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/20 transition-colors">
                    <td className="px-4 py-2 font-bold text-slate-800">{c.name}</td>
                    <td className="px-4 py-2 text-center text-slate-900 font-extrabold">
                      {lang === 'th' ? `${c.totalCustDevices} เครื่อง` : `${c.totalCustDevices} Devices`}
                    </td>
                    <td className="px-4 py-2 text-center text-slate-500 font-medium">{c.pcCust}</td>
                    <td className="px-4 py-2 text-center text-slate-500 font-medium">{c.serverCust}</td>
                    <td className="px-4 py-2 text-center text-slate-500 font-medium">{c.linuxCust}</td>
                  </tr>
                ))}
                
                {hasOthers && (
                  <tr className="hover:bg-slate-50/20 transition-colors italic text-slate-500">
                    <td className="px-4 py-2 font-bold">{lang === 'th' ? 'ลูกค้าอื่น ๆ' : 'Other Customers'}</td>
                    <td className="px-4 py-2 text-center font-extrabold">
                      {lang === 'th' ? `${othersTotalDevices} เครื่อง` : `${othersTotalDevices} Devices`}
                    </td>
                    <td className="px-4 py-2 text-center">{othersPC}</td>
                    <td className="px-4 py-2 text-center">{othersServer}</td>
                    <td className="px-4 py-2 text-center">{othersLinux}</td>
                  </tr>
                )}
                
                {/* Grand Total Summary Row */}
                <tr className="bg-slate-50/80 font-extrabold text-slate-800">
                  <td className="px-4 py-2.5 font-black">{lang === 'th' ? 'รวมทั้งหมด (TOTAL)' : 'TOTAL'}</td>
                  <td className="px-4 py-2.5 text-center text-slate-900 font-black">
                    {lang === 'th' ? `${totalDevices} เครื่อง` : `${totalDevices} Devices`}
                  </td>
                  <td className="px-4 py-2.5 text-center">{pcCount}</td>
                  <td className="px-4 py-2.5 text-center">{serverCount}</td>
                  <td className="px-4 py-2.5 text-center">{linuxCount}</td>
                </tr>
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
