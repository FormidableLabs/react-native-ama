import { Icon } from '@iconify/react';
import * as React from 'react';

const IconAndLabel = ({ children, color, icon }) => {
  return (
    <>
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
        style={{
          color,
          textDecoration: 'underline',
          textUnderlineOffset: 4,
          display: 'inline-block',
          verticalAlign: 'top',
        }}
      >
        {children}
      </strong>
    </>
  );
};

export const Must = () => (
  <IconAndLabel
    rule="MUST_NOT"
    color="#b60000"
    icon="zondicons:exclamation-outline"
  >
    MUST
  </IconAndLabel>
);

export const MustNot = () => (
  <IconAndLabel color="#b60000" icon="pepicons-pop:exclamation-circle-off">
    MUST NOT
  </IconAndLabel>
);

export const ShouldNot = () => (
  <IconAndLabel icon="material-symbols:warning-off-outline" color="#807700">
    SHOULD_NOT
  </IconAndLabel>
);

export const Should = () => (
  <IconAndLabel icon="ion:warning-outline" color="#807700">
    SHOULD
  </IconAndLabel>
);

export const Yes = () => <IconAndLabel icon="typcn:tick"></IconAndLabel>;

export const No = () => (
  <IconAndLabel icon="maki:cross" color="#b60000"></IconAndLabel>
);

export const Severity = props => {
  const Rule = (() => {
    switch (props.level) {
      case 'must':
      default:
        return Must;
    }
  })();
  return (
    <p>
      <strong>Severity</strong>: <Rule />
    </p>
  );
};
