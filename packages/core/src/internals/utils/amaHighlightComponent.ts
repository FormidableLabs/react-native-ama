import ReactNativeAmaModule from '../../ReactNativeAmaModule';
import projectRules, { HighlightMode } from '../config';
import { AmaError } from '../types';
import { getErrorColor } from './getErrorColor';

export const amaHighlightComponent = __DEV__
  ? async (issue: AmaError, mode?: HighlightMode) => {
    return ReactNativeAmaModule.highlight(
      issue.viewId,
      mode ?? projectRules.highlight ?? 'both',
      getErrorColor(issue.rule),
    );
  }
  : null;
