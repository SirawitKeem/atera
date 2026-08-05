'use client';

import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface AlertsPageProps {
  alerts: any[];
  criticalAlerts: number;
  warningAlerts: number;
}

export default function AlertsPage({
  alerts,
  criticalAlerts,
  warningAlerts
}: AlertsPageProps) {
  return (
    <div className="a4-page">
      <div className="page-header">
        <span>Atera Systems Executive Report</span>
        <span>4. รายงานประเด็นความเสี่ยงและแจ้งเตือนระบบ</span>
      </div>

      <div className="page-content space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">รายงานแจ้งเตือนระบบสารสนเทศ (Security Alerts Report)</h2>
          <p className="text-xs text-slate-500">
            รายการความคลาดเคลื่อนในการทำงานของเซิร์ฟเวอร์ อุปกรณ์เน็ตเวิร์ก และระบบแจ้งเตือนภัยคุกคาม
          </p>
        </div>

        {/* Alert Overview card */}
        <div className="bg-rose-50/70 border border-rose-200/50 rounded-2xl p-4 flex gap-4 items-start shadow-xs">
          <AlertTriangle className="h-8 w-8 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-rose-950">ภาพรวมความปลอดภัยระบบ</h4>
            <p className="text-xs text-rose-800 leading-relaxed">
              ระบบเฝ้าระวังอัตโนมัติของ Atera ได้ตรวจพบการแจ้งเตือนประเภท **Critical** จำนวน {criticalAlerts} รายการ 
              และแจ้งเตือนระดับ **Warning** จำนวน {warningAlerts} รายการ 
              กรุณาตรวจสอบรายละเอียดความผิดปกติของเครื่องเซิร์ฟเวอร์หรือฮาร์ดแวร์เพื่อดำเนินการซ่อมแซมก่อนระบบหยุดชะงัก
            </p>
          </div>
        </div>

        {/* Active Alerts Table */}
        <div className="space-y-2 flex-1 flex flex-col justify-end">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">รายการแจ้งเตือนระบบค้างอยู่ (Active System Alerts Log)</h3>
          <div className="border border-slate-100 rounded-xl overflow-hidden shadow-xs">
            <table className="min-w-full divide-y divide-slate-100 text-[11px] text-left">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[9px]">
                <tr>
                  <th className="px-4 py-3">ความร้ายแรง</th>
                  <th className="px-4 py-3">อุปกรณ์</th>
                  <th className="px-4 py-3">ลูกค้า</th>
                  <th className="px-4 py-3">ข้อความแจ้งเตือนภัย</th>
                  <th className="px-4 py-3 text-right">เวลาตรวจพบ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-100 text-slate-700">
                {alerts.slice(0, 8).map((alert, idx) => {
                  const id = alert.AlertID || alert.id || idx + 1;
                  const device = alert.DeviceName || alert.deviceName || 'Unknown';
                  const customer = alert.CustomerName || 'N/A';
                  const severity = alert.Severity || alert.severity || 'Warning';
                  const message = alert.Message || alert.message || 'No message';
                  const time = alert.CreatedDate || alert.created || new Date().toISOString();

                  const formattedTime = new Date(time).toLocaleTimeString('th-TH', {
                    hour: '2-digit',
                    minute: '2-digit'
                  }) + ' น.';

                  let severityBadge = 'bg-slate-100 text-slate-700 border-slate-200';
                  if (severity === 'Critical') severityBadge = 'bg-rose-50 text-rose-800 border-rose-200/50 font-extrabold';
                  else if (severity === 'Warning') severityBadge = 'bg-amber-50 text-amber-800 border-amber-200/50';

                  return (
                    <tr key={id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center rounded px-2 py-0.5 text-[9px] font-bold border ${severityBadge}`}>
                          {severity}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 font-bold text-slate-800">{device}</td>
                      <td className="px-4 py-2.5 text-slate-500 font-semibold">{customer}</td>
                      <td className="px-4 py-2.5 text-slate-600 truncate max-w-[200px]" title={message}>{message}</td>
                      <td className="px-4 py-2.5 text-right font-mono text-slate-400 text-xs">{formattedTime}</td>
                    </tr>
                  );
                })}
                {alerts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-medium">
                      <CheckCircle className="h-6 w-6 text-emerald-500 mx-auto mb-2" />
                      ไม่พบการแจ้งเตือนระบบที่ตรวจพบในรอบรายงานนี้
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="page-footer">
        <span>ความลับของบริษัท - ข้อมูลประมวลผลผ่าน Atera API v3</span>
        <span>หน้า 5 จาก 6</span>
      </div>
    </div>
  );
}
