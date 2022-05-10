import { renderHook } from '@testing-library/react-hooks';
import { render } from '@testing-library/react-native';
import * as React from 'react';
import { AccessibilityInfo } from 'react-native';

import { AMAContextValue, AMAProvider, useAMAContext } from './AMAProvider';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AMAProvider', () => {
  it('adds event listener for "reduceMotionChanged"', () => {
    const spy = jest.spyOn(AccessibilityInfo, 'addEventListener');

    renderAMAProvider();

    expect(spy).toHaveBeenCalledWith(
      'reduceMotionChanged',
      expect.any(Function),
    );
  });

  it('adds event listener for "screenReaderChanged"', () => {
    const spy = jest.spyOn(AccessibilityInfo, 'addEventListener');

    renderAMAProvider();

    expect(spy).toHaveBeenCalledWith(
      'screenReaderChanged',
      expect.any(Function),
    );
  });

  it.each`
    eventName                | valueName
    ${'reduceMotionChanged'} | ${'reduceMotion'}
    ${'screenReaderChanged'} | ${'screenReaderEnabled'}
  `(
    'reacts to the events change',
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
        });

      renderAMAProvider();

      const { result } = renderHook(() => useAMAContext());

      expect(result.current[valueName]).toBe(false);

      handler!(true);

      expect(result.current[valueName]).toBe(true);

      handler!(false);

      expect(result.current[valueName]).toBe(false);
    },
  );
});

function renderAMAProvider() {
  render(
    <AMAProvider>
      <></>
    </AMAProvider>,
  );
}
