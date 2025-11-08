import { Rule } from "./utils/rules";

export type Position = [number, number, number, number];

export type AMAError = {
	rule: Rule;
	extra?: any;
	label?: string;
	viewId: number;
};
