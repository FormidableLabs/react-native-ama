import type { AccessibilityRole } from 'react-native';

import { applyStyle } from '../internal/applyStyle';
import { useChecks } from '../internal/useChecks';

export type UseExpandable<T> = Omit<
  T,
  'accessibilityRole' | 'accessibilityLabel'
> & {
  expanded: boolean;
  accessibilityLabel: string;
};

export const useExpandable = <T>(props: UseExpandable<T>) => {
  const checks = __DEV__ ? useChecks?.() : undefined;

  __DEV__ &&
    checks?.noUndefinedProperty<UseExpandable<T>>({
      properties: props,
      property: 'expanded',
      rule: 'NO_UNDEFINED',
    });
  __DEV__ &&
    checks?.noUndefinedProperty<UseExpandable<T>>({
      properties: props,
      // @ts-ignore
      property: 'accessibilityLabel',
      rule: 'NO_UNDEFINED',
    });
  /* block:end */

  return __DEV__
    ? {
        accessibilityRole: 'button' as AccessibilityRole,
        ...props,
        style: applyStyle?.({
          // @ts-ignore
          style: props.style,
          // @ts-ignore
          debugStyle: checks?.debugStyle,
        }),
      }
    : {
        accessibilityRole: 'button' as AccessibilityRole,
        ...props,
      };
};
