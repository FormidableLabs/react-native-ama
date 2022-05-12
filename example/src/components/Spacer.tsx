import * as React from 'react';
import { View } from 'react-native';

import { theme } from '../theme';

type SpacerProps = {
  height: keyof typeof theme.padding;
};

export const Spacer: React.FC<SpacerProps> = ({ height }) => {
  return <View style={{ height: theme.padding[height] }} />;
};
