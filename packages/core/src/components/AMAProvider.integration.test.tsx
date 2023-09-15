import { act, render } from '@testing-library/react-native';
import { flushMicroTasks } from '@testing-library/react-native/build/flush-micro-tasks';
import * as React from 'react';

import { useAMAContext } from '../components/AMAProvider';
import { AMAContextValue, AMAProvider } from './AMAProvider';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AMAProvider', () => {
  describe('When __DEV__ is true', () => {
    beforeEach(() => {
      // @ts-ignore
      global.__DEV__ = true;
    });

    describe('trackError', () => {
      it('exports trackError', async () => {
        await renderAMAProvider();

        expect(amaContextValuesRef.trackError).toBeDefined();
      });

      it('shows the AMA error banner when called', async () => {
        const renderAPI = await renderAMAProvider();

        expect(renderAPI.queryByTestId('amaError')).toBeNull();

        act(() => {
          amaContextValuesRef.trackError('123');
        });

        expect(renderAPI.getByTestId('amaError')).toBeDefined();
        expect(
          renderAPI.getByTestId('amaError').props.accessibilityLabel,
        ).toEqual("1 component(s) didn't pass the accessibility check(s)");

        act(() => {
          amaContextValuesRef.trackError('123');
        });

        expect(
          renderAPI.getByTestId('amaError').props.accessibilityLabel,
        ).toEqual("1 component(s) didn't pass the accessibility check(s)");

        expect(renderAPI.getByTestId('amaError')).toBeDefined();

        act(() => {
          amaContextValuesRef.trackError('another');
        });

        expect(
          renderAPI.getByTestId('amaError').props.accessibilityLabel,
        ).toEqual("2 component(s) didn't pass the accessibility check(s)");

        expect(renderAPI.getByTestId('amaError')).toBeDefined();
      });
    });

    describe('removeError', () => {
      it('exports removeError', async () => {
        await renderAMAProvider();

        expect(amaContextValuesRef.removeError).toBeDefined();
      });

      it('shows the AMA error banner when called', async () => {
        const renderAPI = await renderAMAProvider();

        expect(renderAPI.queryByTestId('amaError')).toBeNull();

        act(() => {
          amaContextValuesRef.trackError('123');
        });

        expect(
          renderAPI.getByTestId('amaError').props.accessibilityLabel,
        ).toEqual("1 component(s) didn't pass the accessibility check(s)");
        expect(renderAPI.getByTestId('amaError')).toBeDefined();

        act(() => {
          amaContextValuesRef.removeError('invalidID');
        });

        expect(
          renderAPI.getByTestId('amaError').props.accessibilityLabel,
        ).toEqual("1 component(s) didn't pass the accessibility check(s)");

        expect(renderAPI.getByTestId('amaError')).toBeDefined();

        act(() => {
          amaContextValuesRef.removeError('123');
        });

        expect(renderAPI.queryByTestId('amaError')).toBeNull();
      });
    });
  });

  describe('When __DEV__ is false', () => {
    beforeEach(() => {
      // @ts-ignore
      global.__DEV__ = false;
    });

    it('does not export trackError', async () => {
      await renderAMAProvider();

      expect(amaContextValuesRef.trackError).toBeUndefined();
    });

    it('does not export removeError', async () => {
      await renderAMAProvider();

      expect(amaContextValuesRef.removeError).toBeUndefined();
    });
  });
});

const renderAMAProvider = async () => {
  const result = render(
    <AMAProvider>
      <DummyComponent />
    </AMAProvider>,
  );

  await act(async () => {
    await flushMicroTasks();
  });

  return result;
};

type AMAContextValueForDEV = AMAContextValue & {
  trackError: (_: string) => void;
  removeError: (_: string) => void;
};

var amaContextValuesRef: AMAContextValueForDEV;

const DummyComponent = () => {
  // @ts-ignore
  amaContextValuesRef = useAMAContext();

  return null;
};
