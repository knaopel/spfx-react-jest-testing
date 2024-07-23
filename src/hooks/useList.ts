import * as React from 'react';
// import { getSP } from '../webparts/unitTestWebPart/pnpJsConfig';
import { ISPListItem, IUseList } from '../model';
import { SPFI } from '@pnp/sp';

// export interface IListItemCollection<T extends ISPListItem> {
//   items: T[];
// }
// export interface IUseList<T extends ISPListItem> {
//   listItemCollection: IListItemCollection<T>;
//   isLoading: boolean;
//   // getList: () => Promise<T>;
//   error: string;
// }

export const useList = <T extends ISPListItem>(
  listName: string,
  sp: SPFI
): IUseList<T> => {
  // const _sp = getSP();
  const [listItems, setListItems] = React.useState<T[]>();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>();

  React.useEffect(() => {
    let isMounted = true;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async () => {
      try {
        setIsLoading(true);
        // const spCache = spfi(_sp).using(Caching('session'));
        const response = await sp.web.lists
          .getByTitle(listName)
          // .items.select('Id', 'Title', 'FileLeafRef', 'AuthorId')();
          .items();
        if (isMounted) {
          setListItems(response as T[]);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return { listItemCollection: { items: listItems }, isLoading, error };
};
