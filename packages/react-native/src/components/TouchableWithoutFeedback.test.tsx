import * as UsePressable from '@react-native-ama/react-native/src/hooks/usePressable';
import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from './TouchableWithoutFeedback';

afterEach(() => {
  jest.clearAllMocks();
});

describe('AMA TouchableWithoutFeedback', () => {
  it('uses the usePressable hook', () => {
    const test = {
      style: { backgroundColor: 'yellow' },
      another: 'property',
    };

    const spy = jest
      .spyOn(UsePressable, 'usePressable')
      .mockReturnValue(test as any);

    const props: Partial<TouchableWithoutFeedbackProps> = {
      accessibilityRole: 'button',
      accessibilityLabel: 'hello',
      testID: 'test-id',
      style: {
        backgroundColor: 'red',
        width: 42,
      },
    };

    const renderAPI = renderTouchableWithoutFeedback(props as any);

    expect(spy).toHaveBeenCalledWith(props, expect.anything());

    expect(renderAPI.toJSON()).toMatchInlineSnapshot(`
      <View
        accessibilityLabel="hello"
        accessibilityRole="button"
        accessible={true}
        focusable={false}
        onClick={[Function]}
        onResponderGrant={[Function]}
        onResponderMove={[Function]}
        onResponderRelease={[Function]}
        onResponderTerminate={[Function]}
        onResponderTerminationRequest={[Function]}
        onStartShouldSetResponder={[Function]}
        testID="test-id"
      >
        <Text>
          Content
        </Text>
      </View>
    `);
  });
});

function renderTouchableWithoutFeedback(props: TouchableWithoutFeedbackProps) {
  return render(
    <TouchableWithoutFeedback {...props}>
      <View>
        <Text>Content</Text>
      </View>
    </TouchableWithoutFeedback>,
  );
}

jest.mock('../hooks/usePressable');
