import { fetchAtera } from './fetcher';

export const deviceApi = {
  getDevices: async (params: Record<string, string> = {}) => {
    return fetchAtera<any>('devices', params);
  }
};
