import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AMAError, Position } from '../types';
import { amaClearHighlight } from '../utils/amaClearHighlight';
import { amaHighlightComponent } from '../utils/amaHighlightComponent';
import { getAMARuleErrorInfo } from '../utils/getRuleErrorInfo';
import { logError } from '../utils/logError';
import { AMA_COLORS } from '../utils/rules';
import { AMARuleError } from './AMARuleError';

const WINDOW_WIDTH = Dimensions.get('window').width;

const AMAErrorComponent = ({ issues }: { issues?: AMAError[] }) => {
  const [activeIssueIndex, setActiveIssueIndex] = useState<{
    id: number;
    position?: Position;
  }>();
  const issueToView = useRef<AMAError>(null);
  const previousViewId = useRef<AMAError>(null);

  const clearPreviousHighlight = () => {
    if (!previousViewId.current) {
      return;
    }

    amaClearHighlight?.(previousViewId.current);
    amaHighlightComponent?.(previousViewId.current);
  };

  const setActiveIssue = async (newIndex: number) => {
    clearPreviousHighlight();
    issueToView.current = issues![newIndex];

    if (issueToView.current) {
      const position = await amaHighlightComponent?.(
        issueToView.current,
        'both',
      );

      setActiveIssueIndex({ id: newIndex, position: position });

      previousViewId.current = issueToView.current;
    } else {
      setActiveIssueIndex(undefined);
      previousViewId.current = null;
    }
  };

  const showNextIssue = () => {
    setActiveIssue(activeIssueIndex?.id != null ? activeIssueIndex.id + 1 : 0);
  };

  const showPrevIssue = () => {
    setActiveIssue(
      activeIssueIndex?.id && activeIssueIndex?.id > 0
        ? activeIssueIndex?.id - 1
        : 0,
    );
  };

  const closeIssues = () => {
    clearPreviousHighlight();
    setActiveIssueIndex(undefined);
  };

  const showFirstError = () => {
    showNextIssue();
  };

  if (!issues?.length) {
    return null;
  }

  const showActiveIssue = activeIssueIndex !== undefined && issueToView.current;

  return (
    <>
      {showActiveIssue ? (
        <AMAOverlay
          issue={issueToView.current!}
          position={activeIssueIndex.position}
          closeOverlay={closeIssues}
          onPrevIssue={showPrevIssue}
          onNextIssue={showNextIssue}
          onClose={closeIssues}
        />
      ) : null}
      <View style={styles!.failedBar}>
        <AMAButton
          onPress={showFirstError}
          singular={`AMA: ${issues.length} accessibility issue${issues.length !== 1 ? 's' : ''} found. Tap to inspect`}
          bg="#A31420"
          color="#fff"
        />
      </View>
    </>
  );
};

type AMAButtonProps = {
  count?: number;
  singular: string;
  color: string;
  bg: string;
  line?: string;
  onPress: () => void;
  disabled?: boolean;
};

const AMAButton = ({
  count,
  singular,
  color,
  bg,
  onPress,
  line,
  disabled,
}: AMAButtonProps) => {
  const plural = count ? `${singular}${count !== 1 ? 's' : ''} ` : singular;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => {
        const opacity = pressed || disabled ? 0.8 : 1;
        const divider = line
          ? {
              borderRightWidth: 1,
              borderRightColor: line,
            }
          : {};

        return {
          ...styles!.button,
          ...divider,
          backgroundColor: bg,
          opacity,
        };
      }}
      role="button"
      aria-label={`Show ${plural}`}
      aria-disabled={disabled}
    >
      <Text style={[styles!.buttonText, { color }]}>
        {count} {plural}
      </Text>
    </Pressable>
  );
};

type AMAOverlayProps = {
  issue: AMAError;
  position?: Position;
  closeOverlay: () => void;
  onPrevIssue: () => void;
  onNextIssue: () => void;
  onClose: () => void;
};

const AMAOverlay = ({
  issue,
  position,
  closeOverlay,
  onNextIssue,
  onPrevIssue,
  onClose,
}: AMAOverlayProps) => {
  position = position || [24, 100, WINDOW_WIDTH - 48, 0];
  const { severity, url } = getAMARuleErrorInfo!(issue);
  const [x, y, width, height] = position;

  const openHelp = () => {
    Linking.openURL(url);
  };

  useEffect(() => {
    logError?.(issue);
  }, [issue]);

  return (
    <>
      <Pressable
        style={styles!.transparentOverlay}
        onPress={closeOverlay}
        accessible={false}
        importantForAccessibility="no"
      />
      <View
        style={[
          styles?.callout,
          {
            top: y + height + POINTER_SIZE + SPACER,
            borderColor: AMA_COLORS[severity],
          },
        ]}
      >
        {AMARuleError ? (
          <AMARuleError
            issue={issue}
            componentPosition={position}
            onClose={onClose}
          />
        ) : null}

        <View style={styles!.actions}>
          <Pressable
            onPress={onPrevIssue}
            role="button"
            hitSlop={{ left: 12, top: 12, bottom: 12, right: 12 }}
            style={styles!.action}
          >
            <Text>↑ Previous</Text>
          </Pressable>
          <Pressable
            onPress={openHelp}
            role="button"
            hitSlop={{ left: 12, top: 12, bottom: 12, right: 12 }}
            style={{ paddingTop: 8 }}
          >
            <Text style={styles!.link}>Learn more</Text>
          </Pressable>

            <Pressable
              onPress={onNextIssue}
              role="button"
              hitSlop={{ left: 12, top: 12, bottom: 12, right: 12 }}
              style={styles!.action}
            >
              <Text>Next ↓</Text>
            </Pressable>
        </View>
      </View>

      <View
        style={[
          styles!.triangle,
          {
            left: x + width / 2 - POINTER_SIZE,
            top: y + height + SPACER,
            borderBottomColor: AMA_COLORS[severity],
          },
        ]}
      />
    </>
  );
};

export const AMAErrorOverlay = __DEV__ ? AMAErrorComponent : null;

const SPACER = 4;
const POINTER_SIZE = 8;
const Z_INDEX = 9999;

const styles = __DEV__
  ? StyleSheet.create({
      callout: {
        position: 'absolute',
        left: 24,
        right: 24,
        backgroundColor: '#fff',
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: Z_INDEX + 1,
        shadowOffset: {
          width: 10,
          height: -10,
        },
        boxShadow: '0px 2px 20px #000',
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 4,
        borderTopWidth: 2,
        overflow: 'hidden',
      },
      calloutText: {
        color: '#000',
        fontSize: 14,
        marginBottom: 12,
      },
      link: {
        color: 'blue',
        marginTop: 4,
        textDecorationLine: 'underline',
      },
      triangle: {
        position: 'absolute',
        width: 0,
        height: 0,
        borderLeftWidth: POINTER_SIZE,
        borderRightWidth: POINTER_SIZE,
        borderBottomWidth: POINTER_SIZE,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        zIndex: Z_INDEX + 10,
      },
      failedBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: 'black',
        borderTopWidth: 2,
        shadowOffset: {
          width: 10,
          height: -10,
        },
        boxShadow: '0px 2px 20px #000',
        shadowOpacity: 0.1,
        shadowRadius: 24,
        zIndex: Z_INDEX,
      },
      button: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        padding: 12,
        paddingTop: 24,
        paddingBottom: 32,
      },
      buttonText: {
        flex: 1,
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
      },
      transparentOverlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: Z_INDEX - 1,
        backgroundColor: 'transparent',
      },
      actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        width: '100%',
        alignItems: 'center',
      },
      action: {
        paddingTop: 12,
      },
    })
  : null;
