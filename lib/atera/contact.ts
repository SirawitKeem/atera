import { fetchAtera } from './fetcher';

export const contactApi = {
  getContacts: async (params: Record<string, string> = {}) => {
    return fetchAtera<any>('contacts', params);
  }
};
