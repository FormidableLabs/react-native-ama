import { NativeModule, requireNativeModule } from 'expo';

declare class ReactNativeAmaModule extends NativeModule {
  start(config?: any): void;
  stop(): void;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativeAmaModule>('ReactNativeAma');
