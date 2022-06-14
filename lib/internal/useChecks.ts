import { InteractionManager } from 'react-native';

import { useAMAContext } from '../providers/AMAProvider';
import { accessibilityLabelChecker as accessibilityLabelCheckerImplementation } from './checks/accessibilityLabelChecker';
import { checkMinimumSize as checkMinimumSizeImplementation } from './checks/checkMinimumSize';
import { contrastChecker as contrastCheckerImplementation } from './checks/contrastChecker';
import { noUndefinedProperty as noUndefinedPropertyImplementation } from './checks/noUndefinedProperty';
import type { CHECK_STATUS } from './checks/types';
import { ERROR_STYLE } from './error.style';

export const useChecks = () => {
  const { showError } = useAMAContext();

  const handleCheckResponse = (callback: (...params: any) => CHECK_STATUS) => {
    return (...params: any) => {
      const result: CHECK_STATUS = callback(...params);

      if (result === 'ERROR') {
        InteractionManager.runAfterInteractions(() => {
          showError();
        });

        return ERROR_STYLE;
      }

      return {};
    };
  };

  const noUndefinedProperty = handleCheckResponse(
    noUndefinedPropertyImplementation,
  );

  const contrastChecker = handleCheckResponse(contrastCheckerImplementation);

  const checkMinimumSize = handleCheckResponse(checkMinimumSizeImplementation);

  const accessibilityLabelChecker = handleCheckResponse(
    accessibilityLabelCheckerImplementation,
  );

  return {
    noUndefinedProperty,
    contrastChecker,
    checkMinimumSize,
    accessibilityLabelChecker,
  };
};
