import { fetchAtera } from './fetcher';

export const workhourApi = {
  getWorkhours: async (params: Record<string, string> = {}) => {
    return fetchAtera<any>('workhours', params);
  }
};
