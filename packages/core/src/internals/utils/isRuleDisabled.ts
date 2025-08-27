import { AMAError } from '../types';
import { getRuleAction } from './getRuleAction';

export const isRuleDisabled = __DEV__
  ? (error: AMAError) => {
      const action = getRuleAction?.(error.rule);

      return action && action === 'PLEASE_FORGIVE_ME';
    }
  : null;
