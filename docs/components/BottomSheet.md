import { Required } from '@site/src/components'

# BottomSheet

AMA Provides an accessible bottom sheet built on top
of [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)
and [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler).

## Example

```jsx
<BottomSheet
    visible={modalVisible}
    onRequestClose={() => {
        setModalVisible(!modalVisible);
    }}
    closeActionAccessibilityLabel="close bottomsheet"
    bottomSheetStyle={styles.modalView}
    headerComponent={
        <View style={{paddingHorizontal: theme.padding.big}}>
            <Header title="This is the bottom sheet"/>
        </View>
    }
    scrollViewStyle={styles.modalViewContent}>
    <Pressable
        onPress={() => setModalVisible(!modalVisible)}
        accessibilityRole="button"
    >
        <Text>Close bottom sheet</Text>
    </Pressable>
</BottomSheet>
```

## Accessibility 

- Checks that the `closeActionAccessibilityLabel` is a valid [accessibilityLabel](./guidelines/accessibility-label)
- Provides a way [to close the bottom sheet](../guidelines/bottomsheet#2-can-be-dismissed) when the user taps on the overlay
- Makes sure that the overlay is announced as "button"
- Uses slide-in and slide-out animation **only** if the [Reduce Motion] (https://reactnative.dev/docs/accessibilityinfo) preference is turned off
- Prevents the focus from [escaping the bottom sheet](../guidelines/bottomsheet#3-the-focus-stays-inside-it)
- Provides a draggable area respecting the [minimum size](../guidelines/minimum-size)

## Props

### `animationDuration`

The duration in milliseconds of the slide in/out animation.

| Type   | Default |
|--------|---------|
| number | 300     |

### `bottomSheetStyle`

The style to use for the bottom sheet panel 

| Type      | Default                                    |
|-----------|--------------------------------------------|
| ViewStyle | { width: '100%', backgroundColor: '#fff' } |

### <Required /> `closeActionAccessibilityLabel`

The accessibility label to use for the overlay button.

| Type   |
|--------|
| string |

### `headerComponent`

The bottom sheet header component.

| Type        |
|-------------|
| JSX.Element |

### `lineComponent`

Can be used to either disable the "line" or replace it with a custom component.

| Type        |
|-------------|
| JSX.Element |

:::note

This option does only replace the content of the draggable area, will not remove it.

:::

### `lineStyle`

The style for the draggable line

| Type      | Default                                                                                                                  |
|-----------|--------------------------------------------------------------------------------------------------------------------------|
| ViewStyle | { width: 48, height: 4, backgroundColor: 'grey', alignSelf: 'center', marginBottom: 24, borderRadius: 2, marginTop: 12 } |

### <Required /> `onRequestClose`

The callback to trigger when the BottomSheet is dismissed

| Type       |
|------------|
| () => void |

### `overlayStyle`

The style to use for the overlay

| Type      | Default                                            |
|-----------|----------------------------------------------------|
| ViewStyle | { backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1 } |


### `scrollEnabled`

Enabled/disables the scrolling of the [<ScrollView />](https://reactnative.dev/docs/scrollview) that wraps the BottomSheet content

| Type    | Default |
|---------|---------|
| boolean | false   |

### `scrollViewStyle`

The style to use for the [<ScrollView />](https://reactnative.dev/docs/scrollview) that wraps the BottomSheet content

| Type      | Default |
|-----------|---------|
| ViewStyle | {  }    |

### <Required /> `visible`

The BottomSheet visibility


| Type    |
|---------|
| boolean |

## Related guidelines

- [ButtomSheet](../guidelines/bottomsheet)
- [Focus](../guidelines/focus)

[^1]: The announcement is made only when the list is filtered, and the number of items displayed is different from the original one
[^2]: This is with the default behaviour that can be customised via the [isPlural](#isplural) prop
