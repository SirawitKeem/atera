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
  Zap
} from 'lucide-react';

interface EmailScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
  dateRangeDisplay?: string;
}

export default function EmailScheduleModal({
  isOpen,
  onClose,
  companyName = 'Atera Client',
  dateRangeDisplay = 'Current Period'
}: EmailScheduleModalProps) {
  // Form States
  const [senderEmail, setSenderEmail] = useState('report-bot@ateramsp.com');
  const [senderName, setSenderName] = useState('Atera MSP Automated Report System');
  const [recipientInput, setRecipientInput] = useState('');
  const [recipientEmails, setRecipientEmails] = useState<string[]>([
    'ceo@company.com',
    'it-admin@company.com'
  ]);
  const [subject, setSubject] = useState(`📊 [Atera MSP Report] รายงานสรุป A4 PDF ประจำช่วงเวลา ${dateRangeDisplay}`);
  const [attachPdf, setAttachPdf] = useState(true);
  
  // Automation Schedule States
  const [isAutoEnabled, setIsAutoEnabled] = useState(true);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [sendDayOfWeek, setSendDayOfWeek] = useState('1'); // Monday
  const [sendDayOfMonth, setSendDayOfMonth] = useState('1'); // 1st
  const [sendTime, setSendTime] = useState('08:00');

  // Status & Feedback States
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Load saved config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('atera_email_schedule_config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed.senderEmail) setSenderEmail(parsed.senderEmail);
        if (parsed.senderName) setSenderName(parsed.senderName);
        if (parsed.recipientEmails) setRecipientEmails(parsed.recipientEmails);
        if (parsed.subject) setSubject(parsed.subject);
        if (parsed.frequency) setFrequency(parsed.frequency);
        if (parsed.sendDayOfWeek) setSendDayOfWeek(parsed.sendDayOfWeek);
        if (parsed.sendDayOfMonth) setSendDayOfMonth(parsed.sendDayOfMonth);
        if (parsed.sendTime) setSendTime(parsed.sendTime);
        if (typeof parsed.isAutoEnabled === 'boolean') setIsAutoEnabled(parsed.isAutoEnabled);
      } catch (e) {
        console.error('Failed to parse saved email schedule config', e);
      }
    }
  }, []);

  if (!isOpen) return null;

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
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์ส่งอีเมล'
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSaveConfig = () => {
    const config = {
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
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem('atera_email_schedule_config', JSON.stringify(config));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-fade-in select-none">
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col my-auto">
        
        {/* MODAL HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-wide leading-tight">ตั้งค่าการส่งอีเมลรายงานอัตโนมัติ</h3>
              <p className="text-xs text-blue-100 font-medium">Automated Email Report Delivery & Schedule</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* SERVICE KEY STATUS BAR */}
        <div className="bg-slate-50 border-b border-slate-100 px-6 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-600 font-semibold">
            <Key className="h-3.5 w-3.5 text-blue-600" />
            <span>Active Service Key:</span>
            <span className="font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200/60 font-bold">
              VUKZXX7Z...8KZLQV8H
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Ready to Dispatch</span>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh] text-slate-700">
          
          {/* SECTION 1: SENDER CONFIG */}
          <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-600" /> 1. ข้อมูลผู้ส่ง (Sender Settings)
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Email ผู้ส่ง (Sender Email)</label>
                <input 
                  type="email"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">ชื่อผู้แสดงผล (Display Name)</label>
                <input 
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: RECIPIENTS & CONTENT */}
          <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
              <Mail className="h-4 w-4 text-indigo-600" /> 2. รายชื่อผู้รับ & เนื้อหา (Recipients & Content)
            </h4>
            
            {/* Recipient Chips */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">อีเมลผู้รับ (Recipient Emails)</label>
              <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white border border-slate-200 rounded-lg min-h-[42px]">
                {recipientEmails.map((email) => (
                  <span 
                    key={email}
                    className="inline-flex items-center gap-1 bg-blue-50 text-blue-800 text-[11px] font-bold px-2 py-1 rounded-md border border-blue-200/60"
                  >
                    {email}
                    <button 
                      onClick={() => handleRemoveRecipient(email)}
                      className="hover:text-rose-600 p-0.5 rounded transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                <input 
                  type="email"
                  placeholder={recipientEmails.length === 0 ? "พิมพ์อีเมลแล้วกด Enter..." : "เพิ่มอีเมล..."}
                  value={recipientInput}
                  onChange={(e) => setRecipientInput(e.target.value)}
                  onKeyDown={handleKeyDownRecipient}
                  onBlur={handleAddRecipient}
                  className="flex-1 min-w-[140px] text-xs font-semibold px-2 py-1 border-none focus:outline-none text-slate-800 bg-transparent"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">หัวข้ออีเมล (Email Subject)</label>
              <input 
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800"
              />
            </div>

            {/* Attach PDF Toggle */}
            <div className="flex items-center gap-2 pt-1">
              <input 
                type="checkbox"
                id="attachPdf"
                checked={attachPdf}
                onChange={(e) => setAttachPdf(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <label htmlFor="attachPdf" className="text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer">
                <Paperclip className="h-3.5 w-3.5 text-slate-500" /> แนบไฟล์รายงาน A4 PDF อัตโนมัติ (Automatic A4 PDF Attachment)
              </label>
            </div>
          </div>

          {/* SECTION 3: AUTOMATION FREQUENCY */}
          <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-600" /> 3. รอบเวลาส่งอัตโนมัติ (Schedule Frequency)
              </h4>
              
              {/* Enable Toggle Switch */}
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-extrabold uppercase ${isAutoEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
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

            {/* Frequency Options */}
            <div className="grid grid-cols-3 gap-2 select-none pt-1">
              <button
                type="button"
                onClick={() => setFrequency('daily')}
                className={`py-2 px-3 rounded-lg text-xs font-extrabold border flex items-center justify-center gap-1.5 transition-all ${
                  frequency === 'daily' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                ☀️ รายวัน (Daily)
              </button>
              <button
                type="button"
                onClick={() => setFrequency('weekly')}
                className={`py-2 px-3 rounded-lg text-xs font-extrabold border flex items-center justify-center gap-1.5 transition-all ${
                  frequency === 'weekly' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                📅 รายสัปดาห์ (Weekly)
              </button>
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`py-2 px-3 rounded-lg text-xs font-extrabold border flex items-center justify-center gap-1.5 transition-all ${
                  frequency === 'monthly' 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                📆 รายเดือน (Monthly)
              </button>
            </div>

            {/* Time & Day Selection */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {frequency === 'weekly' && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">วันในสัปดาห์ (Day of Week)</label>
                  <select 
                    value={sendDayOfWeek}
                    onChange={(e) => setSendDayOfWeek(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 cursor-pointer"
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
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">วันที่ในเดือน (Day of Month)</label>
                  <select 
                    value={sendDayOfMonth}
                    onChange={(e) => setSendDayOfMonth(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 cursor-pointer"
                  >
                    <option value="1">ทุกวันที่ 1 ของเดือน (1st of Month)</option>
                    <option value="15">ทุกวันที่ 15 ของเดือน (15th of Month)</option>
                    <option value="28">ทุกวันสิ้นเดือน (Last Day of Month)</option>
                  </select>
                </div>
              )}

              <div className={frequency === 'daily' ? 'col-span-2' : ''}>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">เวลาส่ง (Send Time)</label>
                <input 
                  type="time"
                  value={sendTime}
                  onChange={(e) => setSendTime(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-800 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* FEEDBACK BADGE */}
          {feedback && (
            <div className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
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

          {isSaved && (
            <div className="p-3 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-blue-600 shrink-0" />
              <span>บันทึกการตั้งค่าการส่งอีเมลเรียบร้อยแล้ว</span>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSendTestEmail}
            disabled={isSendingTest}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSendingTest ? (
              <>
                <span className="inline-block h-3.5 w-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                กำลังทดสอบส่ง...
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5 text-indigo-600" />
                🧪 ทดสอบส่งอีเมลทันที (Send Test)
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSaveConfig}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              💾 บันทึกการตั้งค่า (Save Settings)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
