---
ama_severity: 2
ama_category: U
ama_affected_users: Visual
ama_success_criterion: 4.1.2@https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html
---

# Accessibility States

Accessibility states are specific attributes that can be added to a component to communicate its current status to assistive technology.

## aria-busy

<Serious withLabel />

<br /><br />

Indicates an element is being modified and that assistive technologies may want to wait until the changes are complete before informing the user about the update.[^1]

| Type    | Default |
| ------- | ------- |
| boolean | false   |

### Expectations

<ScreenReader>
    <When title="The user triggers (double tap) a component">
        <And title="The component is performing a long (or async) task">
            <Then noChildren>The Screen Reader announces the component as <strong>busy</strong></Then>
        </And>
    </When>
</ScreenReader>

#### Example

Assuming we have a button that adds the given product ID to the cart, which requires an API call:

```tsx
const AddToCart = ({ productID }: { productID: string }) => {
  const { addToCart, isAddingToCart } = useQuery(ADD_TO_CART);

  const onPress = async () => {
    const result = await addToCart();
  };

  return (
    <Pressable
      accessibilityLabel="Add to cart"
      accessibilityRole="button"
      ariaBusy={isAddingToCart}
      onPress={isAddingToCart ? undefined : onPress}
    >
      {isAddingToCart} ? <ActivityIndicator /> : <Text>Add to cart</Text>
    </Pressable>
  );
};
```

In the example, while the adding action is happening, the button:

- Ignores any press action
- Shows a loading spinner

While this works fine for sighted users, we must add the `ariaBusy={isAddingToCart}` property for visually impaired users.

### Screen Reader behaviour

#### The user double taps on the example component:

| Voice Over | Talkback                      |
| ---------- | ----------------------------- |
|            | plays a sound as confirmation |

#### The user focuses again on the component while the API is still in flight:

| Voice Over | Talkback                                          |
| ---------- | ------------------------------------------------- |
|            | Add to cart, busy, button, double tap to activate |

## aria-checked

Indicates the state of a checkable element. This field can either take a boolean or the "mixed" string to represent mixed checkboxes.

| Type             | Default |
| ---------------- | ------- |
| boolean, 'mixed' | false   |

## aria-disabled

Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.

| Type    | Default |
| ------- | ------- |
| boolean | false   |

## aria-expanded

Indicates whether an expandable element is currently expanded or collapsed.

| Type    | Default |
| ------- | ------- |
| boolean | false   |

## aria-selected

Indicates whether a selectable element is currently selected or not.

| Type    | Default |
| ------- | ------- |
| boolean | false   |

## External references

- [MDN: aria-busy](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-busy)
- [MDN: aria-checked](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-checked)
- [MDN: aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled)
- [MDN: aria-expanded](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded)
- [MDN: aria-selected](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-selected)
