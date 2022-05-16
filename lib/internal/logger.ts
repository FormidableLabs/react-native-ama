const overrideRules: Record<
  Partial<Rule> | 'CONTRAST_CHECKER_MAX_DEPTH',
  RuleValue | number
> | null = require('./../../ama.rules.json');

import { Rule, RuleValue, SHELL_COLORS } from './logger.rules';
import {
  LOGGER_RULES,
  CONTRAST_CHECKER_MAX_DEPTH,
  RULES_HELP,
} from './logger.rules';

export const log = (rule: Rule, message: string, extra?: any) => {
  const action = overrideRules?.[rule] || LOGGER_RULES[rule];

  const formattedMessage = `${SHELL_COLORS.RED}❌ [AMA ${rule}]${SHELL_COLORS.RESET} - ${SHELL_COLORS.YELLOW}${message}${SHELL_COLORS.RESET}\n\n${RULES_HELP[rule]}`;

  switch (action) {
    case 'throw':
      if (extra) {
        console.info(extra, '\n');
      }
      console.error(formattedMessage, '\n');

      throw new Error(`❌ [AMA ${rule}] - ${message}`);
    case 'warn':
      if (extra) {
        console.info(extra, '\n');
      }

      console.warn(formattedMessage);
  }
};

export const getContrastCheckerMaxDepth = () => {
  return (
    overrideRules?.CONTRAST_CHECKER_MAX_DEPTH || CONTRAST_CHECKER_MAX_DEPTH
  );
};
