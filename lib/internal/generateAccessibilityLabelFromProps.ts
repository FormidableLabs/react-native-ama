import * as React from 'react';

import { noUndefinedProperty } from './checks/noUndefinedProperty';

export const generateAccessibilityLabelFromProps = (
  props: Record<string, any>,
  labelComponent = 'label',
) => {
  const label: JSX.Element = props?.[labelComponent];

  /*block:start*/
  noUndefinedProperty({ properties: props, property: 'label' });
  /*block:end*/

  if (props.accessibilityLabel) {
    return props.accessibilityLabel;
  }

  const pieces = extractPieces(label);

  if (pieces == null || pieces?.length === 0) {
    throw new Error(
      'Cannot generate the accessibilityLabel from the `label` prop. Please provide one!',
    );
  }

  return pieces?.join(' ')?.replace(/\*$/, '');
};

const extractPieces = (component: JSX.Element | JSX.Element[]): any[] => {
  return React.Children.map(component, child => {
    if (!React.isValidElement(child)) {
      return '';
    }

    const children = (child.props as any).children;

    if (React.isValidElement(children) || Array.isArray(children)) {
      return extractPieces(children);
    }

    return children;
  });
};
