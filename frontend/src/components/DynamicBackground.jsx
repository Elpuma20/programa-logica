import React, { useState, useEffect } from 'react';

const backgrounds = [
    '/backgrounds/bg1.jpg',
    '/backgrounds/bg2.jpg',
    '/backgrounds/bg3.jpg'
];

const DynamicBackground = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % backgrounds.length);
        }, 15000); // Cambia cada 15 segundos para no ser molesto
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="dynamic-bg-container">
            {backgrounds.map((bg, i) => (
                <div 
                    key={i}
                    className={`dynamic-bg-layer ${i === index ? 'active' : ''}`}
                    style={{ 
                        backgroundImage: `url(${bg})`,
                        opacity: i === index ? 1 : 0
                    }}
                />
            ))}
            <div className="dynamic-bg-overlay" />
        </div>
    );
};

export default DynamicBackground;
