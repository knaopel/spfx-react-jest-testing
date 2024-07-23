/// <reference types="jest" />
import * as React from 'react';
import {
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import { ItemsWithAuthorDetailsManager } from '../../src/manager/ItemsWithAuthorDetailsManager';
import { IItemWithAuthor } from '../../src/model/IItemWithAuthor';
import { ItemsWithAdminInfo } from '../../src/components/ItemsWithAdminInfo';

describe('ItemsWithAdminInfo', () => {
  let mockManager: ItemsWithAuthorDetailsManager;
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

  beforeEach(() => {
    // Mock manager
    mockManager = {
      getItemsWithAuthorDetails: jest.fn().mockResolvedValue(mockItems)
    } as unknown as ItemsWithAuthorDetailsManager;
  });

  it('should display spinner while loading', async () => {
    // Arrange
    mockManager.getItemsWithAuthorDetails = jest.fn().mockResolvedValue(new Promise(() => { }));

    // Act
    render(<ItemsWithAdminInfo manager={mockManager} />);

    // Assert
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should display items when loaded', async () => {
    // Act
    render(<ItemsWithAdminInfo manager={mockManager} />);

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

  it('should display default text when no title is available', async () => {
    // Arrange
    mockItems[0] = {...mockItems[0], Title: undefined} as unknown as IItemWithAuthor;

    // Act
    render(<ItemsWithAdminInfo manager={mockManager} />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('<No Title>')).toBeInTheDocument();
    });
  })

  it('should handle error when getting items fails', async () => {
    // Arrange
    mockManager.getItemsWithAuthorDetails = jest.fn().mockRejectedValue(new Error("Test error"));
    console.log = jest.fn();

    // Act
    render(<ItemsWithAdminInfo manager={mockManager} />);

    // Assert
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith(new Error("Test error"));
    });
  });
});