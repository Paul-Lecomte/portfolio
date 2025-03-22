"use client";

import { useState } from "react";
import Window from "./Window";
import { useAppStore } from "../store/appStore";

export default function Taskbar() {
    const { windows, openApp } = useAppStore();
    const [startMenuOpen, setStartMenuOpen] = useState(false);

    return (
        <div className="fixed bottom-0 left-0 w-full h-10 bg-black/80 backdrop-blur-md flex items-center px-4 border-t border-gray-700">
            <div className="relative">
                {/* Start Menu Button */}
                <button
                    className="text-white hover:bg-white/10 px-3 py-1 rounded-md"
                    onClick={() => setStartMenuOpen(!startMenuOpen)}
                >
                    Start
                </button>

                {/* Start Menu Dropdown */}
                {startMenuOpen && (
                    <div className="absolute bottom-12 left-0 bg-gray-900 text-white border border-gray-700 rounded-md shadow-lg p-2 w-48">
                        <p className="px-2 py-1 text-sm">Applications</p>
                        <button
                            className="block w-full text-left px-3 py-2 hover:bg-gray-800"
                            onClick={() => openApp("File Explorer")}
                        >
                            File Explorer
                        </button>
                        <button
                            className="block w-full text-left px-3 py-2 hover:bg-gray-800"
                            onClick={() => openApp("Terminal")}
                        >
                            Terminal
                        </button>
                    </div>
                )}
            </div>

            {/* Opened Apps */}
            <div className="flex space-x-2 ml-4">
                {windows.map((window) => (
                    <div key={window.id} className="w-8 h-8 bg-gray-500 rounded-md"></div>
                ))}
            </div>

            {/* Render Windows */}
            {windows.map((window) => (
                <Window key={window.id} title={window.title} id={window.id} />
            ))}
        </div>
    );
}