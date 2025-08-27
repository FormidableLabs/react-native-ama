import { Platform } from 'react-native';
import { AmaNode } from '../../ReactNativeAma.types';
import { AMAError } from '../types';

export const checkAriaRole = (node: AmaNode): AMAError | null => {
  const { ariaRole, traits } = node;
  const a11yRole = ariaRole ?? traits?.join('');

  if (!Boolean(a11yRole)) {
    return {
      rule: 'NO_ACCESSIBILITY_ROLE',
      label: node.ariaLabel,
      viewId: node.viewId,
    };
  }

  if (!checkPlatformSupportsRole(a11yRole?.replace('notEnabled', '') ?? '', Platform.OS as any)) {
    return {
      label: node.ariaLabel,
      viewId: node.viewId,
      extra: `"${a11yRole}" is not a native role for "${Platform.OS}"`,
      rule: 'INCOMPATIBLE_ACCESSIBILITY_ROLE',
    };
  }

  return null;
};

const checkPlatformSupportsRole = (
  role: string,
  platform: 'android' | 'ios',
) => {
  const supportedPlatforms = MAPPED_ROLE_CHECKS[role] || [];

  return supportedPlatforms.includes(platform);
};

const MAPPED_ROLE_CHECKS: {
  [key: string]: ('android' | 'ios')[];
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
