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
  visible: boolean;
  onRequestClose: () => void;
  bottomSheetStyle?: ViewStyle | ViewStyle[];
  lineStyle?: ViewStyle | ViewStyle[];
  closeActionAccessibilityLabel: string;
  headerComponent?: JSX.Element;
  scrollViewStyle?: ViewStyle | ViewStyle[];
  animationDuration?: number;
  overlayStyle?: ViewStyle | ViewStyle[];
  lineComponent?: JSX.Element | 'none';
  closeDistance?: number;
  scrollEnabled?: boolean;
  testID?: string;
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
  closeDistance = 0.7,
  lineComponent,
  scrollEnabled = false,
  testID,
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
      style={wrapperStyle}
      testID={testID}>
      {showContent ? (
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AnimatedContainer
            style={styles.overlay}
            from={{ opacity: 0 }}
            to={{ opacity: 1 }}
            duration={animationDuration}>
            <Pressable
              style={[styles.closeButton, overlayStyle]}
              accessibilityRole="button"
              accessibilityLabel={closeActionAccessibilityLabel}
              onPress={onRequestClose}
              testID={`${testID}-overlay`}
            />
          </AnimatedContainer>
          <Animated.View
            style={[styles.contentWrapper, animatedStyle]}
            testID={`${testID}-wrapper`}>
            <AnimatedContainer
              from={{ transform: [{ translateY: 'targetHeight' }] }}
              to={{ transform: [{ translateY: 0 }] }}
              exitFrom={{
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
                  onRequestClose={onRequestClose}>
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
}>;

const GestureHandler = ({
  translateY,
  closeDistance,
  contentHeight,
  children,
  onRequestClose,
}: GestureHandlerProps) => {
  const { gestureHandler } = useBottomSheetGestureHandler({
    translateY,
    closeDistance,
    contentHeight,
    onRequestClose,
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
