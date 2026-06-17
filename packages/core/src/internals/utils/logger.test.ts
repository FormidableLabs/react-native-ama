import { getRuleAction } from './getRuleAction';
import { LOGGER_RULES, NON_OVERRIDABLE_RULES } from './rules';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getRuleAction', () => {
  it.each(Object.keys(LOGGER_RULES!))(
    'returns the default rule action for %s when no custom config is defined',
    (ruleKey) => {
      const result = getRuleAction?.(ruleKey as any);

      expect(result).toBe(LOGGER_RULES![ruleKey as keyof typeof LOGGER_RULES]);
    },
  );

  it.each(NON_OVERRIDABLE_RULES!)(
    'returns the default (non-overridable) action for rule %s regardless of config',
    (rule) => {
      const result = getRuleAction?.(rule as any);

      expect(result).toBe(LOGGER_RULES![rule as keyof typeof LOGGER_RULES]);
    },
  );
});
