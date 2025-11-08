import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
	url: string;
};

export type AmaNode = {
	type: 'Pressable' | 'Text';
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
};

type UiInteraction = {
	fg?: string;
	bg?: string;
	position?: [number, number, number, number];
};

export type AmaUIInteraction = {
	rootTag: number;
	before: UiInteraction[];
	after: UiInteraction[]
}

export type ReactNativeAmaModuleEvents = {
	onAmaNodes: (nodes: AmaNode[]) => void;
	onUIInteraction: (nodes: AmaUIInteraction) => void;
};

export type ChangeEventPayload = {
	value: string;
};

export type ReactNativeAmaViewProps = {
	url: string;
	onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
	style?: StyleProp<ViewStyle>;
};
