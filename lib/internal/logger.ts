const overrideRules: Record<Partial<Rule>, RuleValue> | null = null;
// (() => {
//   try {
//     return require('./../../ama.json');
//   } catch {}
//
//   return null;
// })();

import type { Rule, RuleValue } from './logger.rules';
import { loggerRules } from './logger.rules';

export const log = (rule: Rule, message: string) => {
  const action = overrideRules?.[rule] || loggerRules[rule];

  const formattedMessage = `❌ [AMA ${rule}] - ${message}`;

  switch (action) {
    case 'throw':
      console.error(formattedMessage);
      throw new Error(formattedMessage);
    case 'warn':
      console.warn(formattedMessage);
  }
};
