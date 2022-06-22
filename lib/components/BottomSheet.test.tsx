import { act, render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import * as UseBottomSheetGestureHandler from '../hooks/useBottomSheetGestureHandler';
import { BottomSheet } from './BottomSheet';

beforeEach(() => {
  jest.clearAllMocks();

  jest
    .spyOn(UseBottomSheetGestureHandler, 'useBottomSheetGestureHandler')
    .mockReturnValue({ gestureHandler: jest.fn() });
});

jest.useFakeTimers();

describe('BottomSheet', () => {
  it('it matches the snapshot', () => {
    const { toJSON } = render(
      <BottomSheet
        visible={true}
        onRequestClose={() => {}}
        closeActionAccessibilityLabel={'close me'}
        headerComponent={<Text>Header</Text>}
      />,
    );

    expect(toJSON()).toMatchInlineSnapshot(`
      <Modal
        animationType="none"
        hardwareAccelerated={false}
        onRequestClose={[Function]}
        style={
          Array [
            Object {},
          ]
        }
        transparent={true}
        visible={true}
      >
        <View
          testID="GestureHandlerRootView"
        >
          <View
            entering={[Function]}
            exiting={[Function]}
            style={
              Array [
                Object {
                  "backgroundColor": "rgba(0, 0, 0, 0.5)",
                  "flex": 1,
                },
              ]
            }
          >
            <View
              accessibilityLabel="close me"
              accessibilityRole="button"
              accessible={true}
              collapsable={false}
              focusable={true}
              onBlur={[Function]}
              onClick={[Function]}
              onFocus={[Function]}
              onResponderGrant={[Function]}
              onResponderMove={[Function]}
              onResponderRelease={[Function]}
              onResponderTerminate={[Function]}
              onResponderTerminationRequest={[Function]}
              onStartShouldSetResponder={[Function]}
              style={
                Array [
                  Object {
                    "flex": 1,
                  },
                  undefined,
                ]
              }
              testID="undefined-overlay"
            />
          </View>
          <View
            style={
              Array [
                Object {
                  "alignSelf": "flex-end",
                  "bottom": 24,
                  "flex": 1,
                  "flexDirection": "column",
                  "maxHeight": "80%",
                  "position": "absolute",
                  "width": "100%",
                },
                Object {
                  "transform": Array [
                    Object {
                      "translateY": 0,
                    },
                  ],
                },
              ]
            }
            testID="undefined-wrapper"
          >
            <View
              entering={[Function]}
              exiting={[Function]}
              onLayout={[Function]}
              style={
                Array [
                  Array [
                    Object {
                      "backgroundColor": "#fff",
                      "width": "100%",
                    },
                    Object {},
                  ],
                ]
              }
              testID="undefined-panel"
            >
              <View
                testID="PanGestureHandler"
              >
                <View
                  style={
                    Object {
                      "justifyContent": "center",
                      "minHeight": 44,
                    }
                  }
                >
                  <View
                    style={
                      Array [
                        Object {
                          "alignSelf": "center",
                          "backgroundColor": "grey",
                          "borderRadius": 2,
                          "height": 4,
                          "marginBottom": 24,
                          "marginTop": 12,
                          "width": 48,
                        },
                        Object {},
                      ]
                    }
                    testID="undefined-line"
                  />
                </View>
              </View>
              <Text>
                Header
              </Text>
              <View
                scrollEnabled={false}
                style={Object {}}
                testID="undefined-scrollview"
              />
            </View>
          </View>
        </View>
      </Modal>
    `);
  });

  it('does not render the content when not visible', () => {
    const { toJSON } = render(
      <BottomSheet
        visible={false}
        onRequestClose={() => {}}
        closeActionAccessibilityLabel={'close me'}
        headerComponent={<Text>Header</Text>}
        testID="bottom-sheet"
      />,
    );

    expect(toJSON()).toMatchInlineSnapshot(`
      <Modal
        animationType="none"
        hardwareAccelerated={false}
        onRequestClose={[Function]}
        style={
          Array [
            Object {},
          ]
        }
        testID="bottom-sheet"
        transparent={true}
        visible={true}
      />
    `);
  });

  describe('Styling...', () => {
    it('allows customising the overlay style', () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onRequestClose={() => {}}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text>Header</Text>}
          overlayStyle={{ backgroundColor: 'yellow', width: 42 }}
          testID="bottom-sheet"
        />,
      );

      expect(getByTestId('bottom-sheet-overlay').props.style).toEqual([
        { flex: 1 },
        { backgroundColor: 'yellow', width: 42 },
      ]);
    });

    it('allows customising the bottom sheet panel', () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onRequestClose={() => {}}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text>Header</Text>}
          bottomSheetStyle={{ borderRadius: 42 }}
          testID="bottom-sheet"
        />,
      );

      expect(getByTestId('bottom-sheet-panel').props.style).toEqual([
        [{ backgroundColor: '#fff', width: '100%' }, { borderRadius: 42 }],
      ]);
    });

    it('allows customising the line style', () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onRequestClose={() => {}}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text>Header</Text>}
          lineStyle={{ width: '100%' }}
          testID="bottom-sheet"
        />,
      );

      expect(getByTestId('bottom-sheet-line').props.style).toEqual([
        {
          alignSelf: 'center',
          backgroundColor: 'grey',
          borderRadius: 2,
          height: 4,
          marginBottom: 24,
          marginTop: 12,
          width: 48,
        },
        { width: '100%' },
      ]);
    });

    it('allows customising the ScrollView style', () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onRequestClose={() => {}}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text>Header</Text>}
          scrollViewStyle={{ backgroundColor: 'fucsia' }}
          testID="bottom-sheet"
        />,
      );

      expect(getByTestId('bottom-sheet-scrollview').props.style).toEqual({
        backgroundColor: 'fucsia',
      });
    });

    it('allows rendering a custom header', () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onRequestClose={() => {}}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text testID="Header">Header</Text>}
        />,
      );

      expect(getByTestId('Header')).toBeDefined();
    });
  });

  it('on close it waits for the animation to be completed before hiding the modal', () => {
    const { rerender, getByTestId } = render(
      <BottomSheet
        visible={true}
        onRequestClose={() => {}}
        closeActionAccessibilityLabel={'close me'}
        animationDuration={100}
        headerComponent={<Text testID="Header">Header</Text>}
      />,
    );

    act(() =>
      rerender(
        <BottomSheet
          visible={false}
          onRequestClose={() => {}}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text testID="Header">Header</Text>}
          animationDuration={100}
          testID="bottom-sheet"
        />,
      ),
    );

    expect(getByTestId('bottom-sheet').props.visible).toBe(true);

    jest.advanceTimersByTime(99);

    expect(getByTestId('bottom-sheet').props.visible).toBe(true);

    act(() => {
      jest.advanceTimersByTime(2);
    });

    expect(getByTestId('bottom-sheet').props.visible).toBe(false);
  });

  it('uses the animatedStyle for the bottom sheet wrapper', () => {
    const { getByTestId } = render(
      <BottomSheet
        visible={true}
        onRequestClose={() => {}}
        closeActionAccessibilityLabel={'close me'}
        animationDuration={100}
        headerComponent={<Text testID="Header">Header</Text>}
        testID="bottom-sheet"
      />,
    );

    expect(getByTestId('bottom-sheet-wrapper').props.style).toEqual([
      {
        alignSelf: 'flex-end',
        bottom: 24,
        flex: 1,
        flexDirection: 'column',
        maxHeight: '80%',
        position: 'absolute',
        width: '100%',
      },
      { transform: [{ translateY: 0 }] },
    ]);
  });

  it('passes the layout height into to the useBottomSheetGestureHandler hook', () => {
    const useBottomSheetGestureHandler = jest
      .spyOn(UseBottomSheetGestureHandler, 'useBottomSheetGestureHandler')
      .mockReturnValue({ gestureHandler: jest.fn() });
    const onRequestClose = jest.fn();

    const { getByTestId } = render(
      <BottomSheet
        visible={true}
        closeDistance={0.1}
        onRequestClose={onRequestClose}
        closeActionAccessibilityLabel={'close me'}
        animationDuration={100}
        headerComponent={<Text testID="Header">Header</Text>}
        testID="bottom-sheet"
      />,
    );

    act(() => {
      getByTestId('bottom-sheet-panel').props.onLayout({
        nativeEvent: { layout: { height: 42 } },
      });
    });

    expect(useBottomSheetGestureHandler).toHaveBeenCalledWith({
      closeDistance: 0.1,
      contentHeight: { value: 42 },
      onRequestClose: onRequestClose,
      translateY: { value: 0 },
    });
  });
});

