import { AmaError } from "../types";
import { RULES_HELP } from "./rules";

export type A11ySeverity = "Serious" | "Critical" | "Warning";

export const getAMARuleErrorInfo = __DEV__
  ? (issue: AmaError) => {
      const ruleHelp = RULES_HELP![issue.rule];

      if (!ruleHelp) {
        console.error(`Missing rule help: ${issue.rule}`);

        throw new Error(`Missing rule help: ${issue.rule}`);
      }

      let message = ruleHelp.message;

      if (issue.extra) {
        message += ": " + issue.extra;
      }

      const url = `https://nearform.com/open-source/react-native-ama/${ruleHelp.url}`;

      return { message, url, severity: ruleHelp.severity };
    }
  : null;
