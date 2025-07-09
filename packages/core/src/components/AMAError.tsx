import React, { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { A11yIssue, getRuleErrorInfo, logAMAError } from '../utils/logAMAError';

type A11yCounts = {
    must: number;
    should: number;
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

export const AMAError = __DEV__ ? ({ issues }: { issues?: A11yIssue[] }) => {
    const [activeIssue, setActiveIssue] = useState<number>();
    const { must, should } = countA11yIssues(issues ?? []);

    const showNextIssue = () => {
        setActiveIssue(current => {
            return current ? current + 1 : 0;
        });
    };

    const showPrevIssue = () => {
        setActiveIssue(current => {
            return current && current > 0 ? current - 1 : 0;
        });
    };

    const closeIssues = () => {
        setActiveIssue(undefined);
    };

    if (!issues?.length) {
        return null;
    }

    const showActiveIssue = activeIssue !== undefined;

    return (
        <>
            {showActiveIssue ? <AMAOverlay issue={issues[0]} /> : null}
            <View
                style={styles!.failed}
            >
                {showActiveIssue ? (<>
                    <AMAButton singular="next" bg="#000" color="#B3B3B3" line="#969696" onPress={showNextIssue} />
                    <AMAButton singular="prev" bg="#000" color="#B3B3B3" line="#969696" onPress={showPrevIssue} disabled={activeIssue <= 0} />
                    <AMAButton singular="close" bg="#000" color="#B3B3B3" onPress={closeIssues} />
                </>) : (
                    <>
                        <AMAButton count={must} singular="error" bg="#FF0000" color="#fff" line="#000" onPress={showNextIssue} />
                        <AMAButton count={should} singular="warning" bg="#FFFf00" color="#000" onPress={showNextIssue} />
                    </>
                )}
            </View>
        </>
    );
} : null;

type AMAButtonProps = {
    count?: number,
    singular: string,
    color: string,
    bg: string,
    line: string,
    onPress: () => void,
    disabled?: boolean
}

const AMAButton = __DEV__ ? ({ count, singular, color, bg, onPress, line, disabled }: AMAButtonProps) => {
    const plural = count ? `${singular}${count !== 1 ? 's' : ''} ` : singular;

    return (
        <Pressable
            onPress={disabled ? undefined : onPress}
            style={({ pressed }) => {
                const opacity = pressed || disabled ? 0.8 : 1;
                const divider = line ? {
                    borderRightWidth: 1,
                    borderRightColor: line,
                } : {};

                return {
                    ...styles!.button,
                    ...divider,
                    backgroundColor: bg,
                    opacity,
                };
            }
            }
            role="button"
            aria-label={`Show ${plural}`}
            aria-disabled={disabled}
        >

            <Text
                style={{
                    flex: 1,
                    color,
                    fontSize: 16,
                    lineHeight: 24,
                    textAlign: 'center',
                }}
            >
                {count} {plural}
            </Text>
        </Pressable>

    );
} : null;

type AMAOverlayProps = {
    issue: A11yIssue
}

const AMAOverlay = __DEV__ ? ({ issue }: AMAOverlayProps) => {
    const { message, url } = getRuleErrorInfo(issue);
    const [x, y, width, height] = issue.bounds;

    const openHelp = () => {
        Linking.openURL(url);
    };

    useEffect(() => {
        logAMAError(issue);
    }, [issue.viewId]);

    return (
        <>
            <View style={[styles?.callout, {
                left: x,
                top: y + height + POINTER_SIZE + SPACER,
                width: width,
            }]}>
                <Text style={styles!.calloutText}>{message}</Text>
                <Pressable onPress={openHelp} role="button">
                    <Text style={styles!.link}>Learn more</Text>
                </Pressable>
            </View>

            <View style={[
                styles!.triangle,
                {
                    left: x + width / 2 - POINTER_SIZE,
                    top: y + height + SPACER,
                    borderBottomColor: styles!.callout.borderColor,
                },
            ]} />
        </ >
    );
} : null;

const SPACER = 4;
const POINTER_SIZE = 8;

const styles = __DEV__ ? StyleSheet.create({
    callout: {
        position: 'absolute',
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999999,
        borderColor: '#f00',
        borderWidth: 1,
        shadowOffset: {
            width: 10,
            height: -10,
        },
        boxShadow: '0px 2px 20px #000',
        shadowOpacity: 1.0,
        shadowRadius: 24,
        elevation: 4,
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
        zIndex: 9999999,
    },
    failed: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: 'black',
        borderTopWidth: 2,
        shadowOffset: {
            width: 10,
            height: -10,
        },
        boxShadow: '0px 2px 20px #000',
        shadowOpacity: 1.0,
        shadowRadius: 24,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        padding: 24,
        paddingBottom: 32,
    },
}) : null;

