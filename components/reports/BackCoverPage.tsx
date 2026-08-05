'use client';

import React from 'react';
import { Database, Mail, Phone, Globe, ShieldCheck } from 'lucide-react';

export default function BackCoverPage() {
  return (
    <div className="a4-page justify-between">
      {/* Top Header line */}
      <div className="flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-widest border-b border-slate-100 pb-2 w-full">
        <span>Atera Systems Executive Report</span>
        <span>End of Document</span>
      </div>

      {/* Center Thank You Content */}
      <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 px-12 my-auto">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-blue-600">
          <Database className="h-9 w-9" />
        </div>
        
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          ขอขอบพระคุณ
        </h2>
        
        <p className="text-slate-500 text-xs leading-relaxed max-w-sm">
          ขอขอบพระคุณสำหรับการไว้วางใจให้ทีมงาน **Keem Workspace** เป็นผู้ช่วยบริหารจัดการดูแลโครงสร้างพื้นฐานระบบสารสนเทศ
          เรามุ่งมั่นเฝ้าระวังความปลอดภัยและเพิ่มประสิทธิภาพอุปกรณ์คอมพิวเตอร์ของคุณให้ปลอดภัยอยู่เสมอ
        </p>

        <div className="w-12 h-1 bg-slate-200 rounded-full my-4" />

        {/* Contact Details */}
        <div className="space-y-2 text-xs text-slate-500 font-semibold">
          <p className="flex items-center justify-center gap-2">
            <Mail className="h-4 w-4 text-slate-400" /> support@keemworkspace.com
          </p>
          <p className="flex items-center justify-center gap-2">
            <Phone className="h-4 w-4 text-slate-400" /> (+66) 2-123-4567
          </p>
          <p className="flex items-center justify-center gap-2">
            <Globe className="h-4 w-4 text-slate-400" /> www.keemworkspace.com
          </p>
        </div>
      </div>

      {/* Bottom security stamp & page */}
      <div className="w-full flex justify-between items-end border-t border-slate-100 pt-6 text-[9px] text-slate-400 font-medium">
        <div>
          <p className="font-bold text-slate-500 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Certified Secure Handshake
          </p>
          <p className="text-slate-400 mt-0.5">Audit Stamp ID: 87ed8f63-4d1d-4e30</p>
        </div>
        <span>หน้า 6 จาก 6</span>
      </div>
    </div>
  );
}
