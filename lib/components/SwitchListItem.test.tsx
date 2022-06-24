import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Switch, Text, View } from 'react-native';

import { SwitchListItem } from './SwitchListItem';

beforeEach(() => {
  jest.clearAllMocks();

  jest.spyOn(console, 'error').mockImplementation();
  jest.spyOn(console, 'info').mockImplementation();
});

describe('SwitchListItem', () => {
  it("renders the label on the left when labelPosition === 'left'", () => {
    const { toJSON } = render(
      <SwitchListItem
        labelComponent={<Text>labelComponent</Text>}
        value={false}
        testID="switch"
        onValueChange={() => {}}
      />,
    );

    expect(toJSON()).toMatchInlineSnapshot(`
      <View
        accessibilityLabel="labelComponent"
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
              Array [
                Object {
                  "alignContent": "center",
                  "alignItems": "center",
                  "flexDirection": "row",
                  "width": "100%",
                },
              ],
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
          labelComponent
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

  it("renders the label on the left when labelPosition === 'right'", () => {
    const { toJSON } = render(
      <SwitchListItem
        labelComponent={<Text>labelComponent</Text>}
        value={false}
        testID="switch"
        labelPosition="right"
        onValueChange={() => {}}
      />,
    );

    expect(toJSON()).toMatchInlineSnapshot(`
      <View
        accessibilityLabel="labelComponent"
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
              Array [
                Object {
                  "alignContent": "center",
                  "alignItems": "center",
                  "flexDirection": "row",
                  "width": "100%",
                },
              ],
            ],
            Object {
              "minHeight": 44,
              "minWidth": 44,
            },
          ]
        }
        testID="switch"
      >
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
        <Text>
          labelComponent
        </Text>
      </View>
    `);
  });

  it('renders the React Native Switch if no children is specified', () => {
    const { UNSAFE_getByType } = render(
      <SwitchListItem
        labelComponent={<Text>labelComponent</Text>}
        value={true}
        onValueChange={() => {}}
      />,
    );

    expect(UNSAFE_getByType(Switch).props).toBeDefined();
  });

  it('hides the children from the accessibilityTree', () => {
    const { getByTestId } = render(
      <SwitchListItem
        labelComponent={<Text>labelComponent</Text>}
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
