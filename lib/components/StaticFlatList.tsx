import React from 'react';
import {
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
} from 'react-native';

import { ListWrapper } from './ListWrapper';

export type StaticFlatListProps = {
  rowsCount?: number;
  columnsCount?: number;
};

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
