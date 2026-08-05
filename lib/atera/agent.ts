import { fetchAtera } from './fetcher';

export const agentApi = {
  getAgents: async (params: Record<string, string> = {}) => {
    return fetchAtera<any>('agents', params);
  },
  getAgent: async (agentId: number) => {
    return fetchAtera<any>(`agents/${agentId}`);
  },
  getAgentsByCustomer: async (customerId: number, params: Record<string, string> = {}) => {
    return fetchAtera<any>(`agents/customer/${customerId}`, params);
  }
};
