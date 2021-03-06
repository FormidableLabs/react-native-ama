import { act, render, waitFor } from '@testing-library/react-native';
import * as React from 'react';
import { AccessibilityInfo } from 'react-native';

import { AMAContextValue, AMAProvider } from './AMAProvider';

var mockProvider: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AMAProvider', () => {
  it('adds event listener for "reduceMotionChanged"', () => {
    const spy = jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockReturnValue({ remove: jest.fn() } as any);

    renderAMAProvider();

    expect(spy).toHaveBeenCalledWith(
      'reduceMotionChanged',
      expect.any(Function),
    );
  });

  it('adds event listener for "screenReaderChanged"', () => {
    const spy = jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockReturnValue({ remove: jest.fn() } as any);

    renderAMAProvider();

    expect(spy).toHaveBeenCalledWith(
      'screenReaderChanged',
      expect.any(Function),
    );
  });

  it('setups the initial value for all the states', async () => {
    const events = [
      'isReduceMotionEnabled',
      'isScreenReaderEnabled',
      'isReduceTransparencyEnabled',
      'isGrayscaleEnabled',
      'isBoldTextEnabled',
      'isInvertColorsEnabled',
    ];

    const states: any = {};

    events.forEach(event => {
      // @ts-ignore
      jest.spyOn(AccessibilityInfo, event).mockResolvedValue('yay');
      states[event] = 'yay';
    });

    renderAMAProvider();

    await waitFor(() =>
      expect(mockProvider.mock.calls[1][0]).toMatchObject({
        value: states,
      }),
    );
  });

  it.each`
    eventName                      | valueName
    ${'reduceMotionChanged'}       | ${'isReduceMotionEnabled'}
    ${'screenReaderChanged'}       | ${'isScreenReaderEnabled'}
    ${'reduceTransparencyChanged'} | ${'isReduceTransparencyEnabled'}
    ${'grayscaleChanged'}          | ${'isGrayscaleEnabled'}
    ${'boldTextChanged'}           | ${'isBoldTextEnabled'}
    ${'invertColorsChanged'}       | ${'isInvertColorsEnabled'}
  `(
    'reacts to the events change $eventName',
    ({
      eventName,
      valueName,
    }: {
      eventName: string;
      valueName: keyof AMAContextValue;
    }) => {
      let handler: Function;
      jest
        .spyOn(AccessibilityInfo, 'addEventListener')
        // @ts-ignore
        .mockImplementation((name, callback) => {
          if (name === eventName) {
            handler = callback;
          }

          return {
            remove: jest.fn(),
          };
        });

      renderAMAProvider();

      const state: any = {};
      state[valueName] = false;

      expect(mockProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          value: expect.objectContaining(state),
        }),
        {},
      );

      jest.clearAllMocks();

      act(() => {
        handler!(true);
      });

      state[valueName] = true;
      expect(mockProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          value: expect.objectContaining(state),
        }),
        {},
      );

      jest.clearAllMocks();

      act(() => {
        handler!(false);
      });

      state[valueName] = false;
      expect(mockProvider).toHaveBeenCalledWith(
        expect.objectContaining({
          value: expect.objectContaining(state),
        }),
        {},
      );
    },
  );

  it.each`
    eventName
    ${'reduceMotionChanged'}
    ${'screenReaderChanged'}
    ${'reduceTransparencyChanged'}
    ${'grayscaleChanged'}
    ${'boldTextChanged'}
    ${'invertColorsChanged'}
  `(
    'remove the "$eventName" subscription when the provider is unmounted',
    ({ eventName }) => {
      const removeMock = jest.fn();
      jest
        .spyOn(AccessibilityInfo, 'addEventListener')
        // @ts-ignore
        .mockImplementation((name, _callback) => {
          return { remove: name === eventName ? removeMock : jest.fn() };
        });

      const a = renderAMAProvider();
      a.unmount();

      expect(removeMock).toHaveBeenCalledWith();
    },
  );
});

function renderAMAProvider() {
  return render(
    <AMAProvider>
      <></>
    </AMAProvider>,
  );
}

function mockCreateContext() {
  const original = jest.requireActual('react');

  mockProvider = jest.fn().mockReturnValue(null);

  return {
    ...original,
    createContext: () => {
      return {
        Provider: mockProvider,
        Consumer: () => {},
        displayName: '',
      };
    },
  };
}

jest.mock('react', () => {
  return mockCreateContext();
});
