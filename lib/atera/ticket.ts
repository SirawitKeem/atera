import { fetchAtera } from './fetcher';

export const ticketApi = {
  getTickets: async (params: Record<string, string> = {}) => {
    return fetchAtera<any>('tickets', params);
  }
};
