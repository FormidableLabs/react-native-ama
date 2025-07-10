import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

type TextProps = RNTextProps & {
  mb?: number;
  mt?: number;
};

export const Text = ({ mb, mt, ...props }: TextProps) => {
  return (
    <RNText
      {...props}
      style={{ fontSize: 16, lineHeight: 24, marginBottom: mb, marginTop: mt }}
    />
  );
};
