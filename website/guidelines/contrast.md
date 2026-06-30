---
ama_severity: Critical
ama_category: Perceivable
ama_affected_users: Vision
ama_success_criterion: 1.4.3@https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum
displayed_sidebar: guidelines
---

# Contrast

<AMASection />

Contrast is the difference in brightness between text (or a UI element) and its background. When contrast is too low — for example, light grey text on a white background — users with low vision or colour blindness struggle to read content. WCAG requires a minimum contrast ratio of **4.5:1** for normal text to ensure legibility.

## Expectations

<LowVisionGroup title="People with moderately low vision">
    <When title="Any text is presented">
        <Then noChildren>They should be able to read it</Then>
    </When>
</LowVisionGroup>

- **Text and Background Contrast**: The text should have a contrast ratio against its background of at least 4.5:1. This is especially important for users with visual impairments or color blindness.

- **Color Contrast:** Colors used in graphics, buttons, links, and other UI elements should have sufficient contrast with adjacent colors. This ensures that users can distinguish between different elements, especially in interfaces where color is used to convey information or state.

---

<ScreenReader>
    <When title="Text or UI elements are displayed">
        <Then noChildren>Screen readers do not rely on visual contrast — they read text and semantic attributes regardless of colour. Contrast is a concern for sighted users with low vision, not for screen reader output.</Then>
    </When>
</ScreenReader>

---

<VoiceControl>
    <When title="The user targets an element by voice">
        <Then noChildren>Voice Control identifies elements by their labels, not their visual appearance. Contrast does not affect voice command recognition.</Then>
    </When>
</VoiceControl>

:::note

The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, except for the following:

- **Large Text** Large-scale text and images of large-scale text have a contrast ratio of at least 3:1;

- **Incidental**: Text or images of text that are part of an inactive user interface component, that are pure decoration, that are not visible to anyone, or that are part of a picture that contains significant other visual content, have no contrast requirement.

- **Logotypes**: Text that is part of a logo or brand name has no contrast requirement.

[WCAG: Contrast (Minimum) (Level AA)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum)

:::

## Best Practices

### Verify contrast ratios during design, not just at runtime

Use a contrast checker tool (such as [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/) or your design tool's built-in checker) while choosing colours. Catching failures early is cheaper than fixing them after implementation.

### Meet 4.5:1 for normal text, 3:1 for large text

Large text is 18pt (24px) or larger at normal weight, or 14pt (approximately 18.67px) or larger when bold.

### Don't rely on colour alone to convey meaning

If an error state is shown only by turning text red, users who cannot distinguish red from another colour will miss it. Pair colour with an icon, label, or pattern.

### Treat disabled-state contrast as a design decision

WCAG exempts inactive UI components from the contrast requirement, but very low contrast on disabled elements can still confuse users who do not realise the element is inactive. Aim for enough contrast to be recognisable, even if you fall below 4.5:1.

### Use AMA's runtime contrast check as a safety net

AMA automatically checks the contrast ratio between a component's background and its children at development time. It is a safety net — it catches regressions, but it does not replace a thorough design-time audit.

## AMA dev runtime errors

AMA performs a contrast check on native components at development time.

The [minimum contrast](#contrast_failed) ratio expected is at least `4.5:1`, and by default, this is a mandatory requirement. While the [enhanced contrast](#contrast_failed_aaa) of at least `7:1` is a suggestion and therefore prints only a warning if it fails.

:::tip

Both Log level type and max depth level can be customised, [here for more info](/config-file#customising-the-log-levels)
:::

### CONTRAST_FAILED <Must />

This error is used when the contrast check between a component background and its children foreground one fails to reach the [AA accessibility level](https://www.w3.org/TR/WCAG21/#contrast-minimum).

### CONTRAST_FAILED_AAA <Should />

This code is used when the contrast check does not pass the [AAA level](https://www.w3.org/TR/WCAG21/#contrast-enhanced).

## Related AMA components
