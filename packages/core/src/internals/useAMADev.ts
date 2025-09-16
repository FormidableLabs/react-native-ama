import { useEffect, useRef, useState } from 'react';
import { DevSettings } from 'react-native';
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
  }
};

export const useAMADev = () => {
  const isMonitoring = useRef(true);
  const [issues, setIssues] = useState<AMAError[]>([]);
  const previousIssues = useRef<AMAError[]>([]);

  const checkNodes = (nodesToCheck: AmaNode[]) => {
    let allIssues: AMAError[] = [];

    for (const node of Object.values(nodesToCheck)) {
      allIssues.push.apply(allIssues, performChecks(node));
    }

    if (previousIssues.current.length) {
      resetFixedIssues(previousIssues.current, allIssues);
    }

    if (allIssues.length) {
      for (const issue of allIssues) {
        ReactNativeAmaModule.highlight(
          issue.viewId,
          projectRules.highlight ?? 'both',
          getErrorColor(issue.rule),
        );
      }

      setIssues(allIssues);
    } else if (previousIssues.current.length) {
      setIssues([]);
    }

    previousIssues.current = allIssues;
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

    const listener = ReactNativeAmaModule.addListener('onAmaNodes', checkNodes);

    return () => {
      stopAMA();

      listener.remove();
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
