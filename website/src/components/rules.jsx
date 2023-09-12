import { Icon } from '@iconify/react';
import * as React from 'react';

const Rule = ({ children, color, icon }) => {
  return (
    <span style={{ verticalAlign: 'middle' }}>
      <span
        style={{
          verticalAlign: 'middle',
          paddingRight: 8,
          color: color,
        }}
      >
        <Icon icon={icon} height={24} />
      </span>
      <strong
        style={{ color, textDecoration: 'underline', textUnderlineOffset: 4 }}
      >
        {children}
      </strong>
    </span>
  );
};

export const Must = () => (
  <Rule rule="MUST_NOT" color="#b60000" icon="zondicons:exclamation-outline">
    MUST
  </Rule>
);

export const MustNot = () => (
  <Rule color="#b60000" icon="pepicons-pop:exclamation-circle-off">
    MUST NOT
  </Rule>
);

export const ShouldNot = () => (
  <Rule icon="material-symbols:warning-off-outline" color="#807700">
    SHOULD_NOT
  </Rule>
);

export const Should = () => (
  <Rule icon="ion:warning-outline" color="#807700">
    SHOULD
  </Rule>
);
