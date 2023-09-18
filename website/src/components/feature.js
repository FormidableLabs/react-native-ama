import { Icon } from '@iconify/react';
import React from 'react';

export const AssistiveTechnology = props => {
  return (
    <div className="ama-feature">
      <strong>Assistive Technology</strong>: {props.title}
      <ul>{props.children}</ul>
    </div>
  );
};

export const ScreenReader = props => {
  return (
    <AssistiveTechnology title="Screen Reader">
      {props.children}
    </AssistiveTechnology>
  );
};

export const Scenario = props => {
  return (
    <li className="ama-scenario">
      <Icon icon="mingcute:right-line" height={12} />
      <strong>Scenario</strong>: {props.title}
      <ul>{props.children}</ul>
    </li>
  );
};

export const When = props => {
  return (
    <li className="ama-when">
      <Icon icon="mingcute:right-line" height={12} />
      <strong>When</strong>: {props.title}
      <ul>{props.children}</ul>
    </li>
  );
};

export const Then = props => {
  const hasChildren = props.children && !props.noChildren;
  const icon = hasChildren ? 'ic:round-plus' : 'typcn:tick';

  return (
    <li className="ama-then">
      <Icon icon={icon} height={12} />
      <strong>Then</strong>: {hasChildren ? props.title : props.children}
      {hasChildren ? <ul>{props.children}</ul> : null}
    </li>
  );
};

export const And = props => {
  const icon = props.children ? 'ic:round-plus' : 'typcn:tick';

  return (
    <li className="ama-and">
      <Icon icon={icon} height={12} />
      <strong>And</strong>: {props.title}
      {props.children ? <ul>{props.children}</ul> : null}
    </li>
  );
};
