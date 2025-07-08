/* eslint-disable @typescript-eslint/no-shadow */
import { useEffect, useState } from 'react';
import { DevSettings } from 'react-native';
import ReactNativeAmaModule from '../ReactNativeAmaModule';

export type Rule =
  | 'BOTTOM_SHEET_CLOSE_ACTION'
  | 'CONTRAST_FAILED'
  | 'CONTRAST_FAILED_AAA'
  | 'FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE'
  | 'FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE'
  | 'MINIMUM_SIZE'
  | 'NO_ACCESSIBILITY_LABEL'
  | 'NO_ACCESSIBILITY_ROLE'
  | 'NO_FORM_ERROR'
  | 'NO_FORM_LABEL'
  | 'NO_KEYBOARD_TRAP'
  | 'NO_UNDEFINED'
  | 'NO_UPPERCASE_TEXT'
  | 'INCOMPATIBLE_ACCESSIBILITY_STATE'
  | 'INCOMPATIBLE_ACCESSIBILITY_ROLE'
  | 'NO_FORM_LABEL_ENDING_WITH_ASTERISK'
  | 'UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL';

export type RuleAction =
  | 'SHOULD_NOT'
  | 'MUST_NOT'
  | 'MUST'
  | 'SHOULD'
  | 'PLEASE_FORGIVE_ME';

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

export type A11yIssue = {
  message: string;
  type: 'MUST' | 'MUST_NOT' | 'SHOULD' | 'SHOULD_NOT';
  viewId: number;
};

const startAMA = () => {
  ReactNativeAmaModule.start(projectRules);
};

export const useAMADev = () => {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [issues, setIssues] = useState<A11yIssue[]>();

  useEffect(() => {
    startAMA();

    ReactNativeAmaModule.addListener(
      'onA11yIssues',
      ({ issues }: { issues: A11yIssue[] }) => {
        setIssues(issues);
      },
    );
  }, []);

  useEffect(() => {
    const nextAction = isMonitoring ? 'Disable' : 'Enable';
    DevSettings.addMenuItem(`${nextAction} React Native AMA`, () => {
      if (isMonitoring) {
        ReactNativeAmaModule.stop();
      } else {
        startAMA();
      }

      setIsMonitoring(!isMonitoring);
    });
  }, [isMonitoring]);

  return {
    issues,
  };
};
