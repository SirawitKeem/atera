import { accountApi } from './account';
import { agentApi } from './agent';
import { alertApi } from './alert';
import { billingApi } from './billing';
import { contactApi } from './contact';
import { contractApi } from './contract';
import { customerApi } from './customer';
import { customvalueApi } from './customvalue';
import { departmentApi } from './department';
import { deviceApi } from './device';
import { knowledgebaseApi } from './knowledgebase';
import { rateApi } from './rate';
import { ticketApi } from './ticket';
import { workhourApi } from './workhour';
import { patchApi } from './patch';

export const AteraClient = {
  ...accountApi,
  ...agentApi,
  ...alertApi,
  ...billingApi,
  ...contactApi,
  ...contractApi,
  ...customerApi,
  ...customvalueApi,
  ...departmentApi,
  ...deviceApi,
  ...knowledgebaseApi,
  ...rateApi,
  ...ticketApi,
  ...workhourApi,
  ...patchApi
};
