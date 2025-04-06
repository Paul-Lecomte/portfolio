"use client";
import { useEffect } from "react";

const BlobWallpaper = () => {
    useEffect(() => {
        const paths = document.querySelectorAll("#blob path");

        const animate = () => {
            paths.forEach((path) => {
                const length = path.getTotalLength();
                path.style.strokeDasharray = `${length}`;
                path.style.strokeDashoffset = `${length}`;
                path.animate(
                    [
                        { strokeDashoffset: length.toString() },
                        { strokeDashoffset: "0" }
                    ],
                    {
                        duration: 3000,
                        iterations: Infinity,
                        direction: "alternate",
                        easing: "ease-in-out"
                    }
                );
            });
        };

        animate();
    }, []);

    return (
        <div className="w-full h-full bg-black flex items-center justify-center">
            <svg
                id="blob"
                viewBox="0 0 600 600"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
            >
                <g fill="none" stroke="#00ffd0" strokeWidth="4">
                    <path d="M 300,300 m -150,0 a 150,150 0 1,0 300,0 a 150,150 0 1,0 -300,0" />
                    <path d="M 300,300 m -100,0 a 100,100 0 1,0 200,0 a 100,100 0 1,0 -200,0" />
                    <path d="M 300,300 m -50,0 a 50,50 0 1,0 100,0 a 50,50 0 1,0 -100,0" />
                </g>
            </svg>
        </div>
    );
};

export default BlobWallpaper;