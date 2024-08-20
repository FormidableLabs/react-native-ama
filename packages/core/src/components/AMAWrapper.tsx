import * as React from 'react';
import { NativeModules, Platform, requireNativeComponent } from 'react-native';

const isAndroid = Platform.OS === 'android';

type AMAWrapperProps = React.PropsWithChildren;

const EmptyComponent: React.FC = ({
  children,
}: React.PropsWithChildren<{}>) => {
  return <>{children}</>;
};

console.info({ NativeModules });
const a = requireNativeComponent<AMAWrapperProps>('AMAWrapper');

console.info({ a });
export const AMAWrapper = isAndroid ? a : EmptyComponent;
