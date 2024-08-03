import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export default function ToolTip() {
	const [isVisible, setIsVisible] = useState(false);
	const [x, setX] = useState(0);
	const [y, setY] = useState(0);

	useEffect(() => {
		const handleSelectionChange = () => {
			const selection = window.getSelection();
			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);
				const rect = range.getBoundingClientRect();
				setX(rect.x + rect.width / 2);
				setY(rect.y + rect.height / 2);
				setIsVisible(true);
			} else {
				setIsVisible(false);
			}
		};

		document.addEventListener('selectionchange', handleSelectionChange);

		return () => {
			document.removeEventListener('selectionchange', handleSelectionChange);
		};
	}, []);

	if (!isVisible) return null;

	return createPortal(
		<div
			className="absolute bg-gray-200 p-2 rounded shadow-md"
			style={{ left: x, top: y }}
		>
			{/* pen icon*/}

			// pen icon
			<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12.0001 2.00001C12.5523 2.00001 13.0001 2.44779 13.0001 3.00001V13.0001C13.0001 13.5523 12.5523 14.0001 12.0001 14.0001H2.00001C1.4478 14.0001 1.00001 13.5523 1.00001 13.0001V3.00001C1.00001 2.44779 1.4478 2.00001 2.00001 2.00001H12.0001ZM12.0001 3.00001H2.00001V13.0001H12.0001V3.00001Z" fill="#111827" />
			</svg>

		</div>,
		document.body
	);
}
