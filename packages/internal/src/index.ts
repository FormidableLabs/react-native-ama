// Checks
export { checkAccessibilityRole } from './checks/checkAccessibilityRole';
export { checkFocusTrap, type CheckFocusTrap } from './checks/checkFocusTrap';
export {
  checkForAccessibilityState,
  type CheckForAccessibilityState,
} from './checks/checkForAccessibilityState';
export { checkMinimumSize } from './checks/checkMinimumSize';
export {
  contrastChecker,
  type ContrastChecker,
} from './checks/contrastChecker';
export {
  noUndefinedProperty,
  type NoUndefinedProperty,
} from './checks/noUndefinedProperty';
export {
  uppercaseChecker,
  type UppercaseChecker,
} from './checks/uppercaseChecker';
export {
  uppercaseStringChecker,
  type UppercaseStringChecker,
} from './checks/uppercaseStringChecker';

// Utilities
export { applyStyle } from './utils/applyStyle';
export { MOTION_ANIMATIONS, type MotionAnimationKey } from './utils/constants';
export { ERROR_STYLE, RED } from './utils/error.style';
export { generateAccessibilityStateFromProp } from './utils/generateAccessibilityStateFromProp';
export { getPropertyFromStyle } from './utils/getPropertyFromStyle';
export { interpolateAnimationStates } from './utils/interpolateAnimationStates';
export { isFocused } from './utils/isFocused';
export {
  CONTRAST_CHECKER_MAX_DEPTH,
  IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS,
  LOGGER_RULES,
  NON_OVERRIDABLE_RULES,
  RULES_HELP,
  SHELL_COLORS,
  canRuleBeOverridden,
  type Rule,
  type RuleAction,
} from './utils/logger.rules';

export {
  logFailure,
  type LogParams,
  getContrastCheckerMaxDepth,
  getRuleAction,
  isAccessibilityLabelAllowed,
  shouldIgnoreContrastCheckForDisabledElement,
} from './utils/logger';

export { maybeGenerateStringFromElement } from './utils/maybeGenerateStringFromElement';
export {
  ANDROID_MINIMUM_TOUCHABLE_SIZE,
  IOS_MINIMUM_TOUCHABLE_SIZE,
  MINIMUM_TOUCHABLE_SIZE,
} from './utils/minimumTouchableSize';

export { IS_ANDROID, IS_IOS } from './utils/platformHelpers';

// Types
export { type AMAAccessibilityState, type AccessibilityRoles } from './types';
