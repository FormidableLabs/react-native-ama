import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  AnimatedContainer,
  Text,
  useFocus,
  useTimedAction,
} from 'react-native-ama';

import { CTAPressable } from '../components/CTAPressable';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

export const UseTimedActionScreen = () => {
  const [showContent, setShowContent] = React.useState(false);
  const { onTimeout } = useTimedAction();

  const handleOnPress = async () => {
    setShowContent(true);

    await onTimeout(() => {
      setShowContent(false);
    }, 30 * 1000);
  };

  return (
    <View style={styles.centeredView}>
      <CTAPressable title="Show timed content" onPress={handleOnPress} />
      {showContent ? (
        <AnimatedContainer
          from={{ transform: [{ translateY: 'targetHeight' }] }}
          to={{ transform: [{ translateY: 0 }] }}
          exitFrom={{ transform: [{ translateY: 'currentHeight' }] }}
          style={styles.timedContent}
          duration={300}
          autofocus>
          <Text>Great! You did it :)</Text>
          <Spacer height="big" />
          <CTAPressable title="Show home screen" />
        </AnimatedContainer>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timedContent: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    padding: theme.padding.big,
    paddingBottom: 48,
    width: '100%',
  },
});
