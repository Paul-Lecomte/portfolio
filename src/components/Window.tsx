"use client";

import React, { useState, useRef, useEffect } from "react";
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
    const [resizeDirection, setResizeDirection] = useState<null | string>(null);

    const nodeRef = useRef<HTMLDivElement>(null);
    const resizeRef = useRef<number>();

    const startResizing = (direction: string) => {
        setIsResizing(true);
        setResizeDirection(direction);
        document.body.style.cursor = getCursorForDirection(direction);
    };

    const stopResizing = () => {
        setIsResizing(false);
        setResizeDirection(null);
        document.body.style.cursor = "default";
    };

    const getCursorForDirection = (direction: string) => {
        switch (direction) {
            case "right":
            case "left":
                return "ew-resize";
            case "bottom":
            case "top":
                return "ns-resize";
            case "bottom-right":
                return "se-resize";
            case "bottom-left":
                return "sw-resize";
            case "top-right":
                return "ne-resize";
            case "top-left":
                return "nw-resize";
            default:
                return "default";
        }
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing || !nodeRef.current || isMaximized) return;

        cancelAnimationFrame(resizeRef.current!);
        resizeRef.current = requestAnimationFrame(() => {
            const rect = nodeRef.current!.getBoundingClientRect();
            const minWidth = 200;
            const minHeight = 150;
            let newWidth = windowSize.width;
            let newHeight = windowSize.height;
            let newX = position.x;
            let newY = position.y;

            if (resizeDirection?.includes("right")) {
                newWidth = Math.max(minWidth, e.clientX - rect.left);
            }
            if (resizeDirection?.includes("left")) {
                const diff = rect.right - e.clientX;
                newWidth = Math.max(minWidth, diff);
                newX = e.clientX;
            }
            if (resizeDirection?.includes("bottom")) {
                newHeight = Math.max(minHeight, e.clientY - rect.top);
            }
            if (resizeDirection?.includes("top")) {
                const diff = rect.bottom - e.clientY;
                newHeight = Math.max(minHeight, diff);
                newY = e.clientY;
            }

            setWindowSize({ width: newWidth, height: newHeight });
            setPosition({ x: newX, y: newY });
        });
    };

    const handleDrag = (_: any, data: any) => {
        if (!isMaximized) {
            setPosition({ x: data.x, y: data.y });
        }
    };

    const handleClose = () => {
        localStorage.clear();
        onClose();
    };

    useEffect(() => {
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

    return (
        <Draggable
            nodeRef={nodeRef}
            handle=".window-header"
            disabled={isMaximized}
            position={isMaximized ? { x: 0, y: 0 } : position}
            onDrag={handleDrag}
            bounds="parent"
            enableUserSelectHack={false}
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
                            transform: "none",
                        }
                        : {
                            width: windowSize.width,
                            height: windowSize.height,
                            top: position.y,
                            left: position.x,
                            transform: "none",
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
                <div className="flex flex-col w-full h-full overflow-auto">
                    {children}
                </div>

                {/* Resize Handles */}
                {!isMaximized && (
                    <>
                        {/* Sides */}
                        <div
                            className="absolute top-0 left-2 right-2 h-2 cursor-ns-resize"
                            onMouseDown={() => startResizing("top")}
                        />
                        <div
                            className="absolute bottom-0 left-2 right-2 h-2 cursor-ns-resize"
                            onMouseDown={() => startResizing("bottom")}
                        />
                        <div
                            className="absolute top-2 bottom-2 left-0 w-2 cursor-ew-resize"
                            onMouseDown={() => startResizing("left")}
                        />
                        <div
                            className="absolute top-2 bottom-2 right-0 w-2 cursor-ew-resize"
                            onMouseDown={() => startResizing("right")}
                        />

                        {/* Corners */}
                        <div
                            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize"
                            onMouseDown={() => startResizing("top-left")}
                        />
                        <div
                            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize"
                            onMouseDown={() => startResizing("top-right")}
                        />
                        <div
                            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize"
                            onMouseDown={() => startResizing("bottom-left")}
                        />
                        <div
                            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                            onMouseDown={() => startResizing("bottom-right")}
                        />
                    </>
                )}
            </div>
        </Draggable>
    );
}