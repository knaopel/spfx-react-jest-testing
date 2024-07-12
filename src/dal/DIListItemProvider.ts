import { ISPListItem } from '../model';
import { IHttpClient } from './IHttpClient';
import { IListItemProvider } from './IListItemProvider';

export class DIListItemProvider<T extends ISPListItem>
  implements IListItemProvider<T>
{
  constructor(
    protected httpClient: IHttpClient,
    protected siteUrl: string,
    protected listName: string
  ) {}
  public async getListItems(): Promise<T[]> {
    const response = await this.httpClient.get<{ value: T[] }>(
      `${this.siteUrl}/_api/web/lists/getbytitle('${this.listName}')/items`
    );
    return response.value;
  }

  public async getById(id: number): Promise<T> {
    const response = await this.httpClient.get<T>(
      `${this.siteUrl}/_api/web/lists/getbytitle('${this.listName}')/items(${id})`
    );
    return response;
  }
}
