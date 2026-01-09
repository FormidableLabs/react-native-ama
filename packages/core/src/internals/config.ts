import logger from './utils/logger';
import { AmaRule, AmaRuleAction } from './utils/rules';

export const NON_OVERRIDABLE_RULES: string[] | undefined = __DEV__
  ? [
      'NO_ACCESSIBILITY_ROLE',
      'NO_ACCESSIBILITY_LABEL',
      'NO_KEYBOARD_TRAP',
      'NO_UNDEFINED',
      'NO_FORM_LABEL',
      'FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE',
      'BOTTOM_SHEET_CLOSE_ACTION',
      'INCOMPATIBLE_ACCESSIBILITY_STATE',
      'INCOMPATIBLE_ACCESSIBILITY_ROLE',
    ]
  : undefined;

export type HighlightMode = 'border' | 'background' | 'both';

type OverrideRule = {
  rules: Record<
    | Partial<AmaRule>
    | 'CONTRAST_CHECKER_MAX_DEPTH'
    | 'IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS',
    AmaRuleAction
  > | null;
  accessibilityLabelExceptions: string[];
  highlight: HighlightMode;
  uppercaseMinLength: number;
  checks: {
    ui: boolean;
    forms: boolean;
    delay: number;
    grouping: boolean;
    gap?: number;
    borderWidth?: number;
  };
};

const defaultRules: OverrideRule = require('./../../ama.config.json');
let projectRules = defaultRules;

try {
  // look upwards to user's project root
  // e.g we are here:
  // root/node_modules/@react-native-ama/internal/dist/utils/logger.ts
  const userDefinedRules: OverrideRule = require('./../../../../ama.config.json');
  projectRules = Object.assign(projectRules, userDefinedRules);

  logger?.log("Using project's config file");
} catch (_) {
  logger?.log('Project config not found, using default one!');
}

export default projectRules;
