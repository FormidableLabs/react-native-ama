import { NativeModule, requireNativeModule } from 'expo';
import { ReactNativeAmaModuleEvents } from './ReactNativeAma.types';

declare class ReactNativeAmaModule extends NativeModule {
  start(config?: any): void;
  stop(): void;
  highlightComponent(viewId: number): Promise;
  clearHighlight(viewId: number): void;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativeAmaModule>('ReactNativeAma');
