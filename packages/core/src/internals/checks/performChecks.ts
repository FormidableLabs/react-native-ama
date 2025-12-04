import { AmaNode } from "../../ReactNativeAma.types";
import { AmaError } from "../types";
import { isRuleDisabled } from "../utils/isRuleDisabled";
import { checkAriaLabel } from "./checkAriaLabel";
import { checkAriaRole } from "./checkAriaRole";
import { checkContrast } from "./checkContrast";
import { checkIsUppercase } from "./checkIsUppercase";
import { checkMinimumSize } from "./checkMinimumSize";

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

const RETURN_DONE = 0; // iOS

export const checkTextInputs = (nodesToCheck: AmaNode[]): AmaError[] => {
  const inputs = nodesToCheck.filter((node) => node.type === "TextInput");
  const errors: AmaError[] = [];

  for (const key in inputs) {
    const index = parseInt(key);
    const inputText = inputs[key];
    const canHaveReturnTypeDone = index === inputs.length - 1;

    if (inputText.returnType === RETURN_DONE && !canHaveReturnTypeDone) {
      errors.push({
        rule: "INPUT_INVALID_RETURN_KEY",
        viewId: inputText.viewId,
      });
    }
  }

  return errors;
};
