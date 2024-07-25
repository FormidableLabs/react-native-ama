---
displayed_sidebar: checklist
---

import BottomSheet from './bottomsheet.png';

# BottomSheet & Drawers

<img src={BottomSheet} className="zoom-me" width="300" />

| Assistive Techonology/Setting | Action | I can                                                               |
| ----------------------------- | ------ | ------------------------------------------------------------------- |
| Screen Reader                 | Close  | Close dismissable BottomSheets/Drawers                              |
| Screen Reader                 | Focus  | Focus **only** on the element inside the BottomSheet/Drawer         |
| Animations: OFF               | Open   | Present the BottomSheet/Drawer without using any sliding animations |
| Animations: OFF               | Close  | Hide the BottomSheet/Drawer without slide animations                |

## Testing

### Procedures

1. Activate a Screen Reader.
2. Initiate a BottomSheet/Drawer.
3. Ensure that the focus shifts to the BottomSheet/Drawer or its contents.
4. Verify that elements underneath it cannot be focused.
5. Ensure the BottomSheet/Drawer can be dismissed.

#### Animations

1. Activate a Screen Reader.
2. Initiate a BottomSheet/Drawer.
3. Confirm that no sliding animations are performed upon opening.
4. Dismiss the BottomSheet/Drawer.
5. Confirm that no sliding animations are performed upon closing.

### Outcome

Ensure all the following checks are true:

- The focus is shifted inside the BottomSheet/Drawer or to its first header.
- Elements beneath the BottomSheet/Drawer cannot be focused.
- If a BottomSheet/Drawer is dismissable, it should also be closable by Screen Reader users.
- Animations are executed in accordance with the device's Animation settings.
