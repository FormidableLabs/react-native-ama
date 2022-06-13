import type { StyleProp } from 'react-native';

export const getPropertyFromStyle = (
  style: StyleProp<any> | StyleProp<any>[] | null,
  key: keyof StyleProp<any>,
) => {
  return Array.isArray(style)
    ? style.filter(theStyle => theStyle[key])?.slice(-1)?.[0]?.[key]
    : style?.[key];
};
