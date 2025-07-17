/* eslint-disable react-native/no-inline-styles */

import { AnimatedContainer } from '@react-native-ama/animations';
import { useChecks, useTimedAction } from '@react-native-ama/core';
import * as React from 'react';
import type { PropsWithChildren } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Modal,
  ModalProps,
  Platform,
  Pressable,
  ScrollViewProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  ScrollView,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { useBottomSheetGestureHandler } from '../hooks/useBottomSheetGestureHandler';
import { useKeyboard } from '../hooks/useKeyboard';

export type BottomSheetProps = {
  animationDuration?: number;
  autoCloseDelay?: number;
  avoidKeyboard?: boolean;
  bottomSheetStyle?: ViewStyle | ViewStyle[];
  closeActionAccessibilityLabel: string;
  closeDistance?: number;
  footerComponent?: JSX.Element;
  handleComponent?: JSX.Element | 'none';
  handleStyle?: ViewStyle | ViewStyle[];
  headerComponent?: JSX.Element;
  maxHeight?: number;
  minVelocityToClose?: number;
  onBottomSheetHidden?: () => void;
  onClose: () => void;
  overlayOpacity?: number;
  overlayStyle?: ViewStyle | ViewStyle[];
  panGestureEnabled?: boolean;
  persistent?: boolean;
  hasScrollableContent?: boolean;
  scrollViewProps?: Omit<
    ScrollViewWrapperProps,
    'testID' | 'maxScrollViewHeight'
  >;
  testID?: string;
  topInset: number;
  visible: boolean;
  ref?: React.RefObject<BottomSheetActions>;
  shouldHandleKeyboardEvents?: boolean;
  supportedOrientations?: ModalProps['supportedOrientations'];
};

export type BottomSheetActions = {
  close: () => Promise<void>;
  isVisible: () => boolean;
};

const DEFAULT_MAX_HEIGHT = Dimensions.get('window').height * 0.9;
const isIOS = Platform.OS === 'ios';

export const BottomSheet = React.forwardRef<
  BottomSheetActions,
  React.PropsWithChildren<BottomSheetProps>
