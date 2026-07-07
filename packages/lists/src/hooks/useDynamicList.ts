import React from 'react';
import { AccessibilityInfo } from 'react-native';

type FlatListRule =
  | 'FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE'
  | 'FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE';

let _useAMAContext:
  | (() => {
      trackError?: (rule: FlatListRule, ref?: React.RefObject<any>) => void;
    } | null)
  | null = null;
try {

  _useAMAContext = require('@react-native-ama/core').useAMAContext;
} catch {
  // core is an optional peer — fall back to null
}

const getTrackError = () => {
  try {
    return _useAMAContext?.()?.trackError ?? null;
  } catch {
    return null;
  }
};

export type UseDynamicList = {
  data: ArrayLike<any>;
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
  const trackError = __DEV__ ? getTrackError() : null;

  __DEV__ &&
    React.useEffect(() => {
      if (!singularMessage?.includes('%count%')) {
        const rule = 'FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE';

        if (trackError) {
          trackError(rule);
        } else {
          console.error('useDynamicFlatList', {
            rule,
            message: 'Special string %count% not found in singularMessage',
            extra: singularMessage,
          });
        }
      }

      if (!pluralMessage?.includes('%count%')) {
        const rule = 'FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE';

        if (trackError) {
          trackError(rule);
        } else {
          console.error('useDynamicFlatList', {
            rule,
            message: 'Special string %count% not found in pluralMessage',
            extra: pluralMessage,
          });
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pluralMessage, singularMessage]);

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

  return {
    rowsCount: rowsCount / numColumns,
    columnsCount: numColumns,
  };
};

function simpleIsPlural(count: number) {
  return count !== 1;
}
