import { useChecks } from 'lib/internal/useChecks';
import React from 'react';
import { AccessibilityInfo } from 'react-native';

export type UseDynamicFlatList = {
  data: any[];
  accessibilitySingularMessage: string;
  accessibilityPluralMessage: string;
  isPlural?: (count: number) => boolean;
  columns?: number;
};

export const useDynamicFlatList = ({
  data,
  accessibilitySingularMessage,
  accessibilityPluralMessage,
  isPlural = simpleIsPlural,
  columns = 1,
}: UseDynamicFlatList) => {
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
        rule: 'FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE',
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
    rowsCount,
    columnsCount: columns,
  };
};

function simpleIsPlural(count: number) {
  return count !== 1;
}
