# AMAProvider

The provider contains information about the various accessibility services. 

## Usage

```tsx
<AMAProvider>
    ...
</AMAProvider>
```

## Context Values

```ts title=lib/providers/AMAProvider.tsx
export type AMAContextValue = {
    isBoldTextEnabled: boolean;
    isScreenReaderEnabled: boolean;
    isGrayscaleEnabled: boolean;
    isInvertColorsEnabled: boolean;
    isReduceMotionEnabled: boolean;
    isReduceTransparencyEnabled: boolean;
    reactNavigationScreenOptions: {
        animationEnabled: boolean;
        animation: 'default' | 'fade';
    };
};
```
Check [useAMAContext](../hooks/useAMAContext.md) for more info.
