import { Icon } from '@iconify/react';
import Admonition from '@theme-original/Admonition';
import React from 'react';

export default function DevAdmonition(props) {
  return props.type === 'dev' ? (
    <Admonition
      type="info"
      title="Dev mode only!"
      icon={<Icon icon="mdi:dev-to" />}
    >
      <p>{props.children}</p>
    </Admonition>
  ) : (
    <Admonition {...props} />
  );
}
