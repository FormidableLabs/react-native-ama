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
  /* block:start */
  const { noUndefinedProperty } = useChecks();

  // @ts-ignore
  let style = props.style;

  const debugStyle = {
    ...noUndefinedProperty<UseExpandable<T>>({
      properties: props,
      property: 'expanded',
      rule: 'NO_UNDEFINED',
    }),
    ...noUndefinedProperty<UseExpandable<T>>({
      properties: props,
      // @ts-ignore
      property: 'accessibilityLabel',
      rule: 'NO_UNDEFINED',
    }),
  };
  /* block:end */

  return {
    accessibilityRole: 'button' as AccessibilityRole,
    ...props,
    /* block:start */
    style: applyStyle({ style, debugStyle }),
    /* block:end */
  };
};