>(
  (
    {
      children,
      visible,
      onClose,
      handleStyle = {},
      bottomSheetStyle = {},
      overlayStyle,
      closeActionAccessibilityLabel,
      headerComponent,
      animationDuration = 300,
      closeDistance = 0.3,
      handleComponent,
      scrollViewProps,
      hasScrollableContent = true,
      persistent = false,
      autoCloseDelay,
      panGestureEnabled = true,
      testID,
      overlayOpacity = 1,
      footerComponent,
      avoidKeyboard,
      maxHeight = DEFAULT_MAX_HEIGHT,
      minVelocityToClose = 1000,
      topInset,
      onBottomSheetHidden,
      shouldHandleKeyboardEvents = true,
      supportedOrientations,
    },
    ref,
  ) => {
    // This is used to let Reanimated animate the view out, before removing it from the tree.
    const [renderContent, setRenderContent] = React.useState(visible);
    const [isModalVisible, setIsModalVisible] = React.useState(false);
    const translateY = useSharedValue(0);
    const contentHeight = useSharedValue(0);
    const dragOpacity = useSharedValue(0);
    const { onTimeout } = useTimedAction();
    const isMounted = React.useRef(false);
    const [headerHeight, setHeaderHeight] = React.useState(-1);
    const [footerHeight, setFooterHeight] = React.useState(-1);
    const [handleHeight, setHandleHeight] = React.useState(-1);
    const promiseResolver = React.useRef<(() => void) | null>(null);
    const [maxScrollViewHeight, setMaxScrollViewHeight] = React.useState(0);
    const { keyboardHeight, keyboardFinalHeight } = useKeyboard(
      shouldHandleKeyboardEvents,
    );

    const checks = __DEV__ ? useChecks?.() : null;
    const debugStyle = __DEV__ ? checks?.debugStyle : {};

    __DEV__ &&
      checks?.noUndefinedProperty({
        properties: { closeActionAccessibilityLabel, children },
        property: 'closeActionAccessibilityLabel',
        rule: 'BOTTOM_SHEET_CLOSE_ACTION',
      });
    __DEV__ &&
      checks?.noUppercaseStringChecker({
        text: closeActionAccessibilityLabel,
      });

    React.useImperativeHandle(ref, () => ({
      close: async () => {
        if (!renderContent) {
          return Promise.resolve();
        }

        return new Promise(resolve => {
          promiseResolver.current = resolve;

          onClose();
        });
      },
      isVisible: () => {
        return renderContent;
      },
    }));

    React.useEffect(() => {
      if (visible) {
        translateY.value = 0;

        setIsModalVisible(true);
        setRenderContent(true);

        if (autoCloseDelay) {
          onTimeout(() => {
            if (isMounted.current) {
              onClose();
            }
          }, autoCloseDelay);
        }
      } else if (isModalVisible) {
        setRenderContent(false);

        /**
         * We need to give Reanimated the time to finish animating the view out.
         * Otherwise, the content will suddenly disappear.
         */
        setTimeout(() => {
          setIsModalVisible(false);

          onBottomSheetHidden?.();
          promiseResolver.current?.();
        }, animationDuration);
      }
    }, [
      animationDuration,
      autoCloseDelay,
      isModalVisible,
      onBottomSheetHidden,
      onClose,
      onTimeout,
      translateY,
      visible,
    ]);

    React.useEffect(() => {
      isMounted.current = true;

      return () => {
        isMounted.current = false;
      };
    }, []);

    const dragStyle = useAnimatedStyle(() => {
      return {
        opacity: dragOpacity.value,
      };
    });

    const maxHeightValue = useDerivedValue(() => {
      return maxHeight - keyboardHeight.value;
    }, [keyboardHeight, maxHeight]);

    const animatedStyle = useAnimatedStyle(() => {
      const keyboard = isIOS ? keyboardHeight.value : 0;

      return {
        transform: [{ translateY: translateY.value - keyboard }],
        maxHeight: maxHeightValue.value,
      };
    }, [maxHeightValue, translateY, keyboardHeight]);

    useDerivedValue(() => {
      const maxScrollHeight = Math.ceil(
        maxHeight -
          keyboardFinalHeight.value -
          footerHeight -
          headerHeight -
          handleHeight -
          topInset,
      );

      if (
        !Number.isNaN(maxScrollHeight) &&
        maxScrollHeight !== maxScrollViewHeight
      ) {
        runOnJS(setMaxScrollViewHeight)(maxScrollHeight);
      }
    }, [
      footerHeight,
      headerHeight,
      handleHeight,
      keyboardFinalHeight,
      topInset,
      maxHeight,
    ]);

    const handleOnLayout = (event: LayoutChangeEvent) => {
      contentHeight.value = event.nativeEvent.layout.height;
    };

    const maybeCloseBottomSheet = persistent ? undefined : onClose;

    const Wrapper =
      avoidKeyboard && !shouldHandleKeyboardEvents
        ? BottomSheetKeyboardAvoidingView
        : React.Fragment;

    const opacity = [footerHeight, headerHeight, handleHeight].every(
      h => h >= 0,
    )
      ? 1
      : 0;

    const ContentWrapper = hasScrollableContent
      ? ScrollViewWrapper
      : FragmentWrapper;

    return (
      <Modal
        animationType="none"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => onClose()}
        ref={ref as any}
        supportedOrientations={supportedOrientations}
        testID={testID}
      >
        <Wrapper>
          {renderContent ? (
            <GestureHandlerRootView style={{ flex: 1, opacity }}>
              <AnimatedContainer
                style={[styles.overlay, overlayStyle, debugStyle, dragStyle]}
                from={{ opacity: 0 }}
                to={{ opacity: overlayOpacity }}
                testID={`${testID}-overlay-wrapper`}
                duration={animationDuration}
              >
                <Pressable
                  style={styles.closeButton}
                  accessibilityRole="button"
                  accessibilityLabel={closeActionAccessibilityLabel}
                  onPress={maybeCloseBottomSheet}
                  testID={`${testID}-overlay-button`}
                  accessible={!persistent}
                  importantForAccessibility={
                    persistent ? 'no-hide-descendants' : 'yes'
                  }
                  accessibilityElementsHidden={persistent}
                  onAccessibilityTap={maybeCloseBottomSheet}
                />
              </AnimatedContainer>
              <Animated.View
                style={[styles.contentWrapper, animatedStyle]}
                testID={`${testID}-wrapper`}
              >
                <AnimatedContainer
                  from={{ transform: [{ translateY: 'targetHeight' }] }}
                  to={{ transform: [{ translateY: 0 }] }}
                  exitFrom={{
                    transform: [{ translateY: 'currentHeight' }],
                  }}
                  duration={animationDuration}
                  style={[styles.content, bottomSheetStyle, debugStyle]}
                  onLayout={handleOnLayout}
                  testID={`${testID}-panel`}
                >
                  <GestureHandler
                    translateY={translateY}
                    closeDistance={closeDistance}
                    contentHeight={contentHeight}
                    onClose={onClose}
                    testID={`${testID}-gesture-handler`}
                    overlayOpacity={overlayOpacity}
                    dragOpacity={dragOpacity}
                    minVelocityToClose={minVelocityToClose}
                    panGestureEnabled={panGestureEnabled}
                  >
                    <View
                      onLayout={event => {
                        setHandleHeight(event.nativeEvent.layout.height);
                      }}
                    >
                      {handleComponent === 'none'
                        ? null
                        : handleComponent || (
                            <View
                              style={[styles.line, handleStyle]}
                              testID={`${testID}-line`}
                            />
                          )}
                    </View>
                    <View
                      onLayout={event => {
                        setHeaderHeight(event.nativeEvent.layout.height);
                      }}
                    >
                      {headerComponent}
                    </View>
                    <ContentWrapper
                      {...scrollViewProps}
                      testID={`${testID}-scrollview`}
                      maxScrollViewHeight={maxScrollViewHeight}
                    >
                      {children}
                    </ContentWrapper>
                    <View
                      onLayout={event => {
                        setFooterHeight(event.nativeEvent.layout.height);
                      }}
                    >
                      {footerComponent}
                    </View>
                  </GestureHandler>
                </AnimatedContainer>
              </Animated.View>
            </GestureHandlerRootView>
          ) : null}
        </Wrapper>
      </Modal>
    );
  },
);

