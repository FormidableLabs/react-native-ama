import * as React from 'react';
import { Platform, requireNativeComponent } from 'react-native';

const isAndroid = Platform.OS === 'android';

type AMAWrapperProps = React.PropsWithChildren;

const EmptyComponent: React.FC = ({
  children,
}: React.PropsWithChildren<{}>) => {
  return <>{children}</>;
};

export const AMAWrapper = isAndroid
  ? requireNativeComponent<AMAWrapperProps>('AMAWrapper')
  : EmptyComponent;
