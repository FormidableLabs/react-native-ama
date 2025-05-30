import React from 'react';
import { FlatList, FlatListProps } from 'react-native';

export type StaticFlatListProps = {
  rowsCount?: number;
  numColumns?: number;
};

export const StaticFlatList = React.forwardRef<
  FlatList,
  FlatListProps<any> & StaticFlatListProps
>(({ data, numColumns, rowsCount, ...rest }, ref) => {
  const columns = numColumns || 1;

  // @ts-ignore
  const rows = React.useMemo(() => {
    if (rowsCount) {
      return rowsCount;
    }

    const length = data?.length || 0;

    return Math.ceil(columns > 1 && length > 0 ? length / columns : length);
  }, [columns, data?.length, rowsCount]);

  return <FlatList data={data} {...rest} ref={ref} />;
});
