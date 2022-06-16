import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import { SwitchListItem } from './SwitchListItem';

beforeEach(() => {
  jest.clearAllMocks();

  jest.spyOn(console, 'error').mockImplementation();
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
            "checked": false,
          }
        }
        accessible={true}
        focusable={true}
        onClick={[Function]}
        onLayout={[Function]}
        onResponderGrant={[Function]}
        onResponderMove={[Function]}
        onResponderRelease={[Function]}
        onResponderTerminate={[Function]}
        onResponderTerminationRequest={[Function]}
        onStartShouldSetResponder={[Function]}
        style={
          Array [
            Array [
              Object {
                "alignContent": "center",
                "alignItems": "center",
                "flexDirection": "row",
                "width": "100%",
              },
            ],
            Object {
              "minHeight": 44,
              "minWidth": 44,
            },
          ]
        }
        testID="switch"
      >
        <Text>
          Label
        </Text>
        <RCTSwitch
          accessibilityElementsHidden={true}
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

  it('hides the children from the accessibilityTree', () => {
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
