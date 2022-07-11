import { act, render } from '@testing-library/react-native';
import * as React from 'react';
import { KeyboardAvoidingView, Text } from 'react-native';

import * as UseBottomSheetGestureHandler from '../hooks/useBottomSheetGestureHandler';
import * as UseTimedAction from '../hooks/useTimedAction';
import * as UseChecks from '../internal/useChecks';
import { BottomSheet } from './BottomSheet';

beforeEach(() => {
  jest.clearAllMocks();

  jest
    .spyOn(UseBottomSheetGestureHandler, 'useBottomSheetGestureHandler')
    .mockReturnValue({ gestureHandler: jest.fn() });
});

jest.useFakeTimers();

describe('BottomSheet', () => {
  describe('When __DEV__ is true', () => {
    it('perform a checks on closeActionAccessibilityLabel', () => {
      const noUndefinedProperty = jest.fn();
      const accessibilityLabelChecker = jest.fn();

      // @ts-ignore
      jest.spyOn(UseChecks, 'useChecks').mockReturnValue({
        noUndefinedProperty,
        noUppercaseStringChecker: accessibilityLabelChecker,
      } as any);

      render(
        <BottomSheet
          visible={true}
          onClose={() => {}}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text>Header</Text>}
        />,
      );

      expect(noUndefinedProperty).toHaveBeenCalledWith({
        properties: { closeActionAccessibilityLabel: 'close me' },
        property: 'closeActionAccessibilityLabel',
        rule: 'BOTTOM_SHEET_CLOSE_ACTION',
      });
      expect(accessibilityLabelChecker).toHaveBeenCalledWith({
        text: 'close me',
      });
    });

    it('applies the style from useChecks', () => {
      const noUndefinedProperty = jest.fn();
      const accessibilityLabelChecker = jest.fn();

      // @ts-ignore
      jest.spyOn(UseChecks, 'useChecks').mockReturnValue({
        debugStyle: { backgroundColor: 'cyan' },
        noUndefinedProperty,
        noUppercaseStringChecker: accessibilityLabelChecker,
      } as any);

      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onClose={() => {}}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text>Header</Text>}
          testID="bottom-sheet"
        />,
      );

      expect(getByTestId('bottom-sheet-overlay-wrapper').props.style).toEqual([
        { backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1 },
        undefined,
        { backgroundColor: 'cyan' },
        { opacity: 0 },
      ]);
    });
  });

  describe('When __DEV__ is false', () => {
    beforeEach(() => {
      // @ts-ignore
      global.__DEV__ = false;
    });

    it('perform a checks on closeActionAccessibilityLabel', () => {
      const { BottomSheet: OriginalBottomSheet } = require('./BottomSheet');
      const noUndefinedProperty = jest.fn();
      const accessibilityLabelChecker = jest.fn();

      // @ts-ignore
      jest.spyOn(UseChecks, 'useChecks').mockReturnValue({
        noUndefinedProperty,
        noUppercaseStringChecker: accessibilityLabelChecker,
      } as any);

      render(
        <OriginalBottomSheet
          visible={true}
          onClose={() => {}}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text>Header</Text>}
        />,
      );

      expect(noUndefinedProperty).not.toHaveBeenCalledWith();
      expect(accessibilityLabelChecker).not.toHaveBeenCalledWith();
    });

    it('does not apply the style from useChecks', () => {
      const noUndefinedProperty = jest.fn();
      const accessibilityLabelChecker = jest.fn();

      // @ts-ignore
      jest.spyOn(UseChecks, 'useChecks').mockReturnValue({
        debugStyle: { backgroundColor: 'cyan' },
        noUndefinedProperty,
        noUppercaseStringChecker: accessibilityLabelChecker,
      } as any);

      const { BottomSheet: OriginalBottomSheet } = require('./BottomSheet');

      const { getByTestId } = render(
        <OriginalBottomSheet
          visible={true}
          onClose={() => {}}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text>Header</Text>}
          testID="bottom-sheet"
        />,
      );

      expect(getByTestId('bottom-sheet-overlay-wrapper').props.style).toEqual([
        { backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1 },
        undefined,
        {},
        { opacity: 0 },
      ]);
    });
  });

  it('does not render the content when not visible', () => {
    const { toJSON } = render(
      <BottomSheet
        visible={false}
        onClose={() => {}}
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
        testID="bottom-sheet"
        transparent={true}
        visible={false}
      />
    `);
  });

  describe('Styling...', () => {
    it('allows customising the overlay style', () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onClose={() => {}}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text>Header</Text>}
          overlayStyle={{ backgroundColor: 'yellow', width: 42 }}
          testID="bottom-sheet"
        />,
      );

      expect(getByTestId('bottom-sheet-overlay-wrapper').props.style).toEqual([
        { backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1 },
        { backgroundColor: 'yellow', width: 42 },
        {},
        { opacity: 0 },
      ]);
    });

    it('allows customising the bottom sheet panel', () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onClose={() => {}}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text>Header</Text>}
          bottomSheetStyle={{ borderRadius: 42 }}
          testID="bottom-sheet"
        />,
      );

      expect(getByTestId('bottom-sheet-panel').props.style).toEqual([
        { backgroundColor: '#fff', width: '100%' },
        { borderRadius: 42 },
        {},
      ]);
    });

    it('allows customising the line style', () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onClose={() => {}}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text>Header</Text>}
          handleStyle={{ width: '100%' }}
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

    it('allows not rendering the line', () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onClose={() => {}}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text>Header</Text>}
          handleComponent="none"
          testID="bottom-sheet"
        />,
      );

      expect(() => getByTestId('bottom-sheet-line')).toThrow();
      expect(() => getByTestId('bottom-sheet-gesture-handler')).toThrow();
    });

    it('allows customising the ScrollView style', () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onClose={() => {}}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text>Header</Text>}
          scrollViewProps={{
            style: {
              backgroundColor: 'fucsia',
            },
          }}
          testID="bottom-sheet"
        />,
      );

      expect(getByTestId('bottom-sheet-scrollview').props.style).toEqual([
        { maxHeight: 1200.6000000000001 },
        { backgroundColor: 'fucsia' },
      ]);
    });

    it('allows rendering a custom header', () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onClose={() => {}}
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
        onClose={() => {}}
        closeActionAccessibilityLabel={'close me'}
        animationDuration={100}
        headerComponent={<Text testID="Header">Header</Text>}
      />,
    );

    act(() =>
      rerender(
        <BottomSheet
          visible={false}
          onClose={() => {}}
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
        onClose={() => {}}
        closeActionAccessibilityLabel={'close me'}
        animationDuration={100}
        headerComponent={<Text testID="Header">Header</Text>}
        testID="bottom-sheet"
      />,
    );

    expect(getByTestId('bottom-sheet-wrapper').props.style).toEqual([
      {
        alignSelf: 'flex-end',
        bottom: 0,
        flex: 1,
        flexDirection: 'column',
        position: 'absolute',
        width: '100%',
      },
      { maxHeight: 1200.6000000000001 },
      { transform: [{ translateY: 0 }] },
    ]);
  });

  it('passes the layout height into to the useBottomSheetGestureHandler hook', () => {
    const useBottomSheetGestureHandler = jest
      .spyOn(UseBottomSheetGestureHandler, 'useBottomSheetGestureHandler')
      .mockReturnValue({ gestureHandler: jest.fn() });
    const onClose = jest.fn();

    const { getByTestId } = render(
      <BottomSheet
        visible={true}
        closeDistance={0.1}
        onClose={onClose}
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
      onClose: onClose,
      translateY: { value: 0 },
      dragOpacity: { value: 0 },
      minVelocityToClose: 1000,
      overlayOpacity: 1,
    });
  });

  it('uses the onTimeout function from the useTimedAction hook to auto-close the bottom sheet', () => {
    const onTimeout = jest.fn();

    jest.spyOn(UseTimedAction, 'useTimedAction').mockReturnValue({
      onTimeout,
    });

    render(
      <BottomSheet
        visible={true}
        autoCloseDelay={100}
        closeDistance={0.1}
        onClose={() => {}}
        closeActionAccessibilityLabel={'close me'}
        animationDuration={100}
        headerComponent={<Text testID="Header">Header</Text>}
        testID="bottom-sheet"
      />,
    );

    expect(onTimeout).toHaveBeenCalledWith(expect.any(Function), 100);
  });

  it('wraps the Modal content inside KeyboardAvoidingView when the avoidKeyboard prop is true', () => {
    const { UNSAFE_getByType } = render(
      <BottomSheet
        visible={true}
        autoCloseDelay={100}
        closeDistance={0.1}
        onClose={() => {}}
        closeActionAccessibilityLabel={'close me'}
        animationDuration={100}
        headerComponent={<Text testID="Header">Header</Text>}
        testID="bottom-sheet"
        avoidKeyboard={true}
      />,
    );

    expect(UNSAFE_getByType(KeyboardAvoidingView)).toBeDefined();
  });

  it.each([undefined, false])(
    'does not wraps the Modal content inside KeyboardAvoidingView when avoidKeyboard prop is %s',
    avoidKeyboard => {
      const { UNSAFE_getByType } = render(
        <BottomSheet
          visible={true}
          autoCloseDelay={100}
          closeDistance={0.1}
          onClose={() => {}}
          closeActionAccessibilityLabel={'close me'}
          animationDuration={100}
          headerComponent={<Text testID="Header">Header</Text>}
          testID="bottom-sheet"
          avoidKeyboard={avoidKeyboard}
        />,
      );

      expect(() => UNSAFE_getByType(KeyboardAvoidingView)).toThrow();
    },
  );
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
    PanGestureHandler: ({ children }, ...rest) => (
      <View testID="PanGestureHandler" {...rest}>
        {children}
      </View>
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
jest.mock('../internal/useChecks');
