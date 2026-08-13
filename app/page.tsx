import React from 'react';
import ReportView from '@/components/ReportView';
import { AteraClient } from '@/lib/atera-client';

export default async function Page() {
  let customersData: Record<string, unknown>[] = [];
  let agentsData: Record<string, unknown>[] = [];
  let ticketsData: Record<string, unknown>[] = [];
  let alertsData: Record<string, unknown>[] = [];
  let contractsData: Record<string, unknown>[] = [];
  let workhoursData: Record<string, unknown>[] = [];
  let contactsData: Record<string, unknown>[] = [];
  let patchData: Record<string, unknown>[] = [];
  let accountInfo: Record<string, unknown> | null = null;
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
      
      const patchPromises = agentsData.map(async (agent: Record<string, unknown>) => {
        if (!agent.DeviceGuid) return null;
        
        const deviceGuid = String(agent.DeviceGuid);
        const [installedRes, availableRes] = await Promise.allSettled([
          AteraClient.getInstalledPatches(deviceGuid),
          AteraClient.getAvailablePatches(deviceGuid)
        ]);

        return {
          agentName: String(agent.MachineName || agent.AgentName || 'Agent'),
          deviceGuid: deviceGuid,
          os: String(agent.OS || 'Unknown OS'),
          deviceType: String(agent.DeviceType || 'Workstation'),
          installedPatches: installedRes.status === 'fulfilled' ? (installedRes.value?.installedUpdates || installedRes.value || []) : [],
          availablePatches: availableRes.status === 'fulfilled' ? (availableRes.value?.availableUpdates || availableRes.value || []) : []
        };
      });
      
      const patchResults = await Promise.all(patchPromises);
      patchData = patchResults.filter(p => p !== null) as Record<string, unknown>[];
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

  } catch (error: unknown) {
    const err = error as Record<string, unknown> | Error;
    errorMsg = (err instanceof Error) ? err.message : (typeof err === 'object' && err && 'message' in err ? String(err.message) : "Error connecting to Atera API");
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
