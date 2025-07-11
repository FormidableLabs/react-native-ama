import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { theme } from '../theme';
import { StyleProps } from 'react-native-reanimated';

type TextProps = Omit<RNTextProps, 'style'> & {
  mb?: number;
  mt?: number;
  bold?: boolean;
  style?: StyleProps
};

export const Text = ({ mb, mt, bold, style, ...props }: TextProps) => {
  return (
    <RNText
      {...props}
      style={{
        fontSize: theme.fontSize.normal,
        lineHeight: style?.fontSize ? style.fontSize * 1.3 : 24,
        marginBottom: mb,
        marginTop: mt,
        fontWeight: bold ? 600 : undefined,
        ...style,
      }}
    />
  );
};
