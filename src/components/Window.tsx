"use client";

import { useState, useRef } from "react";
import Draggable from "react-draggable";

export default function Window({ title }: { title: string }) {
    const [isOpen, setIsOpen] = useState(true);
    const [isMaximized, setIsMaximized] = useState(false);

    // Create a reference for the window container
    const nodeRef = useRef<HTMLDivElement>(null);

    if (!isOpen) return null;

    return (
        <Draggable nodeRef={nodeRef} handle=".window-header">
            <div
                ref={nodeRef} // Attach the ref to the window container
                className={`absolute bg-gray-800 text-white border border-gray-600 rounded-lg shadow-lg overflow-hidden ${
                    isMaximized ? "w-full h-full top-0 left-0" : "w-96 h-64 top-32 left-32"
                }`}
            >
                {/* Window Header */}
                <div className="window-header flex justify-between items-center bg-gray-700 p-2 cursor-move">
                    <span>{title}</span>
                    <div className="flex space-x-2">
                        <button onClick={() => setIsMaximized(!isMaximized)} className="w-6 h-6 bg-gray-600 hover:bg-gray-500 rounded">
                            ⬜
                        </button>
                        <button onClick={() => setIsOpen(false)} className="w-6 h-6 bg-red-600 hover:bg-red-500 rounded">
                            ❌
                        </button>
                    </div>
                </div>

                {/* Window Content */}
                <div className="p-4">
                    <p>This is a window for {title}.</p>
                </div>
            </div>
        </Draggable>
    );
}