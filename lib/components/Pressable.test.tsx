import { render } from '@testing-library/react-native';
import * as React from 'react';
import type { Omit } from 'react-native';
import { Text } from 'react-native';

import * as ContrastChecker from '../internal/contrast-checker';
import * as AMADebugUtils from '../internal/debug';
import { Pressable, PressableProps } from './Pressable';

afterEach(() => {
  jest.clearAllMocks();
});

describe('AMA Pressable', () => {
  describe('When __DEV__ is true', () => {
    beforeEach(() => {
      // @ts-ignore
      global.__DEV__ = true;
    });

    it('checks that the "accessibilityRole" property is not UNDEFINED', () => {
      const amaNoUndefined = jest.spyOn(AMADebugUtils, 'amaNoUndefined');

      try {
        // @ts-ignore
        renderPressable({});
      } catch {}

      expect(amaNoUndefined).toHaveBeenCalledWith({}, 'accessibilityRole');
    });

    it('checks that the "accessibilityLabel" property is not UNDEFINED', () => {
      const amaNoUndefined = jest.spyOn(AMADebugUtils, 'amaNoUndefined');

      try {
        // @ts-ignore
        renderPressable({});
      } catch {}

      expect(amaNoUndefined).toHaveBeenCalledWith({}, 'accessibilityLabel');
    });
  });

  describe('When __DEV__ is false', () => {
    beforeEach(() => {
      // @ts-ignore
      global.__DEV__ = false;
    });

    it('does not throw when the "accessibilityRole" property is UNDEFINED', () => {
      const amaNoUndefined = jest.spyOn(AMADebugUtils, 'amaNoUndefined');

      try {
        // @ts-ignore
        renderPressable({});
      } catch {}

      expect(amaNoUndefined).not.toHaveBeenCalled();
    });

    it('does not throw when the "accessibilityLabel" property is UNDEFINED', () => {
      const amaNoUndefined = jest.spyOn(AMADebugUtils, 'amaNoUndefined');

      try {
        // @ts-ignore
        renderPressable({});
      } catch {}

      expect(amaNoUndefined).not.toHaveBeenCalled();
    });
  });

  describe('accessibility state', () => {
    it.each([true, false])(
      'sets the "disabled" accessibility state when it is passed a property',
      disabled => {
        const { getByTestId } = renderPressable({
          accessibilityRole: 'button',
          accessibilityLabel: 'test',
          testID: 'pressable-disabled-test',
          disabled,
        });

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
        const { getByTestId } = renderPressable({
          accessibilityRole: 'button',
          accessibilityLabel: 'test',
          testID: 'pressable-selected-test',
          selected,
        });

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
        const { getByTestId } = renderPressable({
          accessibilityRole: 'button',
          accessibilityLabel: 'test',
          testID: 'pressable-busy-test',
          busy,
        });

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
        const { getByTestId } = renderPressable({
          accessibilityRole: 'button',
          accessibilityLabel: 'test',
          testID: 'pressable-checked-test',
          checked,
        });

        expect(getByTestId('pressable-checked-test').props).toMatchObject(
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
        const { getByTestId } = renderPressable({
          accessibilityRole: 'button',
          accessibilityLabel: 'test',
          testID: 'pressable-expanded-test',
          expanded,
        });

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

  describe('contrast checker', () => {
    it('checks the contrast ratio between the component and its direct children', () => {
      const contrastChecker = jest.spyOn(ContrastChecker, 'contrastChecker');

      render(
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Test"
          style={{ backgroundColor: '#7a7a7a' }}>
          <Text style={{ color: '#fff' }}>Test</Text>
        </Pressable>,
      );

      expect(contrastChecker).toHaveBeenCalledWith(
        { backgroundColor: '#7a7a7a' },
        <Text style={{ color: '#fff' }}>Test</Text>,
      );
    });
  });
});

function renderPressable(props: Omit<PressableProps, 'children'>) {
  return render(
    <Pressable {...props}>
      <></>
    </Pressable>,
  );
}

jest.mock('../internal/debug');
jest.mock('../internal/contrast-checker');
