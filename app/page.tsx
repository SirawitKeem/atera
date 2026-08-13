import React from 'react';
import ReportView from '@/components/ReportView';
import { AteraClient } from '@/lib/atera-client';

const MOCK_DATA = {
  customers: [
    { "CustomerID": 1, "CustomerName": "Acme Corporation", "CustomerEmail": "contact@acme.com", "CreatedOn": "2024-01-15T08:00:00Z" },
    { "CustomerID": 2, "CustomerName": "Wayne Enterprises", "CustomerEmail": "it@wayne.com", "CreatedOn": "2024-03-22T10:30:00Z" },
    { "CustomerID": 3, "CustomerName": "Stark Industries", "CustomerEmail": "support@stark.com", "CreatedOn": "2024-05-10T14:15:00Z" },
    { "CustomerID": 4, "CustomerName": "Oscorp Technologies", "CustomerEmail": "info@oscorp.com", "CreatedOn": "2024-06-01T09:00:00Z" },
    { "CustomerID": 5, "CustomerName": "Umbrella Corp", "CustomerEmail": "bio@umbrella.com", "CreatedOn": "2024-06-15T11:45:00Z" }
  ],
  agents: [
    { "AgentID": 101, "MachineName": "DESKTOP-R8A21", "OS": "Windows 11 Pro", "CustomerID": 1, "CustomerName": "Acme Corporation", "Online": true, "DeviceType": "Workstation", "IPAddress": "192.168.1.15" },
    { "AgentID": 102, "MachineName": "SERVER-SQL01", "OS": "Windows Server 2022", "CustomerID": 1, "CustomerName": "Acme Corporation", "Online": true, "DeviceType": "Server", "IPAddress": "192.168.1.10" },
    { "AgentID": 103, "MachineName": "ACME-LAP-02", "OS": "macOS Sequoia", "CustomerID": 1, "CustomerName": "Acme Corporation", "Online": false, "DeviceType": "Workstation", "IPAddress": "192.168.1.52" },
    { "AgentID": 104, "MachineName": "WAYNE-DC01", "OS": "Windows Server 2019", "CustomerID": 2, "CustomerName": "Wayne Enterprises", "Online": true, "DeviceType": "Server", "IPAddress": "10.0.1.10" },
    { "AgentID": 105, "MachineName": "WAYNE-WORK-01", "OS": "Windows 10 Pro", "CustomerID": 2, "CustomerName": "Wayne Enterprises", "Online": true, "DeviceType": "Workstation", "IPAddress": "10.0.1.45" },
    { "AgentID": 106, "MachineName": "STARK-JARVIS", "OS": "Ubuntu 24.04 LTS", "CustomerID": 3, "CustomerName": "Stark Industries", "Online": true, "DeviceType": "Server", "IPAddress": "172.16.5.5" },
    { "AgentID": 107, "MachineName": "STARK-LAP-10", "OS": "Windows 11 Pro", "CustomerID": 3, "CustomerName": "Stark Industries", "Online": true, "DeviceType": "Workstation", "IPAddress": "172.16.5.21" }
  ],
  tickets: [
    { "TicketID": 2001, "TicketTitle": "SQL Database replication failure", "TicketStatus": "Open", "TicketPriority": "Critical", "CreatedDate": "2026-07-30T09:00:00Z", "CustomerID": 1, "CustomerName": "Acme Corporation" },
    { "TicketID": 2002, "TicketTitle": "Outlook won't sync email", "TicketStatus": "Open", "TicketPriority": "Medium", "CreatedDate": "2026-07-30T10:15:00Z", "CustomerID": 2, "CustomerName": "Wayne Enterprises" },
    { "TicketID": 2003, "TicketTitle": "New hire workstation deployment", "TicketStatus": "Pending", "TicketPriority": "Low", "CreatedDate": "2026-07-29T14:00:00Z", "CustomerID": 3, "CustomerName": "Stark Industries" },
    { "TicketID": 2004, "TicketTitle": "VPN Connection dropping frequently", "TicketStatus": "Resolved", "TicketPriority": "High", "CreatedDate": "2026-07-29T08:30:00Z", "CustomerID": 1, "CustomerName": "Acme Corporation" },
    { "TicketID": 2005, "TicketTitle": "Antivirus alert on file server", "TicketStatus": "Open", "TicketPriority": "High", "CreatedDate": "2026-07-30T11:00:00Z", "CustomerID": 4, "CustomerName": "Oscorp Technologies" }
  ],
  alerts: [
    { "AlertID": 5001, "DeviceName": "SERVER-SQL01", "CustomerID": 1, "CustomerName": "Acme Corporation", "Severity": "Critical", "Message": "CPU usage exceeded 95% for 15 minutes", "CreatedDate": "2026-07-30T11:45:00Z" },
    { "AlertID": 5002, "DeviceName": "WAYNE-DC01", "CustomerID": 2, "CustomerName": "Wayne Enterprises", "Severity": "Warning", "Message": "Low disk space on C:\\ drive (less than 10%)", "CreatedDate": "2026-07-30T12:00:00Z" },
    { "AlertID": 5003, "DeviceName": "STARK-JARVIS", "CustomerID": 3, "CustomerName": "Stark Industries", "Severity": "Critical", "Message": "Unauthorized SSH login attempt detected", "CreatedDate": "2026-07-30T12:20:00Z" }
  ],
  contracts: [
    { "ContractID": 301, "ContractName": "Premium Managed IT Support", "CustomerID": 1, "CustomerName": "Acme Corporation", "StartDate": "2026-01-01T00:00:00Z", "EndDate": "2027-01-01T00:00:00Z", "ContractType": "Flat Fee" },
    { "ContractID": 302, "ContractName": "Basic Maintenance Agreement", "CustomerID": 2, "CustomerName": "Wayne Enterprises", "StartDate": "2026-03-01T00:00:00Z", "EndDate": "2027-03-01T00:00:00Z", "ContractType": "Hourly" },
    { "ContractID": 303, "ContractName": "Gold SLA Agreement", "CustomerID": 3, "CustomerName": "Stark Industries", "StartDate": "2026-05-01T00:00:00Z", "EndDate": "2027-05-01T00:00:00Z", "ContractType": "Flat Fee" }
  ],
  workhours: [
    { "WorkhourID": 401, "TechnicianName": "Keem IT", "LoggedHours": 18.5, "Billable": true, "TicketID": 2001, "CustomerName": "Acme Corporation" },
    { "WorkhourID": 402, "TechnicianName": "Keem IT", "LoggedHours": 12.0, "Billable": false, "TicketID": 2002, "CustomerName": "Wayne Enterprises" },
    { "WorkhourID": 403, "TechnicianName": "Somchai Support", "LoggedHours": 8.0, "Billable": true, "TicketID": 2003, "CustomerName": "Stark Industries" }
  ],
  patchData: []
};

