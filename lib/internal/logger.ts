import type { CHECK_STATUS } from './checks/types';
import {
  IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS,
  Rule,
  RuleValue,
  SHELL_COLORS,
  canRuleBeOverridden,
} from './logger.rules';
import {
  CONTRAST_CHECKER_MAX_DEPTH,
  LOGGER_RULES,
  RULES_HELP,
} from './logger.rules';

const overrideRules: OverrideRule = require('./../../ama.rules.json');

type OverrideRule = {
  rules: Record<
    | Partial<Rule>
    | 'CONTRAST_CHECKER_MAX_DEPTH'
    | 'IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS',
    RuleValue | number
  > | null;
  accessibilityLabelExceptions: string[];
};

export const log = (rule: Rule, message: string, extra?: any): CHECK_STATUS => {
  const customRule = canRuleBeOverridden(rule)
    ? overrideRules?.rules?.[rule]
    : undefined;
  const action = customRule || LOGGER_RULES[rule];

  const formattedMessage = `${SHELL_COLORS.RED}❌ [AMA ${rule}]${SHELL_COLORS.RESET} - ${SHELL_COLORS.YELLOW}${message}${SHELL_COLORS.RESET}\n\n${RULES_HELP[rule]}\n\n`;

  switch (action) {
    case 'MUST_NOT':
      console.info(formattedMessage, extra || '', '\n');

      return 'ERROR';
    case 'SHOULD_NOT':
    default:
      console.warn(formattedMessage, extra || '', '\n');

      return 'WARNING';
  }
};

export const getContrastCheckerMaxDepth = () => {
  return (
    overrideRules?.rules?.CONTRAST_CHECKER_MAX_DEPTH ||
    CONTRAST_CHECKER_MAX_DEPTH
  );
};

export const shouldIgnoreContrastCheckForDisabledElement = () => {
  return (
    overrideRules?.rules?.IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS ||
    IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS
  );
};

export const isAccessibilityLabelAllowed = (accessibilityLabel: string) => {
  return overrideRules?.accessibilityLabelExceptions?.includes(
    accessibilityLabel,
  );
};
