import React from 'react';
import {
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
} from 'react-native';

import type { UseDynamicFlatList } from '../hooks/useDynamicFlatList';
import { useDynamicFlatList } from '../hooks/useDynamicFlatList';
import { ListWrapper } from './ListWrapper';

export type FlatListProps<T> = RNFlatListProps<T> &
  (
    | ({
        listType: 'static';
      } & StaticFlatListProps)
    | ({
        listType: 'dynamic';
      } & UseDynamicFlatList)
  );

type StaticFlatListProps = {
  rowsCount?: number;
  columnsCount?: number;
};

export const DynamicFlatList = React.forwardRef<
  RNFlatList,
  RNFlatListProps<any> & UseDynamicFlatList
>(
  (
    {
      data,
      accessibilitySingularMessage,
      accessibilityPluralMessage,
      isPlural,
      columns,
      ...rest
    },
    ref,
  ) => {
    const { rowsCount, columnsCount } = useDynamicFlatList({
      data,
      accessibilityPluralMessage,
      accessibilitySingularMessage,
      columns,
      isPlural,
    });

    return (
      <ListWrapper rowsCount={rowsCount} columnsCount={columnsCount}>
        <RNFlatList data={data} {...rest} ref={ref} />
      </ListWrapper>
    );
  },
);

export const StaticFlatList = React.forwardRef<
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
