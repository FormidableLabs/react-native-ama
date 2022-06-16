import React from 'react';
import {
  AccessibilityInfo,
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
} from 'react-native';

import { ListWrapper } from './ListWrapper';

export type FlatListProps<T> = RNFlatListProps<T> &
  (
    | ({
        listType: 'static';
      } & StaticFlatListProps)
    | ({
        listType: 'dynamic';
      } & DynamicFlatListProps)
  );

type StaticFlatListProps = {
  listType: 'static';
  rowsCount?: number;
  columnsCount?: number;
};

type DynamicFlatListProps = {
  accessibilitySingularMessage: string;
  accessibilityPluralMessage: string;
  isPlural?: (count: number) => boolean;
  columnsCount?: number;
};

const DynamicFlatList = React.forwardRef<
  RNFlatList,
  RNFlatListProps<any> & DynamicFlatListProps
>(
  (
    {
      data,
      accessibilitySingularMessage,
      accessibilityPluralMessage,
      isPlural = simpleIsPlural,
      columnsCount = 1,
      ...rest
    },
    ref,
  ) => {
    const isFirstRender = React.useRef(true);
    const initialCount = React.useRef(data?.length);
    const lastItemsCount = React.useRef(-42);

    React.useEffect(() => {
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
    ]);

    return (
      <ListWrapper
        rowsCount={lastItemsCount.current}
        columnsCount={columnsCount}>
        <RNFlatList data={data} {...rest} ref={ref} />
      </ListWrapper>
    );
  },
);

const StaticFlatList = React.forwardRef<
  RNFlatList,
  RNFlatListProps<any> & StaticFlatListProps
>(({ data, columnsCount, rowsCount, ...rest }, ref) => {
  const columns = columnsCount || 1;

  const rows = React.useMemo(() => {
    if (rowsCount) {
      return rowsCount;
    }

    const length = data?.length || 0;

    return columns > 1 && length > 0 ? length / columns : length;
  }, [columns, data?.length, rowsCount]);

  return (
    <ListWrapper rowsCount={rows} columnsCount={columns}>
      <RNFlatList data={data} {...rest} ref={ref} />
    </ListWrapper>
  );
});

export const FlatList = React.forwardRef<RNFlatList, FlatListProps<any>>(
  ({ listType, ...rest }, forwardRef) => {
    return listType === 'dynamic' ? (
      <DynamicFlatList ref={forwardRef} {...(rest as any)} />
    ) : (
      <StaticFlatList ref={forwardRef} {...(rest as any)} />
    );
  },
);

function simpleIsPlural(count: number) {
  return count !== 1;
}
