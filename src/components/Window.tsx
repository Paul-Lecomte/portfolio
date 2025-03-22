"use client";

import Draggable from "react-draggable";
import { ResizableBox } from "react-resizable";
import { useState } from "react";
import { useAppStore } from "../store/appStore";

export default function Window({ title, id }: { title: string, id: number }) {
    const [width, setWidth] = useState(400);
    const [height, setHeight] = useState(300);
    const { closeApp } = useAppStore();

    return (
        <Draggable>
            <div className="absolute top-20 left-20 bg-gray-900 border border-gray-700 rounded-md shadow-lg">
                <div className="flex justify-between items-center bg-gray-800 text-white p-2 cursor-move">
                    <span>{title}</span>
                    <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => closeApp(id)}
                    >
                        ×
                    </button>
                </div>
                <ResizableBox
                    width={width}
                    height={height}
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
}

interface AppStore {
    windows: WindowState[];
    openApp: (title: string) => void;
    closeApp: (id: number) => void;
}

export const useAppStore = create<AppStore>((set) => ({
    windows: [],
    openApp: (title) =>
        set((state) => ({
            windows: [...state.windows, { id: Date.now(), title }],
        })),
    closeApp: (id) =>
        set((state) => ({
            windows: state.windows.filter((window) => window.id !== id),
        })),
}));