"use client";

import { useAppStore } from "../store/appStore";
import { useState } from "react";
import Draggable from "react-draggable";
import Window from "./Window";

const icons = [
    { id: 1, title: "File Explorer" },
    { id: 2, title: "Terminal" },
];

export default function Desktop() {
    const { openApp, windows } = useAppStore();
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

    const handleContextMenu = (e: React.MouseEvent, iconTitle: string) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
    };

    return (
        <div className="w-full h-screen bg-gray-950 relative" onClick={() => setContextMenu({ ...contextMenu, visible: false })}>
            {icons.map((icon) => (
                <Draggable key={icon.id}>
                    <div
                        className="absolute w-16 h-16 flex flex-col items-center text-white cursor-pointer"
                        onDoubleClick={() => openApp(icon.title)}
                        onContextMenu={(e) => handleContextMenu(e, icon.title)}
                    >
                        <div className="w-12 h-12 bg-gray-700 rounded-md"></div>
                        <span className="text-sm mt-1">{icon.title}</span>
                    </div>
                </Draggable>
            ))}

            {contextMenu.visible && (
                <div className="absolute bg-gray-800 text-white p-2 border border-gray-700 rounded-md shadow-lg" style={{ top: contextMenu.y, left: contextMenu.x }}>
                    <button className="block w-full text-left px-3 py-1 hover:bg-gray-700">Open</button>
                    <button className="block w-full text-left px-3 py-1 hover:bg-gray-700">Rename</button>
                    <button className="block w-full text-left px-3 py-1 hover:bg-gray-700 text-red-500">Delete</button>
                </div>
            )}

            {windows.map((window) => window.visible && <Window key={window.id} id={window.id} title={window.title} />)}
        </div>
    );
}