import { render } from '@testing-library/react-native';
import * as React from 'react';

import * as AMADebugUtils from '../internal/debug';
import { TouchableOpacity } from './TouchableOpacity';

afterEach(() => {
  jest.clearAllMocks();
});

describe('AMA TouchableOpacity', () => {
  it('checks that accessibilityRole is not UNDEFINED', () => {
    const amaNoUndefined = jest.spyOn(AMADebugUtils, 'amaNoUndefined');

    try {
      // @ts-ignore
      render(<TouchableOpacity />);
    } catch {}

    expect(amaNoUndefined).toHaveBeenCalledWith({}, 'accessibilityRole');
  });

  it.each([true, false])(
    'sets the "disabled" accessibility state when it is passed a property',
    disabled => {
      const { getByTestId } = render(
        <TouchableOpacity
          accessibilityRole="button"
          disabled={disabled}
          testID="pressable-disabled-test"
        />,
      );

      expect(getByTestId('pressable-disabled-test').props).toMatchObject(
        expect.objectContaining({
          accessibilityState: {
            disabled: disabled,
          },
        }),
      );
    },
  );

  it.each([true, false])(
    'sets the "selected" accessibility state when it is passed a property',
    selected => {
      const { getByTestId } = render(
        <TouchableOpacity
          accessibilityRole="button"
          selected={selected}
          testID="pressable-selected-test"
        />,
      );

      expect(getByTestId('pressable-selected-test').props).toMatchObject(
        expect.objectContaining({
          accessibilityState: {
            selected: selected,
          },
        }),
      );
    },
  );

  it.each([true, false])(
    'sets the "busy" accessibility state when it is passed a property',
    busy => {
      const { getByTestId } = render(
        <TouchableOpacity
          accessibilityRole="button"
          busy={busy}
          testID="pressable-busy-test"
        />,
      );

      expect(getByTestId('pressable-busy-test').props).toMatchObject(
        expect.objectContaining({
          accessibilityState: {
            busy: busy,
          },
        }),
      );
    },
  );

  it.each([true, false])(
    'sets the "busy" accessibility state when it is passed a property',
    busy => {
      const { getByTestId } = render(
        <TouchableOpacity
          accessibilityRole="button"
          busy={busy}
          testID="pressable-busy-test"
        />,
      );

      expect(getByTestId('pressable-busy-test').props).toMatchObject(
        expect.objectContaining({
          accessibilityState: {
            busy: busy,
          },
        }),
      );
    },
  );

  it.each([true, false])(
    'sets the "expanded" accessibility state when it is passed a property',
    expanded => {
      const { getByTestId } = render(
        <TouchableOpacity
          accessibilityRole="button"
          expanded={expanded}
          testID="pressable-expanded-test"
        />,
      );

      expect(getByTestId('pressable-expanded-test').props).toMatchObject(
        expect.objectContaining({
          accessibilityState: {
            expanded: expanded,
          },
        }),
      );
    },
  );
});

jest.mock('../internal/debug');
