import { render } from '@testing-library/react-native';
import * as React from 'react';

import * as AMADebugUtils from '../internal/debug';
import { Pressable, PressableProps } from './Pressable';
import type { Omit } from 'react-native';

afterEach(() => {
  jest.clearAllMocks();
});

describe('AMA Pressable', () => {
  it('checks that accessibilityRole is not UNDEFINED', () => {
    const amaNoUndefined = jest.spyOn(AMADebugUtils, 'amaNoUndefined');

    try {
      // @ts-ignore
      renderPressable({});
    } catch {}

    expect(amaNoUndefined).toHaveBeenCalledWith({}, 'accessibilityRole');
  });

  it.each([true, false])(
    'sets the "disabled" accessibility state when it is passed a property',
    disabled => {
      const { getByTestId } = render(
        renderPressable({
          accessibilityRole: 'button',
          accessibilityLabel: 'test',
          testID: 'pressable-disabled-test',
          disabled,
        }),
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
        renderPressable({
          accessibilityRole: 'button',
          accessibilityLabel: 'test',
          testID: 'pressable-selected-test',
          selected,
        }),
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
        renderPressable({
          accessibilityRole: 'button',
          accessibilityLabel: 'test',
          testID: 'pressable-busy-test',
          busy,
        }),
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
    'sets the "checked" accessibility state when it is passed a property',
    checked => {
      const { getByTestId } = render(
        renderPressable({
          accessibilityRole: 'button',
          accessibilityLabel: 'test',
          testID: 'pressable-checked-test',
          checked,
        }),
      );

      expect(getByTestId('pressable-busy-test').props).toMatchObject(
        expect.objectContaining({
          accessibilityState: {
            checked: checked,
          },
        }),
      );
    },
  );

  it.each([true, false])(
    'sets the "expanded" accessibility state when it is passed a property',
    expanded => {
      const { getByTestId } = render(
        renderPressable({
          accessibilityRole: 'button',
          accessibilityLabel: 'test',
          testID: 'pressable-expanded-test',
          expanded,
        }),
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

function renderPressable(props: Omit<PressableProps, 'children'>) {
  return (
    <Pressable {...props}>
      <></>
    </Pressable>
  );
}

jest.mock('../internal/debug');
