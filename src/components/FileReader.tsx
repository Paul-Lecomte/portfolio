import React, { useState, useEffect } from "react";

interface UniversalFileViewerProps {
    filePath: string;
    fileType: string; // File extension
    onClose: () => void;
}

const UniversalFileViewer: React.FC<UniversalFileViewerProps> = ({ filePath, fileType, onClose }) => {
    const [fileContent, setFileContent] = useState<string | null>(null);

    useEffect(() => {
        const fetchFile = async () => {
            try {
                const response = await fetch(filePath); // Use file URL directly
                if (response.ok) {
                    if (["txt", "readme", "md"].includes(fileType)) {
                        const content = await response.text();
                        setFileContent(content);
                    } else if (["png", "jpeg", "jpg"].includes(fileType)) {
                        setFileContent(filePath); // Directly use the file URL for images
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
        <div className="file-viewer-modal absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black p-4 border border-white">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">{filePath.split("/").pop()}</h2>
                <button onClick={onClose} className="bg-red-500 px-2 py-1 rounded">Close</button>
            </div>

            {/* File Content Display */}
            <div className="file-content bg-gray-800 p-4 overflow-auto max-h-96">
                {fileType === "txt" || fileType === "readme" || fileType === "md" ? (
                    <pre className="text-white whitespace-pre-wrap">{fileContent}</pre>
                ) : fileType === "png" || fileType === "jpeg" || fileType === "jpg" ? (
                    <img src={fileContent as string} alt="File Preview" className="max-w-full max-h-80" />
                ) : (
                    <p className="text-gray-400">⚠️ Cannot preview this file.</p>
                )}
            </div>
        </div>
    );
};

export default UniversalFileViewer;