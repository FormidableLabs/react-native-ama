const baseTheme = {
  padding: {
    small: 6,
    normal: 12,
    big: 24,
  },
  fontSize: {
    normal: 14,
    medium: 18,
    big: 24,
  },
  color: {
    black: '#000',
    gray: '#cfcfd1',
    white: '#fff',
    hover: '#005D85',
    disabled: '#5C5757',
    checked: '#820085',
    mixed: '#006602',
    selected: '#660000',
    header: '#17387e',
  },
  lineHeight: {
    normal: 16,
    medium: 24,
    big: 48,
  },
  flex1: {
    flex: 1,
  },
  border: 8,
};

export const theme = {
  ...baseTheme,
  safeAreaView: {
    flex: 1,
    backgroundColor: baseTheme.color.white,
  },
  safeAreaViewBlue: {
    flex: 0,
    backgroundColor: baseTheme.color.header,
  },
};
