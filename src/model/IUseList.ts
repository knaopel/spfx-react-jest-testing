import { IListItemCollection } from './IListItemCollection';
import { ISPListItem } from './ISPListItem';

export interface IUseList<T extends ISPListItem> {
  listItemCollection: IListItemCollection<T>;
  isLoading: boolean;
  // getList: () => Promise<T>;
  error: string;
}