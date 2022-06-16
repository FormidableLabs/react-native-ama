import { render } from '@testing-library/react-native';
import * as React from 'react';

import * as UsePressable from '../hooks/usePressable';
import { Pressable, PressableProps } from './Pressable';

afterEach(() => {
  jest.clearAllMocks();
});

describe('AMA Pressable', () => {
  it('uses the usePressable hook', () => {
    const test = {
      style: { backgroundColor: 'yellow' },
      another: 'property',
    };

    const spy = jest
      .spyOn(UsePressable, 'usePressable')
      .mockReturnValue(test as any);

    const props: Partial<PressableProps> = {
      accessibilityRole: 'button',
      accessibilityLabel: 'hello',
      testID: 'test-id',
      style: {
        backgroundColor: 'red',
        width: 42,
      },
    };

    const renderAPI = renderPressable(props as any);

    expect(spy).toHaveBeenCalledWith(props, expect.anything());

    expect(renderAPI.toJSON()).toMatchInlineSnapshot(`
      <View
        accessibilityLabel="hello"
        accessibilityRole="button"
        accessible={true}
        another="property"
        collapsable={false}
        focusable={true}
        onBlur={[Function]}
        onClick={[Function]}
        onFocus={[Function]}
        onResponderGrant={[Function]}
        onResponderMove={[Function]}
        onResponderRelease={[Function]}
        onResponderTerminate={[Function]}
        onResponderTerminationRequest={[Function]}
        onStartShouldSetResponder={[Function]}
        style={
          Object {
            "backgroundColor": "yellow",
          }
        }
        testID="test-id"
      />
    `);
  });
});

function renderPressable(props: Omit<PressableProps, 'children'>) {
  return render(
    <Pressable {...props}>
      <></>
    </Pressable>,
  );
}

jest.mock('../hooks/usePressable');
