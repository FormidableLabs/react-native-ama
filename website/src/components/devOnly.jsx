import { Icon } from '@iconify/react';
import * as React from 'react';

import Admonition from '../theme/Admonition';

export const DevOnly = props => {
  return (
    <span
      title="The check is executed only when running the app in __DEV__ mode"
      style={{ color: '#24B6D2' }}>
      <Icon icon="mdi:dev-to" height={props.height} />
    </span>
  );
};

export const DevOnlyChecks = props => {
  return (
    <Admonition type="dev">
      Runtime checks are only performed when <code>__DEV__</code> is set to{' '}
      <strong>true</strong>
    </Admonition>
  );
};
