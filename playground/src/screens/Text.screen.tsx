import * as React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Intro } from '../components/Intro';
import { Spacer } from '../components/Spacer';
import { Text } from '../components/Text';
import { theme } from '../theme';

export const TextScreen = () => {
	return (
		<SafeAreaView>
			<View style={styles.view}>
				<Intro element="Text" />
				<Spacer height="big" />
				<Text style={{ textTransform: 'uppercase' }}>
					Uppercase text is not good for a11y
				</Text>
				<Spacer height="small" />
				<Text style={{ color: '#666' }}>Insufficient contrast</Text>
			</View>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	view: {
		paddingHorizontal: theme.padding.big,
		paddingTop: theme.padding.big,
	},
	textTransform: {
		textTransform: 'uppercase',
	},
	textWithOnPress: {
		marginTop: 12,
		lineHeight: 24,
	},
});
