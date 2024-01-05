import type { AccessibilityRole } from 'react-native';
import { Platform } from 'react-native';

import type { LogParams } from '../utils/logger';

export const checkAccessibilityRole = (
  accessibilityRole: AccessibilityRole,
): LogParams | null => {
  if (!checkPlatformSupportsRole(accessibilityRole, Platform.OS as any)) {
    return {
      message: `"${accessibilityRole}" is not a native element for "${Platform.OS}"`,
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
  togglebutton: ['android'],
  radio: ['android'],
  adjustable: ['ios'],
  link: ['ios', 'android'],
  search: ['ios', 'android'],
  header: ['ios', 'android'],
};
