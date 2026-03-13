import { Platform } from 'react-native';
import { AmaNode } from '../../ReactNativeAma.types';
import { AmaError } from '../types';

export const checkAriaRole = (node: AmaNode): AmaError | null => {
  const { ariaRole, traits } = node;
  const filteredTraits = traits?.filter(
    (trait) => trait !== 'notEnabled' && trait !== 'selected'
  );
  const a11yRole = ariaRole ?? filteredTraits?.join('') ?? '';

  if (node.type !== 'Pressable') {
    return null;
  }

  if (!a11yRole) {
    return {
      rule: 'NO_ACCESSIBILITY_ROLE',
      label: node.ariaLabel,
      viewId: node.viewId,
    };
  }

  if (!checkPlatformSupportsRole(a11yRole, Platform.OS)) {
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
  platform: Partial<typeof Platform.OS>
) => {
  const supportedPlatforms = MAPPED_ROLE_CHECKS[role.toLocaleLowerCase()] || [];

  return supportedPlatforms.includes(platform);
};

const MAPPED_ROLE_CHECKS: {
  [key: string]: Partial<typeof Platform.OS>[];
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
