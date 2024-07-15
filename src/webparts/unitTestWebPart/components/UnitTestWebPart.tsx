import * as React from 'react';
import styles from './UnitTestWebPart.module.scss';
import { IUnitTestWebPartProps } from './IUnitTestWebPartProps';
import { ItemsWithAdminInfo } from '../../../components/ItemsWithAdminInfo';

export default class UnitTestWebPart extends React.Component<IUnitTestWebPartProps, {}> {
  public render(): React.ReactElement<IUnitTestWebPartProps> {
    const {
      hasTeamsContext,
      manager,
    } = this.props;

    return (
      <section className={`${styles.unitTestWebPart} ${hasTeamsContext ? styles.teams : ''}`}>
        <div>
          <ItemsWithAdminInfo manager={manager} />
        </div>
      </section>
    );
  }
}
