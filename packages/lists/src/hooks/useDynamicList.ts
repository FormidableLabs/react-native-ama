import { useChecks } from '@react-native-ama/core';
import React from 'react';
import { AccessibilityInfo } from 'react-native';

export type UseDynamicList = {
  data: readonly any[];
  singularMessage: string;
  pluralMessage: string;
  isPlural?: (count: number) => boolean;
  numColumns?: number;
};

export const useDynamicList = ({
  data,
  singularMessage,
  pluralMessage,
  isPlural = simpleIsPlural,
  numColumns = 1,
}: UseDynamicList) => {
  const isFirstRender = React.useRef(true);
  const initialCount = React.useRef(data?.length);
  const lastItemsCount = React.useRef<null | number>(null);

  const checks = __DEV__ ? useChecks?.() : null;

  __DEV__ &&
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (!singularMessage?.includes('%count%')) {
        checks?.logResult('useDynamicFlatList', {
          rule: 'FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE',
          message: 'Special string %count% not found in singularMessage',
          extra: singularMessage,
        });
      }

      if (!pluralMessage?.includes('%count%')) {
        checks?.logResult('useDynamicFlatList', {
          rule: 'FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE',
          message: 'Special string %count% not found in pluralMessage',
          extra: pluralMessage,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pluralMessage, singularMessage, checks?.logResult]);

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

    const message = isPlural(itemsCount) ? pluralMessage : singularMessage;
    const messageToAnnounce = message.replace('%count%', itemsCount.toString());

    AccessibilityInfo.announceForAccessibility(messageToAnnounce);

    lastItemsCount.current = itemsCount;
  }, [pluralMessage, singularMessage, data, isPlural]);

  const rowsCount = lastItemsCount.current || initialCount.current || 0;

  return __DEV__
    ? {
        rowsCount: rowsCount / numColumns,
        columnsCount: numColumns,
        style: checks?.debugStyle,
      }
    : {
        rowsCount: rowsCount / numColumns,
        columnsCount: numColumns,
      };
};

function simpleIsPlural(count: number) {
  return count !== 1;
}
