import React from 'react';
import { ColorValue, TextProps, requireNativeComponent } from 'react-native';

type SpanProps = {
  style: Pick<TextProps, 'style'>['style'];
  linkColor?: ColorValue | undefined;
  linkBackgroundColor?: ColorValue | undefined;
};

export const Span: React.FC<SpanProps> = ({ children, ...rest }) => {
  const parts: SpanPart[] = [];
  const callbacks: any[] = [];

  React.Children.forEach(children, child => {
    const part = extractParts(child);

    if (part) {
      // @ts-ignore
      parts.push(part.item);
      callbacks.push(part.onPress);
    }
  });

  const handleOnPress = (event: AMASpanViewEvent) => {
    const { spanIndex } = event.nativeEvent;
    const onPress = callbacks?.[spanIndex];

    if (onPress) {
      onPress();
    }
  };

  return <AMASpan {...rest} onPress={handleOnPress} content={parts || []} />;
};

type AMASpanProps = {
  content: SpanPart[];
  style: Pick<TextProps, 'style'>['style'];
  onPress: Function;
};

type SpanPart = {
  text: string;
  onPress?: Function;
};

type AMASpanViewEvent = {
  nativeEvent: {
    spanIndex: number;
  };
};

const AMASpan = requireNativeComponent<AMASpanProps>('AMASpan');

function extractParts(child: React.ReactNode) {
  if (typeof child === 'string') {
    return { item: { text: child } };
  }

  // @ts-ignore
  if (typeof child === 'object' && child?.type?.name === 'ClickableSpan') {
    return {
      // @ts-ignore
      item: { text: child?.props?.children, onPress: 'link' },
      // @ts-ignore
      onPress: child?.props?.onPress,
    };
  }

  if (__DEV__) {
    throw new Error(
      'Only String & <ClickableSpan /> components are supported as child of <Span />!',
    );
  }
}
