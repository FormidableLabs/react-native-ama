import { AMARule } from '../types';
import { AMA_COLORS, RULES_HELP } from './rules';

export const getErrorColor = (rule: AMARule) => {
  const theRule = RULES_HELP?.[rule];

  return AMA_COLORS[theRule?.severity ?? 'Critical'];
};
