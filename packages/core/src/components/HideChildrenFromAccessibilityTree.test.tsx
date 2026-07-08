import { act, render } from '@testing-library/react-native';
import { flushMicroTasks } from '@testing-library/react-native/build/flush-micro-tasks';
import * as React from 'react';
import { Pressable, Text } from 'react-native';
import { AMAProvider } from './AMAProvider';
import { HideChildrenFromAccessibilityTree } from './HideChildrenFromAccessibilityTree';

jest.mock('./AMAProvider', () => {
  const originalModule = jest.requireActual('./AMAProvider');
  return {
    ...originalModule,
    useAMAContext: jest.fn().mockReturnValue({ isScreenReaderEnabled: true }),
  };
});

let useAMAContext: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
  useAMAContext = jest.requireMock('./AMAProvider').useAMAContext;
  useAMAContext.mockReturnValue({ isScreenReaderEnabled: true });
});

describe('HideChildrenFromAccessibilityTree', () => {
  describe('iOS', () => {
    beforeEach(() => {
      const rn = jest.requireMock('react-native');
      rn.Platform.OS = 'ios';
      rn.Platform.select = (params: any) => params.ios ?? params.default;
    });

    it('hides all the children from the accessibility tree when the screen reader is enabled', async () => {
      const { getByTestId } = await renderHideChildrenFromAccessibilityTree();

      ['test-text', 'test-button', 'nested-text'].forEach(testID => {
        expect(getByTestId(testID, { includeHiddenElements: true }).props).toEqual(
          expect.objectContaining({
            importantForAccessibility: 'no',
            accessibilityElementsHidden: true,
          }),
        );
      });
    });

    it('does nothing if the SR is turned off', async () => {
      const { getByTestId } = await renderHideChildrenFromAccessibilityTree({
        isScreenReaderEnabled: false,
      });

      ['test-text', 'test-button', 'nested-text'].forEach(testID => {
        expect(getByTestId(testID).props).not.toHaveProperty(
          'importantForAccessibility',
        );
        expect(getByTestId(testID).props).not.toHaveProperty(
          'accessibilityElementsHidden',
        );
      });
    });
  });

  describe('Android', () => {
    beforeEach(() => {
      const rn = jest.requireMock('react-native');
      rn.Platform.OS = 'android';
      rn.Platform.select = (params: any) => params.default ?? params.android;
    });

    it('hides all the children from the accessibility tree when the screen reader is enabled', async () => {
      const { getByTestId } = await renderHideChildrenFromAccessibilityTree();

      expect(getByTestId('test-wrapper', { includeHiddenElements: true }).props).toEqual(
        expect.objectContaining({
          importantForAccessibility: 'no-hide-descendants',
        }),
      );
    });

    it('does nothing if the SR is turned off', async () => {
      const { queryByTestId } = await renderHideChildrenFromAccessibilityTree({
        isScreenReaderEnabled: false,
      });

      expect(queryByTestId('test-wrapper')).toBeNull();
    });
  });
});

const renderHideChildrenFromAccessibilityTree = async (params?: {
  isScreenReaderEnabled: boolean;
}) => {
  useAMAContext.mockReturnValue({
    isScreenReaderEnabled: params?.isScreenReaderEnabled ?? true,
  });

  const renderAPI = render(
    <AMAProvider>
      <HideChildrenFromAccessibilityTree testID="test-wrapper">
        <Text testID="test-text">Test here</Text>
        <>
          <Pressable testID="test-button">
            <Text testID="nested-text">Press me</Text>
          </Pressable>
        </>
      </HideChildrenFromAccessibilityTree>
    </AMAProvider>,
  );

  await act(async () => {
    await flushMicroTasks();
  });

  return renderAPI;
};
