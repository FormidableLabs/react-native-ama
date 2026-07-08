import projectRules from '../config';
import { AmaError } from '../types';
import { logError } from './logError';
import logger from './logger';

export const logFoundIssues = __DEV__
  ? (issues: AmaError[]) => {
    if (issues.length === 0) {
      return;
    }

    logger?.log(`Issues found: ${issues.length}`);

    if (projectRules.log !== 'always') {
      return;
    }

    issues.forEach((issue) => {
      logError?.(issue);
    });
  }
  : null;
