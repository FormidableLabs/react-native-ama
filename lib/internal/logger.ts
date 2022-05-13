import fs from 'fs';
import type { Rule, RuleValue } from './logger.rules';
import { loggerRules } from './logger.rules';

let overrideRules: Record<Partial<Rule>, RuleValue> | null = null;

export const log = (rule: Rule, message: string) => {
  importRules();

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

const importRules = () => {
  if (overrideRules !== null) {
    return;
  }

  const amaRulesFile = `${__dirname}/../../ama.json`;
  const exists = fs.existsSync(amaRulesFile);

  if (exists) {
    overrideRules = require(amaRulesFile);
  }
};
