import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, useAMAContext } from 'react-native-ama';

import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

export const UseAMAContextScreen = () => {
  const {
    isBoldTextEnabled,
    isGrayscaleEnabled,
    isInvertColorsEnabled,
    isReduceMotionEnabled,
    isReduceTransparencyEnabled,
    isScreenReaderEnabled,
  } = useAMAContext();

  return (
    <View style={styles.centeredView}>
      <Text>isBoldTextEnabled: {`${isBoldTextEnabled}`}</Text>
      <Spacer height="normal" />
      <Text>isGrayscaleEnabled: {`${isGrayscaleEnabled}`}</Text>
      <Spacer height="normal" />
      <Text>isInvertColorsEnabled: {`${isInvertColorsEnabled}`}</Text>
      <Spacer height="normal" />
      <Text>isReduceMotionEnabled: {`${isReduceMotionEnabled}`}</Text>
      <Spacer height="normal" />
      <Text>
        isReduceTransparencyEnabled: {`${isReduceTransparencyEnabled}`}
      </Text>
      <Spacer height="normal" />
      <Text>isScreenReaderEnabled: {`${isScreenReaderEnabled}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timedContent: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    padding: theme.padding.big,
    paddingBottom: 48,
    width: '100%',
  },
});
