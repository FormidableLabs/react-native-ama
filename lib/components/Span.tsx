import React from 'react';
import {
  ColorValue,
  Platform,
  Text,
  TextProps,
  requireNativeComponent,
} from 'react-native';

type SpanProps = {
  style?: Pick<TextProps, 'style'>['style'];
  linkColor?: ColorValue | undefined;
  linkBackgroundColor?: ColorValue | undefined;
  linkStyle?: LinkStyle;
};

const isAndroid = Platform.OS === 'android';

const AndroidSpan: React.FC<SpanProps> = ({ children, ...rest }) => {
  const parts: TextPart[] = [];
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

  return <AMASpan {...rest} onPress={handleOnPress} text={parts} />;
};

export enum LinkStyle {
  NORMAL,
  BOLD,
  ITALIC,
  BOLD_ITALIC,
}

type NativeAMASpanProps = {
  text: TextPart[];
  style?: Pick<TextProps, 'style'>['style'];
  onPress: Function;
};

type TextPart = {
  text: string;
  onPress?: Function;
};

type AMASpanViewEvent = {
  nativeEvent: {
    spanIndex: number;
  };
};

const AMASpan = requireNativeComponent<NativeAMASpanProps>('AMASpan');

export const Span = isAndroid ? AndroidSpan : Text;

type ClickableSpanProps = {
  onPress: Function;
};

const AndroidClickableSpan: React.FC<ClickableSpanProps> = () => {
  return null;
};

export const ClickableSpan = isAndroid ? AndroidClickableSpan : Text;

function extractParts(child: React.ReactNode) {
  if (typeof child === 'string') {
    return { item: { text: child } };
  }

  if (
    typeof child === 'object' &&
    // @ts-ignore
    child?.type?.name === 'AndroidClickableSpan'
  ) {
    return {
      // @ts-ignore
      item: { text: child?.props?.children, onPress: 'link' },
      // @ts-ignore
      onPress: child?.props?.onPress,
    };
  }

  if (__DEV__) {
    console.info(child);
    throw new Error(
      'Only String & <ClickableSpan /> components are supported as child of <Span />!',
    );
  }

  return null;
}
