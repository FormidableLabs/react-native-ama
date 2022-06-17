import React from 'react';
import type {
  FlatList as RNFlatList,
  FlatListProps as RNFlatListProps,
} from 'react-native';

import type { UseDynamicList } from '../hooks/useDynamicList';
import { DynamicFlatList } from './DynamicFlatList';
import { StaticFlatList, StaticFlatListProps } from './StaticFlatList';

export type FlatListProps<T> = RNFlatListProps<T> &
  (
    | ({
        listType: 'static';
      } & StaticFlatListProps)
    | ({
        listType: 'dynamic';
      } & UseDynamicList)
  );

export const FlatList = React.forwardRef<RNFlatList, FlatListProps<any>>(
  ({ listType, ...rest }, forwardRef) => {
    return listType === 'dynamic' ? (
      <DynamicFlatList ref={forwardRef} {...(rest as any)} />
    ) : (
      <StaticFlatList ref={forwardRef} {...(rest as any)} />
    );
  },
);
