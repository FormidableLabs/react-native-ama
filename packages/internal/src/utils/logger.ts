import {
  IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS,
  Rule,
  RuleAction,
  SHELL_COLORS,
  canRuleBeOverridden,
} from './logger.rules';
import {
  CONTRAST_CHECKER_MAX_DEPTH,
  LOGGER_RULES,
  RULES_HELP,
} from './logger.rules';

const overrideRules: OverrideRule = require('./../ama.rules.json');

type OverrideRule = {
  rules: Record<
    | Partial<Rule>
    | 'CONTRAST_CHECKER_MAX_DEPTH'
    | 'IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS',
    RuleAction
  > | null;
  accessibilityLabelExceptions: string[];
};

export type LogParams = {
  rule: Rule;
  message: string;
  extra?: any;
};

export const getRuleAction = __DEV__
  ? (rule: Rule): RuleAction => {
      const customRule = canRuleBeOverridden?.(rule)
        ? overrideRules?.rules?.[rule]
        : undefined;

      return customRule || LOGGER_RULES![rule];
    }
  : null;

type LogFailure = LogParams & {
  action: RuleAction;
};

type CHECK_STATUS = 'ERROR' | 'WARNING';

export const logFailure = __DEV__
  ? ({ action, rule, message, extra = '' }: LogFailure): CHECK_STATUS => {
      // @ts-ignore
      const formattedMessage = `❌ ${SHELL_COLORS.BG_RED}[ AMA ]${SHELL_COLORS.RESET}: ${SHELL_COLORS.BLUE}${rule}${SHELL_COLORS.RESET} - ${SHELL_COLORS.YELLOW}${message}${SHELL_COLORS.RESET}\n\n${RULES_HELP[rule]}\n\n`;

      switch (action) {
        case 'MUST_NOT':
        case 'MUST':
          console.info(formattedMessage, extra || '', '\n');

          return 'ERROR';
        case 'PLEASE_FORGIVE_ME':
          return 'WARNING';
        case 'SHOULD_NOT':
        default:
          console.warn(formattedMessage, extra || '', '\n');

          return 'WARNING';
      }
    }
  : null;

export const getContrastCheckerMaxDepth = __DEV__
  ? () => {
      return (
        overrideRules?.rules?.CONTRAST_CHECKER_MAX_DEPTH ||
        CONTRAST_CHECKER_MAX_DEPTH
      );
    }
  : null;

export const shouldIgnoreContrastCheckForDisabledElement = __DEV__
  ? () => {
      return (
        overrideRules?.rules?.IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS ||
        IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS
      );
    }
  : null;

export const isAccessibilityLabelAllowed = __DEV__
  ? (accessibilityLabel: string) => {
      return overrideRules?.accessibilityLabelExceptions?.includes(
        accessibilityLabel,
      );
    }
  : null;
