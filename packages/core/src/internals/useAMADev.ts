import { useEffect, useRef, useState } from 'react';
import { DevSettings, Pressable } from 'react-native';
import { AmaNode } from '../ReactNativeAma.types';
import ReactNativeAmaModule from '../ReactNativeAmaModule';
import { checkAriaLabel } from './checks/checkAriaLabel';
import { checkAriaRole } from './checks/checkAriaRole';
import { checkContrast } from './checks/checkContrast';
import { checkIsUppercase } from './checks/checkIsUppercase';
import { checkMinimumSize } from './checks/checkMinimumSize';
import projectRules from './config';
import { AMAError } from './types';
import { amaClearHighlight } from './utils/amaClearHighlight';
import { getErrorColor } from './utils/getErrorColor';
import { isRuleDisabled } from './utils/isRuleDisabled';
import logger from './utils/logger';

let issueHighlighted: Array<number> = [];

const startAMA = () => {
  logger?.log('👀 Start Monitoring 👀');

  ReactNativeAmaModule.start();
};

const resetFixedIssues = (prevIssues: AMAError[], newIssues: AMAError[]) => {
  const fixed = prevIssues.filter(
    issue => newIssues.find(item => item.viewId === issue.viewId) === undefined,
  );

  for (const issue of fixed) {
    amaClearHighlight?.(issue);
    const index = issueHighlighted.find(item => item === issue.viewId);

    if (index) {
      issueHighlighted.splice(index, 1);
    }
  }
};

export const useAMADev = () => {
  const isMonitoring = useRef(true);
  const [issues, setIssues] = useState<AMAError[]>([]);
  const previousIssues = useRef<AMAError[]>([]);

  const checkNodes = (nodesToCheck: AmaNode[]) => {
    let allIssues: AMAError[] = [];
    let hasAtLeastOneHeader = false;

    for (const node of Object.values(nodesToCheck)) {
      if (!hasAtLeastOneHeader && node.type === 'Text') {
        if (node.traits?.includes('header') || node.ariaRole === 'header') {
          hasAtLeastOneHeader = true;
        }
      }

      allIssues.push.apply(allIssues, performChecks(node));
    }

    if (!hasAtLeastOneHeader) {
      allIssues.push({ rule: 'NO_HEADER_FOUND', viewId: -1 });
    }

    if (previousIssues.current.length) {
      resetFixedIssues(previousIssues.current, allIssues);
    }

    if (allIssues.length) {
      for (const issue of allIssues) {
        if (issue.viewId >= 0 && !issueHighlighted.includes(issue.viewId)) {
          ReactNativeAmaModule.highlight(
            issue.viewId,
            projectRules.highlight ?? 'both',
            getErrorColor(issue.rule),
          );

          issueHighlighted.push(issue.viewId);
        }
      }

      setIssues(allIssues);
    } else if (previousIssues.current.length) {
      setIssues([]);
    }

    previousIssues.current = allIssues;
  };

  const checkResultUiInteraction = data => {
    console.log({ data });
  };

  const performChecks = (node: AmaNode): AMAError[] => {
    return [
      checkAriaLabel(node),
      checkAriaRole(node),
      checkMinimumSize(node),
      checkIsUppercase({ node }),
      checkContrast(node),
    ].filter(
      (item): item is AMAError => item !== null && !isRuleDisabled?.(item),
    );
  };

  const stopAMA = () => {
    console.log('[React Native AMA]: ', '🙈 Stop Monitoring 🙈');

    for (const issue of issues) {
      amaClearHighlight?.(issue);
    }

    ReactNativeAmaModule.stop();
  };

  useEffect(() => {
    startAMA();

    const amaOnNodesListener = ReactNativeAmaModule.addListener(
      'onAmaNodes',
      checkNodes,
    );
    const amaOnUiInteraction = ReactNativeAmaModule.addListener(
      'onUIInteraction',
      checkResultUiInteraction,
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

  useEffect(() => {
    DevSettings.addMenuItem('Toggle React Native AMA', toggleReactNativeAMA);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    issues,
  };
};

function hasUiChanged(data) {
  const before = data.before;
  const after = data.after;

  const afterKeys = Object.keys(after);

  // 1. Fast check: Did the number of items change?
  //    (This catches any added or removed items)
  if (Object.keys(before).length !== afterKeys.length) {
    return true;
  }

  // 2. Slow check: Iterate and compare items one by one
  for (const key of afterKeys) {
    const snapBefore = before[key];
    const snapAfter = after[key];

    // 2a. Check if item is new (key exists in 'after' but not 'before')
    //     This is a secondary check in case keys were swapped
    //     but the total count remained the same.
    if (!snapBefore) {
      return true;
    }

    // 2b. Compare properties
    if (snapBefore.isEnabled !== snapAfter.isEnabled ||
        snapBefore.bgColor !== snapAfter.bgColor ||
        snapBefore.fgColor !== snapAfter.fgColor) {
      return true;
    }

    // 2c. Compare the position array
    const posBefore = snapBefore.position;
    const posAfter = snapAfter.position;

    if (posBefore.length !== posAfter.length) {
      return true;
    }

    for (let i = 0; i < posBefore.length; i++) {
      if (posBefore[i] !== posAfter[i]) {
        return true;
      }
    }
  }

  // 3. If the loop finishes, no changes were found
  return false;
}
