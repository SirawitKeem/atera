import React from 'react';
import ReportView from '@/components/ReportView';
import { AteraClient } from '@/lib/atera-client';

export default async function Page() {
  let customersData: any[] = [];
  let agentsData: any[] = [];
  let ticketsData: any[] = [];
  let alertsData: any[] = [];
  let contractsData: any[] = [];
  let workhoursData: any[] = [];
  let contactsData: any[] = [];
  let patchData: any[] = [];
  let accountInfo: any = null;
  let isMock = false;
  let errorMsg: string | null = null;

  try {
    // Parallel data fetches from Atera API
    const [customersRes, agentsRes, ticketsRes, alertsRes, contractsRes, workhoursRes, contactsRes, accountRes] = await Promise.allSettled([
      AteraClient.getCustomers({ page: '1', itemsInPage: '50' }),
      AteraClient.getAgents({ page: '1', itemsInPage: '50' }),
      AteraClient.getTickets({ page: '1', itemsInPage: '50' }),
      AteraClient.getAlerts({ page: '1', itemsInPage: '50' }),
      AteraClient.getContracts({ page: '1', itemsInPage: '55' }),
      AteraClient.getWorkhours({ page: '1', itemsInPage: '50' }),
      AteraClient.getContacts({ page: '1', itemsInPage: '50' }),
      AteraClient.getAccountInfo()
    ]);

    // Extract Customers
    if (customersRes.status === 'fulfilled') {
      const val = customersRes.value;
      customersData = val.items || (Array.isArray(val) ? val : []);
    }

    // Extract Agents + Patch Data
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
          agentName: agent.MachineName || agent.AgentName || 'Agent',
          deviceGuid: agent.DeviceGuid,
          os: agent.OS || 'Unknown OS',
          deviceType: agent.DeviceType || 'Workstation',
          installedPatches: installedRes.status === 'fulfilled' ? (installedRes.value?.installedUpdates || installedRes.value || []) : [],
          availablePatches: availableRes.status === 'fulfilled' ? (availableRes.value?.availableUpdates || availableRes.value || []) : []
        };
      });
      
      const patchResults = await Promise.all(patchPromises);
      patchData = patchResults.filter(Boolean);
    }

    // Extract Tickets
    if (ticketsRes.status === 'fulfilled') {
      const val = ticketsRes.value;
      ticketsData = val.items || (Array.isArray(val) ? val : []);
    }

    // Extract Alerts
    if (alertsRes.status === 'fulfilled') {
      const val = alertsRes.value;
      alertsData = val.items || (Array.isArray(val) ? val : []);
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

    // Extract Contacts
    if (contactsRes.status === 'fulfilled') {
      const val = contactsRes.value;
      contactsData = val.items || (Array.isArray(val) ? val : []);
    }

    // Extract Account Info
    if (accountRes.status === 'fulfilled') {
      accountInfo = accountRes.value;
    }

  } catch (error: any) {
    errorMsg = error?.message || "Error connecting to Atera API";
  }

  const reportData = {
    customers: customersData,
    agents: agentsData,
    tickets: ticketsData,
    alerts: alertsData,
    contracts: contractsData,
    workhours: workhoursData,
    contacts: contactsData,
    patchData: patchData,
    accountInfo: accountInfo
  };

  return (
    <ReportView 
      data={reportData} 
      isMock={false} 
      errorMsg={errorMsg} 
    />
  );
}
