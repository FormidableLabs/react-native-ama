import * as React from 'react';
import { InteractionManager, LayoutChangeEvent } from 'react-native';

import {
  CheckFocusTrap,
  checkFocusTrap as checkFocusTrapImplementation,
} from '../internal/checks/checkFocusTrap';
import type { UppercaseChecker } from '../internal/checks/uppercaseChecker';
import { LogParams, getRuleAction, logFailure } from '../internal/logger';
import { useAMAContext } from '../providers/AMAProvider';
import {
  AccessibilityLabelChecker,
  accessibilityLabelChecker as accessibilityLabelCheckerImplementation,
} from './checks/accessibilityLabelChecker';
import { checkMinimumSize as checkMinimumSizeImplementation } from './checks/checkMinimumSize';
import {
  ContrastChecker,
  contrastChecker as contrastCheckerImplementation,
} from './checks/contrastChecker';
import {
  NoUndefinedProperty,
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
  const shouldCheckLayout = React.useRef(true);
  const layoutCheckTimeout = React.useRef<NodeJS.Timeout>();
  const [minimumSizeFailed, setMinimumSizeFailed] = React.useState(false);

  const { trackError, removeError } = useAMAContext();

  const logResult = (
    name: string,
    result: LogParams | LogParams[] | null,
  ): Record<string, any> => {
    const index = failedTests.current.indexOf(name);

    if (result === null) {
      if (index >= 0 && hasErrors.current) {
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
      const hasFailed = action === 'MUST_NOT' || action === 'MUST';

      if (index < 0) {
        logFailure({ action, ...logParam });
      }

      if (!hasFailed) {
        return;
      } else if (index >= 0) {
        return;
      }

      failedTests.current.push(name);

      InteractionManager.runAfterInteractions(() => {
        trackError(fakeRandom.current);
      });

      hasErrors.current = true;
    });

    return hasErrors.current ? ERROR_STYLE : {};
  };

  const noUndefinedProperty = <T>(params: NoUndefinedProperty<T>) =>
    logResult(
      `noUndefinedProperty ${params.property as string}`,
      noUndefinedPropertyImplementation(params),
    );

  const contrastChecker = (params: ContrastChecker) =>
    logResult('contrastChecker', contrastCheckerImplementation(params));

  const checkMinimumSize = (params: LayoutChangeEvent) => {
    return logResult(
      'checkMinimumSize',
      checkMinimumSizeImplementation(params),
    );
  };

  const accessibilityLabelChecker = (params: AccessibilityLabelChecker) =>
    logResult(
      'accessibilityLabelChecker',
      accessibilityLabelCheckerImplementation(params),
    );

  const uppercaseChecker = (params: UppercaseChecker) =>
    logResult('uppercaseChecker', uppercaseCheckerImplementation(params));

  const checkFocusTrap = (params: CheckFocusTrap) => {
    checkFocusTrapImplementation(params).then(result => {
      logResult('checkFocusTrap', result);
    });
  };

  const onLayout = (event: LayoutChangeEvent) => {
    /**
     * When the check fails there are situation when adding a border makes the
     * component meet the minimum size requirement, and this causes a loop as the
     * state is update continuously between true and false.
     * To "avoid" that we wait at least 100ms before checking the size again, as
     * this gives the dev time to hot-reload the changes.
     */
    if (!shouldCheckLayout.current) {
      return;
    }

    shouldCheckLayout.current = false;

    // @ts-ignore
    clearTimeout(layoutCheckTimeout.current);

    layoutCheckTimeout.current = setTimeout(() => {
      shouldCheckLayout.current = true;
    }, 100);

    const result = checkMinimumSize(event);

    setMinimumSizeFailed(Object.keys(result).length > 0);
  };

  return {
    logResult,
    noUndefinedProperty,
    contrastChecker,
    onLayout,
    accessibilityLabelChecker,
    uppercaseChecker,
    checkFocusTrap,
    minimumSizeFailed,
  };
};
