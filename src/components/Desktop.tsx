"use client";

import { useState } from "react";
import Draggable from 'react-draggable';

const icons = [
    { id: 1, title: "File Explorer" },
    { id: 2, title: "Terminal" },
    // You can add more icons here
];

export default function Desktop() {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
    };

    return (
        <div className="w-full h-screen bg-gray-950 relative" onContextMenu={handleContextMenu}>
            {/* Taskbar */}
            <div className="absolute bottom-0 w-full bg-gray-800 p-2 flex items-center justify-between">
                <div className="text-white">Start Menu</div>
                <div className="flex space-x-2">
                    <div className="bg-gray-600 text-white p-2 rounded-md">Task 1</div>
                    <div className="bg-gray-600 text-white p-2 rounded-md">Task 2</div>
                </div>
            </div>

            {/* Desktop Icons */}
            {icons.map((icon) => (
                <Draggable key={icon.id}>
                    <div className="absolute w-16 h-16 flex flex-col items-center text-white cursor-pointer top-20 left-20">
                        <div className="w-12 h-12 bg-gray-700 rounded-md"></div>
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