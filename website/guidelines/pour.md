---
sidebar_position: 1
displayed_sidebar: guidelines
---

# POUR — Accessibility Principles

POUR stands for **Perceivable, Operable, Understandable, and Robust** — the four core principles of accessible design established by the W3C (World Wide Web Consortium) in the [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/TR/WCAG21/). Every guideline in this section maps to one of these four principles.

## Perceivable

> Information and user interface components must be presentable to users in ways they can perceive.

**What it means:** Users take in information through sight, sound, and touch. If content is only available through one sense — for example, a video with no captions, or an image with no text description — users who lack that sense cannot access it. The goal is to offer alternative ways to access the same information.

### Examples

- Support assistive technology, like screen readers
- Video captions for a person with hearing impairment
- [Respect the device font size setting for a person with low vision](/guidelines/text)
- [Provide a good contrast between the content and background](/guidelines/contrast)
- Provide alternative style for content interactions, i.e. hover and focus states

## Operable

> User interface components and navigation must be operable.

**What it means:** Users must be able to interact with the app using more than just touch. Some users rely on keyboards, switch access devices, or voice control. Elements must also give users enough time to complete tasks — not everything can assume fast, precise input.

### Examples

- The app should be fully functional through keyboard inputs
- [Users should be given ample time to complete tasks](/guidelines/timed-actions)
- [The app should be designed in a way that minimizes the risk of triggering seizures or other involuntary reactions](/guidelines/animations)
- [Focus order](/guidelines/focus), screen titles, [headings](/guidelines/headers), and [labels](/guidelines/accessibility-label) should be clearly defined to facilitate easy navigation
- The app should offer appropriately [sized touch targets](/guidelines/minimum-size) and alternative input methods

## Understandable

> Information and the operation of user interface must be understandable.

**What it means:** Content and behaviour should be easy to understand. This means using clear language, consistent patterns, and helpful error messages — so users can always predict what will happen and recover when something goes wrong.

### Examples

- The app should use a navigation structure that is both predictable and consistent
- Abbreviations, jargon, and reading levels should be avoided to ensure the app is accessible to a broad audience
- Elements should be consistent in style and behave consistently and predictably to avoid confusing users
- No two identical-looking controls should function differently. The inverse is also true; two controls with the same function should have the same appearance
- The app should provide clear feedback for user actions and effective [error handling](/guidelines/forms) to guide users in correcting mistakes
- Contextual help and error prevention mechanisms should be in place to assist users in navigating the app more effectively

## Robust

> Content must be robust enough that it can be interpreted by a wide variety of user agents, including assistive technologies.

**What it means:** The app must work correctly across different devices, operating systems, and assistive technologies — not just the most common setup. Robustness is mostly about using standard attributes and patterns that assistive technologies know how to interpret.

### Examples

- Components should be clearly defined with appropriate [names](/guidelines/accessibility-label), [roles](/guidelines/accessibility-role), and values
- Messages like "added to cart" should be conveyed to the user in a way that doesn't interrupt their workflow or shift their focus

## External references

- [What Does It Mean for Content to be POUR?](https://www.accessibility.com/blog/what-does-it-mean-for-content-to-be-pour)
- [Web Accessibility: POUR Acronym Explained](https://equalizedigital.com/web-accessibility-p-o-u-r-acronym/)
- [Understanding the Four Principles of Accessibility](https://www.w3.org/TR/UNDERSTANDING-WCAG20/intro.html#:~:text=Perceivable)
