import * as React from 'react';

import { noUndefinedProperty } from './noUndefinedProperty';

export const generateAccessibilityLabelFromLabel = (
  label: JSX.Element,
  props: Record<any, any>,
) => {
  __DEV__ && noUndefinedProperty(props, 'label');

  if (props.accessibilityLabel) {
    return props.accessibilityLabel;
  }

  const pieces = React.Children.map(label, child => {
    return child.props.children;
  });

  const containsJSXPiece = pieces?.some(piece => React.isValidElement(piece));

  if (containsJSXPiece) {
    console.info(pieces);
    throw new Error(
      'Cannot generate the accessibilityLabel from the `label` prop. Please provide one!',
    );
  }

  return pieces?.join(',')?.replace(/\*$/, '');
};
