import { fetchAtera } from './fetcher';

export const rateApi = {
  getRates: async (params: Record<string, string> = {}) => {
    return fetchAtera<any>('rates', params);
  }
};
