import React, { useRef } from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { theme } from '../theme';
import { StyleProps } from 'react-native-reanimated';
import { useFocus } from '@react-native-ama/core';

type TextProps = Omit<RNTextProps, 'style'> & {
  mb?: number;
  mt?: number;
  bold?: boolean;
  style?: StyleProps;
  white?: boolean;
  autoFocus?: boolean;
};

export const Text = ({
  mb,
  mt,
  bold,
  style,
  white,
  autoFocus,
  ...props
}: TextProps) => {
  const ref = useRef<RNText>(null);

  useFocus(autoFocus ? ref : undefined);

  return (
    <RNText
      {...props}
      ref={ref}
      style={{
        fontSize: theme.fontSize.normal,
        lineHeight: style?.fontSize ? style.fontSize * 1.3 : 24,
        marginBottom: mb,
        marginTop: mt,
        fontWeight: bold ? 600 : undefined,
        color: white ? theme.color.white : undefined,
        ...style,
      }}
    />
  );
};
