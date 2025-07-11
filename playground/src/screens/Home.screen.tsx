import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '../components/Header';
import { ListItem } from '../components/ListItem';
import { Spacer } from '../components/Spacer';
import { Text } from '../components/Text';
import { theme } from '../theme';

export const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={theme.safeAreaView}>
      <ScrollView style={styles.list}>
        <Header title="Welcome to the AMA Playground" />
        <Text>
          This app helps you explore and learn about accessibility in React
          Native.
        </Text>
        <Text>
          See issues, learn fixes, and improve your app’s inclusivity.
        </Text>
        <Header title="Playground" />
        <View style={styles.group}>
          <ListItem title="Pressable components" navigateTo="Pressable" />
          <ListItem title="Text" border={false} navigateTo="Text" />
        </View>
        {/*
        <Spacer height={'normal'} />
        <CTAPressable title="Pressable" onPress={() => navigate('Pressable')} />
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
          title="SwitchListItem"
          onPress={() => navigate('SwitchListItem')}
        />
        <Spacer height={'normal'} />
        <CTAPressable
          title="ExpandablePressable"
          onPress={() => navigate('ExpandablePressable')}
        />
        <Spacer height={'normal'} />
        <CTAPressable title="Text" onPress={() => navigate('Text')} />
        <Spacer height={'normal'} />

        <CTAPressable title="Form" onPress={() => navigate('Form')} />

        <Spacer height={'normal'} />
        <CTAPressable title="FlatList" onPress={() => navigate('FlatList')} />

        <Spacer height={'normal'} />

        <CTAPressable
          title="BottomSheet"
          onPress={() => navigate('BottomSheet')}
        />

        <Spacer height={'normal'} />

        <CTAPressable title="Carousel" onPress={() => navigate('Carousel')} />
        <Spacer height={'normal'} />
        <CTAPressable title="Loading" onPress={() => navigate('Loading')} />

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
          title="useReanimatedAnimationBuilder"
          onPress={() => navigate('UseReanimatedAnimationBuilder')}
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

        {*/}
        <Spacer height={'big'} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: theme.padding.big,
  },
  group: {
    borderWidth: 1,
    borderColor: theme.color.gray,
    borderRadius: theme.border,
  },
});
