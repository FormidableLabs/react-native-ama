import { AmaNode } from '../../ReactNativeAma.types';
import projectRules from '../config';
import { AmaError } from '../types';

export const checkLongNumber = (node: AmaNode): AmaError | null => {
  const text = node.ariaLabel ?? node.content;

  if (!text || !node.isAccessible) {
    return null;
  }

  const hasFailed =
    getLongestDigitRun(text) >= projectRules.longNumberMinLength;

  if (hasFailed) {
    return {
      rule: 'LONG_NUMBER_NOT_FORMATTED',
      label: node.ariaLabel,
      viewId: node.viewId,
    };
  }

  return null;
};

const getLongestDigitRun = (text: string): number => {
  const digitRuns = text.match(/\d+/g);

  if (!digitRuns) {
    return 0;
  }

  return Math.max(...digitRuns.map((run) => run.length));
};
