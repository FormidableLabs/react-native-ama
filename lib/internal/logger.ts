import {
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
    Partial<Rule> | 'CONTRAST_CHECKER_MAX_DEPTH',
    RuleValue | number
  > | null;
  accessibilityLabelExceptions: string[];
};

export const log = (rule: Rule, message: string, extra?: any) => {
  const customRule = canRuleBeOverridden(rule)
    ? overrideRules?.rules?.[rule]
    : undefined;
  const action = customRule || LOGGER_RULES[rule];

  const formattedMessage = `${SHELL_COLORS.RED}❌ [AMA ${rule}]${SHELL_COLORS.RESET} - ${SHELL_COLORS.YELLOW}${message}${SHELL_COLORS.RESET}\n\n${RULES_HELP[rule]}`;

  switch (action) {
    case 'MUST_NOT':
      if (extra) {
        console.info(extra, '\n');
      }
      console.error(formattedMessage, '\n');

      throw new Error(`❌ [AMA ${rule}] - ${message}`);
    case 'SHOULD_NOT':
    default:
      if (extra) {
        console.info(extra, '\n');
      }

      console.warn(formattedMessage, '\n');
  }
};

export const getContrastCheckerMaxDepth = () => {
  return (
    overrideRules?.rules?.CONTRAST_CHECKER_MAX_DEPTH ||
    CONTRAST_CHECKER_MAX_DEPTH
  );
};

export const isAccessibilityLabelAllowed = (accessibilityLabel: string) => {
  return overrideRules?.accessibilityLabelExceptions?.includes(
    accessibilityLabel,
  );
};
