import { AmaNode } from "../../ReactNativeAma.types";
import { AmaError } from "../types";
import { isRuleDisabled } from "../utils/isRuleDisabled";
import { checkAriaLabel } from "./checkAriaLabel";
import { checkAriaRole } from "./checkAriaRole";
import { checkContrast } from "./checkContrast";
import { checkImageAlt } from "./checkImageAlt";
import { checkIsUppercase } from "./checkIsUppercase";
import { checkMinimumSize } from "./checkMinimumSize";

export const performChecks = (node: AmaNode): AmaError[] => {
  return [
    checkAriaLabel(node),
    checkAriaRole(node),
    checkImageAlt(node),
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
    const index = parseInt(key, 10);
    const inputText = inputs[key];
    const canHaveReturnTypeDone = index === inputs.length - 1;
    const ariaLabel = removeEndingSymbol(inputText.ariaLabel);
    const textInputLabel = ariaLabel
      ? nodesToCheck.find(
        // Ignores symbols like ":"
        (node) => node.type === "Text" && removeEndingSymbol(node.content) === ariaLabel
      )
      : false;

    const isLabelAlsoAccessible =
      textInputLabel && textInputLabel?.isAccessible;
    const hasLabel = Boolean(textInputLabel);

    if (inputText.returnType === RETURN_DONE && !canHaveReturnTypeDone) {
      errors.push({
        rule: "INPUT_INVALID_RETURN_KEY",
        viewId: inputText.viewId,
      });
    }

    if (isLabelAlsoAccessible) {
      errors.push({
        rule: "INPUT_HAS_FOCUSABLE_LABEL",
        viewId: textInputLabel.viewId,
      });
    }

    if (ariaLabel && !hasLabel) {
      errors.push({
        rule: "INPUT_HAS_NO_VISIBLE_LABEL",
        viewId: inputText.viewId,
      });
    }
  }

  return errors;
};

const REMOVE_ENDING_REGEXT = /\W$/;

const removeEndingSymbol = (text?: string) => {
  if (!text) {
    return null;
  }

  const result = text.replace(REMOVE_ENDING_REGEXT, "").trim().toLowerCase();

  return result;
};
