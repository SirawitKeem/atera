import { fetchAtera } from './fetcher';

export const billingApi = {
  getInvoices: async (params: Record<string, string> = {}) => {
    return fetchAtera<any>('billing/invoices', params);
  }
};
