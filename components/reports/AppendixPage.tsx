'use client';

import React from 'react';
import { BookOpen, CheckSquare, Info } from 'lucide-react';
import ReportHeader from './ReportHeader';

interface AppendixPageProps {
  pageNumber: number;
}

export default function AppendixPage({
  pageNumber
}: AppendixPageProps) {
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
        title="Appendix & Glossary" 
        subtitle="Terminology Definitions & Operational MSP Guidelines | Reporting Period: 06 Jul 2026 - 05 Aug 2026" 
      />

      <div className="page-content space-y-4 flex-1 flex flex-col justify-between overflow-hidden mt-3 select-none">
        
        {/* GLOSSARY OF TERMS */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs space-y-2">
          <h4 className="text-[9.5px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-55 pb-1">
            <BookOpen className="h-4 w-4 text-blue-500" /> 1. คำอธิบายศัพท์ทางเทคนิค (Glossary of Technical Terms)
          </h4>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[9.5px]">
            <div>
              <p className="font-extrabold text-slate-800">RMM (Remote Monitoring & Management)</p>
              <p className="text-slate-500 text-[8.5px] leading-relaxed mt-0.5">ระบบควบคุมระยะไกลและเฝ้าระวังความพร้อมใช้งานคอมพิวเตอร์และเซิร์ฟเวอร์ปลายทาง</p>
            </div>
            <div>
              <p className="font-extrabold text-slate-800">SLA (Service Level Agreement)</p>
              <p className="text-slate-500 text-[8.5px] leading-relaxed mt-0.5">ข้อตกลงระดับบริการที่ใช้กำหนดความเร็วในการรับเรื่องและปิดตั๋วบริการ Helpdesk</p>
            </div>
            <div>
              <p className="font-extrabold text-slate-800">Patch Compliance</p>
              <p className="text-slate-500 text-[8.5px] leading-relaxed mt-0.5">ดัชนีชี้วัดเปอร์เซ็นต์ความปลอดภัยที่อุปกรณ์ติดตั้งแพทช์อัปเดตระบบปฏิบัติการครบถ้วน</p>
            </div>
            <div>
              <p className="font-extrabold text-slate-800">Agent Connectivity</p>
              <p className="text-slate-500 text-[8.5px] leading-relaxed mt-0.5">อัตราการเชื่อมต่อออนไลน์ของอุปกรณ์ไอที RMM เปรียบเทียบกับสถิติภาพรวม</p>
            </div>
          </div>
        </div>

        {/* SERVICE GUIDELINES & RECOMMENDATIONS */}
        <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs space-y-2 flex-1 flex flex-col justify-between">
          <h4 className="text-[9.5px] font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-55 pb-1">
            <CheckSquare className="h-4 w-4 text-blue-500" /> 2. รายการตรวจสอบการดำเนินงานไอที (MSP Operations Checklist)
          </h4>

          <div className="space-y-2 flex-1 flex flex-col justify-center text-[9.5px]">
            <div className="flex items-start gap-2 bg-slate-50 border border-slate-100 p-2 rounded-lg">
              <span className="text-emerald-500 font-extrabold flex-shrink-0">✓</span>
              <div>
                <p className="font-bold text-slate-800">ตรวจสอบเครื่องที่มีระดับความเสี่ยง Critical รายสัปดาห์</p>
                <p className="text-slate-400 text-[8.5px] mt-0.5">สแกนหาประเด็นแจ้งเตือน CPU เกินขีดจำกัด หรือดิสก์ไดรฟ์ใกล้เต็มของเครื่องแม่ข่าย (Server Node)</p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-slate-50 border border-slate-100 p-2 rounded-lg">
              <span className="text-emerald-500 font-extrabold flex-shrink-0">✓</span>
              <div>
                <p className="font-bold text-slate-800">การวางระบบอัตโนมัติในการรวบรวมแพทช์ความปลอดภัย</p>
                <p className="text-slate-400 text-[8.5px] mt-0.5">จัดระเบียบเวลาดาวน์โหลดแพทช์ตกค้างของระบบปฏิบัติการในช่วงเวลานอกการปฏิบัติงานของสาขา</p>
              </div>
            </div>

            <div className="flex items-start gap-2 bg-slate-50 border border-slate-100 p-2 rounded-lg">
              <span className="text-emerald-500 font-extrabold flex-shrink-0">✓</span>
              <div>
                <p className="font-bold text-slate-800">การทบทวนตั๋วค้างดำเนินงานเพื่อรักษามาตรฐาน SLA</p>
                <p className="text-slate-400 text-[8.5px] mt-0.5">ตรวจสอบตั๋วระดับ Critical และ High ในระบบเพื่อป้องกันเวลารับสายเคสล้นเกิน 30 นาที</p>
              </div>
            </div>
          </div>

          <div className="mt-1 bg-blue-50 border border-blue-100 rounded-lg p-2.5 flex items-start gap-1.5 text-[8.5px] text-blue-700 font-medium">
            <Info className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-500" />
            <span>คำแนะนำเพิ่มเติม: เอกสารวิเคราะห์ฉบับนี้ออกแบบขึ้นเพื่อประโยชน์ของวิศวกรไอทีและผู้บริหาร MSP ในการเร่งแก้ไขข้อกังวลของระบบอย่างมีคุณภาพ</span>
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
