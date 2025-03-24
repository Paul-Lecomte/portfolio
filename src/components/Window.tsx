"use client";

import React, { useState, useRef, useCallback } from "react";
import Draggable from "react-draggable";

export default function Window({
                                   title,
                                   children,
                               }: {
    title: string;
    children: React.ReactNode;
}) {
    const [isOpen, setIsOpen] = useState(true);
    const [isMaximized, setIsMaximized] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 400, height: 300 });
    const [isResizing, setIsResizing] = useState(false);

    // Create a reference for the window container
    const nodeRef = useRef<HTMLDivElement>(null);

    // Start resizing logic
    const startResizing = (e: React.MouseEvent) => {
        setIsResizing(true);
        document.body.style.cursor = "se-resize"; // Change cursor to indicate resizing
    };

    // Handle resizing
    const handleResize = useCallback(
        (e: MouseEvent) => {
            if (!isResizing) return;
            const newWidth = e.clientX - (nodeRef.current?.getBoundingClientRect().left || 0);
            const newHeight = e.clientY - (nodeRef.current?.getBoundingClientRect().top || 0);

            setWindowSize({
                width: newWidth > 200 ? newWidth : 200, // Prevent window from shrinking too much
                height: newHeight > 150 ? newHeight : 150, // Prevent window from shrinking too much
            });
        },
        [isResizing]
    );

    // Stop resizing logic
    const stopResizing = () => {
        setIsResizing(false);
        document.body.style.cursor = "default"; // Reset cursor
    };

    // Add event listeners when resizing starts and stops
    React.useEffect(() => {
        if (isResizing) {
            document.addEventListener("mousemove", handleResize);
            document.addEventListener("mouseup", stopResizing);
        } else {
            document.removeEventListener("mousemove", handleResize);
            document.removeEventListener("mouseup", stopResizing);
        }
        return () => {
            document.removeEventListener("mousemove", handleResize);
            document.removeEventListener("mouseup", stopResizing);
        };
    }, [isResizing, handleResize]);

    if (!isOpen) return null;

    return (
        <Draggable nodeRef={nodeRef} handle=".window-header">
            <div
                ref={nodeRef} // Attach the ref to the window container
                className={`absolute bg-gray-800 text-white border border-gray-600 rounded-lg shadow-lg overflow-hidden ${
                    isMaximized ? "w-full h-full top-0 left-0" : ""
                }`}
                style={{ width: windowSize.width, height: windowSize.height }}
            >
                {/* Window Header */}
                <div className="window-header flex justify-between items-center bg-gray-700 p-2 cursor-move">
                    <span>{title}</span>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsMaximized(!isMaximized)}
                            className="w-6 h-6 bg-gray-600 hover:bg-gray-500 rounded"
                        >
                            ⬜
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-6 h-6 bg-red-600 hover:bg-red-500 rounded"
                        >
                            ❌
                        </button>
                    </div>
                </div>

                {/* Window Content */}
                <div style={{ width: "100%", height: "100%" }}>
                    {/* Render children here */}
                    {children}
                </div>

                {/* Resizing Handle (bottom-right corner) */}
                <div
                    className="resize-handle absolute right-0 bottom-0 w-6 h-6 bg-gray-600 cursor-se-resize"
                    onMouseDown={startResizing}
                />
            </div>
        </Draggable>
    );
}