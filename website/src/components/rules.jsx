import { Icon } from '@iconify/react';
import * as React from 'react';

const MUST_COLOR = 'var(--must-color)';
const SHOULD_COLOR = '#807700';

const IconAndLabel = ({ children, color, icon }) => {
  return (
    <span className="ama-icon-label">
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
        className="ama-icon-label-strong"
        style={{
          color,
        }}
      >
        {children}
      </strong>
    </span>
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
    color={SHOULD_COLOR}
  >
    SHOULD_NOT
  </IconAndLabel>
);

export const Should = () => (
  <IconAndLabel icon="ion:warning-outline" color={SHOULD_COLOR}>
    SHOULD
  </IconAndLabel>
);

export const Yes = () => <IconAndLabel icon="typcn:tick"></IconAndLabel>;

export const No = () => (
  <IconAndLabel icon="maki:cross" color={MUST_COLOR}></IconAndLabel>
);

export const Severity = props => {
  const Label = () => (
    <>
      <strong>Severity:</strong>{' '}
    </>
  );

  return (
    <span className={props.padding ? 'ama-severity-padding' : undefined}>
      {props.dot ? <>&bull;&nbsp;</> : null}
      {props.label ? <Label /> : null}
      <span className={`ama-${props.level.toLowerCase()}`}>
        <a href={`../guidelines/#${props.level.toLowerCase()}`}>
          {capitalizeFirstLetter(props.level)}
        </a>
      </span>
    </span>
  );
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
export const Critical = props => {
  return <Severity {...props} level="critical" />;
};

export const Serious = props => {
  return <Severity {...props} level="serious" />;
};

export const Warning = props => {
  return <Severity {...props} level="warning" />;
};

export const Good = () => {
  return (
    <span className="ama-good-wrong ama-good">
      <Icon icon="typcn:tick" />
      <span>Good</span>
    </span>
  );
};

export const Wrong = () => {
  return (
    <span className="ama-good-wrong ama-wrong">
      <Icon icon="bx:x" />
      <span>Wrong</span>
    </span>
  );
};
