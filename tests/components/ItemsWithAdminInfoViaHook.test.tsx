/// <reference types="jest" />
import * as React from 'react';
import {
  act,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import ItemsWithAdminInfoViaHook from '../../src/components/ItemsWithAdminInfoViaHook';
import { IItemWithAuthor } from '../../src/model/IItemWithAuthor';
import { IUseList } from '../../src/model/IUseList';
import * as useListHook from '../../src/hooks/useList';

jest.mock('../../src/webparts/unitTestWebPart/pnpJsConfig', () => ({
  getSP: () => ({})
}));

const mockItems: IItemWithAuthor[] = [
  {
    Id: 1,
    Title: 'Mock Title 1',
    Author: {
      Title: 'Author 1',
      JobTitle: 'Job Title 1',
      IsSiteAdmin: true
    }
  } as IItemWithAuthor, {
    Id: 2,
    Title: 'Mock Title 2',
    Author: {
      Title: 'Author 2',
      JobTitle: 'Job Title 2',
      IsSiteAdmin: false
    }
  } as IItemWithAuthor];

describe('ItemsWithAdminInfoViaHook', () => {
  it('should display spinner while loading', async () => {
    // Arrange
    jest.spyOn(useListHook, 'useList').mockReturnValue({ isLoading: true, listItemCollection: { items: mockItems }, error: undefined } as unknown as IUseList<IItemWithAuthor>);

    // Act
    render(<ItemsWithAdminInfoViaHook />);

    // Assert
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should display items when loaded', async () => {
    // Arrange
    jest.spyOn(useListHook, 'useList').mockReturnValue({ isLoading: false, listItemCollection: { items: mockItems }, error: undefined } as unknown as IUseList<IItemWithAuthor>);

    // Act
    render(<ItemsWithAdminInfoViaHook />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText(mockItems[0].Title)).toBeInTheDocument();
      expect(screen.getByText(mockItems[1].Title)).toBeInTheDocument();
      expect(screen.getByText(mockItems[0].Author.Title)).toBeInTheDocument();
      expect(screen.getByText(mockItems[1].Author.Title)).toBeInTheDocument();
      expect(screen.getByText(mockItems[0].Author.JobTitle)).toBeInTheDocument();
      expect(screen.getByText(mockItems[1].Author.JobTitle)).toBeInTheDocument();
    });
  });

  it('should not display anything if there are no items', async () => {
    // Arrange
    jest.spyOn(useListHook, 'useList').mockReturnValue({ isLoading: false, listItemCollection: { items: [] }, error: undefined } as unknown as IUseList<IItemWithAuthor>);

    // Act 
    render(<ItemsWithAdminInfoViaHook />);

    // Assert
    act(() => {
      expect(screen.queryByText(mockItems[0].Title)).not.toBeInTheDocument();
      expect(screen.queryByText(mockItems[1].Title)).not.toBeInTheDocument();
      expect(screen.queryByText(mockItems[0].Author.Title)).not.toBeInTheDocument();
      expect(screen.queryByText(mockItems[1].Author.Title)).not.toBeInTheDocument();
      expect(screen.queryByText(mockItems[0].Author.JobTitle)).not.toBeInTheDocument();
      expect(screen.queryByText(mockItems[1].Author.JobTitle)).not.toBeInTheDocument();
    });
  });

  it('should display default text when no title is available', async () => {
    // Arrange
    mockItems[0] = {...mockItems[0], Title: undefined} as unknown as IItemWithAuthor;
    jest.spyOn(useListHook, 'useList').mockReturnValue({ isLoading: false, listItemCollection: { items: mockItems }, error: undefined } as unknown as IUseList<IItemWithAuthor>);

    // Act
    render(<ItemsWithAdminInfoViaHook />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('No Title')).toBeInTheDocument();
    });
  })

  it('should handle error when getting items fails', async () => {
    // Arrange
    jest.spyOn(useListHook, 'useList').mockReturnValue({ isLoading: false, listItemCollection: { items: [] }, error: 'the error' } as unknown as IUseList<IItemWithAuthor>);

    // Act
    render(<ItemsWithAdminInfoViaHook />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('the error')).toBeInTheDocument();
    });
  });
});