import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { DevSettings } from 'react-native';
import type { AmaNodes, AmaUiSnapshotsData } from '../ReactNativeAma.types';
import ReactNativeAmaModule from '../ReactNativeAmaModule';
import projectRules from './config';
import type { AmaError, AmaRule } from './types';
import type { UseAMADev } from './useAMADev';
import { getNodeIssueState, runNodeChecks } from './useAMADevNodeChecks.dev';
import {
  getItemsWithNoStateUpdated,
  syncUiInteractionIssues,
} from './useAMADevUiInteraction.dev';
import { amaClearHighlight } from './utils/amaClearHighlight';
import { logError } from './utils/logError';
import logger from './utils/logger';

const startAMA = __DEV__
  ? () => {
      logger?.log(
        '👀 Start Monitoring 👀: ' + JSON.stringify(projectRules.checks)
      );

      ReactNativeAmaModule.start({
        ...projectRules.checks,
        borderWidth: projectRules.highlight?.borderWidth,
        gap: projectRules.highlight?.gap,
      });
    }
  : null;

export const useAMADev: UseAMADev | null = __DEV__
  ? () => {
      const isMonitoring = useRef(true);
      const lastNodesChecked = useRef<AmaNodes>({});
      const previousNodeIssues = useRef<AmaError[]>([]);
      const jsFailedChecks = useRef<AmaError[]>([]);
      const highlightedIssues = useRef<Record<number, number>>({});
      const issuesRef = useRef<AmaError[]>([]);
      const [issues, setIssues] = useState<AmaError[]>([]);

      useEffect(() => {
        issuesRef.current = issues;
      }, [issues]);

      const checkNodes = (nodesToCheck: AmaNodes) => {
        lastNodesChecked.current = nodesToCheck;

        const nodeIssues =
          runNodeChecks?.({
            nodesToCheck,
            previousNodeIssues: previousNodeIssues.current,
            jsFailedChecks: jsFailedChecks.current,
            highlightedIssues: highlightedIssues.current,
          }) ?? [];

        setIssues(
          (currentIssues) =>
            getNodeIssueState?.(currentIssues, nodeIssues, nodesToCheck) ??
            currentIssues
        );
        previousNodeIssues.current = nodeIssues;
      };

      const checkResultUiInteraction = (data?: AmaUiSnapshotsData) => {
        if (!data) {
          return;
        }

        const itemsToFlag = Array.from(
          getItemsWithNoStateUpdated?.(data, lastNodesChecked.current) ?? []
        );

        setIssues(
          (prevIssues) =>
            syncUiInteractionIssues?.(prevIssues, itemsToFlag, data.rootTag) ??
            prevIssues
        );
      };

      const stopAMA = () => {
        logger?.log('[React Native AMA]: 🙈 Stop Monitoring 🙈');

        for (const issue of issuesRef.current) {
          amaClearHighlight?.(issue);
        }

        highlightedIssues.current = {};
        ReactNativeAmaModule.stop();
      };

      useEffect(() => {
        startAMA?.();

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
      }, []);

      const toggleReactNativeAMA = () => {
        if (isMonitoring.current) {
          stopAMA();
          setIssues([]);
        } else {
          startAMA?.();
        }

        isMonitoring.current = !isMonitoring.current;
      };

      const trackError = (rule: AmaRule, ref?: RefObject<any>) => {
        const viewId = ref?.current?.__nativeTag ?? -1;
        const issue: AmaError = { rule, viewId };

        logError?.(issue);

        const alreadyTracked = jsFailedChecks.current.some(
          (item) => item.viewId === viewId && item.rule === rule
        );

        if (!alreadyTracked) {
          jsFailedChecks.current.push(issue);
          setIssues((currentIssues) => [...currentIssues, issue]);
          checkNodes(lastNodesChecked.current);
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
