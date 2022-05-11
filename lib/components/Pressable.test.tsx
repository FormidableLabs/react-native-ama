import { render } from '@testing-library/react-native';
import * as React from 'react';

import * as AMADebugUtils from '../internal/debug';
import { Pressable } from './Pressable';

afterEach(() => {
  jest.clearAllMocks();
});

describe('AMA Pressable', () => {
  it('checks that accessibilityRole is not UNDEFINED', () => {
    const amaNoUndefined = jest.spyOn(AMADebugUtils, 'amaNoUndefined');

    try {
      // @ts-ignore
      render(<Pressable />);
    } catch {}

    expect(amaNoUndefined).toHaveBeenCalledWith({}, 'accessibilityRole');
  });

  it.each([true, false])(
    'sets the "disabled" accessibility state when it is passed a property',
    disabled => {
      const { getByTestId } = render(
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="test"
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="test"
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="test"
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="test"
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="test"
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
