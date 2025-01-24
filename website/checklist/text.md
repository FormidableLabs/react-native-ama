---
displayed_sidebar: checklist
---

import Text from '../static/gif/text.gif';
import Image from 'next/image'

# Text

**Guideline**: [Text](/guidelines/text)

![dodge gif](${Text})

| Accessibility Setting | I see                                                              |
| --------------------- | ------------------------------------------------------------------ |
| Font size             | The Text adheres to phone settings and remains readable up to 300% |
| Bold font             | When activated, all the text is rendered in bold                   |

## Uppercase

|                | I hear                                                      |
| -------------- | ----------------------------------------------------------- |
| Uppercase text | A screen reader reading the words without spelling them out |

:::note

If your design utilizes uppercase text, please provide a sentence case version using the `accessibility-label` property.
:::

## Testing

### Procedures

1. Adjust the accessibility setting: Font Size.
1. Verify that the app adheres to this setting and all text remains readable.
1. Modify the accessibility setting: Bold Font.
1. Ensure that the app honours this setting.
1. Activate a Screen Reader.
1. Ensure that all uppercase text is pronounced correctly.

### Outcome

Ensure all the following checks are true:

- The app's font size adjusts in accordance with the phone's "Font Size" setting, and all text continues to be readable.
- All of the app's text becomes bold when the corresponding accessibility setting is activated.
- A screen reader reads out all the text correctly without spelling words
