import React from 'react';
import {
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
} from 'react-native';

import {
  UseDynamicFlatList,
  useDynamicFlatList,
} from '../hooks/useDynamicFlatList';
import { ListWrapper } from './ListWrapper';

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
