import { renderHook } from '@testing-library/react-hooks';

import { accessibilityLabelChecker } from '../internal/checks/accessibilityLabelChecker';
import { usePressable } from './usePressable';

beforeEach(() => {
  jest.clearAllMocks();
});

let noUndefinedProperty: jest.Mock;
let contrastChecker: jest.Mock;
let checkMinimumSize: jest.Mock;

describe('usePressable', () => {
  it('checks that the "accessibilityRole" property is not UNDEFINED', () => {
    renderHook(() => usePressable({}, {}));

    expect(noUndefinedProperty).toHaveBeenCalledWith(
      {},
      'accessibilityRole',
      'NO_ACCESSIBILITY_ROLE',
    );
  });

  it('checks that the "accessibilityLabel" property is not UNDEFINED', () => {
    renderHook(() => usePressable({}, {}));

    expect(noUndefinedProperty).toHaveBeenCalledWith(
      {},
      'accessibilityLabel',
      'NO_ACCESSIBILITY_LABEL',
    );
  });

  it('performs a check on the accessibility label', () => {
    renderHook(() => usePressable({}, {}));

    expect(accessibilityLabelChecker).toHaveBeenCalledWith(
      {},
      'accessibilityLabel',
      'NO_ACCESSIBILITY_LABEL',
    );
  });
});

jest.mock('../internal/useChecks', () => mockUseChecks());

function mockUseChecks() {
  noUndefinedProperty = jest.fn();
  contrastChecker = jest.fn();
  checkMinimumSize = jest.fn();

  return {
    useChecks: () => {
      return {
        noUndefinedProperty,
        contrastChecker,
        checkMinimumSize,
      };
    },
  };
}
