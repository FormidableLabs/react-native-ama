import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

function App(): JSX.Element {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <View>
          <Text>Hi</Text>
        </View>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
