import { useChecks } from '@react-native-ama/core';
import { applyStyle } from '~internal';

export type UseExpandable<T> = Omit<T, 'accessibilityRole'> & {
  expanded: boolean;
};

export const useExpandable = <T>(props: UseExpandable<T>) => {
  const checks = __DEV__ ? useChecks?.() : undefined;

  __DEV__ &&
    checks?.noUndefinedProperty<UseExpandable<T>>({
      properties: props,
      // @ts-ignore
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
        accessibilityRole: 'button' as any,
        ...props,
        style: applyStyle?.({
          // @ts-ignore
          style: props.style,
          // @ts-ignore
          debugStyle: checks?.debugStyle,
        }),
      }
    : {
        accessibilityRole: 'button' as any,
        ...props,
      };
};
