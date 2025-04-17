"use client";
import { useState, useEffect } from "react";

const WebBrowser = ({ onClose }: { onClose: () => void }) => {
    const [url, setUrl] = useState("https://example.com");
    const [input, setInput] = useState("https://example.com");
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        const savedFile = localStorage.getItem("currentFile");
        if (savedFile) {
            const { fileContent } = JSON.parse(savedFile);
            console.log("Loaded fileContent for WebBrowser from localStorage:", fileContent);
            setUrl(fileContent || "https://example.com");
            setInput(fileContent || "https://example.com");
        }
    }, []);

    const navigate = () => {
        if (!input.trim()) return;
        let formatted = input.trim();
        if (!/^https?:\/\//i.test(formatted)) {
            formatted = "https://" + formatted;
        }
        setUrl(formatted);
        setIsBlocked(false);

        // Update localStorage so other tabs or refreshes remember
        const savedFile = localStorage.getItem("currentFile");
        if (savedFile) {
            const fileData = JSON.parse(savedFile);
            localStorage.setItem("currentFile", JSON.stringify({ ...fileData, fileContent: formatted }));
        }
    };

    const handleIframeError = () => {
        setIsBlocked(true);
    };

    const handleClose = () => {
        localStorage.removeItem("currentFile");
        onClose();
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
                    onClick={handleClose}
                    className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded"
                >
                    ✖
                </button>
            </div>

            {/* Iframe / Fallback */}
            {url && !isBlocked ? (
                <iframe
                    src={url}
                    title="Web Browser"
                    className="flex-1 w-full bg-white"
                    sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
                    onError={handleIframeError}
                />
            ) : isBlocked ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4 gap-4">
                    <p className="text-gray-300 text-lg">
                        This site has blocked embedding in iframes.
                    </p>
                    <button
                        onClick={() => window.open(url, "_blank")}
                        className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded text-white"
                    >
                        Open in New Tab
                    </button>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400">
                    No URL loaded.
                </div>
            )}
        </div>
    );
};

export default WebBrowser;