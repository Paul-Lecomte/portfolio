import React, { useState, useEffect } from "react";
import Window from "./Window"; // Import the Window component

interface UniversalFileViewerProps {
    filePath: string;
    fileType: string;
    onClose: () => void;
}

const UniversalFileViewer: React.FC<UniversalFileViewerProps> = ({ filePath, fileType, onClose }) => {
    const [fileContent, setFileContent] = useState<string | null>(null);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const response = await fetch(filePath);
                if (response.ok) {
                    if (["txt", "readme", "md"].includes(fileType)) {
                        const content = await response.text();
                        setFileContent(content);
                    } else if (["png", "jpeg", "jpg"].includes(fileType)) {
                        setFileContent(filePath);
                    }
                } else {
                    setFileContent("Failed to load file.");
                }
            } catch (error) {
                setFileContent("Error loading file.");
            }
        };

        fetchFile();
    }, [filePath, fileType]);

    return (
        <Window title={filePath.split("/").pop() || "File Viewer"} onClose={onClose}>
            <div className="file-content bg-gray-800 p-4 overflow-auto max-h-full h-full">
                {fileType === "txt" || fileType === "readme" || fileType === "md" ? (
                    <pre className="text-white whitespace-pre-wrap">{fileContent}</pre>
                ) : fileType === "png" || fileType === "jpeg" || fileType === "jpg" ? (
                    <img src={fileContent as string} alt="File Preview" className="max-w-full max-h-full object-contain" />
                ) : (
                    <p className="text-gray-400">⚠️ Cannot preview this file.</p>
                )}
            </div>
        </Window>
    );
};

export default UniversalFileViewer;