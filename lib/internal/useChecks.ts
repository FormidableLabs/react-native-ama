import type { UppercaseCheckerParams } from 'lib/internal/checks/uppercaseChecker';
import * as React from 'react';
import { InteractionManager, LayoutChangeEvent } from 'react-native';

import { LogParams, getRuleAction, logFailure } from '../internal/logger';
import { useAMAContext } from '../providers/AMAProvider';
import {
  AccessibilityLabelCheckerParams,
  accessibilityLabelChecker as accessibilityLabelCheckerImplementation,
} from './checks/accessibilityLabelChecker';
import { checkMinimumSize as checkMinimumSizeImplementation } from './checks/checkMinimumSize';
import {
  ContrastCheckerParams,
  contrastChecker as contrastCheckerImplementation,
} from './checks/contrastChecker';
import {
  NoUndefinedPropertyParams,
  noUndefinedProperty as noUndefinedPropertyImplementation,
} from './checks/noUndefinedProperty';
import { uppercaseChecker as uppercaseCheckerImplementation } from './checks/uppercaseChecker';
import { ERROR_STYLE } from './error.style';

export const useChecks = () => {
  /**
   * Because the AMA Error view cannot be removed by default, this hacky solution
   * allows the dev to hide it if all the issues have been solved.
   */
  const fakeRandom = React.useRef('' + Date.now() + Math.random() * 42);
  const hasErrors = React.useRef(false);
  const failedTests = React.useRef<string[]>([]);

  const { trackError, removeError } = useAMAContext();

  const logResult = (
    name: string,
    result: LogParams | LogParams[] | null,
  ): Record<string, any> => {
    const index = failedTests.current.indexOf(name);

    if (result === null) {
      if (index >= 0 && hasErrors.current) {
        console.info('fixed');
        failedTests.current.splice(index);

        hasErrors.current = false;

        InteractionManager.runAfterInteractions(() => {
          removeError(fakeRandom.current);
        });
      }
    }

    const results = Array.isArray(result) ? result : [result];

    results.forEach(logParam => {
      if (logParam === null) {
        return;
      }

      const action = getRuleAction(logParam.rule);
      const hasFailed = action === 'MUST_NOT';

      if (!hasFailed) {
        return;
      } else if (hasFailed && index >= 0) {
        return;
      }

      failedTests.current.push(name);

      InteractionManager.runAfterInteractions(() => {
        trackError(fakeRandom.current);
      });

      hasErrors.current = true;

      logFailure({ action, ...logParam });
    });

    return hasErrors.current ? ERROR_STYLE : {};
  };

  const noUndefinedProperty = <T>(params: NoUndefinedPropertyParams<T>) =>
    logResult(
      `noUndefinedProperty ${params.property}`,
      noUndefinedPropertyImplementation(params),
    );

  const contrastChecker = (params: ContrastCheckerParams) =>
    logResult('contrastChecker', contrastCheckerImplementation(params));

  const checkMinimumSize = (params: LayoutChangeEvent) => {
    return logResult(
      'checkMinimumSize',
      checkMinimumSizeImplementation(params),
    );
  };

  const accessibilityLabelChecker = (params: AccessibilityLabelCheckerParams) =>
    logResult(
      'accessibilityLabelChecker',
      accessibilityLabelCheckerImplementation(params),
    );

  const uppercaseChecker = (params: UppercaseCheckerParams) =>
    logResult('uppercaseChecker', uppercaseCheckerImplementation(params));

  return {
    logResult,
    noUndefinedProperty,
    contrastChecker,
    checkMinimumSize,
    accessibilityLabelChecker,
    uppercaseChecker,
  };
};
