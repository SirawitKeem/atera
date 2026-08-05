import { fetchAtera } from './fetcher';

export const alertApi = {
  getAlerts: async (params: Record<string, string> = {}) => {
    return fetchAtera<any>('alerts', params);
  }
};
