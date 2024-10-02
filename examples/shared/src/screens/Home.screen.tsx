import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { CTAPressable } from '../components/CTAPressable';
import { Header } from '../components/Header';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

export const HomeScreen = ({ navigation }) => {
  const { navigate } = navigation;

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

        {/**/}
        <Spacer height={'normal'} />

        <CTAPressable
          title="BottomSheet"
          onPress={() => navigate('BottomSheet')}
        />

        {/* */}
        <Spacer height={'big'} />
        <Header title="Hooks" />
        <Spacer height={'normal'} />
        <CTAPressable
          title="useAnimation"
          onPress={() => navigate('UseAnimation')}
        />
        <Spacer height={'normal'} />
        <CTAPressable
          title="useAnimationDuration"
          onPress={() => navigate('UseAnimationDuration')}
        />
        <Spacer height={'normal'} />
        <CTAPressable
          title="useReanimatedTiming"
          onPress={() => navigate('UseReanimatedTiming')}
        />
        <Spacer height={'normal'} />
        <CTAPressable
          title="useTimedAction"
          onPress={() => navigate('UseTimedAction')}
        />
        <Spacer height={'normal'} />
        <CTAPressable
          title="useAMAContext"
          onPress={() => navigate('UseAMAContext')}
        />

        <Spacer height={'big'} />
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
