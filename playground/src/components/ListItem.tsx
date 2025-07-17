import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { RootStackParamList } from '../AppNavigation';
import { theme } from '../theme';
import { Text } from './Text';

type ListItemProps = {
  title: string;
  border?: boolean;
  navigateTo: keyof RootStackParamList;
};

export const ListItem = (
  { title, border = true, navigateTo }: ListItemProps,
) => {
  const { navigate } = useNavigation();

  return (
    <Pressable
      role="button"
      style={({ pressed }) => {
        return {
          ...styles.listItem,
          backgroundColor: pressed ? theme.color.gray : undefined,
          borderBottomWidth: border ? 1 : 0,
        };
      }}
      onPress={() => {
        navigate(navigateTo);
      }}
    >
      <Text style={styles.text}>{title}</Text>
      <View>
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.94 12L8.47 6.53l1.06-1.06L16.06 12l-6.53 6.53-1.06-1.06L13.94 12z"
            fill="#080341"
          />
        </Svg>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  listItem: {
    padding: theme.padding.normal,
    borderBottomColor: theme.color.gray,
    flexDirection: 'row',
  },
  text: {
    flex: 1,
  },
});
