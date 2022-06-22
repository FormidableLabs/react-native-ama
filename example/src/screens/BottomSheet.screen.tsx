import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedContainer, BottomSheet, Pressable } from 'react-native-ama';

import { CTAPressable } from '../components/CTAPressable';
import { Header } from '../components/Header';
import { theme } from '../theme';

type TimedActionProps = {};

export const BottomSheetScreen: React.FC<TimedActionProps> = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.centeredView}>
      <BottomSheet
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
        closeActionAccessibilityLabel="close bottomsheet"
        bottomSheetStyle={styles.modalView}
        headerComponent={
          <View style={{ paddingHorizontal: theme.padding.big }}>
            <Header title="This is the bottom sheet" />
          </View>
        }
        scrollViewStyle={styles.modalViewContent}>
        <CTAPressable
          onPress={() => setModalVisible(!modalVisible)}
          title="Close bottom sheet"
        />
      </BottomSheet>
      <CTAPressable
        title="Open bottom sheet"
        onPress={() => setModalVisible(true)}
      />
    </View>
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
    padding: theme.padding.big,
    paddingVertical: theme.padding.big,
  },
});
