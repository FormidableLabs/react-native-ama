import ReactNativeAmaModule from '../../ReactNativeAmaModule';
import { AmaError } from '../types';

export const amaClearHighlight = __DEV__
  ? (issue: AmaError) => {
      ReactNativeAmaModule.clearHighlight(issue.viewId);
    }
  : null;
