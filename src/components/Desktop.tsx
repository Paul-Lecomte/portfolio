"use client";

import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";

const icons = [
    { id: 1, title: "File Explorer", icon: "📁" },
    { id: 2, title: "Terminal", icon: "💻" },
];

export default function Desktop() {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
    const [startMenuOpen, setStartMenuOpen] = useState(false);
    const [time, setTime] = useState<string>("");

    const nodeRef = useRef(null);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
    };

    return (
        <div className="w-full h-screen bg-gray-950 relative" onContextMenu={handleContextMenu}>
            {/* Taskbar */}
            <div className="absolute bottom-0 w-full bg-gray-800 p-2 flex items-center justify-between rounded-t-xl shadow-lg">
                {/* Start Menu Button */}
                <div className="relative">
                    <button onClick={() => setStartMenuOpen(!startMenuOpen)} className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600">
                        🏁
                    </button>
                    {startMenuOpen && (
                        <div className="absolute bottom-12 left-0 w-64 bg-gray-900 p-3 rounded-lg shadow-xl">
                            <p className="text-white">Start Menu</p>
                            {/* Add actual app shortcuts here */}
                        </div>
                    )}
                </div>

                {/* Task Icons */}
                <div className="flex space-x-4">
                    <div className="bg-gray-600 text-white p-2 rounded-md">📁</div>
                    <div className="bg-gray-600 text-white p-2 rounded-md">💻</div>
                </div>

                {/* System Tray */}
                <div className="flex space-x-3 text-white">
                    <span>🔊</span>
                    <span>📶</span>
                    <span>⚡</span>
                    <span>{time}</span>
                </div>
            </div>

            {/* Desktop Icons */}
            {icons.map((icon) => (
                <Draggable key={icon.id} nodeRef={nodeRef}>
                    <div ref={nodeRef} className="absolute w-16 h-16 flex flex-col items-center text-white cursor-pointer top-20 left-20">
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-md text-xl">
                            {icon.icon}
                        </div>
                        <span className="text-sm mt-1">{icon.title}</span>
                    </div>
                </Draggable>
            ))}

            {/* Context Menu */}
            {contextMenu.visible && (
                <div className="absolute bg-gray-800 text-white p-2 border border-gray-700 rounded-md shadow-lg" style={{ top: contextMenu.y, left: contextMenu.x }}>
                    <button className="block w-full text-left px-3 py-1 hover:bg-gray-700">Open</button>
                    <button className="block w-full text-left px-3 py-1 hover:bg-gray-700">Rename</button>
                    <button className="block w-full text-left px-3 py-1 hover:bg-gray-700 text-red-500">Delete</button>
                </div>
            )}
        </div>
    );
}