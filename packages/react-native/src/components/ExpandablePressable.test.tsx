import { render } from '@testing-library/react-native';
import * as React from 'react';
import { ExpandablePressable } from './ExpandablePressable';

beforeEach(() => {
  jest.clearAllMocks();

  jest.spyOn(console, 'info').mockImplementation();
});

describe('ExpandablePressable', () => {
  it('renders a pressable component using the useExpandable hook', () => {
    const { toJSON } = render(
      <ExpandablePressable
        accessibilityLabel="the accessibility label"
        expanded={false}
      />,
    );

    expect(toJSON()).toMatchInlineSnapshot(`
      <View
        accessibilityLabel="the accessibility label"
        accessibilityRole="button"
        accessibilityState={
          Object {
            "expanded": false,
          }
        }
        accessible={true}
        collapsable={false}
        expanded={false}
        focusable={true}
        onBlur={[Function]}
        onClick={[Function]}
        onFocus={[Function]}
        onLayout={[Function]}
        onResponderGrant={[Function]}
        onResponderMove={[Function]}
        onResponderRelease={[Function]}
        onResponderTerminate={[Function]}
        onResponderTerminationRequest={[Function]}
        onStartShouldSetResponder={[Function]}
        style={Object {}}
      />
    `);
  });
});
