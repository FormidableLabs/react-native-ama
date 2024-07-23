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
    <View style={{ paddingHorizontal: theme.padding.big }}>
      <Header title="This is the bottom sheet" />
    </View>
  }
  scrollViewStyle={styles.modalViewContent}>
  <Pressable
    onPress={() => setModalVisible(!modalVisible)}
    accessibilityRole="button">
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
| ------ | ------- |
| number | 300     |

### `autoCloseDelay`

The duration in milliseconds before auto-closing the bottom sheet

| Type   | Default   |
| ------ | --------- |
| number | undefined |

:::tip

The auto-close will respect the user [Timed action](./guidelines/timed-actions) preference.

:::

### `bottomSheetStyle`

The style to use for the bottom sheet panel

<!-- | Type      | Default                                    |
| --------- | ------------------------------------------ |
| ViewStyle | { width: '100%', backgroundColor: '#fff' } | -->

### <Required /> `closeActionAccessibilityLabel`

The accessibility label to use for the overlay button.

| Type   |
| ------ |
| string |

### `footerComponent`

The bottom sheet footer component.

| Type        |
| ----------- |
| JSX.Element |

### `handleComponent`

It can be used to either disable the default handle "line" or replace it with a custom component.

| Type                  |
| --------------------- |
| JSX.Element \| 'none' |

### `handleStyle`

The style for the draggable line

<!-- | Type      | Default                                                                                                                  |
|-----------|--------------------------------------------------------------------------------------------------------------------------|
| ViewStyle | { width: 48, height: 4, backgroundColor: 'grey', alignSelf: 'center', marginBottom: 24, borderRadius: 2, marginTop: 12 } | -->

### `headerComponent`

The bottom sheet header component.

| Type        |
| ----------- |
| JSX.Element |

### `maxHeight`

The maximum height of the bottom sheet.

| Type   | Default                  |
| ------ | ------------------------ |
| number | 90% of the screen height |

### `minVelocityToClose`

The minimum velocity needed by quickly swiping down to close the bottom sheet.

| Type   | Default                  |
| ------ | ------------------------ |
| number | 90% of the screen height |

### <Required /> `onClose`

The callback to trigger when the BottomSheet is dismissed

| Type       |
| ---------- |
| () => void |

### `overlayOpacity`

The opacity of the overlay.

| Type   | Default |
| ------ | ------- |
| number | 1       |

### `overlayStyle`

The style to use for the overlay

<!-- | Type      | Default                                            |
|-----------|----------------------------------------------------|
| ViewStyle | { backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1 } | -->

### `panGestureEnabled`

Enable or disable the dragging gesture.

| Type    | Default |
| ------- | ------- |
| boolean | true    |

### `persistent`

If true, the bottom sheet will not be closed when the user taps on the overlay; the dragging gesture is also disabled.

| Type    | Default |
| ------- | ------- |
| boolean | true    |

### `scrollEnabled`

Enabled/disables the scrolling of the [<ScrollView />](https://reactnative.dev/docs/scrollview) that wraps the BottomSheet content

| Type    | Default |
| ------- | ------- |
| boolean | false   |

### `scrollViewProps`

The props to use for the [<ScrollView />](https://reactnative.dev/docs/scrollview) that wraps the BottomSheet content

| Type            | Default   |
| --------------- | --------- |
| scrollViewProps | undefined |

### <Required /> ` `topInset`

The value is used to calculate the correct max ScrollView height.

| Type   | Default |
| ------ | ------- |
| number | 0       |

### <Required /> `visible`

The BottomSheet visibility

| Type    |
| ------- |
| boolean |

## Known issues

If the app crashes with the following error:

> Unsupported top level event type "onGestureHandlerStateChange" dispatched

Add the following import at the top of your `App.tsx|jsx` file:

```js
// https://github.com/software-mansion/react-native-gesture-handler/issues/320
import 'react-native-gesture-handler';
```

## Related guidelines

- [BottomSheet](../guidelines/bottomsheet)
- [Focus](../guidelines/focus)
