import type { StyleProp } from 'react-native';

export const getPropertyFromStyle = (
  style: StyleProp<any> | StyleProp<any>[] | null,
  key: keyof StyleProp<any>,
) => {
  return Array.isArray(style)
    ? style.find(theStyle => theStyle[key])?.[key]
    : style?.[key];
};
