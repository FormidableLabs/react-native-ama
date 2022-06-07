import React from 'react';
import {
  AccessibilityInfo,
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
} from 'react-native';

import { FlatListWrapper } from './FlatListWrapper';

type FlatListProps<T> = RNFlatListProps<T> &
  (
    | {
        listType: 'static';
      }
    | {
        listType: 'dynamic';
        accessibilitySingularMessage: string;
        accessibilityPluralMessage: string;
        isPlural?: (count: number) => boolean;
      }
  );

export const FlatList = React.forwardRef<RNFlatList, FlatListProps<any>>(
  (
    {
      data,
      listType,
      // @ts-ignore
      accessibilitySingularMessage,
      // @ts-ignore
      accessibilityPluralMessage,
      // @ts-ignore
      isPlural = simpleIsPlural,
      ...rest
    },
    ref,
  ) => {
    const isFirstRender = React.useRef(true);
    const initialCount = React.useRef(data?.length);
    const lastItemsCount = React.useRef(-42);

    React.useEffect(() => {
      if (listType !== 'dynamic') {
        return;
      }

      const itemsCount = data?.length || 0;

      if (
        isFirstRender.current ||
        itemsCount === initialCount.current ||
        itemsCount === lastItemsCount.current
      ) {
        isFirstRender.current = false;
        lastItemsCount.current = -42;

        return;
      }

      const message = isPlural(itemsCount)
        ? accessibilityPluralMessage
        : accessibilitySingularMessage;
      const messageToAnnounce = message.replace(
        '%count%',
        itemsCount.toString(),
      );

      AccessibilityInfo.announceForAccessibility(messageToAnnounce);

      lastItemsCount.current = itemsCount;
    }, [
      accessibilityPluralMessage,
      accessibilitySingularMessage,
      data,
      isPlural,
      listType,
    ]);

    return (
      <FlatListWrapper itemsCount={data?.length || 0}>
        <RNFlatList data={data} {...rest} ref={ref} />
      </FlatListWrapper>
    );
  },
);

function simpleIsPlural(count: number) {
  return count !== 1;
}
