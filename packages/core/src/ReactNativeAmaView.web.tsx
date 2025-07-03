import * as React from 'react';

import { ReactNativeAmaViewProps } from './ReactNativeAma.types';

export default function ReactNativeAmaView(props: ReactNativeAmaViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
