import type {
  AmaNode,
  AmaUiSnapshot,
  AmaUiSnapshotKeys,
  AmaUiSnapshotsData,
} from '../ReactNativeAma.types';
import type { AmaError } from './types';
import { amaClearHighlight } from './utils/amaClearHighlight';
import { amaHighlightComponent } from './utils/amaHighlightComponent';

const A11Y_STATE_KEYS: AmaUiSnapshotKeys[] = [
  'parentId',
  'isChecked',
  'isBusy',
  'isSelected',
  'isDisabled',
  'isExpanded',
];

type GetItemsWithNoStateUpdated = (
  data: AmaUiSnapshotsData,
  nodesInView: Record<number, AmaNode>
) => Set<number>;

type SyncUiInteractionIssues = (
  prevIssues: AmaError[],
  itemsToFlag: number[],
  rootTag: number
) => AmaError[];
type ClearNoStateIssueForRoot = (
  issues: AmaError[],
  rootTag: number
) => AmaError[];
type NonNullableValue = <T>(value: T) => value is NonNullable<T>;

export const getItemsWithNoStateUpdated: GetItemsWithNoStateUpdated | null =
  __DEV__
    ? (data, nodesInView) => {
        const viewsBefore = data.before;
        const viewsAfter = data.afterSettled ?? data.after;
        const issues: Set<number> = new Set();
        const afterKeys = Object.keys(viewsAfter).map(Number);

        if (
          !afterKeys.includes(data.rootTag) ||
          data.beforeModalVisible !== data.afterModalVisible
        ) {
          return issues;
        }

        // The tapped element is no longer in the UI, usually after navigation.
        if (!nodesInView[data.rootTag]) {
          return issues;
        }

        let hasSomethingChanged = false;
        for (const tagId of afterKeys) {
          const snapBefore = viewsBefore[tagId];
          const snapAfter = viewsAfter[tagId];

          if (!snapBefore) {
            hasSomethingChanged = true;

            continue;
          }

          const subKeys = (
            Object.keys(snapAfter) as Array<keyof AmaUiSnapshot>
          ).filter((key) => key !== 'parentId');

          for (const subKey of subKeys) {
            const hasPropertyChanged =
              !A11Y_STATE_KEYS.includes(subKey) &&
              snapBefore[subKey] !== snapAfter[subKey];

            if (hasPropertyChanged) {
              hasSomethingChanged = true;

              break;
            }
          }
        }

        if (hasSomethingChanged) {
          const parentId = data.rootTag;
          const after = data.after[parentId];
          const settled = data.afterSettled?.[parentId];
          const before = data.before[parentId];

          const hasStateChanged = A11Y_STATE_KEYS.some(
            (key) =>
              before[key] !== after[key] ||
              (settled && before[key] !== settled[key])
          );

          if (parentId && !hasStateChanged) {
            issues.add(parentId);
          }
        }

        return issues;
      }
    : null;

export const syncUiInteractionIssues: SyncUiInteractionIssues | null = __DEV__
  ? (prevIssues, itemsToFlag, rootTag) => {
      if (itemsToFlag.length === 0) {
        return clearNoStateIssueForRoot?.(prevIssues, rootTag) ?? prevIssues;
      }

      const newIssues = itemsToFlag
        .map((viewId) => {
          const found = prevIssues.find(
            (item) =>
              item.viewId === viewId &&
              item.rule === 'NO_ACCESSIBILITY_STATE_SET'
          );

          if (found) {
            return null;
          }

          const issue: AmaError = {
            rule: 'NO_ACCESSIBILITY_STATE_SET',
            viewId,
          };

          amaHighlightComponent?.(issue);

          return issue;
        })
        .filter(
          (issue): issue is AmaError => nonNullable?.(issue) ?? false
        );

      if (newIssues.length === 0) {
        return prevIssues;
      }

      return [...prevIssues, ...newIssues];
    }
  : null;

const clearNoStateIssueForRoot: ClearNoStateIssueForRoot | null = __DEV__
  ? (issues, rootTag) => {
      const issueIndex = issues.findIndex(
        (item) =>
          item.viewId === rootTag && item.rule === 'NO_ACCESSIBILITY_STATE_SET'
      );

      if (issueIndex < 0) {
        return issues;
      }

      amaClearHighlight?.(issues[issueIndex]);

      return issues.filter((_, index) => index !== issueIndex);
    }
  : null;

const nonNullable: NonNullableValue | null = __DEV__
  ? <T>(value: T): value is NonNullable<T> =>
      value !== null && value !== undefined
  : null;
