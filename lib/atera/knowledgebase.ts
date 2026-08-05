import { fetchAtera } from './fetcher';

export const knowledgebaseApi = {
  getKbArticles: async (params: Record<string, string> = {}) => {
    return fetchAtera<any>('knowledgebase', params);
  }
};
