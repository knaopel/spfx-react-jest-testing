/// <reference types="jest" />
import { SPFI } from '@pnp/sp';
import { PnPListItemProvider } from '../../src/dal/PnPListItemProvider';
import { mockISPListItem, mockISPListItems } from './Mocks';
import { ISPListItem } from '../../src/model';

jest.mock('@pnp/sp/webs', () => ({}));
jest.mock('@pnp/sp/lists', () => ({}));
jest.mock('@pnp/sp/items', () => ({}));

describe('PnPListItemProvider', () => {
  let mockSpfi: SPFI;
  const listName = 'TestList';
  const itemId = 1;

  it('Should call the correct methods weh calling getListItems', async () => {
    // Arrange
    mockSpfi = {
      web: {
        lists: {
          getByTitle: jest.fn().mockReturnValue({
            items: () => mockISPListItems,
          }),
        },
      },
    } as unknown as SPFI;

    const provider = new PnPListItemProvider<ISPListItem>(mockSpfi, listName);

    // Act
    const items = await provider.getListItems();
    // Assert
    expect(mockSpfi.web.lists.getByTitle).toBeCalledWith(listName);
    expect(items).toEqual(mockISPListItems);
  });

  it('Should call the correct methods when cfalling getById', async () => {
    // Arrange
    mockSpfi = {
      web: {
        lists: {
          getByTitle: jest.fn().mockReturnValue({
            items: {
              getById: jest
                .fn()
                .mockReturnValue(() => Promise.resolve(mockISPListItem)),
            },
          }),
        },
      },
    } as unknown as SPFI;

    const provider = new PnPListItemProvider<ISPListItem>(mockSpfi, listName);

    // Act
    const item = await provider.getById(itemId);

    // Assert
    expect(mockSpfi.web.lists.getByTitle).toBeCalledWith(listName);
    expect(item).toEqual(mockISPListItem);
  });
});
