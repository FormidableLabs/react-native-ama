# Animations

> Success Criterion 2.3.3 Animation from Interactions (Level AAA): Motion animation triggered by interaction can be disabled, unless the animation is essential[^1] to the functionality or the information being conveyed. 
>
> https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html

Some people might turn off animation on the device because moving content can distract them, or they might be adversely affected by animations or other reasons.

Our app animations, unless essential[^1], should respect the [Reduce Motion] (https://reactnative.dev/docs/accessibilityinfo) preference and therefore disable any [motion animation](https://www.w3.org/TR/WCAG21/#dfn-motion-animation)
when the option is turned on.
So,

- gifs and videos should not autoplay
- navigation motion should be disabled
- any motion triggered by an interaction with the app

## Related AMA components & hooks

- [AnimatedContainer](../components/animatedcontainer)
- [BottomSheet](../components/bottomsheet)
- [useAMAContext](../hooks/useAMAContext)
- [useAnimation](../hooks/useAnimation)
- [useAnimationDuration](../hooks/useanimationduration)
- [useReanimatedTiming](../hooks/useReanimatedTiming)


[^1]: Basic content scrolling is considered an essential function and is excluded from this requirement.
