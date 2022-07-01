/* eslint-disable react-native/no-inline-styles */
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
  ScrollView,
} from 'react-native-gesture-handler';
import {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

import { AnimatedContainer } from '../components/AnimatedContainer';
import { useBottomSheetGestureHandler } from '../hooks/useBottomSheetGestureHandler';
import { useChecks } from '../internal/useChecks';
import { MINIMUM_TOUCHABLE_SIZE } from '../utils/minimumTouchableSize';

type BottomSheetProps = {
  animationDuration?: number;
  bottomSheetStyle?: ViewStyle | ViewStyle[];
  closeActionAccessibilityLabel: string;
  closeDistance?: number;
  headerComponent?: JSX.Element;
  lineComponent?: JSX.Element | 'none';
  lineStyle?: ViewStyle | ViewStyle[];
  onRequestClose: () => void;
  overlayStyle?: ViewStyle | ViewStyle[];
  scrollEnabled?: boolean;
  scrollViewStyle?: ViewStyle | ViewStyle[];
  testID?: string;
  visible: boolean;
};

export const BottomSheet = ({
  children,
  visible,
  onRequestClose,
  lineStyle = {},
  bottomSheetStyle = {},
  scrollViewStyle = {},
  overlayStyle,
  closeActionAccessibilityLabel,
  headerComponent,
  animationDuration = 300,
  closeDistance = 0.3,
  lineComponent,
  scrollEnabled = false,
  testID,
}: React.PropsWithChildren<BottomSheetProps>) => {
  const [showContent, setShowContent] = React.useState(visible);
  const [isModalVisible, setIsModalVisible] = React.useState(true);
  const translateY = useSharedValue(0);
  const contentHeight = useSharedValue(0);

  const checks = __DEV__ ? useChecks?.() : null;
  const wrapperStyle = __DEV__ ? checks?.debugStyle : {};

  __DEV__ &&
    checks?.noUndefinedProperty({
      properties: { closeActionAccessibilityLabel },
      property: 'closeActionAccessibilityLabel',
      rule: 'BOTTOM_SHEET_CLOSE_ACTION',
    });
  __DEV__ &&
    checks?.noUppercaseStringChecker({
      text: closeActionAccessibilityLabel,
    });

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
      testID={testID}>
      {showContent ? (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AnimatedContainer
            style={[styles.overlay, overlayStyle, wrapperStyle]}
            from={{ opacity: 0 }}
            to={{ opacity: 1 }}
            testID={`${testID}-overlay-wrapper`}
            duration={animationDuration}>
            <Pressable
              style={styles.closeButton}
              accessibilityRole="button"
              accessibilityLabel={closeActionAccessibilityLabel}
              onPress={onRequestClose}
              testID={`${testID}-overlay-buttom`}
            />
          </AnimatedContainer>
          <Animated.View
            style={[styles.contentWrapper, animatedStyle]}
            testID={`${testID}-wrapper`}>
            <AnimatedContainer
              from={{ transform: [{ translateY: 'targetHeight' }] }}
              to={{ transform: [{ translateY: 0 }] }}
              exit={{
                transform: [{ translateY: 'currentHeight' }],
              }}
              duration={animationDuration}
              style={[styles.content, bottomSheetStyle]}
              onLayout={handleOnLayout}
              testID={`${testID}-panel`}>
              {lineComponent === 'none' ? null : (
                <GestureHandler
                  translateY={translateY}
                  closeDistance={closeDistance}
                  contentHeight={contentHeight}
                  onRequestClose={onRequestClose}
                  testID={`${testID}-gesture-handler`}>
                  {lineComponent || (
                    <View
                      style={[styles.line, lineStyle]}
                      testID={`${testID}-line`}
                    />
                  )}
                </GestureHandler>
              )}
              {headerComponent}
              <ScrollView
                style={scrollViewStyle}
                scrollEnabled={scrollEnabled}
                testID={`${testID}-scrollview`}>
                {children}
              </ScrollView>
            </AnimatedContainer>
          </Animated.View>
        </GestureHandlerRootView>
      ) : null}
    </Modal>
  );
};

type GestureHandlerProps = PropsWithChildren<{
  translateY: SharedValue<number>;
  contentHeight: SharedValue<number>;
  closeDistance: number;
  onRequestClose: () => void;
  testID?: string;
}>;

const GestureHandler = ({
  translateY,
  closeDistance,
  contentHeight,
  children,
  onRequestClose,
  testID,
}: GestureHandlerProps) => {
  const { gestureHandler } = useBottomSheetGestureHandler({
    translateY,
    closeDistance,
    contentHeight,
    onRequestClose,
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} testID={testID}>
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
