import type { AccessibilityRole } from 'react-native';
import { Platform } from 'react-native';

import type { LogParams } from '../logger';

export const checkAccessibilityRole = (
  accessibilityRole: AccessibilityRole,
): LogParams | null => {
  const supportedPlatforms = MAPPED_ROLE_CHECKS[accessibilityRole] || [];
  const mirrorPlatform = Platform.OS === 'android' ? 'ios' : 'android';

  if (!supportedPlatforms.includes(Platform.OS as any)) {
    return {
      message: `"${accessibilityRole}" is not a native element for "${Platform.OS}"`,
      rule: 'INCOMPATIBLE_ACCESSIBILITY_ROLE',
    };
  } else if (!supportedPlatforms.includes(mirrorPlatform)) {
    console.warn(
      `NOTE: "${accessibilityRole}" is not a native element for "${mirrorPlatform}"`,
    );
  }

  return null;
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
