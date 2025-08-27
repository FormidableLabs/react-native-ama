import projectRules from '../config';
import { AMARule, AMARuleAction } from '../types';
import canRuleBeOverridden, { LOGGER_RULES } from './rules';

export const getRuleAction = __DEV__
  ? (rule: AMARule): AMARuleAction => {
      const customRule = canRuleBeOverridden?.(rule)
        ? projectRules?.rules?.[rule]
        : undefined;

      return customRule || LOGGER_RULES![rule];
    }
  : null;
