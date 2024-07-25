---
ama_severity: Serious
ama_category: Operable
ama_affected_users: Visual, Mobility
ama_success_criterion: 2.4.6@https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels
displayed_sidebar: guidelines
---

import AndroidListFeature from './android-list-feature.gif';

# Headers

Headers are crucial in organizing and structuring content in a mobile app. They provide a clear hierarchy, guiding users through the content and making it more accessible and understandable.
In React Native, any text element can be designated as a header by assigning the [accessibilityRole](/guidelines/accessibility-role) property to "header".

:::note

Each page/screen should contain at least one header.

:::

## Understand the Navigation

Before checking the expectation, let's look at how Screen Reader users can navigate through multiple headers.

Screen Reader users primarily navigate content using specific gestures or keyboard shortcuts, depending on the assistive technology and device:

- **Linear Navigation**: Screen Reader users can swipe right or left (on touch devices) or use arrow keys (keyboard users) to navigate content linearly, including headers.
- **Rotor or List feature Navigation**: Screen readers like VoiceOver (iOS) or TalkBack (Android) have a rotor or list feature. Users can select 'headers' from this list and then swipe up or down to navigate between them.

#### Rotor or List feature

Using the Rotor feature on iOS or the List feature on Android, users can easily navigate various content types such as Headers, Controls, and Paragraphs.
By selecting the headers navigation option, they can quickly skim the screen's content and gain an understanding of its layout and information.

##### VoiceOver

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

## Related AMA components

- [Text](../components/text)

## External Resources

- [Mobile Screen Reader Cheat Sheets](https://qbalsdon.github.io/accessibility,/testing,/talkback,/voiceover/2023/05/10/accessibility-cheatsheets.html?ref=accessible-mobile-apps-weekly.ghost.io)
