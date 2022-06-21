import * as React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { AnimatedContainer } from '../components/AnimatedContainer';
import { useChecks } from '../internal/useChecks';

type BottomSheetProps = {
  visible: boolean;
  onRequestClose: () => void;
  style?: ViewStyle;
  lineStyle?: ViewStyle;
  closeActionAccessibilityLabel: string;
  header: string;
  headerStyle?: ViewStyle;
  contentStyle?: ViewStyle;
  animationDuration: number;
};

export const BottomSheet = ({
  children,
  visible,
  onRequestClose,
  style = {},
  lineStyle = {},
  closeActionAccessibilityLabel,
  header,
  contentStyle = {},
  headerStyle,
  animationDuration = 300,
}: React.PropsWithChildren<BottomSheetProps>) => {
  const [showContent, setShowContent] = React.useState(visible);
  const [isModalVisible, setIsModalVisible] = React.useState(true);
  let wrapperStyle = {};

  /*block:start*/
  const { noUndefinedProperty } = useChecks();

  const debugStyle = {
    ...noUndefinedProperty({
      properties: { closeActionAccessibilityLabel },
      property: 'closeActionAccessibilityLabel',
      rule: 'BOTTOM_SHEET_CLOSE_ACTION',
    }),
  };

  // @ts-ignore
  wrapperStyle = [debugStyle];
  /*block:end*/

  React.useEffect(() => {
    if (visible) {
      setIsModalVisible(true);
      setShowContent(true);
    } else {
      setShowContent(false);

      setTimeout(() => setIsModalVisible(false), animationDuration);
    }
  }, [visible]);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={onRequestClose}
      style={wrapperStyle}>
      <>
        {showContent ? (
          <>
            <AnimatedContainer
              style={styles.overlay}
              from={{ opacity: 0 }}
              to={{ opacity: 1 }}
              duration={animationDuration}>
              <Pressable
                style={styles.closeButton}
                accessibilityRole="button"
                accessibilityLabel={closeActionAccessibilityLabel}
                onPress={onRequestClose}
              />
            </AnimatedContainer>
            <View style={styles.contentWrapper}>
              <AnimatedContainer
                from={{ transform: [{ translateY: 'targetHeight' }] }}
                to={{ transform: [{ translateY: 0 }] }}
                duration={animationDuration}
                style={[styles.content, contentStyle, style]}>
                <View style={[styles.line, lineStyle]} />
                <Text accessibilityRole="header" style={headerStyle}>
                  {header}
                </Text>
                <>{children}</>
              </AnimatedContainer>
            </View>
          </>
        ) : null}
      </>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
  },
  closeButton: {
    flex: 1,
  },
  contentWrapper: {
    flexDirection: 'column',
    flex: 1,
    maxHeight: '80%',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'flex-end',
    width: '100%',
  },
  content: {
    width: '100%',
    padding: 12,
  },
  line: {
    width: 48,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginBottom: 24,
    borderRadius: 2,
  },
});
