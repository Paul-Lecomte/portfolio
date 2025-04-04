import React, { useState, useEffect } from "react";
import { fetchFiles } from "../../utils/filesystem";
import UniversalFileViewer from "./FileReader";

type File = {
    name: string;
    type: "file" | "folder";
    path: string;
    url: string;
};

interface FileExplorerProps {
    onOpenFile: (fileName: string, filePath: string, fileUrl: string) => void;
}

export default function FileExplorer({ onOpenFile }: FileExplorerProps) {
    const [files, setFiles] = useState<File[]>([]);
    const [currentPath, setCurrentPath] = useState<string>("/C");
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        const loadFiles = async () => {
            const fetchedFiles = await fetchFiles(currentPath);
            setFiles(fetchedFiles);
        };
        loadFiles();
    }, [currentPath]);

    const handleFolderClick = (folder: File) => {
        if (folder.type === "folder") {
            setCurrentPath(folder.path);
        }
    };

    const handleFileClick = (file: File) => {
        if (file.type === "file") {
            onOpenFile(file.name, file.path, file.url);  // passing the file details
        }
    };

    const handleBackClick = () => {
        const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/")) || "/C";
        setCurrentPath(parentPath);
    };

    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="file-explorer p-4 bg-gray-800 text-white flex flex-col h-full">
            {/* Path Navigation */}
            <div className="flex items-center mb-4">
                <button onClick={handleBackClick} className="bg-gray-600 px-2 py-1 mr-2">🔙 Back</button>
                <span className="font-mono">{currentPath}</span>
            </div>

            {/* Search Bar */}
            <input
                type="text"
                className="mb-4 p-2 bg-gray-700 text-white border border-gray-600 rounded w-full"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* File/Folder List */}
            <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-3 gap-4">
                    {filteredFiles.length > 0 ? (
                        filteredFiles.map((file) => (
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
        </div>
    );
}