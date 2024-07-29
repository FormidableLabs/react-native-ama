---
ama_severity: Serious
ama_category: Understandable
ama_affected_users: Visual
ama_success_criterion: 4.1.2@https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html
displayed_sidebar: guidelines
---

# Accessibility States

<AMASection />

Accessibility states are specific attributes that can be added to a component to communicate its current status to assistive technology.

## aria-busy

<Serious label dot padding />

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

### Screen Reader behaviour

Assuming we have a button that adds the given product ID to the cart, which requires an API call:

```tsx {1-11,13-18}
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

While this works fine for sighted users, we must add the `ariaBusy={isAddingToCart}` property for visually impaired users to signal that the action is still happening.

#### The user double taps on the example component:

| VoiceOver | Talkback                      |          |
| --------- | ----------------------------- | -------- |
|           | plays a sound as confirmation | <Good /> |

#### The user focuses again on the component while the API is still in flight:

| VoiceOver | Talkback                                          |          |
| --------- | ------------------------------------------------- | -------- |
|           | Add to cart, busy, button, double tap to activate | <Good /> |

## aria-checked

<Serious label dot padding />

Indicates the state of a checkable element. This field can either take a boolean or the "mixed" string to represent mixed checkboxes.

| Type             | Default |
| ---------------- | ------- |
| boolean, 'mixed' | false   |

### Expectations

<ScreenReader>
    <When title="The component can be toggle">
        <And title="Receives the focus">
            <Then noChildren>The <strong>checked</strong> status is announced</Then>
            <And title="And the accessibility label is announced" />
            <And title="And the accessibility role is announced" />
            <And title="And the available action is announced" />
        </And>
    </When>
</ScreenReader>

:::caution

`aria-checked` is not to be confused with `aria-selected`.
`aria-checked` is only meant to be used with checkboxes and toggle buttons.

:::

### Screen Reader behaviour

```tsx {1-9,11-16}
type ToggleButtonProps = {
  checked: boolean;
  label: string;
};

