import { NativeModule, requireNativeModule } from 'expo';
import { ReactNativeAmaModuleEvents } from './ReactNativeAma.types';
import { Position } from './internals/types';

declare class ReactNativeAmaModule extends NativeModule<ReactNativeAmaModuleEvents> {
  start(config?: any): void;
  stop(): void;
  highlight(
    viewId: number,
    mode: 'background' | 'border' | 'both',
    color: string,
    issueCount: number,
  ): Promise<Position>;
  clearHighlight(viewId: number): void;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativeAmaModule>('ReactNativeAma');
