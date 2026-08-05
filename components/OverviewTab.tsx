'use client';

import React from 'react';
import { 
  Users, 
  Laptop, 
  Ticket, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp
} from 'lucide-react';

interface OverviewTabProps {
  customers: any[];
  agents: any[];
  tickets: any[];
  alerts: any[];
}

export default function OverviewTab({ customers, agents, tickets, alerts }: OverviewTabProps) {
  const totalCustomers = customers.length;
  const totalDevices = agents.length;
  const onlineDevices = agents.filter(a => a.Online === true || a.online === true || String(a.Online).toLowerCase() === 'true').length;
  const offlineDevices = totalDevices - onlineDevices;
  const onlineRatio = totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 100;

  // Tickets stats
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => {
    const status = (t.TicketStatus || t.status || '').toLowerCase();
    return status === 'open' || status === 'new' || status === 'pending';
  }).length;

  // Alerts stats
  const activeAlerts = alerts.length;
  const criticalAlerts = alerts.filter(a => (a.Severity || a.severity || '').toLowerCase() === 'critical').length;
  const warningAlerts = activeAlerts - criticalAlerts;

  // OS Distribution calculation based on real agents data
  const osCounts: Record<string, number> = {};
  agents.forEach(a => {
    const os = (a.OS || a.os || 'Unknown').toLowerCase();
    if (os.includes('win') && os.includes('server')) {
      osCounts['Windows Server'] = (osCounts['Windows Server'] || 0) + 1;
    } else if (os.includes('win')) {
      osCounts['Windows Workstation'] = (osCounts['Windows Workstation'] || 0) + 1;
    } else if (os.includes('mac') || os.includes('darwin')) {
      osCounts['macOS'] = (osCounts['macOS'] || 0) + 1;
    } else if (os.includes('linux') || os.includes('ubuntu') || os.includes('debian')) {
      osCounts['Linux'] = (osCounts['Linux'] || 0) + 1;
    } else {
      osCounts['Other'] = (osCounts['Other'] || 0) + 1;
    }
  });

  const osPercentages = Object.entries(osCounts).map(([name, count]) => ({
    name,
    count,
    percentage: totalDevices > 0 ? Math.round((count / totalDevices) * 100) : 0
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">
          Executive Operations & Infrastructure Summary
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Registered Clients', value: `${totalCustomers} Customers`, sub: 'Active accounts', icon: Users, color: 'text-blue-500 bg-blue-50 border-blue-100/50' },
          { label: 'Monitored Devices', value: `${totalDevices} Agents`, sub: `${onlineDevices} Online / ${offlineDevices} Offline`, icon: Laptop, color: 'text-emerald-500 bg-emerald-50 border-emerald-100/50' },
          { label: 'Open Helpdesk Tickets', value: `${openTickets} Pending`, sub: `Out of ${totalTickets} total tickets`, icon: Ticket, color: 'text-amber-500 bg-amber-50 border-amber-100/50' },
          { label: 'Security & Critical Alerts', value: `${activeAlerts} Alerts`, sub: `${criticalAlerts} Critical / ${warningAlerts} Warning`, icon: AlertTriangle, color: 'text-rose-500 bg-rose-50 border-rose-100/50' }
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between shadow-xs hover:shadow-md transition-shadow duration-300">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{stat.label}</span>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
                <p className="text-xs text-slate-400 font-medium">{stat.sub}</p>
              </div>
              <div className={`p-3.5 rounded-2xl border ${stat.color} flex-shrink-0`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Circle Progress Device Uptime Rate */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between shadow-xs">
          <div className="space-y-1 mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Agent Online Rate</span>
            <h3 className="text-lg font-bold text-slate-800">Connection Health</h3>
          </div>
          
          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <h4 className="text-3xl font-black text-emerald-600 tracking-tight">{onlineRatio}%</h4>
              <p className="text-xs text-slate-500 font-medium">Devices successfully online</p>
              <div className="text-[10px] text-slate-400 font-medium space-y-0.5 mt-2">
                <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span> Online: {onlineDevices} agents</p>
                <p className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300 inline-block"></span> Offline: {offlineDevices} agents</p>
              </div>
            </div>
            
            <div className="relative w-24 h-24 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" className="stroke-slate-100 fill-none" strokeWidth="6" />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  className="stroke-emerald-500 fill-none transition-all duration-1000"
                  strokeWidth="6"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - onlineRatio / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-sm font-black text-slate-800">{onlineRatio}%</span>
            </div>
          </div>
        </div>

        {/* OS Share Bar Chart */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col justify-between shadow-xs lg:col-span-2">
          <div className="space-y-1 mb-4 flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Device System Audit</span>
              <h3 className="text-lg font-bold text-slate-800">Operating System Share</h3>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-100 rounded-md">Realtime</span>
          </div>

          <div className="space-y-3.5">
            {osPercentages.map((os, i) => {
              let barColor = 'bg-blue-500';
              if (os.name === 'Windows Server') barColor = 'bg-emerald-500';
              else if (os.name === 'macOS') barColor = 'bg-purple-500';
              else if (os.name === 'Linux') barColor = 'bg-amber-500';
              else barColor = 'bg-slate-400';

              return (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-slate-700">{os.name} ({os.count} agents)</span>
                    <span className="text-slate-500">{os.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`${barColor} h-full rounded-full transition-all duration-500`} style={{ width: `${os.percentage}%` }} />
                  </div>
                </div>
              );
            })}
            {osPercentages.length === 0 && (
              <p className="text-xs text-center text-slate-400 py-6">No systems data found.</p>
            )}
          </div>
        </div>

      </div>

      {/* Bottom Grid: Recent security warnings & urgent tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Critical Alerts Log */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/20 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <AlertTriangle className="h-4.5 w-4.5 text-rose-500" /> Active Security Alerts
            </h3>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 border border-rose-100 rounded-full">
              {activeAlerts} alerts
            </span>
          </div>

          <div className="divide-y divide-slate-50 flex-1">
            {alerts.slice(0, 4).map((alert, idx) => {
              const severity = (alert.Severity || 'Warning');
              const time = alert.CreatedDate || new Date().toISOString();
              const dateStr = new Date(time).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }) + ' ' + new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
              
              return (
                <div key={idx} className="p-4 flex items-start gap-3 hover:bg-slate-50/30 transition-colors">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border flex-shrink-0 mt-0.5 ${
                    severity === 'Critical' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    {severity}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{alert.DeviceName || 'Unknown Device'}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{alert.Message}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{dateStr}</span>
                </div>
              );
            })}
            {alerts.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs font-medium space-y-1.5">
                <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto" />
                <p>System completely clean. No alerts detected.</p>
              </div>
            )}
          </div>
        </div>

        {/* SLA Tickets Log */}
        <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between">
          <div className="px-5 py-4 border-b border-slate-50 bg-slate-50/20 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Ticket className="h-4.5 w-4.5 text-blue-500" /> Urgent Helpdesk Tickets
            </h3>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 border border-blue-100 rounded-full">
              {openTickets} open
            </span>
          </div>

          <div className="divide-y divide-slate-50 flex-1">
            {tickets.slice(0, 4).map((ticket, idx) => {
              const priority = ticket.TicketPriority || 'Medium';
              const time = ticket.CreatedDate || new Date().toISOString();
              const dateStr = new Date(time).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
              
              let priorityBadge = 'bg-slate-100 text-slate-600 border-slate-200';
              if (priority === 'Critical') priorityBadge = 'bg-rose-50 text-rose-700 border-rose-200';
              else if (priority === 'High') priorityBadge = 'bg-orange-50 text-orange-700 border-orange-200';
              else if (priority === 'Medium') priorityBadge = 'bg-blue-50 text-blue-700 border-blue-200';

              return (
                <div key={idx} className="p-4 flex items-start gap-3 hover:bg-slate-50/30 transition-colors">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold border flex-shrink-0 mt-0.5 ${priorityBadge}`}>
                    {priority}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">{ticket.TicketTitle || 'No Title'}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">Client: {ticket.CustomerName || 'N/A'}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">{dateStr}</span>
                </div>
              );
            })}
            {tickets.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs font-medium space-y-1.5">
                <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto" />
                <p>Support desk is empty. No active tickets.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
