import React from 'react';
import { TextProps, requireNativeComponent } from 'react-native';

type AMASpanProps = {
  content: SpanItem[];
  style: Pick<TextProps, 'style'>;
};

type SpanItem = {
  text: string;
  onPress?: any;
};

const AMASpan = requireNativeComponent<AMASpanProps>('AMASpan');

export const Span: React.FC<{ style: Pick<TextProps, 'style'> }> = ({
  children,
  style,
}) => {
  const parts = React.Children.map(children, child => {
    if (typeof child === 'string') {
      return { text: child };
    }

    // @ts-ignore
    if (typeof child === 'object' && child?.type?.name === 'ClickableSpan') {
      // @ts-ignore
      return { text: child?.props?.children, onPress: 'ciao' };
    }

    if (__DEV__) {
      throw new Error(
        'Only String & <ClickableSpan /> components are supported as child of <Span />!',
      );
    }
  });

  return <AMASpan style={style} content={parts || []} />;
};
