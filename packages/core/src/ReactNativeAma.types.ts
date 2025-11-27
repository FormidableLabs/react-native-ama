import type { StyleProp, ViewStyle } from "react-native";

export type OnLoadEventPayload = {
  url: string;
};

export type AmaNode = {
  type: "Pressable" | "Text" | "TextInput";
  viewId: number;
  bounds: [number, number, number, number];
  hitSlop?: { top: number; left: number; bottom: number; right: number };

  ariaLabel?: string;
  ariaRole?: string;
  traits?: string[];
  content?: string;

  fg?: string;
  bg?: string;
  fontSize?: number; // pt
  isBold?: boolean;
  isEnabled?: boolean;
	returnType?: number;
	hasOnSubmitEditing: boolean;
};

export type AmaNodes = Record<number, AmaNode>;

export type AmaUiSnapshot = {
  fgColor?: string;
  bgColor?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  parentId: number;
  isPressable: boolean;
  isChecked: boolean;
  isBusy: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isExpanded: boolean;
};

export type AmaUiSnapshotsData = {
  rootTag: number;
  before: Record<number, AmaUiSnapshot>;
  after: Record<number, AmaUiSnapshot>;
};

export type AmaUiSnapshotKeys = keyof AmaUiSnapshot;

export type ReactNativeAmaModuleEvents = {
  onAmaNodes: (nodes: AmaNodes) => void;
  onUIInteraction: (nodes: AmaUiSnapshotsData) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type ReactNativeAmaViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
