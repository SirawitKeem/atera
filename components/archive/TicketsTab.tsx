'use client';

import React, { useState, useMemo } from 'react';
import { Ticket, Search, Clock, CheckCircle } from 'lucide-react';

interface TicketItem {
  TicketID: number;
  TicketTitle: string;
  TicketStatus: string;
  TicketPriority: string;
  CreatedDate: string;
  CustomerID: number;
  CustomerName: string;
}

interface TicketsTabProps {
  tickets: TicketItem[];
}

export default function TicketsTab({ tickets }: TicketsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('__all');
  const [statusFilter, setStatusFilter] = useState('__all');

  const ticketStats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter(t => {
      const s = (t.TicketStatus || '').toLowerCase();
      return s === 'open' || s === 'new' || s === 'pending';
    }).length;
    const resolved = total - open;
    const critical = tickets.filter(t => (t.TicketPriority || '').toLowerCase() === 'critical').length;

    return { total, open, resolved, critical };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      // Search query filter
      const title = (t.TicketTitle || '').toLowerCase();
      const customer = (t.CustomerName || '').toLowerCase();
      const id = String(t.TicketID);
      const q = searchQuery.toLowerCase();
      if (searchQuery && !title.includes(q) && !customer.includes(q) && !id.includes(q)) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== '__all' && (t.TicketPriority || '').toLowerCase() !== priorityFilter.toLowerCase()) {
        return false;
      }

      // Status filter
      if (statusFilter !== '__all') {
        const s = (t.TicketStatus || '').toLowerCase();
        const isOpen = s === 'open' || s === 'new' || s === 'pending';
        if (statusFilter === 'open' && !isOpen) return false;
        if (statusFilter === 'resolved' && isOpen) return false;
      }

      return true;
    });
  }, [tickets, searchQuery, priorityFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Helpdesk Tickets</h1>
        <p className="text-sm text-slate-500">
          Monitor service requests, client support tickets, and response performance (SLA)
        </p>
      </div>

      {/* SLA Benchmarks Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        {[
          { label: 'Total Tickets Logged', value: ticketStats.total, sub: 'All recorded tickets', color: 'text-slate-700 bg-slate-50' },
          { label: 'Pending Action', value: ticketStats.open, sub: 'Active work items', color: 'text-amber-600 bg-amber-50/50' },
          { label: 'Resolved Tickets', value: ticketStats.resolved, sub: 'SLA completed', color: 'text-emerald-600 bg-emerald-50/50' },
          { label: 'Critical Exceptions', value: ticketStats.critical, sub: 'Immediate attention', color: 'text-rose-600 bg-rose-50/50' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{stat.label}</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${stat.color}`}>records</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Control Filters */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-wrap gap-3 items-center justify-between shadow-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Search by ID, title, client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-700 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all h-8.5"
            >
              <option value="__all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none border border-slate-200 rounded-lg pl-3 pr-8 py-1.5 text-xs text-slate-700 bg-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all h-8.5"
            >
              <option value="__all">All Statuses</option>
              <option value="open">Open / Pending</option>
              <option value="resolved">Resolved</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {(searchQuery || priorityFilter !== '__all' || statusFilter !== '__all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setPriorityFilter('__all');
                setStatusFilter('__all');
              }}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer "
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="text-xs text-slate-500 font-semibold">
          Showing <span className="text-slate-800 font-bold">{filteredTickets.length}</span> tickets
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider ">
                <th className="px-6 py-4 w-24 text-center">Ticket ID</th>
                <th className="px-6 py-4">Title Description</th>
                <th className="px-6 py-4">Client Name</th>
                <th className="px-6 py-4">Severity Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-600">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20 text-slate-400 font-medium">
                    No tickets found matching the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => {
                  const id = t.TicketID;
                  const title = t.TicketTitle || 'No Title';
                  const customer = t.CustomerName || 'N/A';
                  const priority = t.TicketPriority || 'Low';
                  const status = t.TicketStatus || 'Open';
                  
                  const isResolved = status.toLowerCase() === 'resolved' || status.toLowerCase() === 'closed';

                  let priorityBadge = 'bg-slate-100 text-slate-700 border-slate-200';
                  if (priority === 'Critical') priorityBadge = 'bg-rose-50 text-rose-800 border-rose-200/50 font-extrabold';
                  else if (priority === 'High') priorityBadge = 'bg-orange-50 text-orange-800 border-orange-200/50';
                  else if (priority === 'Medium') priorityBadge = 'bg-blue-50 text-blue-800 border-blue-200/50';

                  let statusBadge = 'bg-amber-50 text-amber-700 border-amber-200/50';
                  if (isResolved) statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200/50';

                  const dateStr = new Date(t.CreatedDate).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  });

                  return (
                    <tr key={id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4 text-center font-mono text-xs text-slate-400">
                        #{id}
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {title}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {customer}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold border ${priorityBadge}`}>
                          {priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusBadge}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isResolved ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-xs text-slate-400">
                        {dateStr}
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
