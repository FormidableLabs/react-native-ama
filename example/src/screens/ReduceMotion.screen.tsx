import React, { useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { Pressable, Text } from 'react-native-ama';
import { useAccessibleAnimation } from 'react-native-ama';

import { CTAPressable } from '../components/CTAPressable';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

const MAX_LINE_WIDTH = Dimensions.get('window').width - theme.padding.big * 2;

export const ReduceMotionScreen = () => {
  const [overlayProgressValue, setOverlayProgressValue] =
    React.useState<Animated.Value | null>(null);
  const animationProgress = useRef<Animated.Value>(
    new Animated.Value(0),
  ).current;
  const { play, animatedStyle, progress } = useAccessibleAnimation({
    duration: 300,
    useNativeDriver: true,
    from: {
      opacity: 0,
      transform: [{ translateY: 200 }],
    },
    to: {
      opacity: 1,
      transform: [{ translateY: 0 }],
    },
  });
  const {
    play: play2,
    animatedStyle: animatedStyle2,
    progress: progress2,
  } = useAccessibleAnimation({
    duration: 300,
    useNativeDriver: false,
    from: {
      opacity: 0,
      width: 0,
      left: MAX_LINE_WIDTH / 2,
    },
    to: {
      opacity: 1,
      width: MAX_LINE_WIDTH,
      left: theme.padding.big,
    },
    skipIfReduceMotionEnabled: true,
  });
  const { play: play3, animatedStyle: animatedStyle3 } = useAccessibleAnimation(
    {
      duration: 300,
      useNativeDriver: false,
      from: {
        height: 2,
        marginTop: -1,
      },
      to: {
        height: 200,
        marginTop: -100,
      },
    },
  );

  const overlayStyle = {
    opacity: overlayProgressValue || 0,
  };

  const playAnimation1 = () => {
    setOverlayProgressValue(progress);
    play().start();
  };

  const playAnimation2 = () => {
    setOverlayProgressValue(progress2);

    play2().start(() => {
      play3().start();
    });
  };

  const reverseAnimation = () => {
    if (overlayProgressValue === progress) {
      play(0).start(() => setOverlayProgressValue(null));
    } else {
      play3(0).start(() => {
        play2(0).start(() => {
          setOverlayProgressValue(null);
        });
      });
    }
  };

  return (
    <>
      <View style={styles.container}>
        <CTAPressable title="Test Animation 1" onPress={playAnimation1} />
        <Spacer height="big" />
        <CTAPressable title="Test Animation 2" onPress={playAnimation2} />
      </View>
      {overlayProgressValue ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close popup"
          style={StyleSheet.absoluteFill}
          onPress={() => reverseAnimation()}>
          <Animated.View style={[styles.overlay, overlayStyle]} />
        </Pressable>
      ) : null}
      <Animated.View style={[styles.animation1, animatedStyle]}>
        <Text style={styles.text}>Content goes here</Text>
      </Animated.View>
      <Animated.View
        style={[styles.animation2, animatedStyle2, animatedStyle3]}>
        <Text style={styles.text}>Another animation</Text>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.padding.big,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    ...StyleSheet.absoluteFillObject,
  },
  animation1: {
    backgroundColor: theme.color.hover,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    bottom: 0,
    height: 200,
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  animation2: {
    backgroundColor: theme.color.hover,
    borderRadius: 20,
    height: 200,
    width: 100,
    left: theme.padding.big,
    top: '50%',
    marginTop: -100,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: theme.color.white,
  },
});
