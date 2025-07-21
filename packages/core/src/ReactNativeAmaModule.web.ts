import { NativeModule, registerWebModule } from 'expo';
import { ReactNativeAmaModuleEvents } from './ReactNativeAma.types';
import type { A11yIssue } from './internals/types';

class ReactNativeAmaModule extends NativeModule<ReactNativeAmaModuleEvents> {
  PI = Math.PI;
  async setValueAsync(issues: A11yIssue[]): Promise<void> {
    this.emit('onA11yIssues', issues);
  }
  hello() {
    return 'Hello world! 👋';
  }
}

export default registerWebModule(ReactNativeAmaModule, 'ReactNativeAmaModule');
