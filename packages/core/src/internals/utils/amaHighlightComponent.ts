import ReactNativeAmaModule from '../../ReactNativeAmaModule';
import projectRules, { HighlightMode } from '../config';
import { AmaError } from '../types';
import { AMA_COLORS, RULES_HELP, A11ySeverity } from './rules';

// Severity priority: Critical > Serious > Warning
const SEVERITY_PRIORITY: Record<A11ySeverity, number> = {
  Critical: 3,
  Serious: 2,
  Warning: 1,
};

const getHighestSeverityColor = (issues: AmaError[]): string => {
  let highestPriority = 0;
  let highestSeverity: A11ySeverity = 'Warning';

  for (const issue of issues) {
    const severity = RULES_HELP?.[issue.rule]?.severity ?? 'Critical';
    const priority = SEVERITY_PRIORITY[severity];
    if (priority > highestPriority) {
      highestPriority = priority;
      highestSeverity = severity;
    }
  }

  return AMA_COLORS[highestSeverity];
};

export const amaHighlightComponent = __DEV__
  ? async (issues: AmaError | AmaError[], mode?: HighlightMode) => {
    const issuesArray = Array.isArray(issues) ? issues : [issues];
    if (issuesArray.length === 0) {return null;}

    const viewId = issuesArray[0].viewId;
    const color = getHighestSeverityColor(issuesArray);
    const issueCount = issuesArray.length;

    return ReactNativeAmaModule.highlight(
      viewId,
      mode ?? projectRules.highlight ?? 'both',
      color,
      issueCount,
    );
  }
  : null;

