import { render } from '@testing-library/react-native';
import * as React from 'react';

import * as UseFocus from '../hooks/useFocus';
import { ERROR_STYLE } from '../internal/error.style';
import * as UseChecks from '../internal/useChecks';
import { Text } from './Text';

beforeEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe('Text', () => {
  let accessibilityLabelChecker: jest.Mock;
  let uppercaseChecker: jest.Mock;
  let onLayout: jest.Mock;
  let noUndefinedProperty: jest.Mock;
  let minimumSizeFailed = false;

  beforeEach(function () {
    accessibilityLabelChecker = jest.fn();
    noUndefinedProperty = jest.fn();
    uppercaseChecker = jest.fn();
    onLayout = jest.fn();

    jest.spyOn(UseChecks, 'useChecks').mockReturnValue({
      accessibilityLabelChecker,
      noUndefinedProperty,
      uppercaseChecker,
      onLayout,
      minimumSizeFailed,
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

  it('performs minimumSize check if the onPress property is not undefined', () => {
    const { getByTestId } = render(
      <Text testID="text" onPress={() => {}}>
        Test me
      </Text>,
    );

    expect(getByTestId('text').props.onLayout).toBe(onLayout);
  });

  it('applies the ERROR_STYLE when the minimum size check fails', () => {
    minimumSizeFailed = true;

    jest.spyOn(UseChecks, 'useChecks').mockReturnValue({
      accessibilityLabelChecker,
      noUndefinedProperty,
      uppercaseChecker,
      onLayout,
      minimumSizeFailed,
    } as any);

    const { getByTestId } = render(
      <Text testID="text" onPress={() => {}}>
        Test me
      </Text>,
    );

    expect(getByTestId('text').props.style).toEqual(ERROR_STYLE);
  });
});
