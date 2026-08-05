import { fetchAtera } from './fetcher';

export const customerApi = {
  getCustomers: async (params: Record<string, string> = {}) => {
    return fetchAtera<any>('customers', params);
  },
  getCustomer: async (customerId: number) => {
    return fetchAtera<any>(`customers/${customerId}`);
  }
};
