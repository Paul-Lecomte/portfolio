"use client";

import { useAppStore } from "../store/appStore";
import { useState } from "react";
import Draggable from "react-draggable";

const icons = [
    { id: 1, title: "File Explorer" },
    { id: 2, title: "Terminal" },
];

export default function Desktop() {
    const { openApp } = useAppStore();
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

    const handleContextMenu = (e: React.MouseEvent, iconTitle: string) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, visible: true });
    };

    return (
        <div
            className="w-full h-screen bg-gray-950 relative"
            onClick={() => setContextMenu({ ...contextMenu, visible: false })}
        >
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
                <div
                    className="absolute bg-gray-800 text-white p-2 border border-gray-700 rounded-md shadow-lg"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button className="block w-full text-left px-3 py-1 hover:bg-gray-700">Open</button>
                    <button className="block w-full text-left px-3 py-1 hover:bg-gray-700">Rename</button>
                    <button className="block w-full text-left px-3 py-1 hover:bg-gray-700 text-red-500">Delete</button>
                </div>
            )}
        </div>
    );
}

// src/store/appStore.ts
import { create } from "zustand";

interface WindowState {
    id: number;
    title: string;
    visible: boolean;
    zIndex: number;
}

interface AppStore {
    windows: WindowState[];
    openApp: (title: string) => void;
    closeApp: (id: number) => void;
    minimizeApp: (id: number) => void;
    restoreApp: (id: number) => void;
    bringToFront: (id: number) => void;
}

export const useAppStore = create<AppStore>((set) => ({
    windows: [],
    openApp: (title) =>
        set((state) => {
            const newId = Date.now();
            return {
                windows: [...state.windows, { id: newId, title, visible: true, zIndex: newId }],
            };
        }),
    closeApp: (id) =>
        set((state) => ({
            windows: state.windows.filter((window) => window.id !== id),
        })),
    minimizeApp: (id) =>
        set((state) => ({
            windows: state.windows.map((window) =>
                window.id === id ? { ...window, visible: false } : window
            ),
        })),
    restoreApp: (id) =>
        set((state) => ({
            windows: state.windows.map((window) =>
                window.id === id ? { ...window, visible: true } : window
            ),
        })),
    bringToFront: (id) =>
        set((state) => {
            const maxZIndex = Math.max(...state.windows.map((w) => w.zIndex), 0);
            return {
                windows: state.windows.map((window) =>
                    window.id === id ? { ...window, zIndex: maxZIndex + 1 } : window
                ),
            };
        }),
}));