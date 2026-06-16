import { AmaNode } from "../../ReactNativeAma.types";
import { AmaError } from "../types";
import { shouldIgnoreContrastCheckForDisabledElement } from "../utils/ignoreContrastCheck";
import { getRuleAction } from '../utils/getRuleAction';

function hexToRgb(hex: string) {
  if (!hex || typeof hex !== "string") {
    return null;
  }

  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }
    : null;
}

function getLuminance(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return 0;
  }

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255; // Normalize to 0-1 range
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastRatio(fgHex: string, bgHex: string) {
  const lum1 = getLuminance(fgHex);
  const lum2 = getLuminance(bgHex);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

export const checkContrast = (node: AmaNode): AmaError | null => {
  const { fg, bg, fontSize, isBold, isEnabled } = node;

  if (!isEnabled && shouldIgnoreContrastCheckForDisabledElement?.()) {
    return null;
  }

  /**
   * We need to skip node without content as it might be an icon only Button.
   * In this case we can't perform a contrast check as is hard to perform
   * a contrast check on SVGs
   */
  if (
    !fg ||
    !bg ||
    !node.content ||
    node.type === "TextInput" ||
    !node.isAccessible
  ) {
    return null;
  }

  const contrastRatio = getContrastRatio(fg, bg);

  // Determine if the text is "large" according to WCAG standards.
  // 18pt is considered large, or 14pt if bold.
  const isLargeText =
    fontSize && (fontSize >= 18 || (fontSize >= 14 && isBold));

  const requiredRatioAA = isLargeText ? 3.0 : 4.5;
  const requiredRatioAAA = isLargeText ? 4.5 : 7.0;

  const passesAA = contrastRatio >= requiredRatioAA;
  const passesAAA = contrastRatio >= requiredRatioAAA;

  const aaaAction = getRuleAction?.("CONTRAST_FAILED_AAA");
  const shouldCheckAAA = aaaAction && aaaAction !== "PLEASE_FORGIVE_ME";

  if (!passesAAA && shouldCheckAAA) {
    return {
      label: node.ariaLabel,
      viewId: node.viewId,
      rule: "CONTRAST_FAILED_AAA",
      extra: `The color contrast between the foreground (${fg}) and background (${bg}) is ${contrastRatio.toFixed(
        2
      )}, which is below the required minimum of ${requiredRatioAAA}.`,
    };
  }

  if (!passesAA) {
    return {
      label: node.ariaLabel,
      viewId: node.viewId,
      rule: "CONTRAST_FAILED",
      extra: `The color contrast between the foreground (${fg}) and background (${bg}) is ${contrastRatio.toFixed(
        2
      )}, which is below the required minimum of ${requiredRatioAA}.`,
    };
  }

  return null;
};
