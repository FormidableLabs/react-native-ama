import 'react-native-gesture-handler';

// import { AMAProvider } from '@react-native-ama/core';
import { NavigationContainer } from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { HomeScreen } from './src/screens/Home.screen';
import { RootStackParamList } from './src/types';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <AppNavigator />
    </>
  );
}

const AppNavigator = () => {
  // const { reactNavigationScreenOptions: amaAnimationScreenOptions } = useAMAContext();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          ...BaseNavigatorOptions,
          // ...amaAnimationScreenOptions,
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={
            {
              // headerTitle: () => <Header title={'AMA Examples'} />, // Add shared header
            }
          }
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const BaseNavigatorOptions: NativeStackNavigationOptions = {
  headerTitleAlign: 'center',
  headerBackVisible: false,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
