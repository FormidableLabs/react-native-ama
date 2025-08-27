import * as UseChecks from '@react-native-ama/core/src/hooks/useChecks';
import * as UseFocus from '@react-native-ama/core/src/hooks/useFocus';
import { ERROR_STYLE } from '@react-native-ama/internal';
import { render } from '@testing-library/react-native';
import * as React from 'react';
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

  beforeEach(function () {
    accessibilityLabelChecker = jest.fn();
    noUndefinedProperty = jest.fn();
    uppercaseChecker = jest.fn();
    onLayout = jest.fn();

    // @ts-ignore
    jest.spyOn(UseChecks, 'useChecks').mockReturnValue({
      noUppercaseStringChecker: accessibilityLabelChecker,
      noUndefinedProperty,
      uppercaseChecker,
      onLayout,
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

  describe('When __DEV__ is true', () => {
    it.each([undefined, 'test'])(
      'calls uppercaseChecker with the given style and accessibilityLabel',
      accessibilityLabel => {
        render(
          <Text
            style={{ textTransform: 'uppercase' }}
            accessibilityLabel={accessibilityLabel}
          >
            This is a test
          </Text>,
        );

        expect(uppercaseChecker).toHaveBeenCalledWith({
          style: { textTransform: 'uppercase' },
          accessibilityLabel,
          extra: {
            accessibilityLabel,
            children: 'This is a test',
            style: {
              textTransform: 'uppercase',
            },
          },
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
          text: accessibilityLabel,
          canBeEmpty: true,
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

    it('applies the style given by useChecks', () => {
      // @ts-ignore
      jest.spyOn(UseChecks, 'useChecks').mockReturnValue({
        noUppercaseStringChecker: accessibilityLabelChecker,
        noUndefinedProperty,
        uppercaseChecker,
        onLayout,
        debugStyle: ERROR_STYLE,
      } as any);

      const { getByTestId } = render(
        <Text testID="text" onPress={() => {}}>
          Test me
        </Text>,
      );

      expect(getByTestId('text').props.style).toEqual(ERROR_STYLE);
    });
  });

  describe('When __DEV__ is false', () => {
    let TextWithoutDebug = Text;

    beforeEach(() => {
      // @ts-ignore
      global.__DEV__ = false;

      TextWithoutDebug = require('./Text').Text;
    });

    it.each([undefined, 'test'])(
      'does not perform any check',
      accessibilityLabel => {
        const { getByTestId } = render(
          <TextWithoutDebug
            testID={'text'}
            style={{ textTransform: 'uppercase' }}
            accessibilityLabel={accessibilityLabel}
          >
            This is a test
          </TextWithoutDebug>,
        );

        expect(uppercaseChecker).not.toHaveBeenCalled();
        expect(accessibilityLabelChecker).not.toHaveBeenCalled();
        expect(getByTestId('text').props.onLayout).toBe(undefined);
      },
    );

    it('ignores  the style given by useChecks', () => {
      // @ts-ignore
      jest.spyOn(UseChecks, 'useChecks').mockReturnValue({
        noUppercaseStringChecker: accessibilityLabelChecker,
        noUndefinedProperty,
        uppercaseChecker,
        onLayout,
        debugStyle: ERROR_STYLE,
      } as any);

      const { getByTestId } = render(
        <TextWithoutDebug testID="text" onPress={() => {}}>
          Test me
        </TextWithoutDebug>,
      );

      expect(getByTestId('text').props.style).toEqual(undefined);
    });
  });
});
