import { useEffect, useRef, useState } from "react";
import { DevSettings } from "react-native";
import {
  AmaNode,
  AmaNodes,
  AmaUiSnapshot,
  AmaUiSnapshotKeys,
  AmaUiSnapshotsData,
} from "../ReactNativeAma.types";
import ReactNativeAmaModule from "../ReactNativeAmaModule";
import { checkAriaLabel } from "./checks/checkAriaLabel";
import { checkAriaRole } from "./checks/checkAriaRole";
import { checkContrast } from "./checks/checkContrast";
import { checkIsUppercase } from "./checks/checkIsUppercase";
import { checkMinimumSize } from "./checks/checkMinimumSize";
import projectRules from "./config";
import { AmaError } from "./types";
import { amaClearHighlight } from "./utils/amaClearHighlight";
import { getErrorColor } from "./utils/getErrorColor";
import { isRuleDisabled } from "./utils/isRuleDisabled";
import logger from "./utils/logger";

let issueHighlighted: Array<number> = [];

const startAMA = () => {
  logger?.log("👀 Start Monitoring 👀: " + JSON.stringify(projectRules.checks));

  ReactNativeAmaModule.start(projectRules.checks);
};

const highlightComponent = (issue: AmaError) => {
  ReactNativeAmaModule.highlight(
    issue.viewId,
    projectRules.highlight ?? "both",
    getErrorColor(issue.rule)
  );
};

const resetFixedIssues = (prevIssues: AmaError[], newIssues: AmaError[]) => {
  const fixed = prevIssues.filter(
    (issue) =>
      newIssues.find((item) => item.viewId === issue.viewId) === undefined &&
      issue.rule !== "NO_ACCESSIBILITY_STATE_SET"
  );

  for (const issue of fixed) {
    amaClearHighlight?.(issue);
    const index = issueHighlighted.find((item) => item === issue.viewId);

    if (index) {
      issueHighlighted.splice(index, 1);
    }
  }
};

let lastNodesChecked: AmaNodes = {};

