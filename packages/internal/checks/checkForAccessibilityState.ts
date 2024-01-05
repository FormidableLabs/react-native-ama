import type { AccessibilityRole, AccessibilityState } from 'react-native';

import type { AMAAccessibilityState, AccessibilityRoles } from '../types';
import type { LogParams } from '../utils/logger';

export type CheckForAccessibilityState = AMAAccessibilityState & {
  accessibilityState?: AccessibilityState;
} & AccessibilityRoles;

export const checkForAccessibilityState = ({
  accessibilityState,
  accessibilityRole,
  ...rest
}: CheckForAccessibilityState): LogParams | null => {
  const expectedState = MAPPED_ROLE_CHECKS[accessibilityRole] || {
    accessibilityStates: [],
  };

  const allStates = [
    ...Object.keys(rest || {}),
    ...Object.keys(accessibilityState || {}),
  ].filter(state => state !== 'busy' && state !== 'disabled');

  for (const state of allStates) {
    // @ts-ignore
    const stateValue = rest?.[state];
    if (allStates.length > 1 && stateValue === undefined) {
      continue;
    }

    if (!expectedState.accessibilityStates.includes(state as any)) {
      return {
        message: `The accessibilityState "${state} = ${stateValue}" and the role "${accessibilityRole}" are not compatible.\nCompatible states are: [${expectedState.accessibilityStates.join(
          ', ',
        )}]\nReceived: [${allStates.join(', ')}]`,
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
