import { render } from '@testing-library/react-native';
import * as React from 'react';

import * as UseFocus from '../hooks/useFocus';
import * as UseChecks from '../internal/useChecks';
import { Text } from './Text';

beforeEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe('Text', () => {
  let accessibilityLabelChecker: jest.Mock;
  let uppercaseChecker: jest.Mock;

  beforeEach(function () {
    accessibilityLabelChecker = jest.fn();
    uppercaseChecker = jest.fn();

    jest.spyOn(UseChecks, 'useChecks').mockReturnValue({
      accessibilityLabelChecker,
      uppercaseChecker,
    } as any);
  });

  it.each([false, undefined])(
    'calls useFocus with undefined if the "autofocus" property is %s',
    autofocus => {
      const spy = jest.spyOn(UseFocus, 'useFocus');

      render(<Text autofocus={autofocus} accessibilityRole="header" />);

      expect(spy).toHaveBeenCalledWith(undefined);
    },
  );

  it('calls useFocus with the component ref if autofocus is true', () => {
    const spy = jest.spyOn(UseFocus, 'useFocus').mockImplementation();

    render(<Text autofocus accessibilityRole="header" />);

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ current: expect.any(Object) }),
    );
  });

  it.each([undefined, 'test'])(
    'calls uppercaseChecker with the given style and accessibilityLabel',
    accessibilityLabel => {
      render(
        <Text
          style={{ textTransform: 'uppercase' }}
          accessibilityLabel={accessibilityLabel}>
          This is a test
        </Text>,
      );

      expect(uppercaseChecker).toHaveBeenCalledWith({
        style: { textTransform: 'uppercase' },
        accessibilityLabel,
        extra: 'This is a test',
      });
    },
  );

  it.each([undefined, 'Test'])(
    'calls accessibilityLabelChecker with the given accessibilityLabel',
    accessibilityLabel => {
      render(
        <Text accessibilityLabel={accessibilityLabel}>This is a test</Text>,
      );

      expect(accessibilityLabelChecker).toHaveBeenCalledWith({
        accessibilityLabel,
      });
    },
  );
});
