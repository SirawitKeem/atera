'use client';

import React, { useState, useMemo } from 'react';
import { AlertTriangle, Search, Clock, CheckCircle } from 'lucide-react';

interface AlertItem {
  AlertID: number;
  DeviceName: string;
  CustomerID: number;
  CustomerName: string;
  Severity: string;
  Message: string;
  CreatedDate: string;
}

interface AlertsTabProps {
  alerts: AlertItem[];
}

export default function AlertsTab({ alerts }: AlertsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('__all');

  const alertStats = useMemo(() => {
    const total = alerts.length;
    const critical = alerts.filter(a => (a.Severity || '').toLowerCase() === 'critical').length;
    const warning = total - critical;

    return { total, critical, warning };
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(a => {
      // Search filter
      const device = (a.DeviceName || '').toLowerCase();
      const customer = (a.CustomerName || '').toLowerCase();
      const message = (a.Message || '').toLowerCase();
      const q = searchQuery.toLowerCase();
      if (searchQuery && !device.includes(q) && !customer.includes(q) && !message.includes(q)) {
        return false;
      }

      // Severity filter
      if (severityFilter !== '__all' && (a.Severity || '').toLowerCase() !== severityFilter.toLowerCase()) {
        return false;
      }

      return true;
    });
  }, [alerts, searchQuery, severityFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Security & Monitoring Alerts</h1>
        <p className="text-sm text-slate-500">
          Realtime logs of system errors, capacity thresholds exceeded, and security alerts
        </p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: 'Active Incidents', value: alertStats.total, sub: 'Triggered monitor alerts', color: 'text-slate-700 bg-slate-50' },
          { label: 'Critical Errors', value: alertStats.critical, sub: 'Requires urgent fix', color: 'text-rose-600 bg-rose-50/50' },
          { label: 'Warning Anomalies', value: alertStats.warning, sub: 'Minor issues and warnings', color: 'text-amber-600 bg-amber-50/50' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{stat.label}</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${stat.color}`}>alerts</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter controls */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-wrap gap-3 items-center justify-between shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search by message, device, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="relative">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-700 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all h-8.5"
            >
              <option value="__all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {(searchQuery || severityFilter !== '__all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSeverityFilter('__all');
              }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer select-none"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Showing <span className="text-slate-800 font-bold">{filteredAlerts.length}</span> active logs
        </div>
      </div>

      {/* Main Alerts Log Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                <th className="px-6 py-4 w-24">Severity</th>
                <th className="px-6 py-4">Trigger Device</th>
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">Anomalous Incident Message</th>
                <th className="px-6 py-4 text-right">Detection Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-20 text-slate-400 font-medium">
                    <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                    No active warnings or errors matched the filters.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => {
                  const id = alert.AlertID;
                  const device = alert.DeviceName || 'Unknown Device';
                  const customer = alert.CustomerName || 'N/A';
                  const severity = alert.Severity || 'Warning';
                  const message = alert.Message || 'No Message';
                  
                  const isCritical = severity.toLowerCase() === 'critical';

                  let severityBadge = 'bg-amber-50 text-amber-700 border-amber-200/50';
                  if (isCritical) severityBadge = 'bg-rose-50 text-rose-700 border-rose-200/50 font-extrabold';

                  const date = new Date(alert.CreatedDate);
                  const formattedTime = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) + ' ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

                  return (
                    <tr key={id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded px-2 py-0.5 text-[9px] font-bold border ${severityBadge}`}>
                          {severity}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {device}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {customer}
                      </td>
                      <td className="px-6 py-4 text-slate-600 max-w-xs md:max-w-md truncate" title={message}>
                        {message}
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-xs text-slate-400">
                        {formattedTime}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
