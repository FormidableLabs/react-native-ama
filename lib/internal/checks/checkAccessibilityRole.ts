import type { AccessibilityRole } from 'react-native';
import { Platform } from 'react-native';

import type { LogParams } from '../logger';

export const checkAccessibilityRole = (
  accessibilityRole:
    | AccessibilityRole
    | { android: AccessibilityRole; ios: AccessibilityRole },
): LogParams | null => {
  const role =
    typeof accessibilityRole === 'object'
      ? // @ts-ignore
        accessibilityRole[Platform.OS]
      : accessibilityRole;
  const mirrorPlatform = Platform.OS === 'android' ? 'ios' : 'android';
  const mirrorRole =
    typeof accessibilityRole === 'object'
      ? accessibilityRole[mirrorPlatform]
      : role;

  if (!checkPlatformSupportsRole(role, Platform.OS as any)) {
    return {
      message: `"${accessibilityRole}" is not a native element for "${Platform.OS}"`,
      rule: 'INCOMPATIBLE_ACCESSIBILITY_ROLE',
    };
  } else if (!checkPlatformSupportsRole(mirrorRole, mirrorPlatform)) {
    return {
      message: `"${mirrorRole}" is not a native element for "${mirrorPlatform}"`,
      rule: 'INCOMPATIBLE_ACCESSIBILITY_ROLE',
    };
  }

  return null;
};

const checkPlatformSupportsRole = (
  role: AccessibilityRole,
  platform: 'android' | 'ios',
) => {
  const supportedPlatforms = MAPPED_ROLE_CHECKS[role] || [];

  return supportedPlatforms.includes(platform);
};

// @ts-ignore
const MAPPED_ROLE_CHECKS: {
  [key in Partial<AccessibilityRole>]: ('android' | 'ios')[];
} = {
  none: ['ios', 'android'],
  button: ['ios', 'android'],
  switch: ['ios', 'android'],
  checkbox: ['android'],
  tab: ['android', 'ios'],
  radio: ['android'],
  adjustable: ['ios'],
  link: ['ios', 'android'],
  search: ['ios', 'android'],
  header: ['ios', 'android'],
};
