import { fetchAtera } from './fetcher';

export const patchApi = {
  getInstalledPatches: async (deviceGuid: string) => {
    return fetchAtera<any>(`agents/${deviceGuid}/installed-patches`);
  },
  getAvailablePatches: async (deviceGuid: string) => {
    return fetchAtera<any>(`agents/${deviceGuid}/available-patches`);
  }
};
