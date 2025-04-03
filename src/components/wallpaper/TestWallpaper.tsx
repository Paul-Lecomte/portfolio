import React, { useEffect } from "react";

const AnimatedWallpaper = () => {
    useEffect(() => {
        const gradientAnimation = () => {
            const gradient = document.querySelector(".animated-gradient") as HTMLElement;
            let angle = 0;

            const rotateGradient = () => {
                angle += 1;
                gradient.style.background = `linear-gradient(${angle}deg, #ff7e5f, #feb47b)`;
            };

            const interval = setInterval(rotateGradient, 10); // Rotate every 10ms for smooth animation

            return () => clearInterval(interval);
        };

        gradientAnimation();
    }, []);

    return (
        <div
            className="absolute w-full h-full top-0 left-0 z-[-1]"
            style={{
                background: "linear-gradient(45deg, #ff7e5f, #feb47b)",
                transition: "background 1s ease",
                animation: "gradient-animation 10s infinite",
            }}
        ></div>
    );
};

export default AnimatedWallpaper;