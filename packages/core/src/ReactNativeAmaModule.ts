import { NativeModule, requireNativeModule } from 'expo';

import { ReactNativeAmaModuleEvents } from './ReactNativeAma.types';

declare class ReactNativeAmaModule extends NativeModule<ReactNativeAmaModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativeAmaModule>('ReactNativeAma');
