import React from 'react';
import ReportView from '@/components/ReportView';
import { AteraClient } from '@/lib/atera-client';
import { enrichPatchesWithCve } from '@/lib/atera/cve';

export const dynamic = 'force-dynamic';

async function fetchAllPages<T>(fetchFn: (params: any) => Promise<any>, initialParams: any = {}): Promise<T[]> {
  let allItems: T[] = [];
  let page = 1;
  let hasMore = true; 
  const itemsInPage = 100;

  while (hasMore) {
    try {
      const res = await fetchFn({ ...initialParams, page: String(page), itemsInPage: String(itemsInPage) });
      const items = res.items || (Array.isArray(res) ? res : []);
      allItems = allItems.concat(items);
      
      console.log(`[API Log] Page ${page} fetched ${items.length} items. Total: ${allItems.length}`);
      
      if (res.nextLink && res.page < res.totalPages) {
        page++;
      } else {
        hasMore = false;
      }
    } catch (err) {
      console.error(`[API Error] Error fetching page ${page} in fetchAllPages:`, err);
      hasMore = false;
    }
  }
  return allItems;
}

export default async function Page() {
  let customersData: any[] = [];
  let agentsData: any[] = [];
  let ticketsData: any[] = [];
  let alertsData: any[] = [];
  let contractsData: any[] = [];
  let workhoursData: any[] = [];
  let contactsData: any[] = [];
  let patchData: any[] = [];
  let realSoftwareUpdates: any[] = [];
  let accountInfo: Record<string, unknown> | null = null;
  let cveData: any = { kbCveMap: {}, cveCache: {} };
  let errorMsg: string | null = null;

  try {
    console.log("[API Log] Beginning dynamic data collection...");

    // Parallel fetches using the pagination helper
    const [
      customersList,
      agentsList,
      ticketsList,
      openTicketsList,
      pendingTicketsList,
      closedTicketsList,
      resolvedTicketsList,
      alertsList,
      contractsList,
      workhoursList,
      contactsList,
      accountRes
    ] = await Promise.all([
      fetchAllPages<any>(AteraClient.getCustomers),
      fetchAllPages<any>(AteraClient.getAgents),
      fetchAllPages<any>(AteraClient.getTickets),
      fetchAllPages<any>(AteraClient.getTickets, { ticketStatus: 'Open' }),
      fetchAllPages<any>(AteraClient.getTickets, { ticketStatus: 'Pending' }),
      fetchAllPages<any>(AteraClient.getTickets, { ticketStatus: 'Closed' }),
      fetchAllPages<any>(AteraClient.getTickets, { ticketStatus: 'Resolved' }),
      fetchAllPages<any>(AteraClient.getAlerts),
      fetchAllPages<any>(AteraClient.getContracts),
      fetchAllPages<any>(AteraClient.getWorkhours),
      fetchAllPages<any>(AteraClient.getContacts),
      AteraClient.getAccountInfo()
    ]);

    customersData = customersList;
    agentsData = agentsList;
    alertsData = alertsList;
    contractsData = contractsList;
    workhoursData = workhoursList;
    contactsData = contactsList;
    accountInfo = accountRes;

    console.log(`[API Log] Retrieved ${agentsData.length} agents. Processing patches...`);

    // Process patches for all agents (DO NOT filter out offline agents)
    const patchPromises = agentsData.map(async (agent: any) => {
      if (!agent.DeviceGuid) {
        console.warn(`[WARN] Skipping agent because of missing DeviceGuid:`, agent);
        return null;
      }
      
      const deviceGuid = String(agent.DeviceGuid);
      const agentName = String(agent.MachineName || agent.AgentName || 'Agent');
      const os = String(agent.OS || 'Unknown OS');
      const isLinux = os.toLowerCase().includes('linux') || agentName.toLowerCase() === 'linux';

      console.log(`[API Log] Fetching patches for ${agentName} (${deviceGuid})...`);

      try {
        const [availableRes, installedRes] = await Promise.all([
          AteraClient.getAvailablePatches(deviceGuid),
          AteraClient.getInstalledPatches(deviceGuid)
        ]);

        let availablePatchesList = availableRes?.availableUpdates || availableRes || [];
        let installedPatchesList = installedRes?.installedUpdates || installedRes || [];

        // Handle empty available arrays for Linux agents by logging warnings instead of injecting mock data
        if (isLinux) {
          if (availablePatchesList.length === 0) {
            console.warn(`[WARN] Linux agent ${agentName} (${deviceGuid}) returned 0 available patches. This might mean the agent is not scanning, is offline, or Atera public API does not return Linux packages.`);
          }
        }

        console.log(`[API Log] ${agentName} patches: ${availablePatchesList.length} available (pending).`);

        return {
          agentName: agentName,
          customerName: String(agent.CustomerName || 'Unassigned'),
          deviceGuid: deviceGuid,
          os: os,
          deviceType: String(agent.DeviceType || 'Workstation'),
          installedPatches: installedPatchesList,
          availablePatches: availablePatchesList
        };
      } catch (patchErr) {
        console.error(`[ERROR] Failed to fetch patches for agent ${agentName} (${deviceGuid}):`, patchErr);
        // Return placeholder object so we don't drop the agent entirely from lists
        return {
          agentName: agentName,
          customerName: String(agent.CustomerName || 'Unassigned'),
          deviceGuid: deviceGuid,
          os: os,
          deviceType: String(agent.DeviceType || 'Workstation'),
          installedPatches: [],
          availablePatches: []
        };
      }
    });

    const patchResults = await Promise.all(patchPromises);
    patchData = patchResults.filter(p => p !== null);

    console.log(`[API Log] Processing CVEs for available patches...`);
    cveData = await enrichPatchesWithCve(patchData);

    // No software inventory API exists in Atera. Software-related page and derived data were removed.

    // Extract & Combine Tickets
    const ticketMap = new Map();
    const combineTickets = (list: any[]) => {
      list.forEach((t: any) => {
        const id = t.TicketID || t.ticketId || t.id;
        if (id) ticketMap.set(id, t);
      });
    };
    combineTickets(ticketsList);
    combineTickets(openTicketsList);
    combineTickets(pendingTicketsList);
    combineTickets(closedTicketsList);
    combineTickets(resolvedTicketsList);
    ticketsData = Array.from(ticketMap.values());

  } catch (error: unknown) {
    console.error("[CRITICAL ERROR] Error fetching data from Atera:", error);
    const err = error as Error;
    errorMsg = err.message || "Error connecting to Atera API";
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
    accountInfo: accountInfo,
    cveData: cveData
  };

  return (
    <ReportView 
      data={reportData} 
      isMock={false} 
      errorMsg={errorMsg} 
    />
  );
}
