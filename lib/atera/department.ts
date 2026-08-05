import { fetchAtera } from './fetcher';

export const departmentApi = {
  getDepartments: async (params: Record<string, string> = {}) => {
    return fetchAtera<any>('departments', params);
  }
};
