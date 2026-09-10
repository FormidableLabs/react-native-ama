import { ReactNativeAmaModuleEvents } from './ReactNativeAma.types';
import { Position } from './internals/types';

type ReactNativeAmaModuleType = {
  start(config?: any): void;
  stop(): void;
  highlight(
    viewId: number,
    mode: 'background' | 'border' | 'both',
    color: string,
    issueCount: number,
  ): Promise<Position>;
  clearHighlight(viewId: number): void;
  addListener<EventName extends keyof ReactNativeAmaModuleEvents>(
    eventName: EventName,
    listener: ReactNativeAmaModuleEvents[EventName],
  ): { remove(): void };
};

const unsupported = (): never => {
  throw new Error(
    'ReactNativeAmaModule: no platform-specific implementation was resolved for this platform.',
  );
};

const ReactNativeAmaModule: ReactNativeAmaModuleType = {
  start: unsupported,
  stop: unsupported,
  highlight: unsupported,
  clearHighlight: unsupported,
  addListener: unsupported,
};

export default ReactNativeAmaModule;
