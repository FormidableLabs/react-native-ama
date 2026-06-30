---
ama_severity: Serious
ama_category: Operable
ama_affected_users: Visual, Motor
ama_success_criterion: 2.3.3@https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
displayed_sidebar: guidelines
---

# Carousel

<AMASection />

A carousel displays a series of items one at a time, where users swipe left or right to move between them. For screen reader users, the standard swipe gesture conflicts with how they navigate the screen — so a carousel must expose `increment` and `decrement` accessibility actions instead, using the `adjustable` role to signal this to the screen reader.

## Expectations

<ScreenReader>
    <When title="The user focuses a Carousel component">
        <Then title="The Screen Reader announces: [Component label] Adjustable/Slider, swipe up or down to adjust">
            <When title="User swipes up">
                <Then noChildren>The previous item is focused</Then>
            </When>
            <When title="User swipes down">
                <Then noChildren>The next item is focused</Then>
            </When>
        </Then>
    </When>
</ScreenReader>

| VoiceOver                                                                           | Talkback                                                    |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| [Component label], Adjustable, swipe up or down with one finger to adjust the value | [Component label], Slider, swipe up or swipe down to adjust |

When the Screen Reader is activated, navigation typically relies on specific gestures to interact with content:

- 1-finger swipe up: This gesture usually focuses on the next item
- 1-finger swipe down: This gesture focuses on the previous item

---

<VoiceControl>
    <When title="The user pronounces the carousel label">
        <Then title="Voice Control highlights the carousel">
            <And noChildren>The user can then issue swipe gestures verbally ("swipe left", "swipe right") to advance between items</And>
        </Then>
    </When>
</VoiceControl>

## Example

To implement this navigation behavior in React Native when the Screen Reader is on, we need to:

- use the [accessibility role](./accessibility-role) **adjustable**
- set `accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}`
- handle **onAccessibilityAction** to change the index

```jsx
<FlatList
  ref={flatList}
  data={data}
  renderItem={renderItem}
  accessible={true}
  accessibilityLabel="Carousel"
  accessibilityRole="adjustable"
  accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
  onAccessibilityAction={(event: AccessibilityActionEvent) => {
    const value = event.nativeEvent.actionName === 'increment' ? 1 : -1;
    const newIndex = carouselIndexForScreenReader.current + value;

    carouselIndexForScreenReader.current = clamp(newIndex, 0, data.length - 1);
    flatList.current?.scrollToIndex({
      index: carouselIndexForScreenReader.current,
    });
  }}
/>
```

## Best Practices

### Use the `adjustable` role with increment/decrement actions

The `adjustable` role tells the screen reader that swipe-up/down adjusts a value. Without it, the user has no indication that the carousel can be navigated at all.

```jsx
accessibilityRole="adjustable"
accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
```

### Announce the current position

Include the item's position in its label or hint so the user knows where they are in the sequence.

```jsx
accessibilityLabel={`Carousel, item ${currentIndex + 1} of ${data.length}`}
```

### Provide a way to pause auto-advancing carousels

If the carousel advances automatically, include a pause or stop control. Auto-advancing content that cannot be paused fails [WCAG 2.2.2 Pause, Stop, Hide](https://www.w3.org/WAI/WCAG21/Understanding/pause-stop-hide.html).
