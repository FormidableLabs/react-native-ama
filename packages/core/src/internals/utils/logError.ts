import { AMAError } from '../types';
import { getRuleAction } from './getRuleAction';
import { RULES_HELP } from './getRuleErrorInfo';
import logger from './logger';

const getAMARuleErrorInfo = __DEV__
  ? ({ rule, extra }: AMAError) => {
      const ruleHelp = RULES_HELP![rule];

      let message = ruleHelp.message;

      if (extra) {
        message += ': ' + extra;
      }

      const url = `https://nearform.com/open-source/react-native-ama/${ruleHelp.url}`;

      return { message, url, severity: ruleHelp.severity };
    }
  : null;


export const logError = __DEV__
  ? (issue: AMAError) => {
      const action = getRuleAction?.(issue.rule);
      const log =
        action === 'MUST' || action === 'MUST_NOT'
          ? logger?.error
          : logger?.warn;

      const { message, url } = getAMARuleErrorInfo?.(issue) ?? {};

      log?.(
        `${issue.rule}
        Component: ${issue.label || '--- NO LABEL FOUND ---'} (#${issue.viewId})

        ${message}

        Learn about: ${url}\n`,
      );
    }
  : null;
