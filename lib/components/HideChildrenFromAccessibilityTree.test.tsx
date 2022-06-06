import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Pressable, Text } from 'react-native';

import { HideChildrenFromAccessibilityTree } from './HideChildrenFromAccessibilityTree';

describe('HideChildrenFromAccessibilityTree', () => {
  it('hides all the children from the accessibility tree', () => {
    const { getByTestId } = render(
      <HideChildrenFromAccessibilityTree>
        <>
          <Text testID="test-text">Test here</Text>
          <>
            <Pressable testID="test-button">
              <Text testID="nested-text">Press me</Text>
            </Pressable>
          </>
        </>
      </HideChildrenFromAccessibilityTree>,
    );

    ['test-text', 'test-button', 'nested-text'].forEach(testID => {
      expect(getByTestId(testID).props).toEqual(
        expect.objectContaining({
          importantForAccessibility: 'no',
          accessibilityElementsHidden: true,
        }),
      );
    });
  });
});
