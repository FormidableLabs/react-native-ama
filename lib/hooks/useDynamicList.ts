import React from 'react';
import { AccessibilityInfo } from 'react-native';

import { useChecks } from '../internal/useChecks';

export type UseDynamicList = {
  data: readonly any[];
  accessibilitySingularMessage: string;
  accessibilityPluralMessage: string;
  isPlural?: (count: number) => boolean;
  numColumns?: number;
};

export const useDynamicList = ({
  data,
  accessibilitySingularMessage,
  accessibilityPluralMessage,
  isPlural = simpleIsPlural,
  numColumns = 1,
}: UseDynamicList) => {
  const isFirstRender = React.useRef(true);
  const initialCount = React.useRef(data?.length);
  const lastItemsCount = React.useRef<null | number>(null);

  /*block:start*/
  const { logResult } = useChecks();

  React.useEffect(() => {
    if (!accessibilitySingularMessage?.includes('%count%')) {
      logResult('useDynamicFlatList', {
        rule: 'FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE',
        message:
          'Special string %count% not found in accessibilitySingularMessage',
        extra: accessibilitySingularMessage,
      });
    }

    if (!accessibilityPluralMessage?.includes('%count%')) {
      logResult('useDynamicFlatList', {
        rule: 'FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE',
        message:
          'Special string %count% not found in accessibilityPluralMessage',
        extra: accessibilityPluralMessage,
      });
    }
  }, [accessibilityPluralMessage, accessibilitySingularMessage, logResult]);
  /*block:end*/

  React.useEffect(() => {
    const itemsCount = data?.length || 0;

    if (
      isFirstRender.current ||
      itemsCount === initialCount.current ||
      itemsCount === lastItemsCount.current
    ) {
      isFirstRender.current = false;
      lastItemsCount.current = null;

      return;
    }

    const message = isPlural(itemsCount)
      ? accessibilityPluralMessage
      : accessibilitySingularMessage;
    const messageToAnnounce = message.replace('%count%', itemsCount.toString());

    AccessibilityInfo.announceForAccessibility(messageToAnnounce);

    lastItemsCount.current = itemsCount;
  }, [
    accessibilityPluralMessage,
    accessibilitySingularMessage,
    data,
    isPlural,
  ]);

  const rowsCount = lastItemsCount.current || initialCount.current || 0;

  return {
    rowsCount: rowsCount / numColumns,
    columnsCount: numColumns,
  };
};

function simpleIsPlural(count: number) {
  return count !== 1;
}
