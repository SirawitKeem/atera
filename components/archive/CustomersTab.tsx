'use client';

import React, { useState, useMemo } from 'react';
import { Users, Mail, AlertTriangle } from 'lucide-react';

interface CustomersTabProps {
  customers: any[];
  agents: any[];
  tickets: any[];
  alerts: any[];
}

export default function CustomersTab({ customers, agents, tickets, alerts }: CustomersTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const name = (c.CustomerName || c.name || '').toLowerCase();
      const email = (c.CustomerEmail || c.email || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      return name.includes(query) || email.includes(query);
    });
  }, [customers, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Tab Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Clients Registry</h1>
          <p className="text-sm text-slate-500">
            Manage customer directories, contact profiles, and associated equipment
          </p>
        </div>
      </div>

      {/* Control panel */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-wrap gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search by customer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
          />
          <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Showing <span className="text-slate-800">{filteredCustomers.length}</span> out of {customers.length} clients
        </div>
      </div>

      {/* Clients Data Grid */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none">
                <th className="px-6 py-4 w-16 text-center">ID</th>
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">Primary Email Contact</th>
                <th className="px-6 py-4 text-center">Registered Agents</th>
                <th className="px-6 py-4 text-center">Open Tickets</th>
                <th className="px-6 py-4 text-right">Status Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-slate-400 font-semibold">
                    No clients matched the search query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((c, idx) => {
                  const id = c.CustomerID || c.id || idx + 1;
                  const name = c.CustomerName || c.name || 'N/A';
                  const email = c.CustomerEmail || c.email || 'No email contact';
                  
                  // stats
                  const devCount = agents.filter(a => a.CustomerID === id || a.customerId === id).length;
                  const clientTickets = tickets.filter(t => {
                    const cid = t.CustomerID || t.customerId;
                    const status = (t.TicketStatus || t.status || '').toLowerCase();
                    const isOpen = status === 'open' || status === 'new' || status === 'pending';
                    return cid === id && isOpen;
                  }).length;

                  // alert status risk
                  const hasCriticalAlert = alerts.some(a => {
                    const cid = a.CustomerID || a.customerId;
                    const severity = (a.Severity || a.severity || '').toLowerCase();
                    return cid === id && severity === 'critical';
                  });

                  return (
                    <tr key={id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4.5 text-center font-mono text-xs text-slate-400">
                        {id}
                      </td>
                      <td className="px-6 py-4.5 font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <span>{name}</span>
                          {hasCriticalAlert && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 bg-rose-50 text-rose-600 border border-rose-100 rounded text-[9px] font-extrabold animate-pulse">
                              <AlertTriangle className="h-3 w-3" /> Critical Alert
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                          <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          <span>{email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4.5 text-center font-bold text-slate-700">
                        {devCount} agents
                      </td>
                      <td className="px-6 py-4.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          clientTickets > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200/50' : 'bg-slate-50 text-slate-400 border border-slate-100'
                        }`}>
                          {clientTickets} open
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-right font-medium">
                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide uppercase ${
                          hasCriticalAlert
                            ? 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/10'
                            : 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10'
                        }`}>
                          {hasCriticalAlert ? 'At Risk' : 'Healthy'}
                        </span>
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
