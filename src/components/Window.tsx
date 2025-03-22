"use client";

import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import { useState } from "react";
import { useAppStore } from "../store/appStore";

export default function Window({ title, id }: { title: string, id: number }) {
    const [width, setWidth] = useState(400);
    const [height, setHeight] = useState(300);
    const [isMaximized, setIsMaximized] = useState(false);
    const { closeApp, minimizeApp, bringToFront } = useAppStore();

    return (
        <Draggable onStart={() => bringToFront(id)}>
            <div className="absolute top-20 left-20 bg-gray-900 border border-gray-700 rounded-md shadow-lg">
                <div className="flex justify-between items-center bg-gray-800 text-white p-2 cursor-move">
                    <span>{title}</span>
                    <div>
                        <button className="text-yellow-500 mx-2" onClick={() => minimizeApp(id)}>–</button>
                        <button
                            className="text-green-500 mx-2"
                            onClick={() => setIsMaximized(!isMaximized)}
                        >
                            {isMaximized ? "❐" : "□"}
                        </button>
                        <button className="text-red-500" onClick={() => closeApp(id)}>×</button>
                    </div>
                </div>
                <ResizableBox
                    width={isMaximized ? window.innerWidth : width}
                    height={isMaximized ? window.innerHeight : height}
                    minConstraints={[200, 150]}
                    maxConstraints={[800, 600]}
                    onResizeStop={(e, data) => {
                        setWidth(data.size.width);
                        setHeight(data.size.height);
                    }}
                >
                    <div className="p-4 text-white">Content goes here...</div>
                </ResizableBox>
            </div>
        </Draggable>
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