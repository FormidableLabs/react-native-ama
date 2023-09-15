import * as UsePressable from '@react-native-ama/core/src/hooks/usePressable';
import { render } from '@testing-library/react-native';
import * as React from 'react';

import { TouchableOpacity, TouchableOpacityProps } from './TouchableOpacity';

afterEach(() => {
  jest.clearAllMocks();
});

describe('AMA TouchableOpacity', () => {
  it('uses the usePressable hook', () => {
    const test = {
      style: { backgroundColor: 'yellow' },
      another: 'property',
    };

    const spy = jest
      .spyOn(UsePressable, 'usePressable')
      .mockReturnValue(test as any);

    const props: Partial<TouchableOpacityProps> = {
      accessibilityRole: 'button',
      accessibilityLabel: 'hello',
      testID: 'test-id',
      style: {
        backgroundColor: 'red',
        width: 42,
      },
    };

    const renderAPI = renderTouchableOpacity(props as any);

    expect(spy).toHaveBeenCalledWith(props, expect.anything());

    expect(renderAPI.toJSON()).toMatchInlineSnapshot(`
      <View
        accessibilityLabel="hello"
        accessibilityRole="button"
        accessible={true}
        collapsable={false}
        focusable={false}
        nativeID="animatedComponent"
        onClick={[Function]}
        onResponderGrant={[Function]}
        onResponderMove={[Function]}
        onResponderRelease={[Function]}
        onResponderTerminate={[Function]}
        onResponderTerminationRequest={[Function]}
        onStartShouldSetResponder={[Function]}
        style={
          Object {
            "backgroundColor": "yellow",
            "opacity": 1,
          }
        }
        testID="test-id"
      />
    `);
  });
});

function renderTouchableOpacity(props: TouchableOpacityProps) {
  return render(
    <TouchableOpacity {...props}>
      <></>
    </TouchableOpacity>,
  );
}

jest.mock('../hooks/usePressable');
