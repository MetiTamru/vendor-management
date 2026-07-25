"use client";

import React, { useEffect, useRef } from "react";

interface MarqueeTextProps {
	text: string;
}

export const MarqueeText: React.FC<MarqueeTextProps> = ({ text }) => {
	const marqueeRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const marqueeElement = marqueeRef.current;
		if (!marqueeElement) return;

		// Start animation
		const keyframes = `
      @keyframes marquee {
        0% { transform: translateX(100%); }
        100% { transform: translateX(-100%); }
      }
    `;

		// Create and append style
		const style = document.createElement("style");
		style.appendChild(document.createTextNode(keyframes));
		document.head.appendChild(style);

		// Apply animation to the element
		marqueeElement.style.animation = "marquee 20s linear infinite";

		return () => {
			// Clean up
			document.head.removeChild(style);
		};
	}, []);

	return (
		<div className="overflow-hidden whitespace-nowrap w-full">
			<div ref={marqueeRef} className="inline-block whitespace-nowrap">
				{text}
			</div>
		</div>
	);
};
