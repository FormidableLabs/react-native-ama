import React from 'react';
import { Linking, ScrollView, StyleSheet } from 'react-native';
import { ClickableSpan, LinkStyle, Span, Text } from 'react-native-ama';

import { Header } from '../components/Header';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

export const SpanScreen = () => {
  const openURL = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <Span style={styles.spanStyle}>
        The{' '}
        <ClickableSpan onPress={() => openURL('https://example.com')}>
          Span
        </ClickableSpan>{' '}
        components allows to have accessible links inside a Text.
      </Span>
      <Span style={styles.spanStyle}>
        When hovering one of this text on Android, Talkback announces "link
        available", allowing you to select the option from the{' '}
        <ClickableSpan
          onPress={() =>
            openURL(
              'https://support.google.com/accessibility/android/answer/6007066?hl=en',
            )
          }>
          local context menu
        </ClickableSpan>
      </Span>
      <Spacer height="big" />
      <Header title="Styling" />
      <Spacer height="normal" />
      <Text style={styles.spanStyle}>
        The Span component allows to customise the color, backgroundColor and
        fontWeight of the links:
      </Text>
      {/**/}
      <Spacer height="normal" />
      <Span linkColor={'red'}>
        The link color is: <ClickableSpan onPress={noop}>red</ClickableSpan>
      </Span>
      {/**/}
      <Spacer height="normal" />
      <Span linkBackgroundColor="red" linkColor="white">
        The link backgroundColor is:{' '}
        <ClickableSpan onPress={noop}> red </ClickableSpan>
      </Span>
      {/**/}
      <Spacer height="normal" />
      <Span linkStyle={LinkStyle.BOLD_ITALIC}>
        The link style is:{' '}
        <ClickableSpan onPress={noop}>Italic bold</ClickableSpan>
      </Span>
    </ScrollView>
  );
};

function noop() {}

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: theme.padding.big,
    paddingTop: theme.padding.big,
  },
  spanStyle: {
    lineHeight: 22,
  },
});
