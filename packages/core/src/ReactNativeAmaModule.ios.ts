import { NativeEventEmitter, NativeModules } from 'react-native';
import { ReactNativeAmaModuleEvents } from './ReactNativeAma.types';
import { Position } from './internals/types';

type ReactNativeAmaNativeModule = {
  start(config?: any): void;
  stop(): void;
  highlight(
    viewId: number,
    mode: 'background' | 'border' | 'both',
    color: string,
    issueCount: number,
  ): Promise<Position>;
  clearHighlight(viewId: number): void;
};

// The legacy/classic RN bridge module registered by ReactNativeAmaModule.m
// (see packages/core/ios/ReactNativeAmaModule.m and .swift).
const ReactNativeAma: ReactNativeAmaNativeModule =
  NativeModules.ReactNativeAmaModule;

const eventEmitter = new NativeEventEmitter(NativeModules.ReactNativeAmaModule);

const ReactNativeAmaModule = {
  start(config?: any): void {
    ReactNativeAma.start(config);
  },
  stop(): void {
    ReactNativeAma.stop();
  },
  highlight(
    viewId: number,
    mode: 'background' | 'border' | 'both',
    color: string,
    issueCount: number,
  ): Promise<Position> {
    return ReactNativeAma.highlight(viewId, mode, color, issueCount);
  },
  clearHighlight(viewId: number): void {
    ReactNativeAma.clearHighlight(viewId);
  },
  addListener<EventName extends keyof ReactNativeAmaModuleEvents>(
    eventName: EventName,
    listener: ReactNativeAmaModuleEvents[EventName],
  ) {
    return eventEmitter.addListener(eventName, listener as (...args: any[]) => void);
  },
};

export default ReactNativeAmaModule;
