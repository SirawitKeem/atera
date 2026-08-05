'use client';

import React from 'react';
import { Award, Clock, CheckCircle } from 'lucide-react';

interface TicketsPageProps {
  tickets: any[];
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  criticalTickets: number;
}

export default function TicketsPage({
  tickets,
  totalTickets,
  openTickets,
  resolvedTickets,
  criticalTickets
}: TicketsPageProps) {
  return (
    <div className="a4-page">
      <div className="page-header">
        <span>Atera Systems Executive Report</span>
        <span>3. รายงานตั๋วการแจ้งเรื่องแก้ปัญหาไอที</span>
      </div>

      <div className="page-content space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">ประสิทธิภาพงานบริการ Helpdesk (Service Metrics)</h2>
          <p className="text-xs text-slate-500">
            สรุปตั๋วใบงานการแจ้งปัญหาไอที สัดส่วนตั๋วงานวิกฤต และการประเมินการรักษาระดับการบริการ (SLA Compliance)
          </p>
        </div>

        {/* Ticket Stats Box style */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'ตั๋วรวมทั้งหมด', value: totalTickets, color: 'text-slate-800 bg-slate-50' },
            { label: 'กำลังทำ/ตั๋วใหม่', value: openTickets, color: 'text-amber-700 bg-amber-50/50' },
            { label: 'แก้ไขเสร็จสิ้น', value: resolvedTickets, color: 'text-emerald-700 bg-emerald-50/50' },
            { label: 'ตั๋ววิกฤต (Critical)', value: criticalTickets, color: 'text-rose-700 bg-rose-50/50 font-black' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-xl p-3 text-center shadow-xs">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{stat.label}</span>
              <p className={`text-lg font-black ${stat.color}`}>{stat.value} งาน</p>
            </div>
          ))}
        </div>

        {/* SLA Performance metrics */}
        <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="h-4 w-4 text-blue-500" /> สถิติความเร็วในการรักษาระดับการบริการ (SLA Benchmarks)
          </h3>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-blue-500" /> อัตราตอบสนองตั๋วงานครั้งแรกเฉลี่ย
              </span>
              <p className="text-xl font-bold text-slate-800">14 นาที</p>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="h-3 w-3 inline" /> อยู่ในมาตรฐานกำหนด (&lt; 30 นาที)
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-500" /> ระยะเวลาแก้ปัญหาเสร็จสิ้นเฉลี่ย
              </span>
              <p className="text-xl font-bold text-slate-800">1.8 ชั่วโมง</p>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 inline" /> อยู่ในมาตรฐานกำหนด (&lt; 4 ชั่วโมง)
              </p>
            </div>
          </div>
        </div>

        {/* Tickets Sample Table */}
        <div className="space-y-2 flex-1 flex flex-col justify-end">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">รายการใบตั๋วปัญหาในบัญชีล่าสุด (Active Tickets List)</h3>
          <div className="border border-slate-100 rounded-xl overflow-hidden shadow-xs">
            <table className="min-w-full divide-y divide-slate-100 text-[11px] text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                <tr>
                  <th className="px-4 py-3">Ticket ID</th>
                  <th className="px-4 py-3">หัวข้อรายงานปัญหา</th>
                  <th className="px-4 py-3">ลูกค้า</th>
                  <th className="px-4 py-3">ความเร่งด่วน</th>
                  <th className="px-4 py-3 text-right">สถานะ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 text-slate-700">
                {tickets.slice(0, 6).map((ticket, idx) => {
                  const id = ticket.TicketID || ticket.id || idx + 1;
                  const title = ticket.TicketTitle || ticket.title || 'No Title';
                  const customer = ticket.CustomerName || 'N/A';
                  const priority = ticket.TicketPriority || ticket.priority || 'Low';
                  const status = ticket.TicketStatus || ticket.status || 'Open';

                  let priorityBadge = 'bg-slate-100 text-slate-700 border-slate-200';
                  if (priority === 'Critical') priorityBadge = 'bg-rose-50 text-rose-800 border-rose-200/50 font-extrabold';
                  else if (priority === 'High') priorityBadge = 'bg-orange-50 text-orange-800 border-orange-200/50';
                  else if (priority === 'Medium') priorityBadge = 'bg-blue-50 text-blue-800 border-blue-200/50';

                  let statusBadge = 'bg-amber-50 text-amber-700 border-amber-200/50';
                  if (status === 'Resolved' || status === 'Closed') statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200/50';

                  return (
                    <tr key={id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-4 py-2.5 font-mono text-slate-400">#{id}</td>
                      <td className="px-4 py-2.5 font-bold text-slate-800 truncate max-w-[200px]" title={title}>{title}</td>
                      <td className="px-4 py-2.5 text-slate-500 font-semibold">{customer}</td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center rounded px-2 py-0.5 text-[9px] font-bold border ${priorityBadge}`}>
                          {priority}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[9px] font-bold border ${statusBadge}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="page-footer">
        <span>ความลับของบริษัท - ข้อมูลประมวลผลผ่าน Atera API v3</span>
        <span>หน้า 4 จาก 6</span>
      </div>
    </div>
  );
}
