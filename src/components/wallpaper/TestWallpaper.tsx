import React, { useEffect, useRef } from "react";

const AnimatedWallpaper: React.FC = () => {
    // Define the type of the canvasRef to HTMLCanvasElement
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        let animationFrameId: number; // Store the requestAnimationFrame ID

        if (canvas) {
            const ctx = canvas.getContext("2d");

            let angle = 0;

            // Function to update the gradient animation
            const animateGradient = () => {
                if (canvas && ctx) {
                    canvas.width = window.innerWidth; // Set the canvas width to window width
                    canvas.height = window.innerHeight; // Set the canvas height to window height

                    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
                    gradient.addColorStop(0, "#ff7e5f"); // Starting color
                    gradient.addColorStop(1, "#feb47b"); // Ending color

                    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing

                    // Rotate the gradient by changing the angle
                    ctx.fillStyle = gradient;
                    ctx.setTransform(1, 0, 0, 1, canvas.width / 2, canvas.height / 2);
                    ctx.rotate((angle * Math.PI) / 180);
                    ctx.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);

                    angle += 1; // Increase the angle for the next frame
                    animationFrameId = requestAnimationFrame(animateGradient); // Store the ID
                }
            };

            animateGradient(); // Start the animation

            return () => {
                // Clean up by cancelling the animation frame
                cancelAnimationFrame(animationFrameId);
            };
        }
    }, []);

    return (
        <div className="w-full h-full">
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
};

export default AnimatedWallpaper;