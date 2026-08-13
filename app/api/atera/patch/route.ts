import { NextResponse } from 'next/server';
import { AteraClient } from '@/lib/atera-client';

export async function GET(request: Request) {
  try {
    const agentsRes = await AteraClient.getAgents();
    const agents = agentsRes.items || (Array.isArray(agentsRes) ? agentsRes : []);

    const patchPromises = agents.map(async (agent: any) => {
      const deviceGuid = agent.DeviceGuid;
      const [installedRes, availableRes] = await Promise.allSettled([
        AteraClient.getInstalledPatches(deviceGuid),
        AteraClient.getAvailablePatches(deviceGuid)
      ]);

      const installedPatches = installedRes.status === 'fulfilled' ? (installedRes.value.items || installedRes.value || []) : [];
      const availablePatches = availableRes.status === 'fulfilled' ? (availableRes.value.items || availableRes.value || []) : [];

      return {
        agentName: agent.MachineName,
        deviceGuid: agent.DeviceGuid,
        os: agent.OS,
        installedPatches,
        availablePatches
      };
    });

    const patchData = await Promise.all(patchPromises);
    
    return NextResponse.json({ agents: patchData });
  } catch (err: any) {
    console.error('GET /api/atera/patch error:', err);
    return new NextResponse(
      JSON.stringify({ error: err.message || 'Failed to fetch patch data' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
