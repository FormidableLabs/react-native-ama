---
ama_severity: Critical
ama_category: Perceivable
ama_affected_users: Vision
ama_success_criterion: 1.4.3@https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum
---

# Contrast

Contrast refers to the difference in luminance or colour that makes an object (or its representation in an image or display) distinguishable from its surroundings.

## Expectations

<LowVisionGroup title="People with moderately low vision">
    <When title="Any text is presented">
        <Then noChildren>They should be able to read it</Then>
    </When>
</LowVisionGroup>

- **Text and Background Contrast**: The text should have a contrast ratio against its background of at least 4.5:1. This is especially important for users with visual impairments or color blindness.

- **Color Contrast:** Colors used in graphics, buttons, links, and other UI elements should have sufficient contrast with adjacent colors. This ensures that users can distinguish between different elements, especially in interfaces where color is used to convey information or state.

:::note

The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for the following:

- **Large Text** Large-scale text and images of large-scale text have a contrast ratio of at least 3:1;

- **Incidental**: Text or images of text that are part of an inactive user interface component, that are pure decoration, that are not visible to anyone, or that are part of a picture that contains significant other visual content, have no contrast requirement.

- **Logotypes**: Text that is part of a logo or brand name has no contrast requirement.

[WCAG: Contrast (Minimum) (Level AA)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum)

:::

## AMA dev runtime errors

AMA performs a contrast check between the component background and its children for:

- [ExpandablePressable](../components/expandablepressable)
- [Pressable](../components/pressable)
- [TouchableOpacity](../components/touchableopacity)
- [TouchableWithoutFeedback](../components/TouchableWithoutFeedback)
- [usePressable](/hooks/usePressable)

The check is performed on the component children and sub children up to a depth level of [5](./custom-log-rules.md#constants).

The [minimum contrast](#contrast_failed) ratio expected is at least `4.5:1`, and by default, this is a mandatory requirement. While the [enhanced contrast](#contrast_failed_aaa) of at least `7:1` is a suggestion and therefore prints only a warning if it fails.

:::tip

Both Log level type and max depth level can be customised, [here for more info](/config-file#customising-the-log-levels)
:::

### CONTRAST_FAILED <Must />

This error is used when the contrast check between a component background and its children foreground one fails to reach the [AA accessibility level](https://www.w3.org/TR/WCAG21/#contrast-minimum).

### CONTRAST_FAILED_AAA <Should />

This code is used when the contrast check does not pass the [AAA level](https://www.w3.org/TR/WCAG21/#contrast-enhanced).

## Related AMA components