const BottomSheetKeyboardAvoidingView = ({
  children,
}: React.PropsWithChildren<{}>) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      pointerEvents="box-none"
      style={{ flex: 1 }}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

type GestureHandlerProps = PropsWithChildren<{
  translateY: SharedValue<number>;
  contentHeight: SharedValue<number>;
  dragOpacity: SharedValue<number>;
  overlayOpacity: number;
  closeDistance: number;
  onClose: () => void;
  panGestureEnabled: boolean;
  testID?: string;
  minVelocityToClose: number;
}>;

const GestureHandler = ({
  translateY,
  closeDistance,
  contentHeight,
  children,
  onClose,
  panGestureEnabled,
  testID,
  dragOpacity,
  overlayOpacity,
  minVelocityToClose,
}: GestureHandlerProps) => {
  const { gestureHandler } = useBottomSheetGestureHandler({
    translateY,
    closeDistance,
    contentHeight,
    onClose,
    dragOpacity,
    overlayOpacity,
    minVelocityToClose,
  });

  return (
    <PanGestureHandler
      onGestureEvent={panGestureEnabled ? gestureHandler : undefined}
      testID={testID}
    >
      <Animated.View>{children}</Animated.View>
    </PanGestureHandler>
  );
};

type ScrollViewWrapperProps = {
  testID?: string;
  maxScrollViewHeight: number;
} & ScrollViewProps;

const ScrollViewWrapper: React.FC<ScrollViewWrapperProps> = ({
  scrollEnabled = false,
  testID,
  maxScrollViewHeight,
  children,
  style,
  ...rest
}) => {
  return (
    <ScrollView
      {...rest}
      style={[{ maxHeight: maxScrollViewHeight }, style]}
      scrollEnabled={scrollEnabled}
      testID={`${testID}-scrollview`}
    >
      {children}
    </ScrollView>
  );
};

const FragmentWrapper: React.FC<React.PropsWithChildren<any>> = ({
  children,
}) => {
  return <>{children}</>;
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
    position: 'absolute',
    bottom: 0,
    alignSelf: 'flex-end',
    width: '100%',
  },
  content: {
    width: '100%',
    backgroundColor: '#fff',
    flex: 1,
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
