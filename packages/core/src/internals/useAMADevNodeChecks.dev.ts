import type { AmaNode, AmaNodes } from '../ReactNativeAma.types';
import { checkTextInputs } from './checks/checkTextInput';
import { performChecks } from './checks/performChecks';
import projectRules from './config';
import type { AmaError } from './types';
import { amaClearHighlight } from './utils/amaClearHighlight';
import { amaHighlightComponent } from './utils/amaHighlightComponent';
import { logFoundIssues } from './utils/logFoundIssues';

type HighlightedIssues = Record<number, number>;

type RunNodeChecksOptions = {
  nodesToCheck: AmaNodes;
  previousNodeIssues: AmaError[];
  jsFailedChecks: AmaError[];
  highlightedIssues: HighlightedIssues;
};

type RunNodeChecks = (options: RunNodeChecksOptions) => AmaError[];
type CollectNodeIssues = (nodesToCheck: AmaNodes) => AmaError[];
type GetNodeIssueState = (
  currentIssues: AmaError[],
  nodeIssues: AmaError[],
  nodesToCheck: AmaNodes
) => AmaError[];
type IsHeaderNode = (node: AmaNode) => boolean;
type ClearFixedNodeIssues = (
  previousNodeIssues: AmaError[],
  nodeIssues: AmaError[],
  jsIssues: AmaError[]
) => void;
type SyncHighlightedIssues = (
  nodeIssues: AmaError[],
  jsFailedChecks: AmaError[],
  highlightedIssues: HighlightedIssues
) => void;
type GroupIssuesByViewId = (issues: AmaError[]) => Record<number, AmaError[]>;
type SortIssuesByViewId = (issues: AmaError[]) => AmaError[];
type KeepNoStateHandledOrKeyboardTrapIssuesStillInView = (
  issues: AmaError[],
  nodesInView: Record<number, AmaNode>
) => AmaError[];

export const runNodeChecks: RunNodeChecks | null = __DEV__
  ? ({ nodesToCheck, previousNodeIssues, jsFailedChecks, highlightedIssues }) => {
      const nodeIssues = collectNodeIssues?.(nodesToCheck) ?? [];

      if (previousNodeIssues.length) {
        clearFixedNodeIssues?.(previousNodeIssues, nodeIssues, jsFailedChecks);
      }

      logFoundIssues?.(nodeIssues);
      syncHighlightedIssues?.(nodeIssues, jsFailedChecks, highlightedIssues);

      return nodeIssues;
    }
  : null;

export const collectNodeIssues: CollectNodeIssues | null = __DEV__
  ? (nodesToCheck) => {
      const nodes = Object.values(nodesToCheck);
      let hasAtLeastOneHeader = false;
      let hasTextInput = false;
      const nodeIssues: AmaError[] = [];

      for (const node of nodes) {
        if (node.type === 'TextInput') {
          hasTextInput = true;
        }

        if (!hasAtLeastOneHeader && isHeaderNode?.(node)) {
          hasAtLeastOneHeader = true;
        }

        nodeIssues.push(...performChecks(node));
      }

      if (hasTextInput && projectRules.checks.forms) {
        nodeIssues.push(...checkTextInputs(nodes));
      }

      if (!hasAtLeastOneHeader) {
        nodeIssues.push({ rule: 'NO_HEADER_FOUND', viewId: -1 });
      }

      return nodeIssues;
    }
  : null;

export const getNodeIssueState: GetNodeIssueState | null = __DEV__
  ? (currentIssues, nodeIssues, nodesToCheck) => {
      const issuesToKeep =
        keepNoStateHandledOrKeyboardTrapIssuesStillInView?.(
          currentIssues,
          nodesToCheck
        ) ?? [];

      return [
        ...issuesToKeep,
        ...(sortIssuesByViewId?.(nodeIssues) ?? nodeIssues),
      ];
    }
  : null;

const isHeaderNode: IsHeaderNode | null = __DEV__
  ? (node) =>
      node.type === 'Text' &&
      (node.traits?.includes('header') || node.ariaRole === 'header')
  : null;

const clearFixedNodeIssues: ClearFixedNodeIssues | null = __DEV__
  ? (previousNodeIssues, nodeIssues, jsIssues) => {
      const fixedIssues = previousNodeIssues.filter(
        (issue) =>
          nodeIssues.find((item) => item.viewId === issue.viewId) ===
            undefined && issue.rule !== 'NO_ACCESSIBILITY_STATE_SET'
      );

      for (const issue of fixedIssues) {
        amaClearHighlight?.(issue);

        const jsIndex = jsIssues.findIndex(
          (item) => item.viewId === issue.viewId && item.rule === issue.rule
        );
        if (jsIndex >= 0) {
          jsIssues.splice(jsIndex, 1);
        }
      }
    }
  : null;

const syncHighlightedIssues: SyncHighlightedIssues | null = __DEV__
  ? (nodeIssues, jsFailedChecks, highlightedIssues) => {
      const issuesByViewId =
        groupIssuesByViewId?.([...nodeIssues, ...jsFailedChecks]) ?? {};

      for (const viewIdStr of Object.keys(issuesByViewId)) {
        const viewId = Number(viewIdStr);
        const issuesForView = issuesByViewId[viewId];

        if (highlightedIssues[viewId] !== issuesForView.length) {
          amaHighlightComponent?.(issuesForView);
          highlightedIssues[viewId] = issuesForView.length;
        }
      }
    }
  : null;

const groupIssuesByViewId: GroupIssuesByViewId | null = __DEV__
  ? (issues) => {
      return issues.reduce((groupedIssues, issue) => {
        if (issue.viewId >= 0) {
          if (!groupedIssues[issue.viewId]) {
            groupedIssues[issue.viewId] = [];
          }
          groupedIssues[issue.viewId].push(issue);
        }

        return groupedIssues;
      }, {} as Record<number, AmaError[]>);
    }
  : null;

const sortIssuesByViewId: SortIssuesByViewId | null = __DEV__
  ? (issues) => [...issues].sort((a, b) => a.viewId - b.viewId)
  : null;

const keepNoStateHandledOrKeyboardTrapIssuesStillInView: KeepNoStateHandledOrKeyboardTrapIssuesStillInView | null =
  __DEV__
    ? (issues, nodesInView) => {
        return issues.filter(
          (item) =>
            (item.rule === 'NO_ACCESSIBILITY_STATE_SET' ||
              item.rule === 'NO_KEYBOARD_TRAP') &&
            nodesInView[item.viewId]
        );
      }
    : null;
