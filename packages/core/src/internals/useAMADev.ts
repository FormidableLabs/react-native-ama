import { useEffect, useRef, useState } from 'react';
import { DevSettings } from 'react-native';
import {
  AmaNode,
  AmaNodes,
  AmaUiSnapshot,
  AmaUiSnapshotKeys,
  AmaUiSnapshotsData,
} from '../ReactNativeAma.types';
import ReactNativeAmaModule from '../ReactNativeAmaModule';
import { checkTextInputs } from './checks/checkTextInput';
import { performChecks } from './checks/performChecks';
import projectRules from './config';
import { AmaError } from './types';
import type { AmaRule } from './types';
import { amaClearHighlight } from './utils/amaClearHighlight';
import { logError } from './utils/logError';
import { logFoundIssues } from './utils/logFoundIssues';
import logger from './utils/logger';
import { A11ySeverity, AMA_COLORS, RULES_HELP } from './utils/rules';

let issueHighlighted: Record<number, number> = {};

const startAMA = () => {
  logger?.log('👀 Start Monitoring 👀: ' + JSON.stringify(projectRules.checks));

  ReactNativeAmaModule.start({
    ...projectRules.checks,
    borderWidth: projectRules.highlight?.borderWidth,
    gap: projectRules.highlight?.gap,
  });
};

const highlightComponent = (
  viewId: number,
  color: string,
  issueCount: number = 1
) => {
  ReactNativeAmaModule.highlight(
    viewId,
    projectRules.highlight?.mode ?? 'both',
    color,
    issueCount
  );
};

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

const resetFixedIssues = (
  prevIssues: AmaError[],
  newIssues: AmaError[],
  jsIssues: AmaError[]
) => {
  const fixed = prevIssues.filter(
    (issue) =>
      newIssues.find((item) => item.viewId === issue.viewId) === undefined &&
      issue.rule !== 'NO_ACCESSIBILITY_STATE_SET'
  );

  for (const issue of fixed) {
    amaClearHighlight?.(issue);
    delete issueHighlighted[issue.viewId];

    const jsIndex = jsIssues.findIndex(
      (item) => item.viewId === issue.viewId && item.rule === issue.rule
    );
    if (jsIndex >= 0) {
      jsIssues.splice(jsIndex, 1);
    }
  }
};

let lastNodesChecked: AmaNodes = {};

