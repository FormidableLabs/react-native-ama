import { getRuleErrorInfo } from './getRuleErrorInfo';
import { A11yIssue } from './types';

export const logAMAError = __DEV__
  ? (issue: A11yIssue) => {
      const logger =
        issue.type === 'MUST' || issue.type === 'MUST_NOT'
          ? console.error
          : console.warn;

      const { message, url } = getRuleErrorInfo!(issue);

      logger(
        `[React Native AMA]: ${issue.rule}
        Component: ${issue.label || '--- NO LABEL FOUND ---'} (#${issue.viewId})

        ${message}

        Learn about: ${url}\n`,
      );
    }
  : null;
