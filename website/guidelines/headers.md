---
ama_severity: Serious
ama_category: Operable
ama_affected_users: Visual, Mobility
ama_success_criterion: 2.4.6@https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels
displayed_sidebar: guidelines
---

import AndroidListFeature from './android-list-feature.gif';
import IosRotor from './ios-rotor.gif';

# Headers

<AMASection />

Headers play a vital accessibility role by helping screen reader users navigate content efficiently.
When a text element is marked as a header, assistive technologies can recognise its level and provide quick navigation shortcuts (e.g., jumping between headings). This allows non-visual users to understand the screen's structure and navigate sections without having to read everything sequentially.


In React Native, any text element can be designated as a header by assigning the `accessibilityRole="header"` property to it.

:::note

Each page/screen should contain at least one header.

:::

## Expectations

<ScreenReader>
    <When title="A user navigates to a screen">
        <Then noChildren>There is at least one element marked as a header so the user can orient themselves without reading all content linearly</Then>
    </When>
    <When title="A user opens the Rotor (iOS) or List feature (Android) and selects Headers">
        <Then noChildren>They can jump directly between all sections marked as headers on the screen</Then>
    </When>
</ScreenReader>

---

<VoiceControl>
    <When title="A user looks at the screen">
        <Then noChildren>Headers are not interactive targets for voice commands, but they provide visible structure that helps all users — including Voice Control users — understand the page layout at a glance</Then>
    </When>
</VoiceControl>

## Understand the Navigation

Before checking the expectation, let's look at how Screen Reader users can navigate through multiple headers.

Screen Reader users primarily navigate content using specific gestures or keyboard shortcuts, depending on the assistive technology and device:

- **Linear Navigation**: Screen Reader users can swipe right or left (on touch devices) or use arrow keys (keyboard users) to navigate content linearly, including headers.
- **Rotor or List feature Navigation**: Screen readers like VoiceOver (iOS) or TalkBack (Android) have a rotor or list feature. Users can select 'headers' from this list and then swipe up or down to navigate between them.

#### Rotor or List feature

Using the Rotor feature on iOS or the List feature on Android, users can easily navigate various content types such as Headers, Controls, and Paragraphs.
By selecting the headers navigation option, they can quickly skim the screen's content and gain an understanding of its layout and information.

##### VoiceOver

<img src={IosRotor} />

##### Talkback

To navigate the feature list, draw an upward (^) or downward (V) shape using a single finger.

<img src={AndroidListFeature} />

After selecting a particular feature to interact with, users can Swipe up or Swipe down to navigate through the specified type of elements.

### Expectations

<ScreenReader>
  <When title="A user navigates to a screen">
      <And title="Selects Headers from the Rotor/List feature" />
      <Then noChildren>Should be able to navigate through all the sections defined as Headers</Then>
  </When>
</ScreenReader>

Because people who depend on assistive technology often navigate by heading first to quickly get a sense of the content offered in the page.

On iOS, the user will use the [VoiceOver rotor](https://support.apple.com/en-gb/HT204783) to move through the different elements on the screen, i.e. headers. On Android is possible but varies by device.

### No Headers

<Serious label padding />

Neglecting to define headers can be detrimental to screen reader users as we're forcing them to navigate through the entire screen content to understand its context.

#### Invisible header

If your screen design lacks a visible header, it might be acceptable for sighted users, but it can pose challenges for those using screen readers. In such scenarios, it's essential to include a header that's exclusively accessible to screen readers.
We can do this by using an empty &gt;Text&lt; component with an accessible label and role.

```jsx
<Text accessibilityLabel="This is the header" accessibilityRole="header" />
```

## Best Practices

### Every screen needs at least one header

Without a heading, screen reader users navigating by header have no entry point and must read the entire screen linearly. Mark the primary screen title as `accessibilityRole="header"`.

### Don't skip heading levels

Use heading hierarchy to reflect the actual structure of the content. Jumping from a top-level heading straight to a third-level sub-heading confuses users who rely on heading order to build a mental map of the page.

### Add a screen-reader-only header when the design has no visible title

If the screen design has no visible heading, add a `<Text>` element that is visually hidden but accessible:

```jsx
<Text accessibilityLabel="Products" accessibilityRole="header" />
```

### Keep heading text short and descriptive

Headings are navigation landmarks — users hear them rapidly while scanning. A heading like "Settings" is better than "Here you can manage all your application settings".

## Related AMA components

- [Text](../components/text)

## External Resources

- [Mobile Screen Reader Cheat Sheets](https://qbalsdon.github.io/accessibility,/testing,/talkback,/voiceover/2023/05/10/accessibility-cheatsheets.html?ref=accessible-mobile-apps-weekly.ghost.io)
