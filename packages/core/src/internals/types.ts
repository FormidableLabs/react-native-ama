import { AmaRule } from "./utils/rules";

export type Position = [number, number, number, number];

export type AMAError = {
	rule: AmaRule;
	extra?: any;
	label?: string;
	viewId: number;
};
