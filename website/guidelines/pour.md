---
sidebar_position: 1
displayed_sidebar: guidelines
---

# POUR - Accessibility Principles

The POUR principles, established by the W3C, consist of four fundamental guidelines that form the basis for making a mobile app accessible to all users.

## Perceivable

> Information and user interface components must be presentable to users in ways they can perceive.

### What to do?

Users typically perceive and interact with information presented in an app through **sight**, **sound**, and, in some instances, **touch**.

The goal is to offer alternative ways for users to access information to accommodate senses that may be weaker or absent.

### Examples

- Support assistive technology, like screen readers
- Video captions for a person with hearing impairment
- [Respect the device font size setting for a person with low vision](/guidelines/text)
- [Provide a good contrast between the content and background](/guidelines/contrast)
- Provide alternative style for content interactions, i.e. hover and focus states

## Operable

> User interface components and navigation must be operable.

### What to do?

We must ensure the app is compatible with assistive technologies, including keyboards, switches, and screen readers. Also, we must provide enough time to complete and correct tasks.

### Examples

- The app should be fully functional through keyboard inputs
- [Users should be given ample time to complete tasks](/guidelines/timed-actions)
- [The app should be designed in a way that minimizes the risk of triggering seizures or other involuntary reactions](/guidelines/animations)
- [Focus order](/guidelines/focus), screen titles, [headings](/guidelines/headings), and [labels](/guidelines/accessibility-label) should be clearly defined to facilitate easy navigation
- The app should offer appropriately [sized touch targets](/guidelines/minimum-size) and alternative input methods

## Understandable

> Information and the operation of user interface must be understandable.

The Understandable principle includes guidelines for readable content, predictable content, and input assistance.

### What to do?

We must use clear language and functionality that are easy to understand. Additionally, maintaining consistent patterns helps users anticipate outcomes.

### Example

- The app should use a navigation structure that is both predictable and consistent
- Abbreviations, jargon, and reading levels should be avoided to ensure the app is accessible to a broad audience
- Elements should be consistent in style and behave consistently and predictably to avoid confusing users
- No two identical-looking controls should function differently. The inverse is also true; two controls with the same function should have the same appearance
- The app should provide clear feedback for user actions and effective [error handling](/guidelines/forms) to guide users in correcting mistakes
- Contextual help and error prevention mechanisms should be in place to assist users in navigating the app more effectively

## Robust

> Content must be robust enough that it can be interpreted by a wide variety of user agents, including assistive technologies.

We must ensure that our app functions effectively across various devices, including assistive technologies.

### Example

- Components should be clearly defined with appropriate [names](/guidelines/accessibility-label), [roles](/guidelines/accessibility-role), and values
- Messages like "added to cart" should be conveyed to the user in a way that doesn't interrupt their workflow or shift their focus

## External references

- [What Does It Mean for Content to be POUR?](https://www.accessibility.com/blog/what-does-it-mean-for-content-to-be-pour)
- [Web Accessibility: POUR Acronym Explained](https://equalizedigital.com/web-accessibility-p-o-u-r-acronym/)
- [Unerstanding the Four Principles of Accessibility](https://www.w3.org/TR/UNDERSTANDING-WCAG20/intro.html#:~:text=Perceivable)
