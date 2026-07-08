import React from 'react';
import { PressableProps, Pressable as RNPressable } from 'react-native';

export const Pressable = (props: PressableProps) => {
  return (
    <RNPressable
      hitSlop={{ left: 12, top: 12, right: 12, bottom: 12 }}
      {...props}
    />
  );
};
