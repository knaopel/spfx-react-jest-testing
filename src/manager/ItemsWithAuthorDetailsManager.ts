import { IListItemProvider } from '../dal/IListItemProvider';
import { IItemWithAuthor, ISPListItem, IUserListItem } from '../model';

export class ItemsWithAuthorDetailsManager {
  constructor(
    protected listItemProvider: IListItemProvider<ISPListItem>,
    protected userProvider: IListItemProvider<IUserListItem>
  ) {}

  public async getItemsWithAuthorDetails(): Promise<IItemWithAuthor[]> {
    const items = await this.listItemProvider.getListItems();
    const uniqueUserIds = this.getUniqueUserIds(items);
    const users = await Promise.all(
      uniqueUserIds.map((id) => this.userProvider.getById(id))
    );
    const itemsWithAuthorDetails = items.map((i) => {
      const author = users.filter((u: IUserListItem) => u.Id === i.AuthorId)[0];
      return {
        ...i,
        Author: author,
      };
    });

    return itemsWithAuthorDetails;
  }

  protected getUniqueUserIds(items: ISPListItem[]): number[] {
    const userIds = items.map((i) => i.AuthorId);
    const uniqueUserIds = userIds.filter(
      (value, index, self) => self.indexOf(value) === index
    );

    return uniqueUserIds;
  }
}
