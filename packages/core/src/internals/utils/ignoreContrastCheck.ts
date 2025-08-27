import projectRules from '../config';
import { IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS } from './rules';

export const shouldIgnoreContrastCheckForDisabledElement = __DEV__
  ? () => {
      return (
        projectRules?.rules?.IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS ||
        IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS
      );
    }
  : null;
