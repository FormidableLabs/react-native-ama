import React from 'react';
import { Platform, requireNativeComponent } from 'react-native';

type FlatListWrapperProps = {
  itemsCount: number;
};

const isAndroid = Platform.OS === 'android';

export const FlatListWrapper: React.FC<FlatListWrapperProps> = ({
  children,
  itemsCount,
}) => {
  return (
    <AMAFlatListWrapper itemsCount={itemsCount}>{children}</AMAFlatListWrapper>
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
