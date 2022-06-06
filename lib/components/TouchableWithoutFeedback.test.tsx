import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import * as AccessibilityLabelChecker from '../internal/accessibilityLabelChecker';
import * as ContrastChecker from '../internal/contrastChecker';
import * as AMADebugUtils from '../internal/noUndefinedProperty';
import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from './TouchableWithoutFeedback';

beforeEach(() => {
  // @ts-ignore
  global.__DEV__ = true;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('AMA TouchableWithoutFeedback', () => {
  describe('When __DEV__ is true', () => {
    it('checks that the "accessibilityRole" property is not UNDEFINED', () => {
      const noUndefined = jest.spyOn(AMADebugUtils, 'noUndefinedProperty');

      try {
        // @ts-ignore
        renderTouchableWithoutFeedback({});
      } catch {}

      expect(noUndefined).toHaveBeenCalledWith(
        {},
        'accessibilityRole',
        'NO_ACCESSIBILITY_ROLE',
      );
    });

    it('checks that the "accessibilityLabel" property is not UNDEFINED', () => {
      const noUndefined = jest.spyOn(AMADebugUtils, 'noUndefinedProperty');

      try {
        // @ts-ignore
        renderTouchableWithoutFeedback({});
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
      const noUndefined = jest.spyOn(AMADebugUtils, 'noUndefinedProperty');

      try {
        // @ts-ignore
        renderTouchableWithoutFeedback({});
      } catch {}

      expect(noUndefined).not.toHaveBeenCalled();
    });

    it('does not throw when the "accessibilityLabel" property is UNDEFINED', () => {
      const noUndefined = jest.spyOn(AMADebugUtils, 'noUndefinedProperty');

      try {
        // @ts-ignore
        renderTouchableWithoutFeedback({});
      } catch {}

      expect(noUndefined).not.toHaveBeenCalled();
    });
  });

  describe('accessibility state', () => {
    it.each([true, false])(
      'sets the "disabled" accessibility state when it is passed a property',
      disabled => {
        const { getByTestId } = renderTouchableWithoutFeedback({
          accessibilityRole: 'button',
          accessibilityLabel: 'test',
          testID: 'touchable-disabled-test',
          disabled,
        });

        expect(getByTestId('touchable-disabled-test').props).toMatchObject(
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
        const { getByTestId } = renderTouchableWithoutFeedback({
          accessibilityRole: 'button',
          accessibilityLabel: 'test',
          testID: 'touchable-selected-test',
          selected,
        });

        expect(getByTestId('touchable-selected-test').props).toMatchObject(
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
        const { getByTestId } = renderTouchableWithoutFeedback({
          accessibilityRole: 'button',
          accessibilityLabel: 'test',
          testID: 'touchable-busy-test',
          busy,
        });

        expect(getByTestId('touchable-busy-test').props).toMatchObject(
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
        const { getByTestId } = renderTouchableWithoutFeedback({
          accessibilityRole: 'button',
          accessibilityLabel: 'test',
          testID: 'touchable-checked-test',
          checked,
        });

        expect(getByTestId('touchable-checked-test').props).toMatchObject(
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
        const { getByTestId } = renderTouchableWithoutFeedback({
          accessibilityRole: 'button',
          accessibilityLabel: 'test',
          testID: 'touchable-expanded-test',
          expanded,
        });

        expect(getByTestId('touchable-expanded-test').props).toMatchObject(
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
        <TouchableWithoutFeedback
          accessibilityRole="button"
          accessibilityLabel="Test"
          style={{ backgroundColor: '#7a7a7a' }}>
          <Text style={{ color: '#fff' }}>Test</Text>
        </TouchableWithoutFeedback>,
      );

      expect(contrastChecker).toHaveBeenCalledWith(
        { backgroundColor: '#7a7a7a' },
        <Text style={{ color: '#fff' }}>Test</Text>,
      );
    });
  });

  it('calls accessibilityLabelChecker for the accessibilityLabel', () => {
    const spy = jest.spyOn(
      AccessibilityLabelChecker,
      'accessibilityLabelChecker',
    );

    renderTouchableWithoutFeedback({
      accessibilityLabel: 'test accessibilityLabel',
      accessibilityRole: 'button',
    });

    expect(spy).toHaveBeenCalledWith('test accessibilityLabel');
  });
});

function renderTouchableWithoutFeedback(props: TouchableWithoutFeedbackProps) {
  return render(
    <TouchableWithoutFeedback {...props}>
      <View>
        <Text>Content</Text>
      </View>
    </TouchableWithoutFeedback>,
  );
}

jest.mock('../internal/noUndefinedProperty');
jest.mock('../internal/contrastChecker');
