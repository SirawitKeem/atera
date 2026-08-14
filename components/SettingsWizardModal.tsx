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
  Users,
  FileText,
  Settings,
  Eye
} from 'lucide-react';

interface SettingsWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStartDate: string;
  initialEndDate: string;
  initialCompanyName: string;
  initialReportTitle: string;
  initialReportSubtitle: string;
  initialDisplayLanguage: 'th' | 'en';
  initialStep?: number;
  onSave: (config: {
    startDate: string;
    endDate: string;
    companyName: string;
    reportTitle: string;
    reportSubtitle: string;
    displayLanguage: 'th' | 'en';
    emailLanguage: 'th' | 'en' | 'both';
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
  initialDisplayLanguage = 'th',
  initialStep = 1,
  onSave
}: SettingsWizardModalProps) {
  // Active Tab Index (1 to 6)
  const [activeTab, setActiveTab] = useState(initialStep);

  // Tab 1: ข้อมูลรายงาน
  const [reportTitle, setReportTitle] = useState(initialReportTitle);
  const [reportSubtitle, setReportSubtitle] = useState(initialReportSubtitle);
  const [companyName, setCompanyName] = useState(initialCompanyName);

  // Tab 2: กำหนดเวลา
  const [isAutoEnabled, setIsAutoEnabled] = useState(true);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [sendDayOfWeek, setSendDayOfWeek] = useState('1'); // 1 = Monday
  const [sendDayOfMonth, setSendDayOfMonth] = useState('1'); // 1st
  const [sendTime, setSendTime] = useState('08:00');

  // Tab 3: ช่วงข้อมูล
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);

  // Tab 4: ผู้รับรายงาน
  const [recipientInput, setRecipientInput] = useState('');
  const [recipientEmails, setRecipientEmails] = useState<string[]>([
    'ceo@company.com',
    'it-admin@company.com'
  ]);

  // Tab 5: การส่งอีเมล
  const [senderEmail] = useState('report-bot@ateramsp.com'); // Fixed to Key Email
  const [senderName, setSenderName] = useState('Atera MSP Automated Report System');
  const [subject, setSubject] = useState('');
  const [attachPdf, setAttachPdf] = useState(true);
  const [displayLanguage, setDisplayLanguage] = useState<'th' | 'en'>(initialDisplayLanguage);
  const [emailLanguage, setEmailLanguage] = useState<'th' | 'en' | 'both'>('both');

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
      setDisplayLanguage(initialDisplayLanguage);
      setActiveTab(initialStep);
    }
  }, [isOpen, initialStartDate, initialEndDate, initialCompanyName, initialReportTitle, initialReportSubtitle, initialDisplayLanguage, initialStep]);

  // Sync default subject line when companyName changes
  useEffect(() => {
    setSubject(`[Atera MSP Report] รายงานสรุป A4 PDF - ${companyName}`);
  }, [companyName]);

  // Load saved config on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('atera_unified_report_settings');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        if (parsed.reportTitle) setReportTitle(parsed.reportTitle);
        if (parsed.reportSubtitle) setReportSubtitle(parsed.reportSubtitle);
        if (parsed.companyName) setCompanyName(parsed.companyName);
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
        if (parsed.displayLanguage && (parsed.displayLanguage === 'th' || parsed.displayLanguage === 'en')) {
          setDisplayLanguage(parsed.displayLanguage);
        }
        if (parsed.emailLanguage && (parsed.emailLanguage === 'th' || parsed.emailLanguage === 'en' || parsed.emailLanguage === 'both')) {
          setEmailLanguage(parsed.emailLanguage);
        }
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
          attachPdf,
          emailLanguage
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
      displayLanguage,
      emailLanguage,
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
      reportSubtitle,
      displayLanguage,
      emailLanguage
    });

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1200);
  };

  const tabs = [
    { num: 1, label: 'ข้อมูลรายงาน', icon: <FileText className="h-4 w-4" /> },
    { num: 2, label: 'กำหนดเวลาส่ง', icon: <Clock className="h-4 w-4" /> },
    { num: 3, label: 'ช่วงข้อมูลเวลา', icon: <Calendar className="h-4 w-4" /> },
    { num: 4, label: 'ผู้รับรายงาน', icon: <Users className="h-4 w-4" /> },
    { num: 5, label: 'การส่งอีเมล', icon: <Mail className="h-4 w-4" /> },
    { num: 6, label: 'สรุปและบันทึก', icon: <Eye className="h-4 w-4" /> }
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto  font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col my-auto transition-all duration-300 border-t-4 border-t-[#E20074]">
        
        {/* MODAL HEADER */}
        <div className="bg-white px-6 py-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 bg-[#FFEAF2] rounded-xl">
              <Settings className="h-5 w-5 text-[#E20074]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight leading-tight text-[#0F172A]">ตั้งค่าหลักของรายงาน (Report Configuration)</h3>
              <p className="text-xs text-slate-400 font-medium mt-0.5">จัดการเนื้อหารายงาน ระยะเวลาจัดทำเอกสาร และการส่งอัตโนมัติ</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* MODAL BODY (Sidebar + Content layout) */}
        <div className="flex flex-1 min-h-[420px] max-h-[60vh]">
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <div className="w-1/3 bg-slate-50/80 border-r border-slate-150 p-4 space-y-1.5 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                เมนูกำหนดค่าหลัก
              </span>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.num;
                return (
                  <button
                    key={tab.num}
                    onClick={() => {
                      setActiveTab(tab.num);
                      setFeedback(null);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left relative cursor-pointer ${
                      isActive 
                        ? 'bg-[#FFEAF2] text-[#E20074] shadow-xs font-black'
                        : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                    }`}
                  >
                    {/* Premium floating vertical indicator capsule */}
                    {isActive && (
                      <div className="absolute left-1.5 top-3 bottom-3 w-1 bg-[#E20074] rounded-full" />
                    )}
                    <div className={`${isActive ? 'text-[#E20074] pl-2' : 'text-slate-400'} transition-all`}>
                      {tab.icon}
                    </div>
                    <span className={isActive ? 'pl-2' : ''}>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Status Info */}
            <div className="bg-slate-100/80 border border-slate-200/60 rounded-2xl p-4 text-[10.5px] text-slate-500 font-medium space-y-1.5 leading-relaxed">
              <div className="flex items-center gap-2 font-black text-[#0F172A]">
                <ShieldCheck className="h-4 w-4 text-[#E20074]" />
                <span>Atera API Connected</span>
              </div>
              <p>เชื่อมต่อเครือข่ายและดึงข้อมูลสรุปเรียบร้อยแล้ว</p>
            </div>
          </div>

          {/* RIGHT CONTENT PANEL */}
          <div className="w-2/3 p-6 overflow-y-auto bg-white flex flex-col justify-between">
            
            {/* CONTENT VIEWS */}
            <div className="flex-1">
              
              {/* TAB 1: ข้อมูลรายงาน */}
              {activeTab === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-[#0F172A]">ข้อมูลรายงาน (Report Settings)</h4>
                    <p className="text-xs text-slate-400 font-medium">ระบุข้อความพาดหัวและข้อมูลแบรนด์เพื่อแสดงในหน้าแรกของรายงาน</p>
                  </div>
                  
                  <div className="space-y-3.5 pt-2">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">ชื่อหัวข้อหลักของรายงาน (Report Title)</label>
                      <input 
                        type="text"
                        value={reportTitle}
                        onChange={(e) => setReportTitle(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E20074]/15 focus:border-[#E20074] text-slate-800 transition-all"
                        placeholder="เช่น Executive Summary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">ชื่อคำอธิบายเพิ่มเติม (Subtitle)</label>
                      <input 
                        type="text"
                        value={reportSubtitle}
                        onChange={(e) => setReportSubtitle(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E20074]/15 focus:border-[#E20074] text-slate-800 transition-all"
                        placeholder="เช่น Monthly Executive Report"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">ชื่อลูกค้าของระบบ (Client Company)</label>
                      <input 
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E20074]/15 focus:border-[#E20074] text-slate-800 transition-all"
                        placeholder="เช่น Atera Client"
                      />
                    </div>

                    {/* Display Language Selection */}
                    <div className="space-y-1.5 pt-2.5 border-t border-slate-100">
                      <label className="block text-[11px] font-bold text-slate-600">ภาษาที่แสดงผลบนหน้าจอรายงาน (Display Language)</label>
                      <div className="grid grid-cols-2 gap-3">
                        {(['th', 'en'] as const).map((langOpt) => (
                          <button
                            key={langOpt}
                            type="button"
                            onClick={() => setDisplayLanguage(langOpt)}
                            className={`py-2 px-3 rounded-xl text-xs font-black border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              displayLanguage === langOpt 
                                ? 'bg-[#E20074] text-white border-[#E20074] shadow-sm' 
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {langOpt === 'th' && 'ภาษาไทย (TH)'}
                            {langOpt === 'en' && 'English (EN)'}
                          </button>
                        ))}
                      </div>
                      <p className="text-[9.5px] text-slate-400 font-medium">
                        * เลือกภาษาที่จะแสดงผลบนหน้าจอรายงานและเวลาดาวน์โหลดเป็นเอกสาร PDF
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: กำหนดเวลาส่ง */}
              {activeTab === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="space-y-1">
                      <h4 className="text-sm font-extrabold text-[#0F172A]">กำหนดเวลาส่งรายงานอัตโนมัติ (Schedule)</h4>
                      <p className="text-xs text-slate-400 font-medium">ตั้งค่าส่งไฟล์รายงานออกไปยังกลุ่มผู้รับผ่านระบบอีเมลตามกำหนดเวลา</p>
                    </div>
                    
                    {/* Toggle Switch */}
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase ${isAutoEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {isAutoEnabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAutoEnabled(!isAutoEnabled)}
                        className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isAutoEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            isAutoEnabled ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-600">รอบเวลาการจัดส่ง (Frequency)</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['daily', 'weekly', 'monthly'] as const).map((freq) => (
                          <button
                            key={freq}
                            type="button"
                            onClick={() => setFrequency(freq)}
                            disabled={!isAutoEnabled}
                            className={`py-2.5 px-3 rounded-xl text-xs font-black border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              !isAutoEnabled 
                                ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200'
                                : frequency === freq 
                                ? 'bg-[#E20074] text-white border-[#E20074] shadow-sm' 
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {freq === 'daily' && 'รายวัน'}
                            {freq === 'weekly' && 'รายสัปดาห์'}
                            {freq === 'monthly' && 'รายเดือน'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      {frequency === 'weekly' && (
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-600">จัดส่งทุกวัน (Day of Week)</label>
                          <select 
                            value={sendDayOfWeek}
                            onChange={(e) => setSendDayOfWeek(e.target.value)}
                            disabled={!isAutoEnabled}
                            className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E20074]/15 focus:border-[#E20074] text-slate-800 cursor-pointer disabled:opacity-50"
                          >
                            <option value="1">วันจันทร์ (Monday)</option>
                            <option value="2">วันอังคาร (Tuesday)</option>
                            <option value="3">วันพุธ (Wednesday)</option>
                            <option value="4">วันพฤหัสบดี (Thursday)</option>
                            <option value="5">วันศุกร์ (Friday)</option>
                          </select>
                        </div>
                      )}

                      {frequency === 'monthly' && (
                        <div className="space-y-1">
                          <label className="block text-[11px] font-bold text-slate-600">จัดส่งวันที่ (Day of Month)</label>
                          <select 
                            value={sendDayOfMonth}
                            onChange={(e) => setSendDayOfMonth(e.target.value)}
                            disabled={!isAutoEnabled}
                            className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E20074]/15 focus:border-[#E20074] text-slate-800 cursor-pointer disabled:opacity-50"
                          >
                            <option value="1">วันที่ 1 ของเดือน</option>
                            <option value="15">วันที่ 15 ของเดือน</option>
                            <option value="28">วันสิ้นเดือน (Last Day)</option>
                          </select>
                        </div>
                      )}

                      <div className={frequency === 'daily' ? 'col-span-2 space-y-1' : 'space-y-1'}>
                        <label className="block text-[11px] font-bold text-slate-600">เวลาในการส่ง (Time)</label>
                        <input 
                          type="time"
                          value={sendTime}
                          onChange={(e) => setSendTime(e.target.value)}
                          disabled={!isAutoEnabled}
                          className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E20074]/15 focus:border-[#E20074] text-slate-800 cursor-pointer disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: ช่วงข้อมูลเวลา */}
              {activeTab === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-[#0F172A]">ช่วงข้อมูลเวลาของรายงาน (Date Scope)</h4>
                    <p className="text-xs text-slate-400 font-medium">เลือกขอบเขตวันที่จะดึงจากระบบฐานข้อมูลมาประมวลผล</p>
                  </div>
                  
                  <div className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-600">ปุ่มเลือกช่วงเวลาสำเร็จรูป (Quick Presets)</label>
                      <div className="grid grid-cols-4 gap-2">
                        <button
                          type="button"
                          onClick={() => applyPreset('7d')}
                          className="py-2.5 px-2 bg-slate-50 text-slate-700 hover:bg-[#FFEAF2] hover:text-[#E20074] hover:border-[#E20074]/40 border border-slate-200 rounded-xl text-[10.5px] font-extrabold transition-all cursor-pointer"
                        >
                          ย้อนหลัง 7 วัน
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPreset('30d')}
                          className="py-2.5 px-2 bg-slate-50 text-slate-700 hover:bg-[#FFEAF2] hover:text-[#E20074] hover:border-[#E20074]/40 border border-slate-200 rounded-xl text-[10.5px] font-extrabold transition-all cursor-pointer"
                        >
                          ย้อนหลัง 30 วัน
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPreset('thisMonth')}
                          className="py-2.5 px-2 bg-slate-50 text-slate-700 hover:bg-[#FFEAF2] hover:text-[#E20074] hover:border-[#E20074]/40 border border-slate-200 rounded-xl text-[10.5px] font-extrabold transition-all cursor-pointer"
                        >
                          เดือนนี้
                        </button>
                        <button
                          type="button"
                          onClick={() => applyPreset('lastMonth')}
                          className="py-2.5 px-2 bg-slate-50 text-slate-700 hover:bg-[#FFEAF2] hover:text-[#E20074] hover:border-[#E20074]/40 border border-slate-200 rounded-xl text-[10.5px] font-extrabold transition-all cursor-pointer"
                        >
                          เดือนที่แล้ว
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600">วันที่เริ่มต้น (Start Date)</label>
                        <input 
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E20074]/15 focus:border-[#E20074] text-slate-800 cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600">วันที่สิ้นสุด (End Date)</label>
                        <input 
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E20074]/15 focus:border-[#E20074] text-slate-800 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: ผู้รับรายงาน */}
              {activeTab === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-[#0F172A]">รายชื่อผู้รับรายงาน (Recipients)</h4>
                    <p className="text-xs text-slate-400 font-medium">ระบุรายชื่ออีเมลผู้ที่จะได้รับส่งออกรายงานฉบับสรุปนี้</p>
                  </div>
                  
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">อีเมลผู้รับปลายทาง (Recipient Emails)</label>
                      <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-white border border-slate-200 rounded-xl min-h-[90px] focus-within:ring-2 focus-within:ring-[#E20074]/15 focus-within:border-[#E20074] transition-all">
                        {recipientEmails.map((email) => (
                          <span 
                            key={email}
                            className="inline-flex items-center gap-1 bg-[#FFEAF2] text-[#E20074] text-[11px] font-bold px-2.5 py-1 rounded-lg border border-[#E20074]/20"
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
                      <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">
                        * พิมพ์อีเมลที่ต้องการส่งให้ถูกต้อง แล้วกดปุ่ม Enter หรือกดจุลภาค ( , ) เพื่อบรรจุอีเมล
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: การส่งอีเมล */}
              {activeTab === 5 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-[#0F172A]">ตั้งค่าอีเมลจัดส่ง (Email Configuration)</h4>
                    <p className="text-xs text-slate-400 font-medium">จัดการอีเมลผู้ส่งและตั้งเรื่องเอกสาร (หมายเหตุ: ล็อกอีเมลผู้ส่งตามคีย์บริการเท่านั้น)</p>
                  </div>
                  
                  <div className="space-y-3.5 pt-1">
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600">Email ผู้ส่ง (Sender Email - Fixed)</label>
                        <div className="relative">
                          <input 
                            type="email"
                            value={senderEmail}
                            disabled={true}
                            className="w-full text-xs font-bold px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
                          />
                          <Key className="absolute right-3 top-3 h-3.5 w-3.5 text-slate-400" />
                        </div>
                        <p className="text-[9.5px] text-slate-400 font-bold mt-1">
                          * ล็อกค่าตาม Service Key SMTP ระบบจะไม่สามารถแก้ไขค่านี้ได้
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-slate-600">ชื่อผู้แสดงผลการส่ง (Display Name)</label>
                        <input 
                          type="text"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          className="w-full text-xs font-semibold px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E20074]/15 focus:border-[#E20074] text-slate-800 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-slate-600">หัวข้ออีเมลส่งงาน (Subject Line)</label>
                      <input 
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E20074]/15 focus:border-[#E20074] text-slate-800 transition-all"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <input 
                        type="checkbox"
                        id="wizardAttachPdf"
                        checked={attachPdf}
                        onChange={(e) => setAttachPdf(e.target.checked)}
                        className="h-4 w-4 text-[#E20074] rounded border-slate-300 focus:ring-[#E20074] cursor-pointer"
                      />
                      <label htmlFor="wizardAttachPdf" className="text-xs font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer">
                        <Paperclip className="h-3.5 w-3.5 text-slate-500" /> ทำการแนบรายงาน PDF ไปพร้อมกับอีเมลส่งอัตโนมัติ
                      </label>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <label className="block text-[11px] font-bold text-slate-600">ภาษาของไฟล์รายงานที่จะจัดส่ง (Report Delivery Language)</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['th', 'en', 'both'] as const).map((langOpt) => (
                          <button
                            key={langOpt}
                            type="button"
                            onClick={() => setEmailLanguage(langOpt)}
                            className={`py-2 px-3 rounded-xl text-xs font-black border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              emailLanguage === langOpt 
                                ? 'bg-[#E20074] text-white border-[#E20074] shadow-sm' 
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {langOpt === 'th' && 'ภาษาไทย (TH)'}
                            {langOpt === 'en' && 'ภาษาอังกฤษ (EN)'}
                            {langOpt === 'both' && 'ทั้งสองภาษา (Both)'}
                          </button>
                        ))}
                      </div>
                      <p className="text-[9.5px] text-slate-400 font-medium">
                        * กำหนดรูปแบบภาษาของรายงาน PDF ที่จะแนบส่ง (ทั้งสองภาษา จะส่งแนบเอกสารแยกเป็นสองไฟล์)
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: สรุปและบันทึก */}
              {activeTab === 6 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-[#0F172A]">สรุปข้อมูลรายละเอียดการตั้งค่าหลัก (Review & Apply)</h4>
                    <p className="text-xs text-slate-400 font-medium">สรุปค่าควบคุมเอกสารทั้งหมดเพื่อยืนยันนำค่าไปทำงาน</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    {/* Visual Summary List */}
                    <div className="space-y-2.5 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-[10.5px] font-bold text-slate-600">
                      <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                        <span className="text-slate-400 font-bold">หัวข้อหลัก:</span>
                        <span className="text-[#0F172A] text-right truncate max-w-[150px] font-extrabold">{reportTitle}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                        <span className="text-slate-400 font-bold">คำอธิบายย่อย:</span>
                        <span className="text-[#0F172A] text-right truncate max-w-[150px] font-extrabold">{reportSubtitle}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                        <span className="text-slate-400 font-bold">บริษัทลูกค้า:</span>
                        <span className="text-[#0F172A] text-right truncate max-w-[150px] font-extrabold">{companyName}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                        <span className="text-slate-400 font-bold">ช่วงเวลาจัดเตรียม:</span>
                        <span className="text-[#0F172A] text-right font-extrabold">{startDate} ถึง {endDate}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                        <span className="text-slate-400 font-bold">ระบบส่งอัตโนมัติ:</span>
                        <span className={`font-black ${isAutoEnabled ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {isAutoEnabled ? `ส่งทุก${frequency === 'daily' ? 'วัน' : frequency === 'weekly' ? 'สัปดาห์' : 'เดือน'} เวลา ${sendTime} น.` : 'ปิดใช้งาน'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                        <span className="text-slate-400 font-bold">ภาษาที่แสดงผล:</span>
                        <span className="text-[#0F172A] text-right font-extrabold">
                          {displayLanguage === 'th' ? 'ภาษาไทย (TH)' : 'English (EN)'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                        <span className="text-slate-400 font-bold">ภาษาที่จัดส่งเมล:</span>
                        <span className="text-[#E20074] text-right font-extrabold">
                          {emailLanguage === 'th' ? 'ภาษาไทย (TH)' : emailLanguage === 'en' ? 'ภาษาอังกฤษ (EN)' : 'ทั้งสองภาษา (TH & EN)'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-bold">ผู้รับ ({recipientEmails.length} อีเมล):</span>
                        <span className="text-[#0F172A] text-right truncate max-w-[140px] font-extrabold">{recipientEmails.join(', ') || 'ไม่มี'}</span>
                      </div>
                    </div>

                    {/* Status Bar / Ready to Send Box */}
                    <div className="flex flex-col justify-between border border-slate-200 rounded-xl p-4 bg-white">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-black text-[#0F172A]">
                          <Key className="h-4 w-4 text-[#E20074]" />
                          <span>SMTP Dispatch Ready</span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                          เชื่อมระบบเรียบร้อยแล้วผ่าน API Service Key คุณสามารถส่งตั๋วเมลทดสอบไปตรวจสอบหน้าตางานได้ทันที
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-emerald-600 font-black text-[10.5px] pt-4">
                        <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                        <span>Service Key พร้อมใช้งาน</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* FEEDBACK & STATUS BOTTOM BAR (Inside right content panel) */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
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

              {isSaved && (
                <div className="p-3 bg-pink-50 text-[#E20074] border border-pink-200 rounded-xl text-xs font-bold flex items-center gap-2 animate-pulse">
                  <CheckCircle className="h-4 w-4 text-[#E20074] shrink-0" />
                  <span>บันทึกการตั้งค่าทั้งหมดเรียบร้อยแล้ว...</span>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* MODAL FOOTER */}
        <div className="bg-slate-50 border-t border-slate-150 px-6 py-4 flex items-center justify-between shadow-inner">
          {/* Left: Test Send Button on Step 6 / Tab 6 */}
          <div>
            {activeTab === 6 && (
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={isSendingTest || recipientEmails.length === 0}
                className="px-4 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white disabled:opacity-40 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer"
              >
                {isSendingTest ? (
                  <>
                    <span className="inline-block h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    กำลังส่งอีเมล...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 text-[#E20074]" />
                    <span>ทดสอบส่งเมล (Send Test)</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Right: Close and Save options */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={handleSaveConfig}
              className="px-5 py-2.5 bg-[#E20074] hover:bg-[#c30062] text-white rounded-xl text-xs font-extrabold shadow-lg shadow-[#E20074]/20 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>บันทึกตั้งค่า (Save Settings)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
