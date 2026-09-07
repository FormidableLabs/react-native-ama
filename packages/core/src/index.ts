// Components
export {
  AutofocusContainer,
  type AutofocusContainerProps,
} from './components/AutofocusContainer';
export {
  AMAProvider,
  useAMAContext,
  type AMAContextValue,
  type AMADevContextValue,
  type AMAProdContextValue,
} from './components/AMAProvider';
export { HideChildrenFromAccessibilityTree } from './components/HideChildrenFromAccessibilityTree';

// Hooks
export { useFocus } from './hooks/useFocus';
export { useTimedAction } from './hooks/useTimedAction';

// Only loaded in __DEV__: this pulls in the native highlighter module, which bare
// React Native apps that don't need the dev-only a11y highlighter shouldn't be forced to link.
export default __DEV__
  ? (require('./ReactNativeAmaModule') as typeof import('./ReactNativeAmaModule'))
      .default
  : null;
export * from './ReactNativeAma.types';
