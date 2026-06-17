
import { act, render } from '@testing-library/react-native';
import * as React from 'react';
import { KeyboardAvoidingView, Text } from 'react-native';
import * as UseBottomSheetGestureHandler from '../hooks/useBottomSheetGestureHandler';
import { BottomSheet } from './BottomSheet';

const mockOnTimeout = jest.fn();

jest.mock('@react-native-ama/core', () => ({
  __esModule: true,
  useTimedAction: jest.fn(() => ({ onTimeout: mockOnTimeout })),
}));

beforeEach(() => {
  jest.clearAllMocks();

  jest
    .spyOn(UseBottomSheetGestureHandler, 'useBottomSheetGestureHandler')
    .mockReturnValue({ gestureHandler: jest.fn() });
});

jest.useFakeTimers();

describe('BottomSheet', () => {

  it('does not render the content when not visible', () => {
    const { toJSON } = render(
      <BottomSheet
        topInset={0}
        visible={false}
        onClose={() => { }}
        closeActionAccessibilityLabel={'close me'}
        headerComponent={<Text>Header</Text>}
        testID="bottom-sheet"
      />,
    );

    expect(toJSON()).toMatchInlineSnapshot(`
      <Modal
        animationType="none"
        onRequestClose={[Function]}
        ref={null}
        statusBarTranslucent={true}
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
          topInset={0}
          visible={true}
          onClose={() => { }}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text>Header</Text>}
          overlayStyle={{ backgroundColor: 'yellow', width: 42 }}
          testID="bottom-sheet"
        />,
      );

      const overlayStyle = getByTestId('bottom-sheet-overlay-wrapper').props.style;
      const flatStyle = Array.isArray(overlayStyle)
        ? Object.assign({}, ...overlayStyle.map((s: any) => s || {}))
        : overlayStyle;

      expect(flatStyle).toMatchObject({
        backgroundColor: 'yellow',
        flex: 1,
        width: 42,
      });
    });

    it('allows customising the bottom sheet panel', () => {
      const { getByTestId } = render(
        <BottomSheet
          topInset={0}
          visible={true}
          onClose={() => { }}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text>Header</Text>}
          bottomSheetStyle={{ borderRadius: 42 }}
          testID="bottom-sheet"
        />,
      );

      const wrapperStyle = getByTestId('bottom-sheet-wrapper').props.style;
      const flatStyle = Array.isArray(wrapperStyle)
        ? Object.assign({}, ...wrapperStyle.map((s: any) => s || {}))
        : wrapperStyle;

      expect(flatStyle).toMatchObject({
        backgroundColor: '#fff',
        borderRadius: 42,
        flex: 1,
        width: '100%',
      });
    });

    it('allows customising the line style', () => {
      const { getByTestId } = render(
        <BottomSheet
          topInset={0}
          visible={true}
          onClose={() => { }}
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
          topInset={0}
          visible={true}
          onClose={() => { }}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text>Header</Text>}
          handleComponent="none"
          testID="bottom-sheet"
        />,
      );

      expect(() => getByTestId('bottom-sheet-line')).toThrow();
    });

    it('allows customising the ScrollView style', () => {
      const { getByTestId } = render(
        <BottomSheet
          visible={true}
          onClose={() => { }}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text>Header</Text>}
          scrollViewProps={{
            style: {
              backgroundColor: 'fucsia',
            },
          }}
          topInset={3}
          testID="bottom-sheet"
        />,
      );

      const scrollStyle = getByTestId('bottom-sheet-scrollview').props.style;
      expect(Array.isArray(scrollStyle)).toBe(true);
      expect(scrollStyle[1]).toEqual({ backgroundColor: 'fucsia' });
    });

    it('allows rendering a custom header', () => {
      const { getByTestId } = render(
        <BottomSheet
          topInset={0}
          visible={true}
          onClose={() => { }}
          closeActionAccessibilityLabel={'close me'}
          headerComponent={<Text testID="Header">Header</Text>}
        />,
      );

      expect(getByTestId('Header')).toBeDefined();
    });
  });

  // TODO: Fix
  it.skip('on close it waits for the animation to be completed before hiding the modal', () => {
    const { rerender, getByTestId } = render(
      <BottomSheet
        topInset={0}
        visible={true}
        onClose={() => { }}
        closeActionAccessibilityLabel={'close me'}
        animationDuration={100}
        headerComponent={<Text testID="Header">Header</Text>}
      />,
    );

    act(() =>
      rerender(
        <BottomSheet
          topInset={0}
          visible={false}
          onClose={() => { }}
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
        topInset={0}
        visible={true}
        onClose={() => { }}
        closeActionAccessibilityLabel={'close me'}
        animationDuration={100}
        headerComponent={<Text testID="Header">Header</Text>}
        testID="bottom-sheet"
      />,
    );

    const wrapperStyle = getByTestId('bottom-sheet-wrapper').props.style;
    const flatStyle = Array.isArray(wrapperStyle)
      ? Object.assign({}, ...wrapperStyle.map((s: any) => s || {}))
      : wrapperStyle;

    expect(flatStyle).toMatchObject({
      alignSelf: 'flex-end',
      bottom: 0,
      flex: 1,
      flexDirection: 'column',
      position: 'absolute',
      width: '100%',
    });
  });

  // TODO: Fix
  it.skip('passes the layout height into to the useBottomSheetGestureHandler hook', () => {
    const useBottomSheetGestureHandlerSpy = jest
      .spyOn(UseBottomSheetGestureHandler, 'useBottomSheetGestureHandler')
      .mockReturnValue({ gestureHandler: jest.fn() });
    const onClose = jest.fn();

    const { getByTestId } = render(
      <BottomSheet
        topInset={0}
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

    expect(useBottomSheetGestureHandlerSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        closeDistance: 0.1,
        contentHeight: { value: 42 },
        onClose: onClose,
        translateY: { value: 0 },
        dragOpacity: { value: 0 },
        minVelocityToClose: 1000,
        overlayOpacity: 1,
      }),
    );
  });

  it('uses the onTimeout function from the useTimedAction hook to auto-close the bottom sheet', () => {
    render(
      <BottomSheet
        topInset={0}
        visible={true}
        autoCloseDelay={100}
        closeDistance={0.1}
        onClose={() => { }}
        closeActionAccessibilityLabel={'close me'}
        animationDuration={100}
        headerComponent={<Text testID="Header">Header</Text>}
        testID="bottom-sheet"
      />,
    );

    expect(mockOnTimeout).toHaveBeenCalledWith(expect.any(Function), 100);
  });

  it('wraps the Modal content inside KeyboardAvoidingView when the avoidKeyboard prop is true and shouldHandleKeyboardEvents = false', () => {
    const { UNSAFE_getByType } = render(
      <BottomSheet
        topInset={0}
        visible={true}
        autoCloseDelay={100}
        closeDistance={0.1}
        onClose={() => { }}
        closeActionAccessibilityLabel={'close me'}
        animationDuration={100}
        headerComponent={<Text testID="Header">Header</Text>}
        testID="bottom-sheet"
        avoidKeyboard={true}
        shouldHandleKeyboardEvents={false}
      />,
    );

    expect(UNSAFE_getByType(KeyboardAvoidingView)).toBeDefined();
  });

  it('does not wrap the Modal content inside KeyboardAvoidingView when the avoidKeyboard prop is true and shouldHandleKeyboardEvents = true', () => {
    const { UNSAFE_getByType } = render(
      <BottomSheet
        topInset={0}
        visible={true}
        autoCloseDelay={100}
        closeDistance={0.1}
        onClose={() => { }}
        closeActionAccessibilityLabel={'close me'}
        animationDuration={100}
        headerComponent={<Text testID="Header">Header</Text>}
        testID="bottom-sheet"
        avoidKeyboard={true}
      />,
    );

    expect(() => UNSAFE_getByType(KeyboardAvoidingView)).toThrow();
  });

  it.each([undefined, false])(
    'does not wraps the Modal content inside KeyboardAvoidingView when avoidKeyboard prop is %s',
    avoidKeyboard => {
      const { UNSAFE_getByType } = render(
        <BottomSheet
          topInset={0}
          visible={true}
          autoCloseDelay={100}
          closeDistance={0.1}
          onClose={() => { }}
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

  it('calls onClose correctly', () => {
    const onClose = jest.fn();

    const { getByTestId } = render(
      <BottomSheet
        topInset={0}
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
      const event = { some: 'props' };
      getByTestId('bottom-sheet').props.onRequestClose(event);
    });

    expect(onClose).toHaveBeenCalled();
  });

  it.todo('calculate correct max height');
  it.todo('calculate correct scrollview height');
  it.todo('handles keyboard correctly');
});

jest.mock('../hooks/useBottomSheetGestureHandler');
