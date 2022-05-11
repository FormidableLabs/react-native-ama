import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { Text } from 'react-native';
import { Pressable } from 'react-native-ama';
import Svg, { Path } from 'react-native-svg';

export const BackButton = () => {
  const navigation = useNavigation();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={navigation.goBack}
      accessibilityLabel="Back">
      <Svg width={32} height={32} viewBox="0 0 8.467 8.467">
        <Path
          d="M5.283 1.907l-2.251 2.25L5.434 6.56"
          fill="none"
          stroke="#000"
          strokeWidth={0.79378125}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={4}
          strokeDasharray="none"
          strokeOpacity={1}
        />
      </Svg>
    </Pressable>
  );
};
