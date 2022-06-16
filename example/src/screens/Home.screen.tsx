import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CTAPressable } from '../components/CTAPressable';
import { Header } from '../components/Header';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';
import { useTypedNavigation } from '../utils/useTypedNavigation';

export const HomeScreen = () => {
  const { navigate } = useTypedNavigation();

  return (
    <View style={styles.view}>
      <ScrollView style={styles.list}>
        <Header title="Example components" />
        <Spacer height={'normal'} />
        <CTAPressable title="Pressable" onPress={() => navigate('Pressable')} />
        <Spacer height={'normal'} />
        <CTAPressable
          title="TouchableOpacity"
          onPress={() => navigate('TouchableOpacity')}
        />
        <Spacer height={'normal'} />
        <CTAPressable
          title="TouchableWithoutFeedback"
          onPress={() => navigate('TouchableWithoutFeedback')}
        />
        <Spacer height={'normal'} />
        <CTAPressable
          title="ExpandablePressable"
          onPress={() => navigate('ExpandablePressable')}
        />
        <Spacer height={'normal'} />
        <CTAPressable title="Text" onPress={() => navigate('Text')} />
        <Spacer height={'normal'} />

        {/* */}
        <CTAPressable title="Form" onPress={() => navigate('Form')} />

        <Spacer height={'normal'} />
        <CTAPressable title="FlatList" onPress={() => navigate('FlatList')} />

        {/* */}
        <Spacer height={'big'} />
        <Header title="Hooks" />
        <Spacer height={'normal'} />
        <CTAPressable
          title="useAccessibleAnimations"
          onPress={() => navigate('ReduceMotion')}
        />
        <Spacer height={'normal'} />
        <CTAPressable
          title="useReanimatedTiming"
          onPress={() => navigate('ReanimatedReduceMotion')}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    flex: 1,
    paddingVertical: theme.padding.normal,
  },
  list: {
    paddingHorizontal: theme.padding.big,
  },
  header: {
    fontSize: theme.fontSize.medium,
    fontWeight: 'bold',
  },
});
