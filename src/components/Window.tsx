// src/components/Window.tsx
"use client";

import { useAppStore } from "../store/appStore";
import Draggable from "react-draggable";
import FileExplorer from "./FileExplorer";
import Terminal from "./Terminal";

export default function Window({ id, title }: { id: number; title: string }) {
    const { closeApp, minimizeApp, bringToFront } = useAppStore();

    const renderAppContent = () => {
        switch (title) {
            case "File Explorer":
                return <FileExplorer />;
            case "Terminal":
                return <Terminal />;
            default:
                return <div className="p-4 text-white">Unknown App</div>;
        }
    };

    return (
        <Draggable handle=".window-header" onStart={() => bringToFront(id)}>
            <div className="absolute w-96 h-64 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                <div className="window-header flex justify-between items-center bg-gray-700 p-2 rounded-t-md cursor-move">
                    <span className="text-white">{title}</span>
                    <div className="space-x-2">
                        <button className="text-yellow-400" onClick={() => minimizeApp(id)}>🟡</button>
                        <button className="text-red-400" onClick={() => closeApp(id)}>🔴</button>
                    </div>
                </div>
                <div className="p-2 bg-gray-900 h-full">{renderAppContent()}</div>
            </div>
        </Draggable>
    );
}