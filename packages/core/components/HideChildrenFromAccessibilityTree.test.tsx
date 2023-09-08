import { act, render } from '@testing-library/react-native';
import { flushMicroTasks } from '@testing-library/react-native/build/flushMicroTasks';
import * as React from 'react';
import { Pressable, Text } from 'react-native';

import { AMAProvider } from './AMAProvider';
import { HideChildrenFromAccessibilityTree } from './HideChildrenFromAccessibilityTree';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('HideChildrenFromAccessibilityTree', () => {
  describe('iOS', () => {
    beforeEach(() => {
      const Platform = jest.requireActual(
        'react-native/Libraries/Utilities/Platform',
      );

      Platform.select = (params: any) => {
        return params.ios;
      };
    });

    it('hides all the children from the accessibility tree when the screen reader is enabled', async () => {
      const { getByTestId } = await renderHideChildrenFromAccessibilityTree();

      ['test-text', 'test-button', 'nested-text'].forEach(testID => {
        expect(getByTestId(testID).props).toEqual(
          expect.objectContaining({
            importantForAccessibility: 'no',
            accessibilityElementsHidden: true,
          }),
        );
      });
    });

    it('does nothing if the SR is turned off %s', async () => {
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
      const Platform = jest.requireActual(
        'react-native/Libraries/Utilities/Platform',
      );

      Platform.select = (params: any) => {
        return params.default;
      };
    });

    it('hides all the children from the accessibility tree when the screen reader is enabled', async () => {
      const { getByTestId } = await renderHideChildrenFromAccessibilityTree();

      expect(getByTestId('test-wrapper').props).toEqual(
        expect.objectContaining({
          importantForAccessibility: 'no-hide-descendants',
        }),
      );
    });

    it('does nothing if the SR is turned off %s', async () => {
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

let useAMAContext: jest.Mock;

function mockAMAProvider() {
  const originalModule = jest.requireActual('./AMAProvider');

  useAMAContext = jest.fn().mockReturnValue({
    isScreenReaderEnabled: true,
  });

  return {
    ...originalModule,
    useAMAContext,
  };
}

jest.mock('./AMAProvider', () => mockAMAProvider());