export default async function Page() {
  let customersData: any = [];
  let agentsData: any = [];
  let ticketsData: any = [];
  let alertsData: any = [];
  let contractsData: any = [];
  let workhoursData: any = [];
  let patchData: any = [];
  let isMock = false;
  let errorMsg: string | null = null;

  try {
    // Attempt parallel data fetches using Promise.allSettled to handle individual failures gracefully
    const [customersRes, agentsRes, ticketsRes, alertsRes, contractsRes, workhoursRes] = await Promise.allSettled([
      AteraClient.getCustomers({ page: '1', itemsInPage: '50' }),
      AteraClient.getAgents({ page: '1', itemsInPage: '50' }),
      AteraClient.getTickets({ page: '1', itemsInPage: '50' }),
      AteraClient.getAlerts({ page: '1', itemsInPage: '50' }),
      AteraClient.getContracts({ page: '1', itemsInPage: '55' }),
      AteraClient.getWorkhours({ page: '1', itemsInPage: '50' })
    ]);

    // Extract Customers
    if (customersRes.status === 'fulfilled') {
      const val = customersRes.value;
      customersData = val.items || (Array.isArray(val) ? val : []);
    } else {
      throw new Error(`Failed to fetch customers: ${customersRes.reason.message}`);
    }

    // Extract Agents (Devices)
    if (agentsRes.status === 'fulfilled') {
      const val = agentsRes.value;
      agentsData = val.items || (Array.isArray(val) ? val : []);
      
      const patchPromises = agentsData.map(async (agent: any) => {
        if (!agent.DeviceGuid) return null;
        
        const [installedRes, availableRes] = await Promise.allSettled([
          AteraClient.getInstalledPatches(agent.DeviceGuid),
          AteraClient.getAvailablePatches(agent.DeviceGuid)
        ]);

        return {
          agentName: agent.MachineName,
          deviceGuid: agent.DeviceGuid,
          os: agent.OS,
          deviceType: agent.DeviceType,
          installedPatches: installedRes.status === 'fulfilled' ? (installedRes.value.installedUpdates || []) : [],
          availablePatches: availableRes.status === 'fulfilled' ? (availableRes.value.availableUpdates || []) : []
        };
      });
      
      const patchResults = await Promise.all(patchPromises);
      patchData = patchResults.filter(Boolean);
    } else {
      throw new Error(`Failed to fetch agents: ${agentsRes.reason.message}`);
    }

    // Extract Tickets
    if (ticketsRes.status === 'fulfilled') {
      const val = ticketsRes.value;
      ticketsData = val.items || (Array.isArray(val) ? val : []);
    } else {
      throw new Error(`Failed to fetch tickets: ${ticketsRes.reason.message}`);
    }

    // Extract Alerts
    if (alertsRes.status === 'fulfilled') {
      const val = alertsRes.value;
      alertsData = val.items || (Array.isArray(val) ? val : []);
    } else {
      throw new Error(`Failed to fetch alerts: ${alertsRes.reason.message}`);
    }

    // Extract Contracts
    if (contractsRes.status === 'fulfilled') {
      const val = contractsRes.value;
      contractsData = val.items || (Array.isArray(val) ? val : []);
    }

    // Extract Workhours
    if (workhoursRes.status === 'fulfilled') {
      const val = workhoursRes.value;
      workhoursData = val.items || (Array.isArray(val) ? val : []);
    }

    // fallback if account is empty (eg. fresh trial or empty setup)
    if (customersData.length === 0 && agentsData.length === 0) {
      isMock = true;
      errorMsg = "API returned successfully but database is empty. Showing preview template.";
      customersData = MOCK_DATA.customers;
      agentsData = MOCK_DATA.agents;
      ticketsData = MOCK_DATA.tickets;
      alertsData = MOCK_DATA.alerts;
      contractsData = MOCK_DATA.contracts;
      workhoursData = MOCK_DATA.workhours;
      patchData = MOCK_DATA.patchData;
    }

  } catch (error: any) {
    isMock = true;
    errorMsg = error.message || "Atera connection error";
    
    // Load fallback preview data
    customersData = MOCK_DATA.customers;
    agentsData = MOCK_DATA.agents;
    ticketsData = MOCK_DATA.tickets;
    alertsData = MOCK_DATA.alerts;
    contractsData = MOCK_DATA.contracts;
    workhoursData = MOCK_DATA.workhours;
    patchData = MOCK_DATA.patchData;
  }

  const reportData = {
    customers: customersData,
    agents: agentsData,
    tickets: ticketsData,
    alerts: alertsData,
    contracts: contractsData,
    workhours: workhoursData,
    patchData: patchData
  };

  return (
    <ReportView 
      data={reportData} 
      isMock={isMock} 
      errorMsg={errorMsg} 
    />
  );
}
