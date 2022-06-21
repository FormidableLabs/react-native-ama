import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedContainer, BottomSheet, Pressable } from 'react-native-ama';

import { CTAPressable } from '../components/CTAPressable';
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
        style={styles.modalView}
        header={'This is the bottom sheet'}
        contentStyle={styles.modalViewContent}>
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
    paddingBottom: 48,
    paddingTop: 12,
  },
});
