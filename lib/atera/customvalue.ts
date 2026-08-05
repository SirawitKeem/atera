import { fetchAtera } from './fetcher';

export const customvalueApi = {
  getCustomValues: async (params: Record<string, string> = {}) => {
    return fetchAtera<any>('customvalues', params);
  }
};
