import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import { SwitchListItem } from './SwitchListItem';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('SwitchListItem', () => {
  it('matches the snapshot', () => {
    const { toJSON } = render(
      <SwitchListItem
        label={<Text>Label</Text>}
        value={false}
        testID="switch"
        onValueChange={() => {}}
      />,
    );

    expect(toJSON()).toMatchInlineSnapshot(`
      <View
        accessibilityLabel="Label"
        accessibilityRole="switch"
        accessibilityState={
          Object {
            "busy": undefined,
            "checked": false,
            "disabled": undefined,
            "expanded": undefined,
            "selected": undefined,
          }
        }
        accessible={true}
        checked={false}
        focusable={false}
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
        style={
          Array [
            Object {
              "alignContent": "center",
              "alignItems": "center",
              "flexDirection": "row",
              "minHeight": 44,
              "width": "100%",
            },
            Object {},
          ]
        }
        testID="switch"
      >
        <Text>
          Label
        </Text>
        <RCTSwitch
          accessibilityElementsHidden={true}
          accessibilityLabel="Label"
          accessibilityRole="switch"
          importantForAccessibility="no"
          onChange={[Function]}
          onResponderTerminationRequest={[Function]}
          onStartShouldSetResponder={[Function]}
          style={
            Array [
              Object {
                "height": 31,
                "width": 51,
              },
              Object {},
            ]
          }
          testID="switch-switch"
          value={false}
        />
      </View>
    `);
  });

  it('hides the children fro mthe accessibilityTree', () => {
    const { getByTestId } = render(
      <SwitchListItem
        label={<Text>Label</Text>}
        value={true}
        onValueChange={() => {}}>
        <View testID="custom-switch" />
      </SwitchListItem>,
    );

    expect(getByTestId('custom-switch').props).toEqual(
      expect.objectContaining({
        importantForAccessibility: 'no',
        accessibilityElementsHidden: true,
      }),
    );
  });
});
