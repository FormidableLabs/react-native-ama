import { BottomSheet } from '@react-native-ama/extras';
import React, { useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';

import { CTAPressable } from '../components/CTAPressable';
import { Header } from '../components/Header';
import { theme } from '../theme';
import { FormScreen } from './Form.screen';

type TimedActionProps = {};

export const BottomSheetScreen: React.FC<TimedActionProps> = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.centeredView}>
      <BottomSheet
        visible={modalVisible}
        topInset={0}
        onClose={() => {
          setModalVisible(!modalVisible);
        }}
        avoidKeyboard={Platform.OS === 'ios'}
        closeActionAccessibilityLabel="close bottomsheet"
        bottomSheetStyle={styles.modalView}
        headerComponent={
          <View style={{ paddingHorizontal: theme.padding.big }}>
            <Header title="This is the bottom sheet" />
          </View>
        }
        scrollViewProps={{
          style: styles.modalViewContent,
        }}
        scrollEnabled={true}>
        <FormScreen />
      </BottomSheet>
      <CTAPressable
        title="Open bottom sheet"
        onPress={() => setModalVisible(true)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalViewContent: {
    flex: 1,
    marginBottom: theme.padding.big,
  },
});
