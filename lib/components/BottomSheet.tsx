import * as React from 'react';
import type { PropsWithChildren } from 'react';
import {
  LayoutChangeEvent,
  Modal,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  ScrollView,
} from 'react-native-gesture-handler';
import {
  SharedValue,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

import { AnimatedContainer } from '../components/AnimatedContainer';
import { useChecks } from '../internal/useChecks';
import { MINIMUM_TOUCHABLE_SIZE } from '../utils/minimumTouchableSize';

type BottomSheetProps = {
  visible: boolean;
  onRequestClose: () => void;
  bottomSheetStyle?: ViewStyle | ViewStyle[];
  lineStyle?: ViewStyle | ViewStyle[];
  closeActionAccessibilityLabel: string;
  headerComponent: JSX.Element;
  scrollViewStyle?: ViewStyle | ViewStyle[];
  animationDuration?: number;
  lineComponent?: JSX.Element | 'none';
  closeDistance?: number;
  scrollEnabled?: boolean;
};

export const BottomSheet = ({
  children,
  visible,
  onRequestClose,
  bottomSheetStyle = {},
  lineStyle = {},
  closeActionAccessibilityLabel,
  headerComponent,
  scrollViewStyle = {},
  animationDuration = 300,
  closeDistance = 0.7,
  lineComponent,
  scrollEnabled = false,
}: React.PropsWithChildren<BottomSheetProps>) => {
  const [showContent, setShowContent] = React.useState(visible);
  const [isModalVisible, setIsModalVisible] = React.useState(true);
  let wrapperStyle = {};
  const translateY = useSharedValue(0);
  const contentHeight = useSharedValue(0);

  /*block:start*/
  const { noUndefinedProperty } = useChecks();

  const debugStyle = {
    ...noUndefinedProperty({
      properties: { closeActionAccessibilityLabel },
      property: 'closeActionAccessibilityLabel',
      rule: 'BOTTOM_SHEET_CLOSE_ACTION',
    }),
  };

  // @ts-ignore
  wrapperStyle = [debugStyle];
  /*block:end*/

  React.useEffect(() => {
    if (visible) {
      translateY.value = 0;

      setIsModalVisible(true);
      setShowContent(true);
    } else {
      setShowContent(false);

      setTimeout(() => setIsModalVisible(false), animationDuration);
    }
  }, [animationDuration, translateY, visible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const handleOnLayout = (event: LayoutChangeEvent) => {
    contentHeight.value = event.nativeEvent.layout.height;
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={onRequestClose}
      style={wrapperStyle}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {showContent ? (
          <>
            <AnimatedContainer
              style={styles.overlay}
              from={{ opacity: 0 }}
              to={{ opacity: 1 }}
              duration={animationDuration}>
              <Pressable
                style={styles.closeButton}
                accessibilityRole="button"
                accessibilityLabel={closeActionAccessibilityLabel}
                onPress={onRequestClose}
              />
            </AnimatedContainer>
            <Animated.View style={[styles.contentWrapper, animatedStyle]}>
              <AnimatedContainer
                from={{ transform: [{ translateY: 'targetHeight' }] }}
                to={{ transform: [{ translateY: 0 }] }}
                exitFrom={{
                  transform: [{ translateY: 'currentHeight' }],
                }}
                duration={animationDuration}
                style={[styles.content, bottomSheetStyle]}
                onLayout={handleOnLayout}>
                {lineComponent === 'none' ? null : (
                  <GestureHandler
                    translateY={translateY}
                    closeDistance={closeDistance}
                    contentHeight={contentHeight}
                    onRequestClose={onRequestClose}>
                    {lineComponent || <View style={[styles.line, lineStyle]} />}
                  </GestureHandler>
                )}
                {headerComponent}
                <ScrollView
                  style={scrollViewStyle}
                  scrollEnabled={scrollEnabled}>
                  {children}
                </ScrollView>
              </AnimatedContainer>
            </Animated.View>
          </>
        ) : null}
      </GestureHandlerRootView>
    </Modal>
  );
};

type GestureHandlerProps = PropsWithChildren<{
  translateY: SharedValue<number>;
  contentHeight: SharedValue<number>;
  closeDistance: number;
  onRequestClose: () => void;
}>;

const GestureHandler = ({
  translateY,
  closeDistance,
  contentHeight,
  children,
  onRequestClose,
}: GestureHandlerProps) => {
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { y: number }
  >({
    onStart: (_, context) => {
      context.y = translateY.value;
    },
    onActive: (event, context) => {
      translateY.value = Math.max(0, context.y + event.translationY);
    },
    onEnd: _ => {
      const minimumDistanceToClose = contentHeight.value * (1 - closeDistance);
      const shouldCloseBottomSheet = translateY.value > minimumDistanceToClose;

      if (shouldCloseBottomSheet) {
        runOnJS(onRequestClose)();
      } else {
        translateY.value = withTiming(0);
      }
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={{ minHeight: MINIMUM_TOUCHABLE_SIZE, justifyContent: 'center' }}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
  },
  closeButton: {
    flex: 1,
  },
  contentWrapper: {
    flexDirection: 'column',
    flex: 1,
    maxHeight: '80%',
    position: 'absolute',
    bottom: 24,
    alignSelf: 'flex-end',
    width: '100%',
  },
  content: {
    width: '100%',
    backgroundColor: '#fff',
  },
  line: {
    width: 48,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginBottom: 24,
    borderRadius: 2,
    marginTop: 12,
  },
});
