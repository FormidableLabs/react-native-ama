import React from 'react';
import { Platform, requireNativeComponent } from 'react-native';

type FlatListWrapperProps = {
  rowsCount: number;
  columnsCount: number;
};

const isAndroid = Platform.OS === 'android';

export const ListWrapper: React.FC<FlatListWrapperProps> = ({
  children,
  rowsCount,
  columnsCount,
}) => {
  return (
    <AMAFlatListWrapper rowsCount={rowsCount} columnsCount={columnsCount}>
      {children}
    </AMAFlatListWrapper>
  );
};

/*
 * Used instead of React.Fragment to avoid the warning:
 *  ...React.Fragment can only have `key` and `children` props.
 */
const EmptyComponent: React.FC = ({ children }) => {
  return <>{children}</>;
};

const AMAFlatListWrapper = isAndroid
  ? requireNativeComponent<FlatListWrapperProps>('AmaFlatListWrapper')
  : EmptyComponent;
