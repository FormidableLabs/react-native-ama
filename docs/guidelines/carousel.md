# Carousel

When dealing with Carousel, we need to make sure that the user is able to navigate through its items.
The navigation is generally done by swiping one finger up or done:

- 1 finger swipe up: go to the next item
- 1 finger swipe down: go to the previous item

To do this in React Native we need to:

- use the [accessibility role](./accessibility-role) **adjustable**
- set `accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}`
- handle **onAccessibilityAction** to change the index

## Example

```jsx

<FlatList
    ref={flatList}
    data={data}
    renderItem={renderItem}
    accessible={true}
    accessibilityRole="adjustable"
    accessibilityLabel="Carousel"
    accessibilityActions={[
        { name: 'increment' },
        { name: 'decrement' }
    ]}
    onAccessibilityAction={(event: AccessibilityActionEvent) => {
        const value = event.nativeEvent.actionName === 'increment' ? 1 : -1;
        const newIndex = carouselIndexForScreenReader.current + value;

        carouselIndexForScreenReader.current = clamp(
            newIndex,
            0,
            data.length - 1,
        );
        flatList.current?.scrollToIndex({
            index: carouselIndexForScreenReader.current,
        });
    }}
/>

```
