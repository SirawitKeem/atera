export type LocaleType = 'th' | 'en';

export const translations = {
  th: {
    // Header & Subtitles
    summaryTitle: 'สรุปผลผู้บริหาร (Executive Summary)',
    summarySubtitle: 'รายงานสรุปย่อการดำเนินงานหลักสำหรับผู้บริหาร',
    devicesTitle: 'โครงสร้างพื้นฐานและข้อมูลอุปกรณ์ (Infrastructure Overview)',
    devicesSubtitle: 'สรุปสถานะอุปกรณ์และบัญชีผู้ติดต่อของลูกค้า',
    patchesTitle: 'สรุปการอัปเดตระบบปฏิบัติการ (OS Patch Summary)',
    patchesSubtitle: 'รายงานสถานะการติดตั้งแพตช์ความปลอดภัยล่าสุด',
    softwareTitle: 'แพตช์ระบบปฏิบัติการที่พร้อมติดตั้ง (Available Patches)',
    softwareSubtitle: 'รายการอัปเดตระบบที่ค้างการติดตั้งแยกตามอุปกรณ์',
    alertsTitle: 'สรุปการแจ้งเตือนและการเฝ้าระวัง (Alert Overview)',
    alertsSubtitle: 'ประวัติและระดับความรุนแรงของการแจ้งเตือนในระบบ',
    ticketsTitle: 'สรุปการให้บริการตั๋วงาน (Ticket Overview)',
    ticketsSubtitle: 'สถิติการเปิดตั๋วงาน เวลาแก้ไข และระดับการให้บริการ',
    riskTitle: 'การประเมินความเสี่ยงและความปลอดภัย (Security Assessment)',
    riskSubtitle: 'คะแนนการประเมินช่องโหว่ความมั่นคงปลอดภัยโดยรวม',
    healthTitle: 'ความพร้อมใช้งานและสุขภาพของอุปกรณ์ (Device Health)',
    healthSubtitle: 'รายงานการวิเคราะห์เสถียรภาพและเปอร์เซ็นต์ออฟไลน์',
    
    // KPI Cards
    totalCustomers: 'จำนวนลูกค้าทั้งหมด',
    monitoredDevices: 'อุปกรณ์ที่เฝ้าระวัง',
    activeAlerts: 'การแจ้งเตือนที่รันอยู่',
    totalTickets: 'ตั๋วงานที่เกิดขึ้น',
    
    // Summary Cards (Page 2)
    ticketsAndService: 'การจัดการตั๋วงานและบริการ (Service Desk)',
    openTickets: 'ตั๋วรอดำเนินการ (Pending)',
    resolvedTickets: 'ตั๋วงานที่แก้ไขแล้ว',
    criticalTickets: 'ตั๋วงานระดับวิกฤต',
    resolutionRate: 'อัตราการปิดงาน',
    alertsAndMonitoring: 'ระบบตรวจสอบและการแจ้งเตือน (Monitoring)',
    criticalSeverity: 'การแจ้งเตือนระดับวิกฤต',
    warningSeverity: 'การแจ้งเตือนระดับเฝ้าระวัง',
    activeAlertsTitle: 'การแจ้งเตือนสะสมในระบบ',
    deviceTypeBreakdown: 'อัตราส่วนและประเภทของอุปกรณ์ทั้งหมด (Device Type)',
    deviceType: 'ประเภทอุปกรณ์',
    agentCount: 'จำนวนอุปกรณ์',
    ratio: 'สัดส่วนเปอร์เซ็นต์',

    // Devices Page (Page 3)
    customersTable: 'รายชื่อลูกค้าและสัญญาบริการ (Customer Contracts)',
    customerName: 'ชื่อลูกค้า',
    contactPerson: 'ผู้ประสานงาน',
    devices: 'อุปกรณ์',
    activeContracts: 'สัญญาบริการ',
    status: 'สถานะ',
    deviceBreakdownTitle: 'รายละเอียดประเภทอุปกรณ์ในระบบ (Device Inventory)',
    workstations: 'เครื่องผู้ใช้งาน (Workstation)',
    servers: 'เครื่องแม่ข่าย (Server)',
    active: 'เปิดใช้งาน',
    suspended: 'ปิดใช้งานชั่วคราว',

    // Patches Page (Page 4)
    patchesSummaryCard: 'สรุปการควบคุมแพตช์ความปลอดภัย (Patch Compliance)',
    compliantDevices: 'อุปกรณ์ที่เป็นไปตามเกณฑ์',
    pendingDevices: 'อุปกรณ์ค้างติดตั้งแพตช์',
    complianceRate: 'อัตราความปลอดภัย',
    osDistribution: 'ข้อมูลระบบปฏิบัติการในระบบ (OS Distribution)',
    osName: 'ระบบปฏิบัติการ',
    deviceCount: 'จำนวนเครื่อง',
    missingPatches: 'ค้างติดตั้งแพตช์ความปลอดภัย',
    highSeverityMissing: 'ค้างแพตช์ระดับวิกฤต',

    // Software Page (Page 5)
    softwareAudit: 'ประวัติและรายการอัปเดตระบบปฏิบัติการ (Patch Audit)',
    deviceName: 'ชื่อเครื่องอุปกรณ์',
    criticalMissing: 'วิกฤตที่ขาดหาย',
    importantMissing: 'สำคัญที่ขาดหาย',
    totalMissing: 'จำนวนแพตช์ค้างสะสม',
    latestPatchStatus: 'สถานะการตรวจพบแพตช์ค้างล่าสุด',

    // Alerts Page (Page 6)
    activeAlertsSummary: 'ภาพรวมการแจ้งเตือนจำแนกระดับ (Alerts Distribution)',
    alertSource: 'อุปกรณ์ที่แจ้งเตือน',
    alertMessage: 'ข้อความเตือนภัย',
    alertTime: 'เวลาแจ้งเตือน',
    severity: 'ระดับความรุนแรง',
    critical: 'วิกฤต (Critical)',
    warning: 'เตือนภัย (Warning)',

    // Tickets Page (Page 7)
    ticketsPerformance: 'ดัชนีประสิทธิภาพการบริการ (Service Performance Index)',
    avgResolutionTime: 'เวลาปิดตั๋วงานเฉลี่ย',
    slaCompliance: 'การตอบสนองตามข้อตกลง SLA',
    hours: 'ชั่วโมง',
    ticketList: 'ประวัติรายการตั๋วงานและบันทึกการซ่อม (Ticket Log)',
    ticketTitle: 'หัวข้อปัญหาตั๋วงาน',
    requestedBy: 'ผู้ยื่นคำร้อง',
    ticketStatus: 'สถานะตั๋ว',
    priority: 'ความสำคัญ',

    // Risk Scorecard Page (Page 8)
    overallRisk: 'คะแนนประเมินความเสี่ยงโดยรวม (Overall Risk Score)',
    excellent: 'ดีเยี่ยม (Excellent)',
    good: 'ดี (Good)',
    fair: 'ปานกลาง (Fair)',
    riskLevel: 'ระดับความเสี่ยงของโครงสร้างพื้นฐาน',
    riskFactor: 'ปัจจัยที่มีผลต่อคะแนนความปลอดภัย',
    patchRisk: 'ความปลอดภัยระบบปฏิบัติการ (OS Patch Compliance)',
    criticalAlertRisk: 'ปริมาณแจ้งเตือนระดับวิกฤตค้างสะสม',
    unresolvedTicketRisk: 'ปริมาณงานค้างแก้สะสมเกินเวลา',

    // Health Page (Page 9)
    availabilityHealth: 'อัตราความเสถียรและความพร้อมใช้งานเครื่อง (Availability & Uptime)',
    monitoredAgents: 'เครื่องที่รับการตรวจสอบ',
    onlineRatioTitle: 'สัดส่วนเครื่องออนไลน์',
    stabilityDetails: 'สรุปบันทึกการทำงานและสัญญาณชีพ (Agent Stable Status)',
    macAddress: 'หมายเลขทางกายภาพ (MAC Address)',
    ipAddress: 'ที่อยู่ไอพีเครื่อง (IP Address)',
    lastSeen: 'เชื่อมต่อล่าสุด (Last Seen)',
  },
  en: {
    // Header & Subtitles
    summaryTitle: 'Executive Summary',
    summarySubtitle: 'Monthly operational overview for executive management',
    devicesTitle: 'Infrastructure & Customer Overview',
    devicesSubtitle: 'Summary of devices, active contracts, and client contacts',
    patchesTitle: 'OS Patch Summary',
    patchesSubtitle: 'Latest security update and patch compliance statistics',
    softwareTitle: 'Available OS Patches',
    softwareSubtitle: 'Pending OS updates and patches details by device',
    alertsTitle: 'Alert Overview',
    alertsSubtitle: 'Recent system warnings, health alerts, and active notifications',
    ticketsTitle: 'Ticket Overview',
    ticketsSubtitle: 'Service desk statistics, response times, and SLA compliance',
    riskTitle: 'Security & Vulnerability Assessment',
    riskSubtitle: 'Overall risk scorecard and vulnerability status',
    healthTitle: 'Device Availability & Health',
    healthSubtitle: 'Availability reports, agent stability analysis, and uptime metrics',

    // KPI Cards
    totalCustomers: 'Total Customers',
    monitoredDevices: 'Monitored Devices',
    activeAlerts: 'Active Alerts',
    totalTickets: 'Total Tickets',

    // Summary Cards (Page 2)
    ticketsAndService: 'Tickets & Service Desk',
    openTickets: 'Pending Tickets',
    resolvedTickets: 'Resolved Tickets',
    criticalTickets: 'Critical Tickets',
    resolutionRate: 'Resolution Rate',
    alertsAndMonitoring: 'Alerts & Monitoring',
    criticalSeverity: 'Critical Severity',
    warningSeverity: 'Warning Severity',
    activeAlertsTitle: 'Active Alerts',
    deviceTypeBreakdown: 'Device Type Breakdown',
    deviceType: 'Device Type',
    agentCount: 'Agent Count',
    ratio: 'Ratio',

    // Devices Page (Page 3)
    customersTable: 'Customer Contracts & Billing',
    customerName: 'Customer Name',
    contactPerson: 'Contact Person',
    devices: 'Devices',
    activeContracts: 'Active Contracts',
    status: 'Status',
    deviceBreakdownTitle: 'Device Type Breakdown',
    workstations: 'Workstations',
    servers: 'Servers',
    active: 'Active',
    suspended: 'Suspended',

    // Patches Page (Page 4)
    patchesSummaryCard: 'Patch Compliance',
    compliantDevices: 'Compliant Devices',
    pendingDevices: 'Devices Pending Patches',
    complianceRate: 'Compliance Rate',
    osDistribution: 'OS Distribution',
    osName: 'Operating System',
    deviceCount: 'Device Count',
    missingPatches: 'Missing Patches',
    highSeverityMissing: 'Critical Missing Patches',

    // Software Page (Page 5)
    softwareAudit: 'Patch Audit Logs',
    deviceName: 'Device Name',
    criticalMissing: 'Critical Missing',
    importantMissing: 'Important Missing',
    totalMissing: 'Total Missing',
    latestPatchStatus: 'Latest Status Check',

    // Alerts Page (Page 6)
    activeAlertsSummary: 'Alerts Distribution by Severity',
    alertSource: 'Alert Source (Device)',
    alertMessage: 'Alert Message',
    alertTime: 'Alert Time',
    severity: 'Severity',
    critical: 'Critical',
    warning: 'Warning',

    // Tickets Page (Page 7)
    ticketsPerformance: 'Service Performance Index',
    avgResolutionTime: 'Avg Resolution Time',
    slaCompliance: 'SLA Compliance Rate',
    hours: 'Hours',
    ticketList: 'Ticket Log & Activity History',
    ticketTitle: 'Ticket Title',
    requestedBy: 'Requested By',
    ticketStatus: 'Status',
    priority: 'Priority',

    // Risk Scorecard Page (Page 8)
    overallRisk: 'Overall Risk Score',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    riskLevel: 'Infrastructure Risk Level',
    riskFactor: 'Security Risk Factors',
    patchRisk: 'OS Patch Compliance Risk',
    criticalAlertRisk: 'Accumulated Critical Alerts',
    unresolvedTicketRisk: 'Aged Open Tickets',

    // Health Page (Page 9)
    availabilityHealth: 'Availability & Uptime',
    monitoredAgents: 'Monitored Agents',
    onlineRatioTitle: 'Online Devices Ratio',
    stabilityDetails: 'Agent Stability Log',
    macAddress: 'MAC Address',
    ipAddress: 'IP Address',
    lastSeen: 'Last Seen',
  }
};
