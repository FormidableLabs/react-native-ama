---
ama_severity: Critical
ama_category: Operable
ama_affected_users: Cognitive
ama_success_criterion: 2.3.3@https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html
displayed_sidebar: guidelines
---

# Animations

<AMASection />

Some people might turn off animation on the device because moving content can distract them, or they might be adversely affected by animations or other reasons.

## Expectations

<ReduceMotion>
    <When title="The user enables the Reduce Motion option">
        <Then noChildren>Non essential<sup id="fnref-1"><a href="#fn-1" class="footnote-ref">1</a></sup> animations should be disabled</Then>
    </When>
</ReduceMotion>

## Example

- GIFs and Videos: Autoplay should be disabled to prevent unexpected distractions and [potential issues](/guidelines/type-of-accessibility-issues#seizures) for users with certain disabilities
- Navigation Motion: Any motion involved in navigation should be disabled
- Interaction-Triggered Motion: Should be disabled, unless essential[^1]

## Related AMA components & hooks

- [AnimatedContainer](../components/animatedcontainer)
- [BottomSheet](../components/bottomsheet)
- [useAMAContext](../hooks/useAMAContext)
- [useAnimation](../hooks/useAnimation)
- [useAnimationDuration](../hooks/useanimationduration)
- [useReanimatedTiming](../hooks/useReanimatedTiming)

[^1]: If removed, it would fundamentally change the information or functionality of the content, and information and functionality cannot be achieved in another way that would conform. Basic content scrolling is considered an essential function and is excluded from this requirement.
