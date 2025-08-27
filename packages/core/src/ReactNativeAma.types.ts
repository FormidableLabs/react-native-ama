import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export type AmaNode = {
  viewId: number;
  bounds: [number, number, number, number];
  hitSlop?: { top: number; left: number; bottom: number; right: number };

  isPressable?: boolean;
  ariaLabel?: string;
  ariaRole?: string;
  traits?: string[];

  fg?: string;
  bg?: string;
  fontSize?: number; // pt
  isBold?: boolean;
};

export type ReactNativeAmaModuleEvents = {
  onAmaNodes: (nodes: AmaNode[]) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type ReactNativeAmaViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp;
};
