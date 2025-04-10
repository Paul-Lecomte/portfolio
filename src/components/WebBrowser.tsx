"use client";
import { useState, useRef } from "react";

const WebBrowser = ({ initialUrl, onClose }: { initialUrl: string; onClose: () => void }) => {
    const [url, setUrl] = useState(initialUrl || "https://example.com");
    const [input, setInput] = useState(initialUrl || "https://example.com");

    const navigate = () => {
        if (!input.trim()) return;
        let formatted = input.trim();
        if (!/^https?:\/\//i.test(formatted)) {
            formatted = "https://" + formatted;
        }
        setUrl(formatted);
    };

    return (
        <div className="w-full h-full bg-gray-900 text-white rounded-lg flex flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center gap-2 p-2 bg-gray-800 border-b border-gray-700">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && navigate()}
                    placeholder="Enter URL"
                    className="flex-1 px-3 py-2 rounded bg-gray-700 text-white outline-none"
                />
                <button
                    onClick={navigate}
                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded"
                >
                    Go
                </button>
                <button
                    onClick={onClose}
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
                >
                    ✖
                </button>
            </div>

            {/* Iframe */}
            {url ? (
                <iframe
                    src={url}
                    title="Web Browser"
                    className="flex-1 w-full bg-white"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                />
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                    No URL loaded.
                </div>
            )}
        </div>
    );
};

export default WebBrowser;