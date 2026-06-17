import { act, render } from '@testing-library/react-native';
import { flushMicroTasks } from '@testing-library/react-native/build/flush-micro-tasks';
import * as React from 'react';
import { AMAContextValue, AMAProvider, useAMAContext } from './AMAProvider';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('AMAProvider', () => {
  describe('When __DEV__ is false', () => {
    beforeEach(() => {
      // @ts-ignore
      global.__DEV__ = false;
    });

    it('does not export trackError', async () => {
      await renderAMAProvider();

      expect((amaContextValuesRef as any).trackError).toBeUndefined();
    });

    it('does not export removeError', async () => {
      await renderAMAProvider();

      expect((amaContextValuesRef as any).removeError).toBeUndefined();
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

let amaContextValuesRef: AMAContextValue;

const DummyComponent = () => {
  // @ts-ignore
  amaContextValuesRef = useAMAContext();

  return null;
};
