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
    if (state === 'busy') {
      continue;
    }

    if (!expectedState.accessibilityStates.includes(state as any)) {
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
    accessibilityStates: (keyof AccessibilityState)[];
    required: boolean;
  };
} = {
  button: { accessibilityStates: ['expanded', 'selected'], required: false },
  togglebutton: { accessibilityStates: ['checked'], required: true },
  switch: { accessibilityStates: ['checked'], required: true },
  checkbox: { accessibilityStates: ['checked'], required: true },
  tab: { accessibilityStates: ['selected'], required: true },
  radio: { accessibilityStates: ['selected'], required: true },
};
