"use client";

import { useState, useRef } from "react";
import Draggable from 'react-draggable';

const icons = [
    { id: 1, title: "File Explorer" },
    { id: 2, title: "Terminal" },
    // You can add more icons here
];

export default function Desktop() {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

    const nodeRef = useRef(null);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
    };

    return (
        <div className="" onContextMenu={handleContextMenu}>
            {/* Desktop Icons */}
            {icons.map((icon) => (
                <Draggable key={icon.id} nodeRef={nodeRef}>
                    <div ref={nodeRef} className="absolute w-16 h-16 flex flex-col items-center text-white cursor-pointer top-20 left-20">
                        <div className="w-12 h-12 bg-[#2c2f33] rounded-md shadow-lg hover:scale-105 transform transition-all duration-200"></div>
                        <span className="text-sm mt-1">{icon.title}</span>
                    </div>
                </Draggable>
            ))}

            {/* Context Menu */}
            {contextMenu.visible && (
                <div className="absolute bg-[#3c3f42] text-white p-2 border border-[#4a4d52] rounded-md shadow-lg" style={{ top: contextMenu.y, left: contextMenu.x }}>
                    <button className="block w-full text-left px-3 py-1 hover:bg-[#4a4d52]">Open</button>
                    <button className="block w-full text-left px-3 py-1 hover:bg-[#4a4d52]">Rename</button>
                    <button className="block w-full text-left px-3 py-1 hover:bg-[#4a4d52] text-red-500">Delete</button>
                </div>
            )}
        </div>
    );
}