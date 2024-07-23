/// <reference types="jest" />
import { renderHook } from '@testing-library/react-hooks';
import { SPFI } from '@pnp/sp';
import { useList } from '../../src/hooks/useList';
import { ISPListItem, IListItemCollection } from '../../src/model';
import { mockISPListItems } from '../dal/Mocks';

jest.mock('@pnp/sp/webs', () => ({}));
jest.mock('@pnp/sp/lists', () => ({}));
jest.mock('@pnp/sp/items', () => ({}));

describe('useList', () => {
  const mockSpfi = {
    web: {
      lists: {
        getByTitle: jest
          .fn()
          .mockReturnValue({ items: () => mockISPListItems }),
      },
    },
  } as unknown as SPFI;

  it('should return isLoading as true during call', async () => {
    // Arrange
    const { result, waitForNextUpdate } = renderHook(() =>
      useList('Documents', mockSpfi)
    );

    // Act
    const { isLoading } = result.current;

    // Assert
    expect(isLoading).toBe(true);
    await waitForNextUpdate();
  });

  it('should get list items', async () => {
    // Arrange
    const { result, waitForNextUpdate } = renderHook(() =>
      useList('Documents', mockSpfi)
    );

    const expectedResults: IListItemCollection<ISPListItem> = {
      items: mockISPListItems,
    };

    // Act
    await waitForNextUpdate();

    // Assert
    expect(result.current.listItemCollection).toEqual(expectedResults);
  });

  it('should return an error', async () => {
    // Arrange
    const error = 'An error occurred';
    const mockSpfi = {
      web: {
        lists: {
          getByTitle: jest.fn().mockReturnValue({
            items: jest.fn().mockRejectedValue(new Error(error)),
          }),
        },
      },
    } as unknown as SPFI;

    const { result, waitForValueToChange } = renderHook(() =>
      useList('Documents', mockSpfi)
    );

    // Act
    await waitForValueToChange(() => result.current.error);

    // Assert
    expect(result.current.error).toBe(error);
  });
});
