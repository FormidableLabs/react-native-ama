import React, { CSSProperties } from 'react'; // CSSProperties allows inline styling with better type checking.
import clsx from 'clsx'; // clsx helps manage conditional className names in a clean and concise manner.

const CardContainer = ({
	className, // Custom classes for the container card
	style, // Custom styles for the container card
	children, // Content to be included within the card
}) => {
	return (
		<div
			className={clsx(className)}
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(2, 1fr)',
				gap: '48px',
				margin: '24px',
				...style,
			}}>
			{children}
		</div>
	);
};
export default CardContainer;

