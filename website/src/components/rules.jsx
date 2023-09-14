import { Icon } from '@iconify/react';
import * as React from 'react';

const MUST_COLOR = 'var(--must-color)';
const SHOULD_COLOR = '#807700';

const IconAndLabel = ({ children, color, icon }) => {
  return (
    <>
      <span
        style={{
          verticalAlign: 'middle',
          paddingRight: 8,
          color: color,
        }}>
        <Icon icon={icon} height={24} />
      </span>
      <strong
        style={{
          color,
          textDecoration: 'underline',
          textUnderlineOffset: 4,
          display: 'inline-block',
          verticalAlign: 'top',
        }}>
        {children}
      </strong>
    </>
  );
};

export const Must = () => (
  <IconAndLabel color={MUST_COLOR} icon="zondicons:exclamation-outline">
    MUST
  </IconAndLabel>
);

export const MustNot = () => (
  <IconAndLabel color={MUST_COLOR} icon="pepicons-pop:exclamation-circle-off">
    MUST NOT
  </IconAndLabel>
);

export const ShouldNot = () => (
  <IconAndLabel
    icon="material-symbols:warning-off-outline"
    color={SHOULD_COLOR}>
    SHOULD_NOT
  </IconAndLabel>
);

export const Should = () => (
  <IconAndLabel icon="ion:warning-outline" color={SHOULD_COLOR}>
    }> SHOULD
  </IconAndLabel>
);

export const Yes = () => <IconAndLabel icon="typcn:tick"></IconAndLabel>;

export const No = () => (
  <IconAndLabel icon="maki:cross" color={MUST_COLOR}></IconAndLabel>
);

export const Severity = props => {
  switch (props.level) {
    case 'critical':
    default:
      return (
        <IconAndLabel color={MUST_COLOR} icon="zondicons:exclamation-outline">
          Critical
        </IconAndLabel>
      );
  }
};
