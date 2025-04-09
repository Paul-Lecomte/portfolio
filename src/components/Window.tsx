import React, { useState, useRef, useCallback } from "react";
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
    const [windowSize, setWindowSize] = useState({ width: 400, height: 300 });
    const [isResizing, setIsResizing] = useState(false);

    const nodeRef = useRef<HTMLDivElement>(null);

    const startResizing = () => {
        setIsResizing(true);
        document.body.style.cursor = "se-resize";
    };

    const handleResize = useCallback(
        (e: MouseEvent) => {
            if (!isResizing) return;
            const newWidth = e.clientX - (nodeRef.current?.getBoundingClientRect().left || 0);
            const newHeight = e.clientY - (nodeRef.current?.getBoundingClientRect().top || 0);

            setWindowSize({
                width: newWidth > 200 ? newWidth : 200,
                height: newHeight > 150 ? newHeight : 150,
            });
        },
        [isResizing]
    );

    const stopResizing = () => {
        setIsResizing(false);
        document.body.style.cursor = "default";
    };

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

    return (
        <Draggable nodeRef={nodeRef} handle=".window-header" defaultClassName="z-10">
            <div
                ref={nodeRef}
                className={`absolute bg-opacity-70 backdrop-blur-lg border border-gray-300 rounded-lg shadow-lg overflow-hidden ${
                    isMaximized ? "w-full h-full top-0 left-0" : ""
                }`}
                style={{
                    width: windowSize.width,
                    height: windowSize.height,
                }}
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
                            onClick={onClose}
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
                        overflow: "auto", // Ensure content is scrollable if it exceeds the size of the window
                    }}
                >
                    {children}
                </div>

                {/* Resizing Handle */}
                <div
                    className="resize-handle absolute right-0 bottom-0 w-8 h-8 bg-gray-600 cursor-se-resize rounded-br-lg"
                    onMouseDown={startResizing}
                />
            </div>
        </Draggable>
    );
}