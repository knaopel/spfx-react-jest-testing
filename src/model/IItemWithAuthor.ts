import { ISPListItem, IUserListItem } from '.';

export interface IItemWithAuthor extends ISPListItem{
  Author: IUserListItem;
}