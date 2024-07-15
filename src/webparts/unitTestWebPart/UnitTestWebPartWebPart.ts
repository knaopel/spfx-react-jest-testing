import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'UnitTestWebPartWebPartStrings';
import UnitTestWebPart from './components/UnitTestWebPart';
import { IUnitTestWebPartProps } from './components/IUnitTestWebPartProps';
import { ItemsWithAuthorDetailsManager } from '../../manager';
import { PnPListItemProvider } from '../../dal';
import { getSP } from './pnpJsConfig';
import { ISPListItem, IUserListItem } from '../../model';

export interface IUnitTestWebPartWebPartProps {
  description: string;
}

export default class UnitTestWebPartWebPart extends BaseClientSideWebPart<IUnitTestWebPartWebPartProps> {
  private manager: ItemsWithAuthorDetailsManager;
  public render(): void {
    const element: React.ReactElement<IUnitTestWebPartProps> =
      React.createElement(UnitTestWebPart, {
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        manager: this.manager,
      });

    ReactDom.render(element, this.domElement);
  }

  protected async onInit(): Promise<void> {
    // return new Promise<void>((resolve, _reject) => {
    await super.onInit();
    const spfi = getSP(this.context);
    const listItemProvider = new PnPListItemProvider<ISPListItem>(
      spfi,
      'Documents'
    );
    const userListItemProvider = new PnPListItemProvider<IUserListItem>(
      spfi,
      'User Information List'
    );
    this.manager = new ItemsWithAuthorDetailsManager(
      listItemProvider,
      userListItemProvider
    );
    // resolve();
    // });
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }
    const { semanticColors } = currentTheme;

    if (semanticColors) {
      this.domElement.style.setProperty(
        '--bodyText',
        semanticColors.bodyText || null
      );
      this.domElement.style.setProperty('--link', semanticColors.link || null);
      this.domElement.style.setProperty(
        '--linkHovered',
        semanticColors.linkHovered || null
      );
    }
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
