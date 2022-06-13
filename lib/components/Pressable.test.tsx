import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import * as AccessibilityLabelChecker from '../internal/checks/accessibilityLabelChecker';
import * as ContrastChecker from '../internal/checks/contrastChecker';
import * as AMANoUndefined from '../internal/checks/noUndefinedProperty';
import { Pressable, PressableProps } from './Pressable';

beforeEach(() => {
  // @ts-ignore
  global.__DEV__ = true;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('AMA Pressable', () => {
  describe('When __DEV__ is true', () => {
    it('checks that the "accessibilityRole" property is not UNDEFINED', () => {
      const noUndefined = jest.spyOn(AMANoUndefined, 'noUndefinedProperty');

      try {
        // @ts-ignore
        renderPressable({});
      } catch {}

      expect(noUndefined).toHaveBeenCalledWith(
        {},
        'accessibilityRole',
        'NO_ACCESSIBILITY_ROLE',
      );
    });

    it('checks that the "accessibilityLabel" property is not UNDEFINED', () => {
      const noUndefined = jest.spyOn(AMANoUndefined, 'noUndefinedProperty');

      try {
        // @ts-ignore
        renderPressable({});
      } catch {}

      expect(noUndefined).toHaveBeenCalledWith(
        {},
        'accessibilityLabel',
        'NO_ACCESSIBILITY_LABEL',
      );
    });
  });

  describe('When __DEV__ is false', () => {
    beforeEach(() => {
      // @ts-ignore
      global.__DEV__ = false;
    });

    it('does not throw when the "accessibilityRole" property is UNDEFINED', () => {
      const noUndefined = jest.spyOn(AMANoUndefined, 'noUndefinedProperty');

      try {
        // @ts-ignore
        renderPressable({});
      } catch {}

      expect(noUndefined).not.toHaveBeenCalled();
    });

    it('does not throw when the "accessibilityLabel" property is UNDEFINED', () => {
      const noUndefined = jest.spyOn(AMANoUndefined, 'noUndefinedProperty');

      try {
        // @ts-ignore
        renderPressable({});
      } catch {}

      expect(noUndefined).not.toHaveBeenCalled();
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
    it('checks the contrast ratio between the component and its children', () => {
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

    it('if style is a function then performs the contrast ratio check on both pressed and not pressed state', () => {
      const contrastChecker = jest.spyOn(ContrastChecker, 'contrastChecker');

      render(
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Test"
          style={({ pressed }) => {
            return pressed
              ? { backgroundColor: '#7a7a7a' }
              : { backgroundColor: 'yellow' };
          }}>
          <Text style={{ color: '#fff' }}>Test</Text>
        </Pressable>,
      );

      expect(contrastChecker).toHaveBeenCalledTimes(2);

      expect(contrastChecker).toHaveBeenCalledWith(
        { backgroundColor: '#7a7a7a' },
        <Text style={{ color: '#fff' }}>Test</Text>,
      );
      expect(contrastChecker).toHaveBeenCalledWith(
        { backgroundColor: 'yellow' },
        <Text style={{ color: '#fff' }}>Test</Text>,
      );
    });
  });

  it('calls accessibilityLabelChecker for the accessibilityLabel', () => {
    const spy = jest.spyOn(
      AccessibilityLabelChecker,
      'accessibilityLabelChecker',
    );

    renderPressable({
      accessibilityLabel: 'test accessibilityLabel',
      accessibilityRole: 'button',
    });

    expect(spy).toHaveBeenCalledWith('test accessibilityLabel');
  });
});

function renderPressable(props: Omit<PressableProps, 'children'>) {
  return render(
    <Pressable {...props}>
      <></>
    </Pressable>,
  );
}

jest.mock('../internal/noUndefinedProperty');
jest.mock('../internal/contrastChecker');
