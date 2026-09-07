import { NativeModule, registerWebModule } from 'expo-modules-core';
import { AmaNodes, ReactNativeAmaModuleEvents } from './ReactNativeAma.types';

class ReactNativeAmaModule extends NativeModule<ReactNativeAmaModuleEvents> {
  PI = Math.PI;
  async setValueAsync(nodes: AmaNodes): Promise<void> {
    this.emit('onAmaNodes', nodes);
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ReactNativeAmaModule, 'ReactNativeAmaModule');
