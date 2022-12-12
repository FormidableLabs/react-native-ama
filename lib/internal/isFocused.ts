import type { TextInput } from 'react-native';

export const isFocused = (input: TextInput | undefined | null) => {
  return input?.isFocused();
};
