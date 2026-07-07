import { View } from 'react-native';
import { Pressable } from './Pressable';
import { FC, PropsWithChildren, useState } from 'react';
import React from 'react';
import { Text } from './Text';

type AccordionProps = {
	title: string;
};

export const Accordion: FC<PropsWithChildren<AccordionProps>> = ({ title, children }) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<Pressable role="button" onPress={() => setIsOpen(open => !open)}>
				<View style={{ flexDirection: 'row', paddingVertical: 8 }}>
					<Text style={{ flex: 1 }}>{title}</Text><Text>{isOpen ? ' - ' : ' + '}</Text>
				</View>
			</Pressable >
			{isOpen ? (
				<View style={{ borderWidth: 1, padding: 8 }}>
					{children}
				</View>) : null}
		</>
	);
};

