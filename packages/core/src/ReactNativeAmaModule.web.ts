import { registerWebModule, NativeModule } from 'expo';

import { ReactNativeAmaModuleEvents } from './ReactNativeAma.types';

class ReactNativeAmaModule extends NativeModule<ReactNativeAmaModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ReactNativeAmaModule, 'ReactNativeAmaModule');
