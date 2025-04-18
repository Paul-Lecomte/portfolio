import React, { useState, useRef } from "react";
import Draggable from "react-draggable";
import { FaWindowMaximize, FaWindowRestore, FaTimes } from "react-icons/fa";

export default function Window({
                                   title,
                                   children,
                                   onClose,
                               }: {
    title: string;
    children: React.ReactNode;
    onClose: () => void;
}) {
    const [isMaximized, setIsMaximized] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 500, height: 500 });
    const [position, setPosition] = useState({ x: 100, y: 50 });
    const [isResizing, setIsResizing] = useState(false);

    const nodeRef = useRef<HTMLDivElement>(null);
    const resizeRef = useRef<number>();

    // Start resizing
    const startResizing = () => {
        setIsResizing(true);
        document.body.style.cursor = "se-resize";
    };

    // Handle resizing
    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing || !nodeRef.current || isMaximized) return;

        cancelAnimationFrame(resizeRef.current!);
        resizeRef.current = requestAnimationFrame(() => {
            const rect = nodeRef.current!.getBoundingClientRect();
            const newWidth = e.clientX - rect.left;
            const newHeight = e.clientY - rect.top;

            setWindowSize({
                width: Math.max(200, newWidth),
                height: Math.max(150, newHeight),
            });
        });
    };

    // Stop resizing
    const stopResizing = () => {
        setIsResizing(false);
        document.body.style.cursor = "default";
    };

    React.useEffect(() => {
        if (isResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", stopResizing);
        } else {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stopResizing);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stopResizing);
        };
    }, [isResizing]);

    // Handle dragging
    const handleDrag = (_: any, data: any) => {
        if (!isMaximized) {
            setPosition({ x: data.x, y: data.y });
        }
    };

    // Modify onClose function to clear localStorage
    const handleClose = () => {
        // Clear local storage when the window is closed
        localStorage.clear();
        onClose();
    };

    return (
        <Draggable
            nodeRef={nodeRef}
            handle=".window-header"
            disabled={isMaximized} // Disable dragging when maximized
            position={isMaximized ? { x: 0, y: 0 } : position} // Keep position when maximized
            onDrag={handleDrag}
            bounds="parent" // Prevent dragging outside parent container
            enableUserSelectHack={false} // Prevent text selection issues during drag
        >
            <div
                ref={nodeRef}
                className="fixed z-40 bg-opacity-70 backdrop-blur-lg border border-gray-300 rounded-lg shadow-lg overflow-hidden"
                style={
                    isMaximized
                        ? {
                            width: "90vw",
                            height: "90vh",
                            top: "5vh",
                            left: "5vw",
                            transform: "none", // Remove transform during maximization
                        }
                        : {
                            width: windowSize.width,
                            height: windowSize.height,
                            top: position.y,
                            left: position.x,
                            transform: "none", // Remove transform during dragging and resizing
                        }
                }
            >
                {/* Window Header */}
                <div className="window-header flex justify-between items-center bg-opacity-70 bg-gray-800 p-3 cursor-move rounded-t-lg">
                    <span className="font-semibold text-lg text-white">{title}</span>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setIsMaximized(!isMaximized)}
                            className="w-8 h-8 flex justify-center items-center bg-gray-600 rounded-md hover:bg-gray-500 transition-all"
                        >
                            {isMaximized ? (
                                <FaWindowRestore size={16} className="text-white" />
                            ) : (
                                <FaWindowMaximize size={16} className="text-white" />
                            )}
                        </button>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 flex justify-center items-center bg-red-600 rounded-md hover:bg-red-500 transition-all"
                        >
                            <FaTimes size={16} className="text-white" />
                        </button>
                    </div>
                </div>

                {/* Window Content */}
                <div
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "auto",
                    }}
                >
                    {children}
                </div>

                {/* Resize Handle */}
                {!isMaximized && (
                    <div
                        className="resize-handle absolute right-0 bottom-0 w-6 h-6 bg-gray-600 cursor-se-resize rounded-br-lg"
                        onMouseDown={startResizing}
                    />
                )}
            </div>
        </Draggable>
    );
}