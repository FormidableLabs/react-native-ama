import React, { useEffect, useRef, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import ReactNativeAmaModule from '../ReactNativeAmaModule';
import {
  A11ySeverity,
  GetRuleError,
  getRuleErrorInfo,
} from './getRuleErrorInfo';
import { logAMAError } from './logAMAError';
import { A11yIssue, Position } from './types';

type A11yCounts = {
  must: number;
  should: number;
};

const COLORS: { [key in A11ySeverity]: string } = {
  Critical: '#f00',
  Serious: '#FFFf00',
};

function countA11yIssues(issues: A11yIssue[]): A11yCounts {
  return issues.reduce<A11yCounts>(
    (acc, { type }) => {
      if (type === 'MUST' || type === 'MUST_NOT') {
        acc.must++;
      } else if (type === 'SHOULD' || type === 'SHOULD_NOT') {
        acc.should++;
      }
      return acc;
    },
    { must: 0, should: 0 },
  );
}

const AMAErrorComponent = ({ issues }: { issues?: A11yIssue[] }) => {
  const [activeIssueIndex, setActiveIssueIndex] = useState<{
    id: number;
    position: Position;
  }>();
  const { must, should } = countA11yIssues(issues ?? []);
  const filteredIssues = useRef<A11yIssue[]>([]);
  const issueToView = useRef<A11yIssue>(null);

  const setActiveIssue = async (newIndex: number) => {
    issueToView.current = filteredIssues.current?.[newIndex];

    if (issueToView.current) {
      const position = await ReactNativeAmaModule.getPosition(
        issueToView.current.viewId,
      );
      console.info({ position });

      setActiveIssueIndex({ id: newIndex, position });
    } else {
      setActiveIssueIndex(undefined);
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
    setActiveIssueIndex(undefined);
  };

  const showFirstError = () => {
    filteredIssues.current =
      issues?.filter(issue => ['MUST', 'MUST_NOT'].includes(issue.type)) ?? [];

    showNextIssue();
  };

  const showFirstWarning = () => {
    filteredIssues.current =
      issues?.filter(issue => ['SHOULD', 'SHOULD_NOT'].includes(issue.type)) ??
      [];

    showNextIssue();
  };

  useEffect(() => {
    if (issues?.length) {
      for (const issue of issues) {
        // if (Platform.OS === 'android') {
        //     ReactNativeAmaModule.inspectViewAttributes(issue.viewId).then(data => {
        //         console.info('attrs', data)
        //     })
        // }

        logAMAError!(issue);
      }
    } else {
      console.info('[React Native AMA]: No issues found');
    }
  }, [issues]);

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
        />
      ) : null}
      <View style={styles!.failedBar}>
        {showActiveIssue ? (
          <>
            <AMAButton
              singular="↑ prev"
              bg="#000"
              color="#fff"
              line="#969696"
              onPress={showPrevIssue}
              disabled={activeIssueIndex.id <= 0}
            />
            <AMAButton
              singular="next ↓"
              bg="#000"
              color="#fff"
              line="#969696"
              onPress={showNextIssue}
              disabled={
                activeIssueIndex.id + 1 >= filteredIssues.current.length
              }
            />
            <AMAButton
              singular="✘ close"
              bg="#000"
              color="#fff"
              onPress={closeIssues}
            />
          </>
        ) : (
          <>
            <AMAButton
              count={must}
              singular="error"
              bg="#FF0000"
              color="#fff"
              line="#000"
              onPress={showFirstError}
              disabled={must === 0}
            />
            <AMAButton
              count={should}
              singular="warning"
              bg="#FFFf00"
              color="#000"
              onPress={showFirstWarning}
              disabled={should === 0}
            />
          </>
        )}
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
  issue: A11yIssue;
  position: Position;
  closeOverlay: () => void;
};

const AMAOverlay = ({ issue, position, closeOverlay }: AMAOverlayProps) => {
  const { severity, url } = getRuleErrorInfo!(issue);
  const [x, y, width, height] = position;

  const openHelp = () => {
    Linking.openURL(url);
  };

  useEffect(() => {
    logAMAError!(issue);
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
            borderColor: COLORS[severity],
          },
        ]}
      >
        {GetRuleError && <GetRuleError issue={issue} />}

        <Pressable onPress={openHelp} role="button">
          <Text style={styles!.link}>Learn more</Text>
        </Pressable>
      </View>

      <View
        style={[
          styles!.triangle,
          {
            left: x + width / 2 - POINTER_SIZE,
            top: y + height + SPACER,
            borderBottomColor: COLORS[severity],
          },
        ]}
      />
    </>
  );
};

export const AMAError = __DEV__ ? AMAErrorComponent : null;

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
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: Z_INDEX,
        shadowOffset: {
          width: 10,
          height: -10,
        },
        boxShadow: '0px 2px 20px #000',
        shadowOpacity: 0.2,
        shadowRadius: 24,
        elevation: 4,
        borderWidth: 1,
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
    })
  : null;
