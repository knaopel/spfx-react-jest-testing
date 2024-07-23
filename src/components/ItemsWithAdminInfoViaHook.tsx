import * as React from 'react'
import { getSP } from '../webparts/unitTestWebPart/pnpJsConfig';
import { useList } from '../hooks/useList';
import { IItemWithAuthor } from '../model';
import { Checkbox, Spinner, Stack } from '@fluentui/react';

const ItemsWithAdminInfoViaHook = (): JSX.Element => {
  const { isLoading, listItemCollection, error } = useList<IItemWithAuthor>('Documents', getSP());

  if (isLoading) {
    return <Spinner role='progressbar' label="Loading..." />;
  }
  return (
    <Stack>
      {listItemCollection.items.map(item => (
        <Stack horizontal key={item.Id} tokens={{ childrenGap: 10 }}>
          <Stack.Item>{item.Title || 'No Title'}</Stack.Item>
          <Stack.Item>{item.Author.Title}</Stack.Item>
          <Stack.Item>{item.Author.JobTitle}</Stack.Item>
          <Stack.Item>{<Checkbox label='Is admin?' disabled checked={item.Author.IsSiteAdmin} />}</Stack.Item>
        </Stack>
      ))}
      {error && <Stack.Item>{error}</Stack.Item>}
    </Stack>
  );
}

export default ItemsWithAdminInfoViaHook;