"use client";

import { useState, useEffect } from "react";
import { fetchFiles } from "../../utils/filesystem"; // Fetch function for mock filesystem

type File = {
    name: string;
    type: "file" | "folder";
    path: string; // Full path for the file/folder
};

export default function FileExplorer() {
    const [files, setFiles] = useState<File[]>([]);
    const [currentPath, setCurrentPath] = useState<string>("/C"); // Default starting path
    const [openedFile, setOpenedFile] = useState<{ name: string; content: string } | null>(null);

    // Fetch files whenever the path changes
    useEffect(() => {
        const loadFiles = async () => {
            const fetchedFiles = await fetchFiles(currentPath); // Fetch files for current path
            setFiles(fetchedFiles);
        };
        loadFiles();
    }, [currentPath]);

    // Handle folder click (navigate to the folder)
    const handleFolderClick = (folder: File) => {
        if (folder.type === "folder") {
            setCurrentPath(folder.path); // Update path to the folder
        }
    };

    // Handle file click (open the file)
    const handleFileClick = (file: File) => {
        if (file.type === "file") {
            setOpenedFile({ name: file.name, content: `Preview of ${file.name} will go here...` });
            // Optionally, fetch actual file content if necessary
        }
    };

    // Handle navigation back to the parent folder
    const handleBackClick = () => {
        const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/")) || "/C";
        setCurrentPath(parentPath); // Set the path back to the parent folder
    };

    return (
        <div className="file-explorer p-4 bg-gray-800 text-white flex flex-col h-full">
            {/* Path Navigation */}
            <div className="flex items-center mb-4">
                <button onClick={handleBackClick} className="bg-gray-600 px-2 py-1 mr-2">🔙 Back</button>
                <span className="font-mono">{currentPath}</span>
            </div>

            {/* File/Folder List */}
            <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-3 gap-4">
                    {files.length > 0 ? (
                        files.map((file) => (
                            <div
                                key={file.path}
                                className="file-item p-2 cursor-pointer hover:bg-gray-700"
                                onClick={() => file.type === "folder" ? handleFolderClick(file) : handleFileClick(file)}
                            >
                                {file.type === "folder" ? "📁" : "📄"} {file.name}
                            </div>
                        ))
                    ) : (
                        <p className="col-span-3 text-gray-400">No files found.</p>
                    )}
                </div>
            </div>

            {/* Opened File Modal */}
            {openedFile && (
                <div className="opened-file-modal absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black p-4 border border-white">
                    <h2 className="text-lg font-bold">{openedFile.name}</h2>
                    <pre className="whitespace-pre-wrap">{openedFile.content}</pre>
                    <button className="mt-2 bg-gray-600 px-2 py-1" onClick={() => setOpenedFile(null)}>Close</button>
                </div>
            )}
        </div>
    );
}