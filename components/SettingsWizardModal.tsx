'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Key, 
  Calendar, 
  Paperclip, 
  Plus, 
  Trash2,
  ShieldCheck,
  Zap,
  ChevronLeft,
  ChevronRight,
  Info,
  Sliders,
  Users
} from 'lucide-react';

interface SettingsWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStartDate: string;
  initialEndDate: string;
  initialCompanyName: string;
  initialReportTitle: string;
  initialReportSubtitle: string;
  initialStep?: number;
  onSave: (config: {
    startDate: string;
    endDate: string;
    companyName: string;
    reportTitle: string;
    reportSubtitle: string;
  }) => void;
}

export default function SettingsWizardModal({
  isOpen,
  onClose,
  initialStartDate,
  initialEndDate,
  initialCompanyName,
  initialReportTitle,
  initialReportSubtitle,
  initialStep = 1,
  onSave
}: SettingsWizardModalProps) {
  // Current Step (1 to 6)
  const [currentStep, setCurrentStep] = useState(initialStep);

  // Step 1: ข้อมูลรายงาน
  const [reportTitle, setReportTitle] = useState(initialReportTitle);
  const [reportSubtitle, setReportSubtitle] = useState(initialReportSubtitle);
  const [companyName, setCompanyName] = useState(initialCompanyName);

  // Step 2: กำหนดเวลา
  const [isAutoEnabled, setIsAutoEnabled] = useState(true);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [sendDayOfWeek, setSendDayOfWeek] = useState('1'); // 1 = Monday
  const [sendDayOfMonth, setSendDayOfMonth] = useState('1'); // 1st
  const [sendTime, setSendTime] = useState('08:00');

  // Step 3: ช่วงข้อมูล
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  // Step 4: ผู้รับรายงาน
  const [recipientInput, setRecipientInput] = useState('');
  const [recipientEmails, setRecipientEmails] = useState<string[]>([
    'ceo@company.com',
    'it-admin@company.com'
  ]);

  // Step 5: การส่งอีเมล
  const [senderEmail, setSenderEmail] = useState('report-bot@ateramsp.com');
  const [senderName, setSenderName] = useState('Atera MSP Automated Report System');
  const [subject, setSubject] = useState('');
  const [attachPdf, setAttachPdf] = useState(true);

  // Status & Feedback States
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Synchronize initial values when modal opens
  useEffect(() => {
    if (isOpen) {
      setStartDate(initialStartDate);
      setEndDate(initialEndDate);
      setCompanyName(initialCompanyName);
      setReportTitle(initialReportTitle);
      setReportSubtitle(initialReportSubtitle);
      setCurrentStep(initialStep);
    }
  }, [isOpen, initialStartDate, initialEndDate, initialCompanyName, initialReportTitle, initialReportSubtitle, initialStep]);

  // Sync default subject line when companyName or startDate/endDate changes
  useEffect(() => {
    setSubject(`📊 [Atera MSP Report] รายงานสรุป A4 PDF - ${companyName}`);
  }, [companyName, startDate, endDate]);

  // Load saved config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('atera_unified_report_settings');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed.reportTitle) setReportTitle(parsed.reportTitle);
        if (parsed.reportSubtitle) setReportSubtitle(parsed.reportSubtitle);
        if (parsed.companyName) setCompanyName(parsed.companyName);
        if (parsed.senderEmail) setSenderEmail(parsed.senderEmail);
        if (parsed.senderName) setSenderName(parsed.senderName);
        if (parsed.recipientEmails) setRecipientEmails(parsed.recipientEmails);
        if (parsed.subject) setSubject(parsed.subject);
        if (parsed.frequency) setFrequency(parsed.frequency);
        if (parsed.sendDayOfWeek) setSendDayOfWeek(parsed.sendDayOfWeek);
        if (parsed.sendDayOfMonth) setSendDayOfMonth(parsed.sendDayOfMonth);
        if (parsed.sendTime) setSendTime(parsed.sendTime);
        if (parsed.startDate) setStartDate(parsed.startDate);
        if (parsed.endDate) setEndDate(parsed.endDate);
        if (typeof parsed.isAutoEnabled === 'boolean') setIsAutoEnabled(parsed.isAutoEnabled);
        if (typeof parsed.attachPdf === 'boolean') setAttachPdf(parsed.attachPdf);
      } catch (e) {
        console.error('Failed to parse saved email schedule config', e);
      }
    }
  }, []);

  if (!isOpen) return null;

  // Date range presets helper
  const applyPreset = (preset: '7d' | '30d' | 'thisMonth' | 'lastMonth') => {
    const today = new Date();
    const start = new Date();

    if (preset === '7d') {
      start.setDate(today.getDate() - 7);
    } else if (preset === '30d') {
      start.setDate(today.getDate() - 30);
    } else if (preset === 'thisMonth') {
      start.setDate(1);
    } else if (preset === 'lastMonth') {
      start.setMonth(today.getMonth() - 1);
      start.setDate(1);
      today.setDate(0); // Last day of previous month
    }

    const formatISODate = (d: Date) => d.toISOString().split('T')[0];
    setStartDate(formatISODate(start));
    setEndDate(formatISODate(today));
  };

  const handleAddRecipient = () => {
    const trimmed = recipientInput.trim();
    if (trimmed && trimmed.includes('@') && !recipientEmails.includes(trimmed)) {
      setRecipientEmails([...recipientEmails, trimmed]);
      setRecipientInput('');
    }
  };

  const handleRemoveRecipient = (emailToRemove: string) => {
    setRecipientEmails(recipientEmails.filter(e => e !== emailToRemove));
  };

  const handleKeyDownRecipient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddRecipient();
    }
  };

  const handleSendTestEmail = async () => {
    setIsSendingTest(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderEmail,
          senderName,
          recipientEmails,
          subject,
          frequency,
          attachPdf
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setFeedback({
          type: 'success',
          message: `${data.message} (ส่งสำเร็จผ่าน Service Key VUKZXX7Z...)`
        });
      } else {
        setFeedback({
          type: 'error',
          message: data.message || 'ส่งอีเมลทดสอบไม่สำเร็จ กรุณาตรวจสอบอีเมลผู้รับ'
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ส่งอีเมล';
      setFeedback({
        type: 'error',
        message: errorMsg
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSaveConfig = () => {
    const config = {
      reportTitle,
      reportSubtitle,
      companyName,
      senderEmail,
      senderName,
      recipientEmails,
      subject,
      attachPdf,
      isAutoEnabled,
      frequency,
      sendDayOfWeek,
      sendDayOfMonth,
      sendTime,
      startDate,
      endDate,
      updatedAt: new Date().toISOString()
    };

    // Save to local storage
    localStorage.setItem('atera_unified_report_settings', JSON.stringify(config));

    // Call onSave to update parent component state in real time
    onSave({
      startDate,
      endDate,
      companyName,
      reportTitle,
      reportSubtitle
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1500);
  };

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { num: 1, label: 'ข้อมูลรายงาน' },
    { num: 2, label: 'กำหนดเวลา' },
    { num: 3, label: 'ช่วงข้อมูล' },
    { num: 4, label: 'ผู้รับรายงาน' },
    { num: 5, label: 'การส่งอีเมล' },
    { num: 6, label: 'สรุปและบันทึก' }
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto select-none">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col my-auto transition-all duration-300">
        
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-700 text-white px-6 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <Sliders className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-wide leading-tight">ตั้งค่าหลักของรายงาน (Report Master Settings)</h3>
              <p className="text-xs text-pink-100 font-medium">จัดการเนื้อหา, กำหนดเวลา และการดึงข้อมูลทั้งหมด</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* STEPPER PROGRESS BAR (Horizontal representation matching the user's screenshot) */}
        <div className="bg-slate-50/80 border-b border-slate-100 px-6 py-4">
          <div className="flex items-center justify-between w-full relative">
            {/* Horizontal Line behind steps */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            
            {steps.map((step) => {
              const isActive = currentStep === step.num;
              const isCompleted = currentStep > step.num;
              
              return (
                <button
                  key={step.num}
                  onClick={() => setCurrentStep(step.num)}
                  className="flex flex-col items-center gap-1.5 z-10 focus:outline-none cursor-pointer flex-1"
                >
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isActive 
                      ? 'bg-pink-600 text-white shadow-md shadow-pink-500/20 ring-4 ring-pink-100'
                      : isCompleted
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/10'
                      : 'bg-white text-slate-400 border-2 border-slate-200'
                  }`}>
                    {step.num}
                  </div>
                  <span className={`text-[10px] tracking-tight transition-colors ${
                    isActive 
                      ? 'text-pink-600 font-black' 
                      : isCompleted
                      ? 'text-blue-600 font-extrabold'
                      : 'text-slate-400 font-bold'
                  }`}>
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="p-6 overflow-y-auto max-h-[55vh] text-slate-700 min-h-[280px]">
          
          {/* STEP 1: ข้อมูลรายงาน */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <Zap className="h-4 w-4 text-pink-600" /> 1. ข้อมูลรายงาน (Report Information)
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">ชื่อหัวข้อหลักของรายงาน (Main Title)</label>
                  <input 
                    type="text"
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-slate-800"
                    placeholder="เช่น Executive Summary"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">ชื่อคำอธิบายเพิ่มเติม (Subtitle)</label>
                  <input 
                    type="text"
                    value={reportSubtitle}
                    onChange={(e) => setReportSubtitle(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-slate-800"
                    placeholder="เช่น Monthly Executive Report"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">ชื่อบริษัทของลูกค้า (Company / Client Name)</label>
                  <input 
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-slate-800"
                    placeholder="เช่น Atera Client"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: กำหนดเวลาส่งรายงาน */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-600" /> 2. กำหนดเวลาส่งรายงานอัตโนมัติ (Schedule)
                </h4>
                
                {/* Toggle Switch */}
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black uppercase ${isAutoEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {isAutoEnabled ? '🟢 เปิดใช้งานส่งอัตโนมัติ' : '🔴 ปิดใช้งาน'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAutoEnabled(!isAutoEnabled)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isAutoEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isAutoEnabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">ความถี่รอบเวลา (Frequency)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setFrequency(freq)}
                        disabled={!isAutoEnabled}
                        className={`py-2 px-3 rounded-lg text-xs font-black border flex items-center justify-center gap-1.5 transition-all ${
                          !isAutoEnabled 
                            ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200'
                            : frequency === freq 
                            ? 'bg-pink-600 text-white border-pink-600 shadow-sm' 
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {freq === 'daily' && '☀️ รายวัน (Daily)'}
                        {freq === 'weekly' && '📅 รายสัปดาห์ (Weekly)'}
                        {freq === 'monthly' && '📆 รายเดือน (Monthly)'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {frequency === 'weekly' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">วันในรอบสัปดาห์ (Day of Week)</label>
                      <select 
                        value={sendDayOfWeek}
                        onChange={(e) => setSendDayOfWeek(e.target.value)}
                        disabled={!isAutoEnabled}
                        className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-slate-800 cursor-pointer disabled:opacity-50"
                      >
                        <option value="1">ทุกวันจันทร์ (Every Monday)</option>
                        <option value="2">ทุกวันอังคาร (Every Tuesday)</option>
                        <option value="3">ทุกวันพุธ (Every Wednesday)</option>
                        <option value="4">ทุกวันพฤหัสบดี (Every Thursday)</option>
                        <option value="5">ทุกวันศุกร์ (Every Friday)</option>
                      </select>
                    </div>
                  )}

                  {frequency === 'monthly' && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">วันในรอบเดือน (Day of Month)</label>
                      <select 
                        value={sendDayOfMonth}
                        onChange={(e) => setSendDayOfMonth(e.target.value)}
                        disabled={!isAutoEnabled}
                        className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-slate-800 cursor-pointer disabled:opacity-50"
                      >
                        <option value="1">ทุกวันที่ 1 ของเดือน (1st of Month)</option>
                        <option value="15">ทุกวันที่ 15 ของเดือน (15th of Month)</option>
                        <option value="28">ทุกวันสิ้นเดือน (Last Day of Month)</option>
                      </select>
                    </div>
                  )}

                  <div className={frequency === 'daily' ? 'col-span-2' : ''}>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">เวลาส่ง (Time)</label>
                    <input 
                      type="time"
                      value={sendTime}
                      onChange={(e) => setSendTime(e.target.value)}
                      disabled={!isAutoEnabled}
                      className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-slate-800 cursor-pointer disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: ช่วงข้อมูลรายงาน */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <Calendar className="h-4 w-4 text-blue-600" /> 3. ช่วงข้อมูลรายงาน (Date Scope)
              </h4>
              
              <div className="space-y-4">
                {/* Date presets */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1.5">เลือกช่วงเวลาด่วน (Quick Presets)</label>
                  <div className="grid grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => applyPreset('7d')}
                      className="py-1.5 px-2 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold transition-all"
                    >
                      ย้อนหลัง 7 วัน
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('30d')}
                      className="py-1.5 px-2 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold transition-all"
                    >
                      ย้อนหลัง 30 วัน
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('thisMonth')}
                      className="py-1.5 px-2 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold transition-all"
                    >
                      เดือนนี้
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset('lastMonth')}
                      className="py-1.5 px-2 bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-bold transition-all"
                    >
                      เดือนที่แล้ว
                    </button>
                  </div>
                </div>

                {/* Calendar fields */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">วันที่เริ่มต้น (Start Date)</label>
                    <input 
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-slate-800 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">วันที่สิ้นสุด (End Date)</label>
                    <input 
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-slate-800 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: ผู้รับรายงาน */}
          {currentStep === 4 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <Users className="h-4 w-4 text-indigo-600" /> 4. รายชื่อผู้รับรายงาน (Recipients)
              </h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">ระบุอีเมลผู้รับ (Recipient Emails)</label>
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white border border-slate-200 rounded-lg min-h-[80px]">
                    {recipientEmails.map((email) => (
                      <span 
                        key={email}
                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-[11px] font-bold px-2.5 py-1 rounded-md border border-blue-200/60"
                      >
                        {email}
                        <button 
                          onClick={() => handleRemoveRecipient(email)}
                          className="hover:text-rose-600 p-0.5 rounded transition-colors cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <input 
                      type="email"
                      placeholder={recipientEmails.length === 0 ? "พิมพ์อีเมลที่นี่แล้วกด Enter..." : "เพิ่มอีเมล..."}
                      value={recipientInput}
                      onChange={(e) => setRecipientInput(e.target.value)}
                      onKeyDown={handleKeyDownRecipient}
                      onBlur={handleAddRecipient}
                      className="flex-1 min-w-[180px] text-xs font-semibold px-2 py-1 border-none focus:outline-none text-slate-800 bg-transparent"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                    * พิมพ์อีเมลเสร็จแล้วสามารถกด <span className="font-bold">Enter</span> หรือสัญลักษณ์ <span className="font-bold">จุลภาค ( , )</span> เพื่อเพิ่มอีเมลใหม่
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: การส่งอีเมล */}
          {currentStep === 5 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <Mail className="h-4 w-4 text-purple-600" /> 5. ข้อมูลและเนื้อหาอีเมล (Email Settings)
              </h4>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Email ผู้ส่ง (Sender Email)</label>
                    <input 
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">ชื่อผู้แสดงส่ง (Sender Name)</label>
                    <input 
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">หัวเรื่องอีเมล (Subject Line)</label>
                  <input 
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 text-slate-800"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                  <input 
                    type="checkbox"
                    id="wizardAttachPdf"
                    checked={attachPdf}
                    onChange={(e) => setAttachPdf(e.target.checked)}
                    className="h-4 w-4 text-pink-600 rounded border-slate-300 focus:ring-pink-500 cursor-pointer"
                  />
                  <label htmlFor="wizardAttachPdf" className="text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer">
                    <Paperclip className="h-3.5 w-3.5 text-slate-500" /> แนบรายงานความคืบหน้าฉบับ PDF (A4 Layout PDF Attachment)
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: สรุปและบันทึก */}
          {currentStep === 6 && (
            <div className="space-y-4 animate-fade-in">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                <CheckCircle className="h-4 w-4 text-pink-600" /> 6. ตรวจสอบข้อมูลและบันทึกผล (Summary)
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Visual Summary List */}
                <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px] font-semibold text-slate-600">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-400">หัวข้อรายงาน:</span>
                    <span className="text-slate-800 text-right font-black truncate max-w-[200px]">{reportTitle}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-400">ขอบเขตข้อมูลลูกค้า:</span>
                    <span className="text-slate-800 text-right font-black truncate max-w-[200px]">{companyName}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-400">ช่วงเวลาดึงข้อมูล:</span>
                    <span className="text-slate-800 text-right font-black">{startDate} ถึง {endDate}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-400">ระบบส่งอัตโนมัติ:</span>
                    <span className={`font-black ${isAutoEnabled ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {isAutoEnabled ? `ส่งทุก${frequency === 'daily' ? 'วัน' : frequency === 'weekly' ? 'วันจันทร์' : 'เดือน'} เวลา ${sendTime} น.` : 'ปิดการใช้งาน'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-400">ผู้รับอีเมล ({recipientEmails.length}):</span>
                    <span className="text-slate-800 text-right font-black truncate max-w-[200px]">{recipientEmails.join(', ') || 'ไม่มี'}</span>
                  </div>
                </div>

                {/* Status Bar / Ready to Send Box */}
                <div className="flex flex-col justify-between border border-slate-150 rounded-xl p-4 bg-white">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
                      <Key className="h-4 w-4 text-blue-600" />
                      <span>SMTP Endpoint status</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                      เชื่อมต่อสำเร็จผ่าน Service API Key พร้อมส่งอีเมลทดสอบทันทีไปยังอีเมลปลายทาง
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px] pt-4">
                    <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                    <span>ระบบ API RMM พร้อมใช้งาน</span>
                  </div>
                </div>
              </div>

              {/* FEEDBACK BADGE FOR TESTING */}
              {feedback && (
                <div className={`p-3 rounded-xl border text-[11px] font-bold flex items-center gap-2 ${
                  feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {feedback.type === 'success' ? (
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}
            </div>
          )}

          {isSaved && (
            <div className="p-3 bg-pink-50 text-pink-800 border border-pink-200 rounded-xl text-xs font-bold flex items-center gap-2 mt-3 animate-pulse">
              <CheckCircle className="h-4 w-4 text-pink-600 shrink-0" />
              <span>บันทึกการตั้งค่าทั้งหมดและกำลังปิดหน้าจอการตั้งค่า...</span>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
          
          {/* Left: Test Send Button on Step 6 */}
          <div>
            {currentStep === 6 ? (
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={isSendingTest || recipientEmails.length === 0}
                className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer"
              >
                {isSendingTest ? (
                  <>
                    <span className="inline-block h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    กำลังส่ง...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    🧪 ทดสอบส่งเมล (Send Test)
                  </>
                )}
              </button>
            ) : (
              <div className="text-[10px] text-slate-400 font-bold">
                ขั้นตอน {currentStep} จาก 6
              </div>
            )}
          </div>

          {/* Right: Navigation Actions (Back / Next / Save) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-3 py-2 bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 disabled:opacity-30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>ย้อนกลับ</span>
            </button>
            
            {currentStep < 6 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-1"
              >
                <span>ขั้นตอนถัดไป</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveConfig}
                className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-extrabold shadow-md shadow-pink-500/25 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>💾 บันทึกและใช้ตั้งค่า (Save)</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
