import projectRules from "../config";


export const isAccessibilityLabelAllowed = __DEV__
  ? (accessibilityLabel: string) => {
      return (
        accessibilityLabel.length < projectRules.uppercaseMinLength ||
        projectRules?.accessibilityLabelExceptions?.includes(accessibilityLabel)
      );
    }
  : null;

