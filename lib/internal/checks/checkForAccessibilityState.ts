import type { AccessibilityRole, AccessibilityState } from 'react-native';

import type { AMAAccessibilityState, AccessibilityRoles } from '../../types';
import type { LogParams } from '../logger';

export type CheckForAccessibilityState = AMAAccessibilityState & {
  accessibilityState?: AccessibilityState;
} & AccessibilityRoles;

export const checkForAccessibilityState = ({
  accessibilityState,
  accessibilityRole,
  ...rest
}: CheckForAccessibilityState): LogParams | null => {
  const expectedState = MAPPED_ROLE_CHECKS[accessibilityRole];

  const allStates = [
    ...Object.keys(rest || {}),
    ...Object.keys(accessibilityState || {}),
  ];

  for (const state of allStates) {
    if (state !== 'busy' && state !== expectedState.accessibilityState) {
      return {
        message: `The accessibilityState "${state}" and the role "${accessibilityRole}" are not compatible`,
        rule: 'INCOMPATIBLE_ACCESSIBILITY_STATE',
      };
    }
  }

  return null;
};

// @ts-ignore
const MAPPED_ROLE_CHECKS: {
  [key in Partial<AccessibilityRole>]: {
    accessibilityState: keyof AccessibilityState;
    required: boolean;
  };
} = {
  button: { accessibilityState: 'expanded', required: false },
  togglebutton: { accessibilityState: 'checked', required: true },
  switch: { accessibilityState: 'checked', required: true },
  checkbox: { accessibilityState: 'checked', required: true },
  tab: { accessibilityState: 'selected', required: true },
  radio: { accessibilityState: 'selected', required: true },
};
