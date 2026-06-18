import { useAMAContext } from '@react-native-ama/core';
import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { Spacer } from '../components/Spacer';
import { Text } from '../components/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme';

export const UseAMAContextScreen = () => {
  const {
    isBoldTextEnabled,
    isGrayscaleEnabled,
    isInvertColorsEnabled,
    isReduceMotionEnabled,
    isReduceTransparencyEnabled,
    isScreenReaderEnabled,
    isHighTextContrastEnabled,
    isDarkerSystemColorsEnabled,
  } = useAMAContext();

  return (
    <ScrollView style={styles.container}>
      <Text mt={8} mb={8}>
        AMA checks can be toggled on/off via the dev menu under Toggle React
        Native AMA
      </Text>
      <View style={styles.contentView}>
        <Text>isBoldTextEnabled: <Text bold>{`${isBoldTextEnabled}`}</Text></Text>
        <Spacer height="normal" />
        <Text>isGrayscaleEnabled: <Text bold>{`${isGrayscaleEnabled}`}</Text></Text>
        <Spacer height="normal" />
        <Text>isInvertColorsEnabled: <Text bold>{`${isInvertColorsEnabled}`}</Text></Text>
        <Spacer height="normal" />
        <Text>isReduceMotionEnabled: <Text bold>{`${isReduceMotionEnabled}`}</Text></Text>
        <Spacer height="normal" />
        <Text>
          isReduceTransparencyEnabled: <Text bold>{`${isReduceTransparencyEnabled}`}</Text>
        </Text>
        <Spacer height="normal" />
        <Text>isScreenReaderEnabled: <Text bold>{`${isScreenReaderEnabled}`}</Text></Text>
        <Spacer height="normal" />
        <Text>isHighTextContrastEnabled: <Text bold>{`${isHighTextContrastEnabled}`}</Text></Text>
        <Spacer height="normal" />
        <Text>isDarkerSystemColorsEnabled: <Text bold>{`${isDarkerSystemColorsEnabled}`}</Text></Text>
        <Spacer height="big" />

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.padding.big,
    marginTop: theme.padding.big,
  },
  contentView: {
    marginTop: theme.padding.big,
    flex: 1,
  },
});
