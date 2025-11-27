import projectRules from '../config';
import { AmaRule, AmaRuleAction } from '../types';
import canRuleBeOverridden, { LOGGER_RULES } from './rules';

export const getRuleAction = __DEV__
  ? (rule: AmaRule): AmaRuleAction => {
    const customRule = canRuleBeOverridden?.(rule)
      ? projectRules?.rules?.[rule]
      : undefined;

    return customRule || LOGGER_RULES![rule];
  }
  : null;
