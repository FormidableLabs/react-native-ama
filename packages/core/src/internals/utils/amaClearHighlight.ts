import ReactNativeAmaModule from '../../ReactNativeAmaModule';
import { AMAError } from '../types';

export const amaClearHighlight = __DEV__
  ? (issue: AMAError) => {
      ReactNativeAmaModule.clearHighlight(issue.viewId);
    }
  : null;
