'use client';

import React from 'react';
import { 
  Users, 
  UserCheck, 
  Contact, 
  FileText, 
  Monitor, 
  Laptop, 
  Server, 
  Activity,
  Terminal,
  ShieldCheck,
  Info,
  TrendingUp
} from 'lucide-react';
import ReportHeader from './ReportHeader';
import { translations } from '@/lib/translations';

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
  const activeCustomersCount = customers.filter(c => agents.some(a => a.CustomerID === c.CustomerID || a.customerId === c.id)).length || customers.length;
  const inactiveCustomersCount = Math.max(0, totalCustomers - activeCustomersCount);
  const totalContractsCount = contracts.length;
  const totalDevices = agents.length;
  const winCount = agents.filter(a => (a.OS || a.os || '').toLowerCase().includes('win')).length;
  const macCount = agents.filter(a => (a.OS || a.os || '').toLowerCase().includes('mac') || (a.OS || a.os || '').toLowerCase().includes('darwin')).length;
  const linuxCount = agents.filter(a => (a.OS || a.os || '').toLowerCase().includes('linux') || (a.OS || a.os || '').toLowerCase().includes('ubuntu')).length;
  const otherCount = Math.max(0, totalDevices - (winCount + macCount + linuxCount));

  const serverCount = agents.filter(a => {
    const type = String(a.DeviceType || a.deviceType || '').toLowerCase();
    const osType = String(a.OSType || a.osType || '').toLowerCase();
    const os = String(a.OS || a.os || '').toLowerCase();
    return type.includes('server') || osType.includes('server') || osType.includes('controller') || os.includes('server');
  }).length;

  const workstationCount = totalDevices - serverCount;

  const onlineCount = agents.filter(a => a.Online === true || a.online === true || String(a.Online).toLowerCase() === 'true').length;
  const offlineCount = totalDevices - onlineCount;
  const onlineRatio = totalDevices > 0 ? Math.round((onlineCount / totalDevices) * 100) : 100;
  const totalContactsCount = contacts.length;

  // 3. Process Customers data (Device counts per customer)
  const customerList = customers.map((c, idx) => {
    const id = c.CustomerID || c.id || idx + 1;
    const name = c.CustomerName || c.name || 'N/A';
    
    const custAgents = agents.filter(a => a.CustomerID === id || a.customerId === id);
    const totalCustDevices = custAgents.length;
    const winCust = custAgents.filter(a => (a.OS || a.os || '').toLowerCase().includes('win')).length;
    const macCust = custAgents.filter(a => (a.OS || a.os || '').toLowerCase().includes('mac') || (a.OS || a.os || '').toLowerCase().includes('darwin')).length;
    const linuxCust = custAgents.filter(a => (a.OS || a.os || '').toLowerCase().includes('linux') || (a.OS || a.os || '').toLowerCase().includes('ubuntu')).length;

    const onlineCustCount = custAgents.filter(a => a.Online === true || a.online === true || String(a.Online).toLowerCase() === 'true').length;
    const custAvailability = totalCustDevices > 0 ? Math.round((onlineCustCount / totalCustDevices) * 100) : 100;

    return {
      id,
      name,
      totalCustDevices,
      winCust,
      macCust,
      linuxCust,
      custAvailability
    };
  }).sort((a, b) => b.totalCustDevices - a.totalCustDevices);

  const topCustomersChart = customerList.slice(0, 5);

  const activeCustomerList = customerList.filter(c => c.totalCustDevices > 0);
  const displayedCustomers = activeCustomerList.slice(0, 5);
  const otherCustomers = activeCustomerList.slice(5);
  const hasOthers = otherCustomers.length > 0;

  const othersTotalDevices = otherCustomers.reduce((sum, c) => sum + c.totalCustDevices, 0);
  const othersWin = otherCustomers.reduce((sum, c) => sum + c.winCust, 0);
  const othersMac = otherCustomers.reduce((sum, c) => sum + c.macCust, 0);
  const othersLinux = otherCustomers.reduce((sum, c) => sum + c.linuxCust, 0);
  const othersAvailability = otherCustomers.length > 0
    ? Math.round(otherCustomers.reduce((sum, c) => sum + c.custAvailability, 0) / otherCustomers.length)
    : 100;

  // 4. OS Distribution percentages
  const winPercent = totalDevices > 0 ? Math.round((winCount / totalDevices) * 100) : 0;
  const macPercent = totalDevices > 0 ? Math.round((macCount / totalDevices) * 100) : 0;
  const linuxPercent = totalDevices > 0 ? Math.round((linuxCount / totalDevices) * 100) : 0;
  const otherPercent = totalDevices > 0 ? Math.round((otherCount / totalDevices) * 100) : 0;

  // Horizontal bar scale calculation
  const maxDevices = topCustomersChart.length > 0
    ? Math.max(...topCustomersChart.map(c => c.totalCustDevices))
    : 1;
  const safeMaxDevices = isNaN(maxDevices) || maxDevices <= 0 || maxDevices === -Infinity || maxDevices === Infinity ? 1 : maxDevices;
  const scaleTicks = Array.from({ length: 6 }, (_, idx) => Math.round((safeMaxDevices / 5) * idx));

  // Windows SVG Logo Helper
  const renderWindowsLogo = () => (
    <svg className="h-4.5 w-4.5 text-blue-500 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.1zM10.8 1.95L24 0v11.55H10.8V1.95zM10.8 12.45H24v11.55l-13.2-1.95v-9.6z" />
    </svg>
  );

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
        
        {/* SECTION 1: CUSTOMER SUMMARY & DEVICE SUMMARY (With Premium Icons & English values) */}
        <div className="flex justify-between gap-4 ">
          
          {/* Customer Summary (Left Side) */}
          <div className="w-[49%] space-y-1.5">
            <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
              {lang === 'th' ? '1. สรุปข้อมูลลูกค้า (CUSTOMER SUMMARY)' : '1. CUSTOMER SUMMARY'}
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {/* Total Customers */}
              <div className="bg-white border border-slate-100 rounded-xl p-2 flex flex-col justify-between shadow-xs h-[74px]">
                <div className="flex items-center justify-between">
                  <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                    {lang === 'th' ? 'ลูกค้า' : 'Customers'}
                  </span>
                  <Users className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-800 leading-none">
                    {lang === 'th' ? `${totalCustomers} ราย` : `${totalCustomers} Clients`}
                  </h4>
                  <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                    {t.totalCustomers}
                  </p>
                </div>
              </div>

              {/* Active Customers */}
              <div className="bg-white border border-slate-100 rounded-xl p-2 flex flex-col justify-between shadow-xs h-[74px]">
                <div className="flex items-center justify-between">
                  <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                    {lang === 'th' ? 'ใช้งานอยู่' : 'Active'}
                  </span>
                  <UserCheck className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-800 leading-none">
                    {lang === 'th' ? `${activeCustomersCount} ราย` : `${activeCustomersCount} Clients`}
                  </h4>
                  <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                    {lang === 'th' ? `ไม่ได้ใช้งาน: ${inactiveCustomersCount}` : `Inactive: ${inactiveCustomersCount}`}
                  </p>
                </div>
              </div>

              {/* Contacts */}
              <div className="bg-white border border-slate-100 rounded-xl p-2 flex flex-col justify-between shadow-xs h-[74px]">
                <div className="flex items-center justify-between">
                  <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                    {lang === 'th' ? 'ผู้ติดต่อ' : 'Contacts'}
                  </span>
                  <Contact className="h-3.5 w-3.5 text-indigo-500" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-800 leading-none">
                    {lang === 'th' ? `${totalContactsCount} รายชื่อ` : `${totalContactsCount} Contacts`}
                  </h4>
                  <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                    {lang === 'th' ? 'บัญชีหลัก' : 'Primary Accounts'}
                  </p>
                </div>
              </div>

              {/* Protected Devices */}
              <div className="bg-white border border-slate-100 rounded-xl p-2 flex flex-col justify-between shadow-xs h-[74px]">
                <div className="flex items-center justify-between">
                  <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                    {lang === 'th' ? 'ที่คุ้มครอง' : 'Protected'}
                  </span>
                  <FileText className="h-3.5 w-3.5 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-800 leading-none">
                    {lang === 'th' ? `${totalContractsCount} สัญญา` : `${totalContractsCount} Contracts`}
                  </h4>
                  <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                    {lang === 'th' ? 'บริการตาม SLA' : 'Service SLAs'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Device Summary (Right Side) */}
          <div className="w-[49%] space-y-1.5">
            <h3 className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
              {lang === 'th' ? '2. สรุปข้อมูลอุปกรณ์และระบบ (INFRASTRUCTURE SUMMARY)' : '2. INFRASTRUCTURE SUMMARY'}
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {/* Total Agents */}
              <div className="bg-white border border-slate-100 rounded-xl p-2 flex flex-col justify-between shadow-xs h-[74px]">
                <div className="flex items-center justify-between">
                  <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                    {lang === 'th' ? 'อุปกรณ์ทั้งหมด' : 'Total Agents'}
                  </span>
                  <Monitor className="h-3.5 w-3.5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-800 leading-none">
                    {lang === 'th' ? `${totalDevices} เครื่อง` : `${totalDevices} Agents`}
                  </h4>
                  <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                    {lang === 'th' ? 'จัดการผ่าน RMM' : 'Managed RMM'}
                  </p>
                </div>
              </div>

              {/* Workstations */}
              <div className="bg-white border border-slate-100 rounded-xl p-2 flex flex-col justify-between shadow-xs h-[74px]">
                <div className="flex items-center justify-between">
                  <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                    {lang === 'th' ? 'เครื่องผู้ใช้' : 'Workstations'}
                  </span>
                  <Laptop className="h-3.5 w-3.5 text-sky-500" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-800 leading-none">
                    {lang === 'th' ? `${workstationCount} เครื่อง` : `${workstationCount} Devices`}
                  </h4>
                  <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                    Win & Mac & Linux
                  </p>
                </div>
              </div>

              {/* Servers */}
              <div className="bg-white border border-slate-100 rounded-xl p-2 flex flex-col justify-between shadow-xs h-[74px]">
                <div className="flex items-center justify-between">
                  <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                    {lang === 'th' ? 'เซิร์ฟเวอร์' : 'Servers'}
                  </span>
                  <Server className="h-3.5 w-3.5 text-indigo-500" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-800 leading-none">
                    {lang === 'th' ? `${serverCount} เครื่อง` : `${serverCount} Devices`}
                  </h4>
                  <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                    Active Servers
                  </p>
                </div>
              </div>

              {/* Linux & Others */}
              <div className="bg-white border border-slate-100 rounded-xl p-2 flex flex-col justify-between shadow-xs h-[74px]">
                <div className="flex items-center justify-between">
                  <span className="text-[7.5px] font-extrabold text-slate-400 uppercase tracking-wider block leading-none">
                    {lang === 'th' ? 'ลินุกซ์และอื่น ๆ' : 'Linux & Others'}
                  </span>
                  <Terminal className="h-3.5 w-3.5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-base font-black text-slate-800 leading-none">
                    {lang === 'th' ? `${linuxCount + otherCount} เครื่อง` : `${linuxCount + otherCount} Devices`}
                  </h4>
                  <p className="text-[7px] text-slate-400 font-bold uppercase mt-1">
                    Linux & Others
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: CHARTS SIDE-BY-SIDE (Fixed Height layout to resolve vertical stretching) */}
        <div className="grid grid-cols-2 gap-4 h-[210px] ">
          
          {/* Customer Distribution Chart */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[210px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Users className="h-4 w-4 text-blue-500" /> {lang === 'th' ? '3. การกระจายอุปกรณ์ตามลูกค้า (CUSTOMER DISTRIBUTION)' : '3. CUSTOMER DISTRIBUTION'}
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

          {/* OS Distribution Chart (Larger Donut Chart with correct spacing) */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs flex flex-col justify-between h-[210px]">
            <h4 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Activity className="h-4 w-4 text-blue-500" /> {lang === 'th' ? '4. สัดส่วนระบบปฏิบัติการ (OPERATING SYSTEM SHARE)' : '4. OPERATING SYSTEM SHARE'}
            </h4>
            
            <div className="flex items-center gap-6 flex-1 justify-center py-1">
              {/* Doughnut SVG Representation */}
              <div className="relative h-20 w-20 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#f1f5f9" strokeWidth="3.5"></circle>
                  
                  {/* Windows Segment */}
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#3b82f6" strokeWidth="3.5"
                    strokeDasharray={`${winPercent} 100`} strokeDashoffset="0"></circle>
                  
                  {/* macOS Segment */}
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#94a3b8" strokeWidth="3.5"
                    strokeDasharray={`${macPercent} 100`} strokeDashoffset={`-${winPercent}`}></circle>
                  
                  {/* Linux Segment */}
                  <circle cx="18" cy="18" r="16" fill="transparent" stroke="#10b981" strokeWidth="3.5"
                    strokeDasharray={`${linuxPercent} 100`} strokeDashoffset={`-${winPercent + macPercent}`}></circle>
                </svg>
                <div className="absolute text-[9.5px] font-black text-slate-700 text-center leading-none">
                  OS<br/>Share
                </div>
              </div>

              {/* Legends with dynamic counts */}
              <div className="space-y-1 text-[9.5px] font-bold text-slate-600 flex-1">
                <div className="flex items-center justify-between border-b border-slate-50 pb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-blue-500"></span>
                    <span>Windows</span>
                  </div>
                  <span className="text-slate-800 font-extrabold">
                    {lang === 'th' ? `${winCount} เครื่อง (${winPercent}%)` : `${winCount} (${winPercent}%)`}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-50 pb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-slate-400"></span>
                    <span>macOS</span>
                  </div>
                  <span className="text-slate-800 font-extrabold">
                    {lang === 'th' ? `${macCount} เครื่อง (${macPercent}%)` : `${macCount} (${macPercent}%)`}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-50 pb-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                    <span>Linux</span>
                  </div>
                  <span className="text-slate-800 font-extrabold">
                    {lang === 'th' ? `${linuxCount} เครื่อง (${linuxPercent}%)` : `${linuxCount} (${linuxPercent}%)`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-slate-200"></span>
                    <span>Others</span>
                  </div>
                  <span className="text-slate-800 font-extrabold">
                    {lang === 'th' ? `${otherCount} เครื่อง (${otherPercent}%)` : `${otherCount} (${otherPercent}%)`}
                  </span>
                </div>
              </div>
            </div>

            {/* Info Message Box inside Donut Container */}
            <div className="mt-2 bg-blue-50 border border-blue-100 rounded-lg p-2 flex items-start gap-1.5 text-[8.5px] text-blue-700 font-medium">
              <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-blue-500" />
              <span>
                {lang === 'th'
                  ? `Windows เป็นระบบหลักที่ใช้งาน คิดเป็น ${winPercent}% ของอุปกรณ์ทั้งหมดในเครือข่าย`
                  : `Windows is the primary operating system, representing ${winPercent}% of all network devices.`}
              </span>
            </div>
          </div>

        </div>

        {/* SECTION 3: TOP CUSTOMERS INVENTORY TABLE */}
        <div className="space-y-1.5 flex-1 flex flex-col justify-end">
          <h3 className="text-[9px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 ">
            <Server className="h-3.5 w-3.5 text-blue-500" /> {lang === 'th' ? '5. สินทรัพย์อุปกรณ์แยกตามลูกค้า (TOP CUSTOMER INVENTORY)' : '5. TOP CUSTOMER INVENTORY'}
          </h3>
          <div className="border border-slate-100 rounded-lg overflow-hidden bg-white/70 backdrop-blur-xs shadow-xs flex-1">
            <table className="min-w-full divide-y divide-slate-100 text-[10px] text-left">
              <thead className="bg-[#0f4c81] text-white font-bold uppercase tracking-wider text-[7.5px]">
                <tr>
                  <th className="px-4 py-2 w-[35%]">{lang === 'th' ? 'ลูกค้า' : 'CUSTOMER'}</th>
                  <th className="px-4 py-2 text-center w-[15%]">{lang === 'th' ? 'อุปกรณ์ทั้งหมด' : 'DEVICES (TOTAL)'}</th>
                  <th className="px-4 py-2 text-center w-[12%]">WINDOWS</th>
                  <th className="px-4 py-2 text-center w-[12%]">MACOS</th>
                  <th className="px-4 py-2 text-center w-[12%]">LINUX</th>
                  <th className="px-4 py-2 text-right w-[14%]">{lang === 'th' ? 'ความพร้อมใช้งาน' : 'AVAILABILITY'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold bg-white/50">
                {displayedCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/20 transition-colors">
                    <td className="px-4 py-2 font-bold text-slate-800">{c.name}</td>
                    <td className="px-4 py-2 text-center text-slate-900 font-extrabold">
                      {lang === 'th' ? `${c.totalCustDevices} เครื่อง` : `${c.totalCustDevices} Devices`}
                    </td>
                    <td className="px-4 py-2 text-center text-slate-500 font-medium">{c.winCust}</td>
                    <td className="px-4 py-2 text-center text-slate-500 font-medium">{c.macCust}</td>
                    <td className="px-4 py-2 text-center text-slate-500 font-medium">{c.linuxCust}</td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-bold text-emerald-600">{c.custAvailability}%</span>
                        <div className="w-14 bg-slate-100 h-1.5 rounded-full overflow-hidden flex-shrink-0">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${c.custAvailability}%` }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                
                {hasOthers && (
                  <tr className="hover:bg-slate-50/20 transition-colors italic text-slate-500">
                    <td className="px-4 py-2 font-bold">{lang === 'th' ? 'ลูกค้าอื่น ๆ' : 'Other Customers'}</td>
                    <td className="px-4 py-2 text-center font-extrabold">
                      {lang === 'th' ? `${othersTotalDevices} เครื่อง` : `${othersTotalDevices} Devices`}
                    </td>
                    <td className="px-4 py-2 text-center">{othersWin}</td>
                    <td className="px-4 py-2 text-center">{othersMac}</td>
                    <td className="px-4 py-2 text-center">{othersLinux}</td>
                    <td className="px-4 py-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-bold">{othersAvailability}%</span>
                        <div className="w-14 bg-slate-100 h-1.5 rounded-full overflow-hidden flex-shrink-0">
                          <div className="bg-emerald-450 h-full rounded-full" style={{ width: `${othersAvailability}%` }}></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                
                {/* Grand Total Summary Row */}
                <tr className="bg-slate-50/80 font-extrabold text-slate-800">
                  <td className="px-4 py-2.5 font-black">{lang === 'th' ? 'รวมทั้งหมด (TOTAL)' : 'TOTAL'}</td>
                  <td className="px-4 py-2.5 text-center text-slate-900 font-black">
                    {lang === 'th' ? `${totalDevices} เครื่อง` : `${totalDevices} Devices`}
                  </td>
                  <td className="px-4 py-2.5 text-center">{winCount}</td>
                  <td className="px-4 py-2.5 text-center">{macCount}</td>
                  <td className="px-4 py-2.5 text-center">{linuxCount}</td>
                  <td className="px-4 py-2.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-black text-emerald-600">{onlineRatio}%</span>
                      <div className="w-14 bg-slate-100 h-1.5 rounded-full overflow-hidden flex-shrink-0">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${onlineRatio}%` }}></div>
                      </div>
                    </div>
                  </td>
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
