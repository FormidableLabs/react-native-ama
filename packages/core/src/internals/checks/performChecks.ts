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

