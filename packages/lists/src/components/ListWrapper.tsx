import * as React from 'react';
import { Platform } from 'react-native';

type FlatListWrapperProps = React.PropsWithChildren<{
  rowsCount: number;
  columnsCount?: number;
}>;

const isAndroid = Platform.OS === 'android';

export const ListWrapper = ({ children }: FlatListWrapperProps) => {
  return <AMAFlatListWrapper>{children}</AMAFlatListWrapper>;
};

/*
 * Used instead of React.Fragment to avoid the warning:
 *  ...React.Fragment can only have `key` and `children` props.
 */
const EmptyComponent: React.FC = ({
  children,
}: React.PropsWithChildren<{}>) => {
  return <>{children}</>;
};

const AMAFlatListWrapper = EmptyComponent;
