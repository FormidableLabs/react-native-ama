/* eslint-disable react-native/no-inline-styles */

import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AmaError, Position } from '../types';
import { amaClearHighlight } from '../utils/amaClearHighlight';
import { amaHighlightComponent } from '../utils/amaHighlightComponent';
import { getAMARuleErrorInfo } from '../utils/getRuleErrorInfo';
import { logError } from '../utils/logError';
import { AMA_COLORS } from '../utils/rules';
import { AMARuleError } from './AMARuleError';

const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('screen').height;

const AMAErrorComponent = ({ issues }: { issues?: AmaError[] }) => {
  const [activeIssueIndex, setActiveIssueIndex] = useState<{
    id: number;
    position?: Position;
  }>();
  const issueToView = useRef<AmaError>(null);
  const previousViewId = useRef<AmaError>(null);

  const clearPreviousHighlight = () => {
    if (!previousViewId.current) {
      return;
    }

    amaClearHighlight?.(previousViewId.current);

    // Get all issues for the previous viewId to restore correct count and color
    const issuesForPreviousView =
      issues?.filter(
        (issue) => issue.viewId === previousViewId.current?.viewId
      ) ?? [];

    if (issuesForPreviousView.length > 0) {
      amaHighlightComponent?.(issuesForPreviousView);
    }
  };

  const setActiveIssue = async (newIndex: number) => {
    clearPreviousHighlight();
    issueToView.current = issues![newIndex];

    if (issueToView.current) {
      // Get all issues for the current viewId
      const issuesForView =
        issues?.filter(
          (issue) => issue.viewId === issueToView.current?.viewId
        ) ?? [];

      const position = await amaHighlightComponent?.(issuesForView, 'both');

      setActiveIssueIndex({ id: newIndex, position: position ?? undefined });

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
        : 0
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
          totalIssues={issues.length}
          issueIndex={activeIssueIndex.id}
        />
      ) : null}
      <View
        style={styles!.failedBar}
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <AMAButton onPress={showFirstError} bg="transparent" color="#fff">
          <Text style={styles!.buttonText}>
            <Text style={{ color: 'yellow' }}>
              ⚠️ AMA: {issues.length} issue{issues.length !== 1 ? 's' : ''}{' '}
              detected
            </Text>
            <Text style={{ color: '#fafafa' }}>{' ┆ '}</Text>
            <Text style={{ fontWeight: 'bold' }}>Inspect ›</Text>
          </Text>
        </AMAButton>
      </View>
    </>
  );
};

type AMAButtonProps = PropsWithChildren<{
  count?: number;
  singular?: string;
  color: string;
  bg: string;
  line?: string;
  onPress: () => void;
  disabled?: boolean;
}>;

const AMAButton = ({
  children,
  count,
  singular,
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
      importantForAccessibility="no"
      accessibilityElementsHidden
    >
      {children}
    </Pressable>
  );
};

type AMAOverlayProps = {
  issue: AmaError;
  position?: Position;
  closeOverlay: () => void;
  onPrevIssue: () => void;
  onNextIssue: () => void;
  onClose: () => void;
  totalIssues: number;
  issueIndex: number;
};

const AMAOverlay = ({
  issue,
  position,
  closeOverlay,
  onNextIssue,
  onPrevIssue,
  onClose,
  totalIssues,
  issueIndex,
}: AMAOverlayProps) => {
  position = position || [24, 100, WINDOW_WIDTH - 48, 0];
  const { severity, url } = getAMARuleErrorInfo!(issue);
  const [x, y, width, height] = position;
  const isMoreThanHalfScreen = y / WINDOW_HEIGHT > 0.57;
  const maxHeight = isMoreThanHalfScreen
    ? WINDOW_HEIGHT * 0.43
    : WINDOW_HEIGHT - y - 160;
  const yPosition = isMoreThanHalfScreen
    ? undefined
    : y + height + POINTER_SIZE + SPACER;
  const bottomPosition = isMoreThanHalfScreen
    ? WINDOW_HEIGHT - y + SPACER + POINTER_SIZE
    : undefined;

  const openHelp = async () => {
    try {
      await Share.share({
        message: url,
      });
    } catch (error) {
      console.error(error);
    }
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
            top: yPosition,
            bottom: bottomPosition,
            borderColor: AMA_COLORS[severity],
          },
        ]}
      >
        <Text style={styles!.totalIssues}>
          {issueIndex + 1} / {totalIssues}
        </Text>
        {AMARuleError ? (
          <AMARuleError issue={issue} onClose={onClose} maxHeight={maxHeight} />
        ) : null}

        <View style={styles!.actions}>
          <Pressable
            onPress={onPrevIssue}
            role="button"
            hitSlop={{ left: 12, top: 12, bottom: 12, right: 12 }}
            style={[styles!.action, styles!.previous]}
            accessible={false}
            importantForAccessibility="no"
          >
            <Text>‹ Previous</Text>
          </Pressable>
          <Pressable
            onPress={openHelp}
            role="button"
            hitSlop={{ left: 12, top: 12, bottom: 12, right: 12 }}
            style={[styles!.action, styles!.learnMore]}
            accessible={false}
            importantForAccessibility="no"
          >
            <Text style={styles!.link}>Learn more</Text>
          </Pressable>

          <Pressable
            onPress={onNextIssue}
            role="button"
            hitSlop={{ left: 12, top: 12, bottom: 12, right: 12 }}
            style={[styles!.action, styles!.next]}
            accessible={false}
            importantForAccessibility="no"
          >
            <Text>Next ›</Text>
          </Pressable>
        </View>
      </View>
      <View
        style={[
          styles!.triangle,
          {
            left: x + width / 2 - POINTER_SIZE,
          },
          isMoreThanHalfScreen
            ? {
              top: y - POINTER_SIZE - SPACER,
              borderTopWidth: POINTER_SIZE,
              borderTopColor: AMA_COLORS[severity],
              borderBottomWidth: 0,
            }
            : {
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
      padding: 0,
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
    failedBar: {
      backgroundColor: '#A31420',
      position: 'absolute',
      bottom: 40,
      flexDirection: 'row',
      alignItems: 'center',
      shadowOffset: {
        width: 10,
        height: 10,
      },
      boxShadow: '0px 2px 6px #000',
      shadowOpacity: 0.05,
      shadowRadius: 12,
      zIndex: Z_INDEX,
      borderRadius: 20,
      maxWidth: '90%',
      left: '5%',
    },
    button: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      padding: 12,
    },
    buttonText: {
      flex: 1,
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
      color: '#fff',
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
      alignItems: 'center',
      alignContent: 'center',
    },
    action: {
      paddingVertical: 8,
      marginBottom: 12,
      width: '27%',
      borderWidth: 1,
    },
    previous: {
      borderLeftWidth: 0,
      borderTopEndRadius: 18,
      borderBottomEndRadius: 18,
      paddingRight: 12,
      paddingLeft: 12,
    },
    next: {
      borderRightWidth: 0,
      borderTopLeftRadius: 18,
      borderBottomLeftRadius: 18,
      paddingRight: 12,
      paddingLeft: 12,
    },
    learnMore: {
      flex: 1,
      alignItems: 'center',
      borderRadius: 24,
      borderWidth: 1,
      marginHorizontal: 24,
      paddingVertical: 8,
      backgroundColor: '#07549C',
      borderColor: '#07549C',
    },
    link: {
      color: '#fff',
    },
    totalIssues: {
      marginTop: 8,
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
  })
  : null;
