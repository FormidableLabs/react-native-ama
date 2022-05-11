import * as React from 'react';
import { View } from 'react-native';

type SpacerProps = {
  height: number;
};

export const Spacer: React.FC<SpacerProps> = ({ height }) => {
  return <View style={{ height }} />;
};
