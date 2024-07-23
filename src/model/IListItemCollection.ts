import { ISPListItem } from './ISPListItem';

export interface IListItemCollection<T extends ISPListItem> {
  items: T[];
}