export const useAMADev = __DEV__
  ? () => {
      const isMonitoring = useRef(true);
      const [issues, setIssues] = useState<AmaError[]>([]);
      const previousIssues = useRef<AmaError[]>([]);
      const jsFailedChecks = useRef<AmaError[]>([]);

      const checkNodes = (nodesToCheck: AmaNodes) => {
        let allIssues: AmaError[] = [];
        let hasAtLeastOneHeader = false;
        let hasTextInput = false;

        lastNodesChecked = nodesToCheck;
        const nodes = Object.values(nodesToCheck);

        for (const node of nodes) {
          if (node.type === 'TextInput') {
            hasTextInput = true;
          }

          if (!hasAtLeastOneHeader && node.type === 'Text') {
            if (node.traits?.includes('header') || node.ariaRole === 'header') {
              hasAtLeastOneHeader = true;
            }
          }

          allIssues.push.apply(allIssues, performChecks(node));
        }

        if (hasTextInput && projectRules.checks.forms) {
          allIssues.push.apply(allIssues, checkTextInputs(nodes));
        }

        if (!hasAtLeastOneHeader) {
          allIssues.push({ rule: 'NO_HEADER_FOUND', viewId: -1 });
        }

        if (previousIssues.current.length) {
          resetFixedIssues(
            previousIssues.current,
            allIssues,
            jsFailedChecks.current
          );
        }

        logFoundIssues?.(allIssues);

        if (allIssues.length || jsFailedChecks.current.length) {
          const issuesByViewId = [
            ...allIssues,
            ...jsFailedChecks.current,
          ].reduce((groupedIssues, issue) => {
            if (issue.viewId >= 0) {
              if (!groupedIssues[issue.viewId]) {
                groupedIssues[issue.viewId] = [];
              }
              groupedIssues[issue.viewId].push(issue);
            }
            return groupedIssues;
          }, {} as Record<number, AmaError[]>);

          for (const viewIdStr of Object.keys(issuesByViewId)) {
            const viewId = Number(viewIdStr);

            const issuesForView = issuesByViewId[viewId];
            if (issueHighlighted[viewId] !== issuesForView.length) {
              const color = getHighestSeverityColor(issuesForView);
              highlightComponent(viewId, color, issuesForView.length);
              issueHighlighted[viewId] = issuesForView.length;
            }
          }

          setIssues((issues) => {
            const a11yStateIssues = keepNoStateHandledOrKeyboardTrapIssuesStillInView(
              issues,
              nodesToCheck
            );

            return [
              ...a11yStateIssues,
              ...allIssues.sort((a, b) => a.viewId - b.viewId),
            ];
          });
        } else {
          setIssues((issues) => {
            const a11yStateIssues = keepNoStateHandledOrKeyboardTrapIssuesStillInView(
              issues,
              nodesToCheck
            );

            return [...a11yStateIssues];
          });
        }

        previousIssues.current = allIssues;
      };

      const checkResultUiInteraction = (data?: AmaUiSnapshotsData) => {
        if (!data) {
          return;
        }

        const itemsToFlag = Array.from(itemsWithNoStateUpdated(data));

        setIssues((prevIssues) => {
          let currentIssues = prevIssues;

          if (itemsToFlag.length === 0) {
            const issueIndex = currentIssues.findIndex(
              (item) =>
                item.viewId === data.rootTag &&
                item.rule === 'NO_ACCESSIBILITY_STATE_SET'
            );

            if (issueIndex >= 0) {
              amaClearHighlight?.(currentIssues[issueIndex]);

              currentIssues = currentIssues.filter(
                (_, index) => index !== issueIndex
              );
            }
          } else {
            const newIssues = itemsToFlag
              .map((viewId) => {
                const found = currentIssues.find(
                  (item) =>
                    item.viewId === viewId &&
                    item.rule === 'NO_ACCESSIBILITY_STATE_SET'
                );

                if (found) {
                  return null;
                }

                const rule: AmaError = {
                  rule: 'NO_ACCESSIBILITY_STATE_SET',
                  viewId,
                };

                highlightComponent(viewId, AMA_COLORS.Critical, 1);
                return rule;
              })
              .filter(nonNullable);

            if (newIssues.length > 0) {
              currentIssues = [...currentIssues, ...newIssues];
            }
          }

          return currentIssues;
        });
      };

      const stopAMA = () => {
        logger?.log('[React Native AMA]: 🙈 Stop Monitoring 🙈');

        for (const issue of issues) {
          amaClearHighlight?.(issue);
        }

        ReactNativeAmaModule.stop();
      };

      useEffect(() => {
        startAMA();

        const amaOnNodesListener = ReactNativeAmaModule.addListener(
          'onAmaNodes',
          checkNodes
        );
        const amaOnUiInteraction = ReactNativeAmaModule.addListener(
          'onUIInteraction',
          checkResultUiInteraction
        );

        return () => {
          stopAMA();

          amaOnNodesListener.remove();
          amaOnUiInteraction.remove();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const toggleReactNativeAMA = () => {
        if (isMonitoring.current) {
          stopAMA();
          setIssues([]);
        } else {
          startAMA();
        }

        isMonitoring.current = !isMonitoring.current;
      };

      const trackError = (rule: AmaRule, ref?: React.RefObject<any>) => {
        const viewId = ref?.current?.__nativeTag ?? -1;
        const issue: AmaError = { rule, viewId };

        logError?.(issue);

        const alreadyTracked = jsFailedChecks.current.some(
          (item) => item.viewId === viewId && item.rule === rule
        );

        if (!alreadyTracked) {
          jsFailedChecks.current.push(issue);
          setIssues((currentIssues) => [...currentIssues, issue]);
          checkNodes(lastNodesChecked);
        }
      };

      useEffect(() => {
        DevSettings.addMenuItem(
          'Toggle React Native AMA',
          toggleReactNativeAMA
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return {
        issues,
        trackError,
      };
    }
  : null;

const A11Y_STATE_KEY: AmaUiSnapshotKeys[] = [
  'parentId',
  'isChecked',
  'isBusy',
  'isSelected',
  'isDisabled',
  'isExpanded',
];
function itemsWithNoStateUpdated(data: AmaUiSnapshotsData) {
  const viewsBefore = data.before;
  const viewsAfter = data.afterSettled ?? data.after;
  const issues: Set<number> = new Set();

  const afterKeys = Object.keys(viewsAfter).map(Number);

  if (
    !afterKeys.includes(data.rootTag) ||
    data.beforeModalVisible !== data.afterModalVisible
  ) {
    return [];
  }

  // The tapped element is no longer in the UI (probably the action did navigate the user to a different screen)
  if (!lastNodesChecked[data.rootTag]) {
    return [];
  }

  let hasSomethingChanged = false;
  for (const tagId of afterKeys) {
    const snapBefore = viewsBefore[tagId];
    const snapAfter = viewsAfter[tagId];

    if (!snapBefore) {
      hasSomethingChanged = true;

      continue;
    }

    const subKeys = (
      Object.keys(snapAfter) as Array<keyof AmaUiSnapshot>
    ).filter((key) => key !== 'parentId');

    for (const subKey of subKeys) {
      const hasPropertyChanged =
        !A11Y_STATE_KEY.includes(subKey) &&
        snapBefore[subKey] !== snapAfter[subKey];

      if (hasPropertyChanged) {
        hasSomethingChanged = true;

        break;
      }
    }
  }

  if (hasSomethingChanged) {
    const parentId = data.rootTag;

    const after = data.after[parentId];
    const settled = data.afterSettled?.[parentId];
    const before = data.before[parentId];

    const hasStateChanged = A11Y_STATE_KEY.some(
      (key) =>
        before[key] !== after[key] ||
        (settled && before[key] !== settled[key])
    );

    if (parentId && !hasStateChanged) {
      issues.add(parentId);
    }
  }

  return issues;
}

const keepNoStateHandledOrKeyboardTrapIssuesStillInView = (
  issues: AmaError[],
  nodesInView: Record<number, AmaNode>
) => {
  return issues.filter(
    (item) =>
      (item.rule === 'NO_ACCESSIBILITY_STATE_SET' ||
        item.rule === 'NO_KEYBOARD_TRAP') &&
      nodesInView[item.viewId]
  );
};

function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
