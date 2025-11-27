import { checkAriaLabel } from "./checkAriaLabel";
import { checkAriaRole } from "./checkAriaRole";
import { checkIsUppercase } from "./checkIsUppercase";
import { checkContrast } from "./checkContrast";
import { AmaError } from "../types";
import { AmaNode, AmaNodes } from "../../ReactNativeAma.types";
import { checkMinimumSize } from "./checkMinimumSize";
import { isRuleDisabled } from "../utils/isRuleDisabled";

export const performChecks = (node: AmaNode): AmaError[] => {
	return [
		checkAriaLabel(node),
		checkAriaRole(node),
		checkMinimumSize(node),
		checkIsUppercase({ node }),
		checkContrast(node),
	].filter(
		(item): item is AmaError => item !== null && !isRuleDisabled?.(item)
	);
};

const RETURN_DONE = 0 // iOS

export const checkTextInputs = (nodesToCheck: AmaNode[]): AmaError[] => {
	const inputs = nodesToCheck.filter(node => node.type === 'TextInput')
	const errors: AmaError[] = []

	for (const key in inputs) {
		const index = parseInt(key)
		const node = inputs[key]
		const canHaveReturnTypeDone = (index === inputs.length - 1)

		if (node.returnType === RETURN_DONE && !canHaveReturnTypeDone) {
			errors.push({ rule: 'INPUT_INVALID_RETURN_KEY', viewId: node.viewId })
		}
	}

	return errors
}