export const useAMADev = () => {
  const isMonitoring = useRef(true);
  const [issues, setIssues] = useState<AmaError[]>([]);
  const previousIssues = useRef<AmaError[]>([]);

  const checkNodes = (nodesToCheck: AmaNodes) => {
    let allIssues: AmaError[] = [];
    let hasAtLeastOneHeader = false;

    for (const node of Object.values(nodesToCheck)) {
      if (!hasAtLeastOneHeader && node.type === "Text") {
        if (node.traits?.includes("header") || node.ariaRole === "header") {
          hasAtLeastOneHeader = true;
        }
      }

      allIssues.push.apply(allIssues, performChecks(node));
    }

    if (!hasAtLeastOneHeader) {
      allIssues.push({ rule: "NO_HEADER_FOUND", viewId: -1 });
    }

    if (previousIssues.current.length) {
      resetFixedIssues(previousIssues.current, allIssues);
    }

    if (allIssues.length) {
      for (const issue of allIssues) {
        if (issue.viewId >= 0 && !issueHighlighted.includes(issue.viewId)) {
          highlightComponent(issue);

          issueHighlighted.push(issue.viewId);
        }
      }

      setIssues((issues) => {
        const a11yStateIssues = keepNoStateHandledIssuesStillInView(
          issues,
          nodesToCheck
        );

        return [...a11yStateIssues, ...allIssues];
      });
    } else {
      setIssues((issues) => {
        const a11yStateIssues = keepNoStateHandledIssuesStillInView(
          issues,
          nodesToCheck
        );

        return [...a11yStateIssues];
      });
    }

    previousIssues.current = allIssues;
    lastNodesChecked = nodesToCheck;
  };

  const checkResultUiInteraction = (data?: AmaUiSnapshotsData) => {
    if (!data) {
      return;
    }

    const itemsToFlag = Array.from(itemsWithNoStateUpdated(data));

    setIssues((currentIssues) => {
      if (itemsToFlag.length === 0) {
        const issueIndex = currentIssues.findIndex(
          (item) =>
            item.viewId === data.rootTag &&
            item.rule === "NO_ACCESSIBILITY_STATE_SET"
        );

        if (issueIndex >= 0) {
          amaClearHighlight?.(currentIssues[issueIndex]);

          currentIssues.splice(issueIndex, 1);

          return [...currentIssues];
        }

        return currentIssues;
      }

      const newIssues = itemsToFlag
        .map((viewId) => {
          const found = currentIssues.find(
            (item) =>
              item.viewId === viewId &&
              item.rule === "NO_ACCESSIBILITY_STATE_SET"
          );

          if (found) {
            return null;
          }

          const rule: AmaError = {
            rule: "NO_ACCESSIBILITY_STATE_SET",
            viewId,
          };

          highlightComponent(rule);
          return rule;
        })
        .filter(nonNullable);

      if (newIssues.length === 0) {
        return currentIssues;
      }

      return [...currentIssues, ...newIssues];
    });
  };

  const performChecks = (node: AmaNode): AmaError[] => {
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

  const stopAMA = () => {
    console.log("[React Native AMA]: ", "🙈 Stop Monitoring 🙈");

    for (const issue of issues) {
      amaClearHighlight?.(issue);
    }

    ReactNativeAmaModule.stop();
  };

  useEffect(() => {
    startAMA();

    const amaOnNodesListener = ReactNativeAmaModule.addListener(
      "onAmaNodes",
      checkNodes
    );
    const amaOnUiInteraction = ReactNativeAmaModule.addListener(
      "onUIInteraction",
      checkResultUiInteraction
    );

    return () => {
      stopAMA();

      amaOnNodesListener.remove();
      amaOnUiInteraction.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleReactNativeAMA = () => {
    if (isMonitoring.current) {
      stopAMA();
      setIssues([]);
    } else {
      startAMA();
    }

    isMonitoring.current = !isMonitoring.current;
  };

  useEffect(() => {
    DevSettings.addMenuItem("Toggle React Native AMA", toggleReactNativeAMA);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    issues,
  };
};

function findPressableParentId(
  snapshot: Record<number, AmaUiSnapshot>,
  startKey: number
) {
  let currentElement = snapshot[startKey];

  // Loop as long as we have a valid element to check
  while (currentElement) {
    const parentId = currentElement.parentId;

    if (!parentId) {
      return null;
    }

    const parentElement = snapshot[parentId];

    if (parentElement) {
      if (parentElement.isPressable) {
        return parentId;
      }

      currentElement = parentElement;
    } else {
      return null;
    }
  }

  return null;
}

const IGNORE_KEYS: AmaUiSnapshotKeys[] = ["parentId", "isChecked", "isBusy"];
function itemsWithNoStateUpdated(data: AmaUiSnapshotsData) {
  const tappedViewBefore = data.before;
  const tappedViewAfter = data.after;
  const issues: Set<number> = new Set();

  const afterKeys = Object.keys(tappedViewAfter).map(Number);

  if (!afterKeys.includes(data.rootTag)) {
    return [];
  }

  // The tapped element is no longer in the UI (probably the action did navigate the user to a different screen)
  if (!lastNodesChecked[data.rootTag]) {
    return [];
  }

  for (const tagId of afterKeys) {
    const snapBefore = tappedViewBefore[tagId];
    const snapAfter = tappedViewAfter[tagId];

    if (!snapBefore) {
      issues.add(data.rootTag);

      continue;
    }

    const subKeys = Object.keys(snapAfter) as Array<keyof AmaUiSnapshot>;
    let hasSomethingChanged = false;

    for (const subKey of subKeys) {
      const hasPropertyChanged =
        !IGNORE_KEYS.includes(subKey) &&
        snapBefore[subKey] !== snapAfter[subKey];

      if (hasPropertyChanged) {
        hasSomethingChanged = true;

        break;
      }
    }

    if (hasSomethingChanged) {
      const parentId = data.rootTag; //findPressableParentId(after, snapAfter.parentId);

      const { isChecked, isBusy } = tappedViewAfter[parentId];
      const { isChecked: wasChecked, isBusy: wasBusy } =
        tappedViewBefore[parentId];

      const hasStateChanged = isChecked !== wasChecked || isBusy !== wasBusy;

      if (parentId && !hasStateChanged) {
        issues.add(parentId);
      }
    }
  }

  return issues;
}

const keepNoStateHandledIssuesStillInView = (
  issues: AmaError[],
  nodesInView: Record<number, AmaNode>
) => {
  return issues.filter(
    (item) =>
      item.rule === "NO_ACCESSIBILITY_STATE_SET" && nodesInView[item.viewId]
  );
};

function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
