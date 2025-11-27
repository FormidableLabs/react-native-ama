import { AmaError } from '../types';
import { getRuleAction } from './getRuleAction';
import logger from './logger';
import { RULES_HELP } from './rules';

const getAMARuleErrorInfo = __DEV__
  ? ({ rule, extra }: AmaError) => {
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
  ? (issue: AmaError) => {
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
