"use client";

import React, { useState, useEffect } from "react";
import Window from "./Window";

interface UniversalFileViewerProps {
    filePath?: string;
    fileType: string;
    onClose: () => void;
}

const UniversalFileViewer: React.FC<UniversalFileViewerProps> = ({ filePath, fileType, onClose }) => {
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("");

    useEffect(() => {
        const loadFile = async () => {
            let pathToLoad = filePath;

            // Try to get fileUrl from localStorage if not provided
            const savedFile = localStorage.getItem("currentFile");
            if (!pathToLoad && savedFile) {
                const { fileUrl } = JSON.parse(savedFile);
                pathToLoad = fileUrl;
            }

            if (!pathToLoad) {
                setFileContent("No file to load.");
                return;
            }

            setFileName(pathToLoad.split("/").pop() || "File Viewer");

            try {
                const response = await fetch(pathToLoad);
                if (!response.ok) {
                    setFileContent("Failed to load file.");
                    return;
                }

                if (["txt", "readme", "md"].includes(fileType)) {
                    const text = await response.text();
                    setFileContent(text);
                } else if (["png", "jpeg", "jpg"].includes(fileType)) {
                    setFileContent(pathToLoad);
                } else {
                    setFileContent("Unsupported file type.");
                }
            } catch (error) {
                setFileContent("Error loading file.");
            }
        };

        loadFile();
    }, [filePath, fileType]);

    return (
        <Window title={fileName} onClose={onClose}>
            <div className="file-content bg-gray-800 p-4 overflow-auto max-h-full h-full">
                {["txt", "readme", "md"].includes(fileType) ? (
                    <pre className="text-white whitespace-pre-wrap">{fileContent}</pre>
                ) : ["png", "jpeg", "jpg"].includes(fileType) ? (
                    <img
                        src={fileContent as string}
                        alt="File Preview"
                        className="max-w-full max-h-full object-contain mx-auto"
                    />
                ) : (
                    <p className="text-gray-400">⚠️ Cannot preview this file.</p>
                )}
            </div>
        </Window>
    );
};

export default UniversalFileViewer;