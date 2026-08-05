import { fetchAtera } from './fetcher';

export const contractApi = {
  getContracts: async (params: Record<string, string> = {}) => {
    return fetchAtera<any>('contracts', params);
  }
};
