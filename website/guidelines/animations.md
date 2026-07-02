---
ama_severity: Critical
ama_category: Operable
ama_affected_users: Cognitive
ama_success_criterion: 2.3.3@https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
displayed_sidebar: guidelines
---

# Animations

<AMASection />

Some people are sensitive to motion — animations can cause dizziness, nausea, or distraction for users with vestibular disorders, attention differences, or epilepsy. React Native exposes a system-level "Reduce Motion" setting that lets users opt out of non-essential animations. Your app should respect it.

## Expectations

<ReduceMotion>
    <When title="The user enables the Reduce Motion option">
        <Then noChildren>Non essential<sup id="fnref-1"><a href="#fn-1" class="footnote-ref">1</a></sup> animations should be disabled</Then>
    </When>
</ReduceMotion>

---

<ScreenReader>
    <When title="An animation plays">
        <Then noChildren>The Screen Reader does not announce the animation itself — only content changes triggered by the animation are announced, if accessibility events are correctly wired</Then>
    </When>
</ScreenReader>

---

<VoiceControl>
    <When title="An animation plays">
        <Then noChildren>Animations do not affect voice command recognition — elements remain targetable by their labels during and after animation</Then>
    </When>
</VoiceControl>

## Example

- GIFs and Videos: Autoplay should be disabled to prevent unexpected distractions and [potential issues](/guidelines/type-of-accessibility-issues#cognitive) for users with certain disabilities
- Navigation Motion: Any motion involved in navigation should be disabled
- Interaction-Triggered Motion: Should be disabled, unless essential[^1]

## Best Practices

### Always check the Reduce Motion setting before animating

Use AMA's `useAnimationDuration` hook or the platform's `AccessibilityInfo.isReduceMotionEnabled` to check the user's preference before starting an animation.

```tsx
import { useAnimationDuration } from '@react-native-ama/animations';

const duration = useAnimationDuration({ duration: 300 });
// Returns 0 when Reduce Motion is enabled, 300 otherwise
```

### Disable autoplay for GIFs and videos

Autoplay motion can startle users and cause harm for those with vestibular disorders or photosensitive epilepsy. Always start paused and give users explicit control to play.

### Keep essential animations, cut decorative ones

An animation is essential only if removing it would fundamentally change what the user understands or can do[^1]. Decorative transitions, loading spinners, and bounce effects should all be disabled under Reduce Motion.

### Use AMA components where possible

AMA's `AnimatedContainer` and related hooks handle the Reduce Motion check automatically. Prefer them over building custom animations that require manual `isReduceMotionEnabled` checks.

## Related AMA components & hooks

- [AnimatedContainer](/animations/components/AnimatedContainer)
- [BottomSheet](/bottom-sheet/components/BottomSheet)
- [useAMAContext](/core/hooks/useAMAContext)
- [useAnimation](/animations/hooks/useAnimation)
- [useAnimationDuration](/animations/hooks/useAnimationDuration)
- [useReanimatedTiming](/animations/hooks/useReanimatedTiming)

[^1]: If removed, it would fundamentally change the information or functionality of the content, and information and functionality cannot be achieved in another way that would conform. Basic content scrolling is considered an essential function and is excluded from this requirement.
