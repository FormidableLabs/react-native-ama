import { renderHook } from '@testing-library/react-hooks';

import type { PressableProps } from '../components/Pressable';
import * as UseChecks from '../internal/useChecks';
import { useExpandable } from './useExpandable';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useExpandable', () => {
  describe('When __DEV__ is false', () => {
    let accessibilityLabelChecker: jest.Mock;
    let uppercaseChecker: jest.Mock;
    let onLayout: jest.Mock;
    let noUndefinedProperty: jest.Mock;

    beforeEach(function () {
      // @ts-ignore
      global.__DEV__ = false;

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

    it('does not perform any check', () => {
      const { result } = renderHook(() =>
        useExpandable<PressableProps>({
          expanded: false,
          accessibilityLabel: 'hello',
        }),
      );

      expect(noUndefinedProperty).not.toHaveBeenCalled();
      expect(result.current).toEqual({
        accessibilityLabel: 'hello',
        accessibilityRole: 'button',
        expanded: false,
      });
    });
  });
});

jest.mock('../internal/useChecks');