let useAnimatedGestureHandler: jest.Mock;

function mockReanimated() {
  const { View } = require('react-native');

  useAnimatedGestureHandler = jest.fn();

  return {
    View: (props: any) => <View {...props} />,
    SharedValue: undefined,
    runOnJS: undefined,
    useAnimatedGestureHandler,
    useAnimatedStyle: jest.fn(callback => callback()),
    useSharedValue: jest.fn(() => {
      return { value: 0 };
    }),
    withTiming: undefined,
  };
}

jest.mock('react-native-reanimated', () => mockReanimated());

jest.mock('react-native-gesture-handler', () => {
  const { View } = require('react-native');

  return {
    // @ts-ignore
    GestureHandlerRootView: ({ children }) => (
      <View testID="GestureHandlerRootView">{children}</View>
    ),
    // @ts-ignore
    PanGestureHandler: ({ children }) => (
      <View testID="PanGestureHandler">{children}</View>
    ),
    // @ts-ignore
    PanGestureHandlerGestureEvent: ({ children }) => (
      <View testID="PanGestureHandlerGestureEvent">{children}</View>
    ),
    // @ts-ignore
    ScrollView: ({ children, ...rest }) => <View {...rest}>{children}</View>,
  };
});

jest.mock('../hooks/useBottomSheetGestureHandler');
