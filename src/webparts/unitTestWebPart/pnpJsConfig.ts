import { WebPartContext } from '@microsoft/sp-webpart-base';
import { spfi, SPFI, SPFx } from '@pnp/sp';
import '@pnp/sp/webs';
import '@pnp/sp/lists';
import '@pnp/sp/items';
import '@pnp/sp/batching';

let _sp: SPFI;

export const getSP = (context: WebPartContext): SPFI => {
  if (_sp === undefined || _sp === null) {
    _sp = spfi().using(SPFx(context as WebPartContext));
  }
  return _sp;
};
