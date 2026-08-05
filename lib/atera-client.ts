/**
 * Atera API Helper Client Facade
 * Imports and re-exports AteraClient from the structured API domain modules.
 */
export { AteraClient } from './atera';

export interface AteraPaginationParams {
  page?: string;
  itemsInPage?: string;
}
