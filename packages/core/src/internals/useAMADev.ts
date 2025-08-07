/* eslint-disable @typescript-eslint/no-shadow */
import { useEffect, useRef, useState } from 'react';
import { DevSettings } from 'react-native';
import ReactNativeAmaModule from '../ReactNativeAmaModule';
import { logAMAError } from './logAMAError';
import { A11yIssue, Rule, RuleAction } from './types';

export const NON_OVERRIDABLE_RULES: string[] | undefined = __DEV__
  ? [
      'NO_ACCESSIBILITY_ROLE',
      'NO_ACCESSIBILITY_LABEL',
      'NO_KEYBOARD_TRAP',
      'NO_UNDEFINED',
      'NO_FORM_LABEL',
      'FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE',
      'BOTTOM_SHEET_CLOSE_ACTION',
      'INCOMPATIBLE_ACCESSIBILITY_STATE',
      'INCOMPATIBLE_ACCESSIBILITY_ROLE',
    ]
  : undefined;

// prettier-ignore
type OverrideRule = {
    rules: Record<
        | Partial<Rule>
        | 'CONTRAST_CHECKER_MAX_DEPTH'
        | 'IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS',
        RuleAction
    > | null;
    accessibilityLabelExceptions: string[];
};

const defaultRules: OverrideRule = require('./../../ama.rules.json');
let projectRules = defaultRules;
try {
  // look upwards to user's project root
  // e.g we are here:
  // root/node_modules/@react-native-ama/internal/dist/utils/logger.ts
  const userDefinedRules: OverrideRule = require('./../../../../../ama.rules.json');
  projectRules = Object.assign(projectRules, userDefinedRules);
} catch (error) {
  // noop
}

const startAMA = () => {
  console.log('[React Native AMA]: ', '👀 Start Monitoring 👀');

  ReactNativeAmaModule.start(projectRules);
};

const stopAMA = () => {
  console.log('[React Native AMA]: ', '🙈 Stop Monitoring 🙈');

  ReactNativeAmaModule.stop();
};

export const useAMADev = () => {
  const isMonitoring = useRef(true);
  const [issues, setIssues] = useState<A11yIssue[]>();

  useEffect(() => {
    startAMA();

    ReactNativeAmaModule.addListener(
      'onA11yIssues',
      (issues: { issues: A11yIssue[] }) => {
        setIssues(issues.issues);
      },
    );
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
