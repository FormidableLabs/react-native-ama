import { render } from '@testing-library/react-native';
import * as React from 'react';

import * as UseA11yFocus from '../hooks/useA11yFocus';
import * as AccessibilityLabelChecker from '../internal/accessibilityLabelChecker';
import * as UppercaseChecker from '../internal/uppercaseChecker';
import { Text } from './Text';

describe('Text', () => {
  it.each([false, undefined])(
    'calls useA11yFocus with undefined if the "autofocus" property is %s',
    autofocus => {
      const spy = jest.spyOn(UseA11yFocus, 'useA11yFocus');

      render(<Text autofocus={autofocus} accessibilityRole="header" />);

      expect(spy).toHaveBeenCalledWith(undefined);
    },
  );

  it('calls useA11yFocus with the component ref if autofocus is true', () => {
    const spy = jest.spyOn(UseA11yFocus, 'useA11yFocus').mockImplementation();

    render(<Text autofocus accessibilityRole="header" />);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ current: expect.any(Object) }),
    );
  });

  it.each([undefined, 'test'])(
    'calls uppercaseChecker with the given style and accessibilityLabel',
    accessibilityLabel => {
      const spy = jest.spyOn(UppercaseChecker, 'uppercaseChecker');

      render(
        <Text
          style={{ textTransform: 'uppercase' }}
          accessibilityLabel={accessibilityLabel}>
          This is a test
        </Text>,
      );

      expect(spy).toHaveBeenCalledWith(
        { textTransform: 'uppercase' },
        accessibilityLabel,
      );
    },
  );

  it.each([undefined, 'Test'])(
    'calls accessibilityLabelChecker with the given accessibilityLabel',
    accessibilityLabel => {
      const spy = jest.spyOn(
        AccessibilityLabelChecker,
        'accessibilityLabelChecker',
      );

      render(
        <Text accessibilityLabel={accessibilityLabel}>This is a test</Text>,
      );

      expect(spy).toHaveBeenCalledWith(accessibilityLabel);
    },
  );
});

jest.mock('../internal/uppercaseChecker');
jest.mock('../internal/accessibilityLabelChecker');
