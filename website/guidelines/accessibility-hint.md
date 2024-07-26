---
displayed_sidebar: guidelines
---

# Accessibility Hint

Accessibility hint helps users understand the element's purpose when the accessibility label alone is not enough.
For example:

```jsx
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Like"
  accessibilityHint="Likes the song"
  onPress={onPress}
>
  <View style={styles.button}>
    lib
    <Text style={styles.buttonText}>Like</Text>
  </View>
</TouchableOpacity>
```

In the example announcing only "Like" might be not enough for a screen reader user, so we've added the extra information: "Likes the song."

:::danger

The field is optional and should only be used if the label itself is not self-explanatory, don't overload a screen reader user with too much information.

:::
