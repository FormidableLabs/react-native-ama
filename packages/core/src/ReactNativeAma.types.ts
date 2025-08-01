import type { StyleProp, ViewStyle } from 'react-native';
import { A11yIssue } from './internals/types';

export type OnLoadEventPayload = {
  url: string;
};

export type ReactNativeAmaModuleEvents = {
  onA11yIssues: (params: {issues: A11yIssue[]}) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type ReactNativeAmaViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
