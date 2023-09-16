import { useReanimatedTiming } from '@react-native-ama/animations';
import { Text } from '@react-native-ama/react-native';
import * as React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { CTAPressable } from '../components/CTAPressable';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

export const UseReanimatedTimingScreen = () => {
  const value = useSharedValue(0);
  const { withTiming, withSpring } = useReanimatedTiming();

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: value.value }],
    };
  });

  const getFinalPosition = () => {
    return value.value === 0
      ? Dimensions.get('window').width - theme.padding.big * 2 - 100
      : 0;
  };

  const testWithTiming = () => {
    value.value = withTiming('translateX', getFinalPosition(), {
      duration: 300,
    });
  };

  const testWithSpring = () => {
    value.value = withSpring('translateX', getFinalPosition());
  };

  return (
    <View style={styles.view}>
      <Spacer height="big" />
      <Text style={styles.intro}>
        This example shows how to use the{' '}
        <Text onPress={() => {}}>getAnimationDuration</Text> with Reanimated for
        a more accessible animations.
      </Text>
      <Spacer height="big" />
      <Animated.View style={[styles.box, animatedStyles]} />

      <Spacer height="big" />
      <CTAPressable title="Test: withTiming" onPress={testWithTiming} />
      <Spacer height="normal" />
      <CTAPressable title="Test: withSpring" onPress={testWithSpring} />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: theme.padding.big,
  },
  box: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: theme.color.mixed,
  },
  intro: {
    lineHeight: theme.lineHeight.medium,
  },
});
