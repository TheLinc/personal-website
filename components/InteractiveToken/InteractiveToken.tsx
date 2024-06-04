import React, { useEffect, useRef } from 'react';
import './InteractiveToken.css'; // Import the CSS

const InteractiveToken = ({ image }: { image: string }) => {
    const imageRef = useRef<HTMLImageElement>(null); // Provide a type for imageRef

    useEffect(() => {
        const handleMouseMove = (event: { clientX: any; clientY: any; }) => {
            const { clientX, clientY } = event;
            if (imageRef.current) {
                const { offsetLeft, offsetTop } = imageRef.current;
                const x = (offsetLeft - clientX) / 25;
                const y = (offsetTop - clientY) / 25;
                imageRef.current.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
            }
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <img ref={imageRef} src={image} alt="Interactive" className="interactive-image" />
    );
};

export default InteractiveToken;