export const ToggleButton = ({ checked, label }: ToggleButtonProps) => {
  return (
    <Pressable
      accessibilityLabel={label}
      ariaChecked={checked}
      ariaRole="button"
    >
      {label}
    </Pressable>
  );
};
```

Assuming the button `label` is: **Add me to the list**

#### The user selects the component

| State           | VoiceOver | Talkback                                                      |          |
| --------------- | --------- | ------------------------------------------------------------- | -------- |
| checked         |           | ticked, Add me to the list, tickbox, double tap to toggle     | <Good /> |
| **not** checked |           | not ticked, Add me to the list, tickbox, double tap to toggle | <Good /> |

#### The user double taps on the example component:

| New state   | VoiceOver | Talkback   |          |
| ----------- | --------- | ---------- | -------- |
| checked     |           | ticked     | <Good /> |
| not checked |           | not ticked | <Good /> |

## aria-disabled

<Serious label dot padding />

Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.

| Type    | Default |
| ------- | ------- |
| boolean | false   |

### Expectations

<ScreenReader>
    <When title="The component is disabled">
        <And title="Receives the focus">
            <Then noChildren>The Screen Reader announces its <strong>disabled</strong> status first</Then>
            <And title="The accessibility label is announced" />
            <And title="The accessibility role is announced" />
        </And>
    </When>
</ScreenReader>

### Screen Reader behaviour

```jsx {1-5,7-11}
const AddToCart = ({ disabled }) => {
  return (
    <Pressable
      accessibilityLabel="Add to cart"
      accessibilityRole="button"
      disabled={disabled}
    >
      Add to cart
    </Pressable>
  );
};
```

#### When the component receives the focus

| Is Disabled? | VoiceOver                                          | Talkback                                           |          |
| ------------ | -------------------------------------------------- | -------------------------------------------------- | -------- |
| false        | Add me to the cart, button, double tap to activate | Add me to the cart, button, double tap to activate | <Good /> |
| true         | dimmed, Add me to the cart, button                 | disabled, Add me to the cart, button               | <Good /> |

## aria-expanded

<Serious dot label padding />

Indicates whether an expandable element is currently expanded or collapsed.

| Type    | Default |
| ------- | ------- |
| boolean | false   |

### Expectations

<ScreenReader>
    <When title="The user triggers (double tap) a collapsable component, i.e. Accordion">
        <And title="Its content is expanded/collapsed">
            <Then noChildren>The Screen Reader announces the component as <strong>expanded/collapsed</strong></Then>
        </And>
    </When>
</ScreenReader>

### Screen Reader behaviour

```jsx {1-9,11-18}
export const Content = ({ content }) => {
  const [isShowingMore, setIsShowingMore] = React.useState(false);

  return (
    <View>
      <Text numberOfLines={isShowingMore ? undefined : 2}>{content}</Text>
      <Pressable
        accessibilityLabel="Show more"
        accessibilityRole="button"
        ariaExpanded={isShowingMore}
        onPress={() => setIsShowingMore(showMore => !showMore)}
      >
        {isShowingMore ? 'Show less' : 'Show more'}
      </Pressable>
    </View>
  );
};
```

#### When the component receives the focus

| Is the content expanded? | VoiceOver | Talkback                                            |          |
| ------------------------ | --------- | --------------------------------------------------- | -------- |
| false                    |           | Show more, collapsed button, double tap to activate | <Good /> |
| true                     |           | Show less, expanded, button, double tap to activate | <Good /> |

#### When the component is activated (double-tap)

| Is the new state expanded? | VoiceOver | Talkback                                            |          |
| -------------------------- | --------- | --------------------------------------------------- | -------- |
| false                      |           | Show more, collapsed button, double tap to activate | <Good /> |
| true                       |           | Show less, expanded, button, double tap to activate | <Good /> |

## aria-selected

Indicates whether a selectable element is currently selected or not.

| Type    | Default |
| ------- | ------- |
| boolean | false   |

### Expectations

<ScreenReader>
    <When title="The user selects an option component, i.e. radio button">
      <Then noChildren>The Screen Reader announces the component <strong>selected</strong> state first</Then>
    </When>
</ScreenReader>

### Screen Reader behaviour

```jsx {1-5,7-19,21-99}
const OptionButton = ({ selected, label }) => {
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      ariaSelected={selected}
    >
      <Text>{label}</Text>
    </Pressable>
  );
};

const TestScreen = () => {
  const [selectedOption, setSelectedOption] = React.useState('Big');

  return ['Big', 'Medium', 'Small'].map(size => {
    return (
      <Option
        label={size}
        selected={optionSelected}
        onPress={() => setSelectedOption(size)}
      />
    );
  });
};
```

#### When the component receives the focus

| Is Selected? | VoiceOver | Talkback                                                       |          |
| ------------ | --------- | -------------------------------------------------------------- | -------- |
| false        |           | _accessibility label_, button, double tap to activate          | <Good /> |
| true         |           | Selected, _accessibility label_ button, double tap to activate | <Good /> |

#### When the component is activated (double-tap)

| Is the new state selected? | VoiceOver | Talkback                        |          |
| -------------------------- | --------- | ------------------------------- | -------- |
| true                       |           | _accessibility label_, selected | <Good /> |
| false                      |           |                                 | <Good /> |

## Related AMA components

- [ExpandablePressable](/core/components/expandablepressable)
- [Pressable](/core/components/pressable)
- [TouchableOpacity](/core/components/touchableopacity)
- [TouchableWithoutFeedback](/core/components/TouchableWithoutFeedback)

## External references

- [MDN: aria-busy](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-busy)
- [MDN: aria-checked](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-checked)
- [MDN: aria-disabled](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-disabled)
- [MDN: aria-expanded](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-expanded)
- [MDN: aria-selected](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-selected)
- [How Not To Misuse ARIA States, Properties and Roles](https://www.levelaccess.com/blog/how-not-to-misuse-aria-states-properties-and-roles/)

```

```

```

```
