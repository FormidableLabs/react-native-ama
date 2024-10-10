---
ama_severity: Serious
ama_category: Operable
ama_affected_users: Visual, Motor
ama_success_criterion: 2.3.3@https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
displayed_sidebar: guidelines
---

# Carousel

<AMASection />

When implementing a Carousel, it's essential to ensure that users can easily navigate through its items.

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

### Related AMA utility

- [Carouse](/extras/components/Carousel)
- [useCarousel](/extras/hooks/useCarousel)
