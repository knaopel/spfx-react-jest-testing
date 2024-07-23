import * as React from 'react';
import { ItemsWithAuthorDetailsManager } from '../manager/ItemsWithAuthorDetailsManager';
import { IItemWithAuthor } from '../model/IItemWithAuthor';
import { Checkbox, Spinner, Stack } from '@fluentui/react';

export interface IItemsWithAdminInfoProps {
  manager: ItemsWithAuthorDetailsManager;
}

export function ItemsWithAdminInfo(props: IItemsWithAdminInfoProps): JSX.Element {
  const [loading, setLoading] = React.useState(true);
  const [items, setItems] = React.useState<IItemWithAuthor[]>([]);

  React.useEffect(() => {
    props.manager.getItemsWithAuthorDetails().then((items: IItemWithAuthor[]) => {
      setItems(items);
      setLoading(false);
    }).catch((error) => {
      console.log(error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Spinner role='progressbar' />
  }
  return (
    <Stack>
      {items.map((item) => (
        <Stack horizontal key={item.Id} tokens={{ childrenGap: 10 }}>
          <Stack.Item>{item.Title || '<No Title>'}</Stack.Item>
          <Stack.Item>{item.Author.Title}</Stack.Item>
          <Stack.Item>{item.Author.JobTitle}</Stack.Item>
          <Stack.Item>{<Checkbox label='Is admin' disabled checked={item.Author.IsSiteAdmin} />}</Stack.Item>
        </Stack>
      )
      )}
    </Stack>
  )
}