import { Platform } from 'react-native';
import { AMAError } from '../types';
import { RULES_HELP } from './rules';

export type A11ySeverity = 'Serious' | 'Critical' | 'Warning';

export const getAMARuleErrorInfo = __DEV__
  ? (issue: AMAError) => {
      const ruleHelp = RULES_HELP![issue.rule];

      let message = ruleHelp.message;

      if (issue.extra) {
        message += ': ' + issue.extra;
      }

      const url = `https://nearform.com/open-source/react-native-ama/${ruleHelp.url}`;

      return { message, url, severity: ruleHelp.severity };
    }
  : null;
