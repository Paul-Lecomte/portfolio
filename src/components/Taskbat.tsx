"use client";

import { useState } from "react";
import Window from "./Window";

export default function Taskbar() {
    const [windows, setWindows] = useState([
        { id: 1, title: "File Explorer" },
        { id: 2, title: "Terminal" }
    ]);

    return (
        <div className="fixed bottom-0 left-0 w-full h-10 bg-black/80 backdrop-blur-md flex items-center px-4 border-t border-gray-700">
            <div className="flex space-x-4">
                {/* Start Menu Button */}
                <button className="text-white hover:bg-white/10 px-3 py-1 rounded-md">
                    Start
                </button>

                {/* Opened Apps */}
                <div className="flex space-x-2">
                    {windows.map((window) => (
                        <div key={window.id} className="w-8 h-8 bg-gray-500 rounded-md"></div>
                    ))}
                </div>
            </div>

            {/* Render Windows */}
            {windows.map((window) => (
                <Window key={window.id} title={window.title} />
            ))}
        </div>
    );
}