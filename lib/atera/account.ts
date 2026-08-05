import { fetchAtera } from './fetcher';

export const accountApi = {
  getAccountInfo: async () => {
    return fetchAtera<any>('accounts');
  }
};
