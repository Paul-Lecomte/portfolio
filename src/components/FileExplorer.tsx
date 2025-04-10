import React, { useState, useEffect } from "react";
import { fetchFiles } from "../../utils/filesystem";
import { AiFillFolder, AiFillFile, AiOutlineDesktop, AiOutlineDownload, AiOutlineHome } from "react-icons/ai";
import { IoMdArrowBack } from "react-icons/io";

type File = {
    name: string;
    type: "file" | "folder";
    path: string;
    url: string;
    app?: string;
};

interface FileExplorerProps {
    onOpenFile: (fileName: string, filePath: string, fileUrl: string, app?: string) => void;
    initialPath: string;
}

export default function FileExplorer({ onOpenFile, initialPath }: FileExplorerProps) {
    // Set initialPath to '/C' if it's undefined or empty
    const initial = initialPath || "/C"; // Default to '/C' if initialPath is falsy
    const [files, setFiles] = useState<File[]>([]);
    const [currentPath, setCurrentPath] = useState<string>(initial); // Initialize with the resolved initialPath
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        console.log("Current path received:", currentPath); // Log currentPath to verify it's being set correctly

        const loadFiles = async () => {
            const fetchedFiles = await fetchFiles(currentPath);
            setFiles(fetchedFiles);
        };

        loadFiles();
    }, [currentPath]); // Will update whenever currentPath changes

    const handleFolderClick = (folder: File) => {
        if (folder.type === "folder") {
            setCurrentPath(folder.path); // Update current path when a folder is clicked
        }
    };

    const handleFileClick = (file: File) => {
        if (file.type === "file") {
            onOpenFile(file.name, file.url, file.path, file.app); // Pass the file data
        }
    };

    const handleBackClick = () => {
        const parentPath = currentPath.substring(0, currentPath.lastIndexOf("/")) || "/C";
        setCurrentPath(parentPath); // Set to parent directory when back is clicked
    };

    const filteredFiles = files.filter(file =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-full bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-xl overflow-hidden">
            {/* Sidebar */}
            <div className="w-48 bg-white/5 border-r border-white/10 p-4 text-white">
                <div className="text-sm font-semibold mb-4 text-white/70">Quick Access</div>
                <ul className="space-y-2">
                    <li
                        className="flex items-center gap-2 hover:bg-white/10 p-2 rounded cursor-pointer"
                        onClick={() => setCurrentPath("/C/Users/admin/Desktop/projects")} // Handle the "Projects" shortcut
                    >
                        <AiOutlineDesktop className="text-lg" />
                        Project Folder
                    </li>
                    <li className="flex items-center gap-2 hover:bg-white/10 p-2 rounded cursor-pointer">
                        <AiOutlineHome className="text-lg" />
                        Home
                    </li>
                    <li className="flex items-center gap-2 hover:bg-white/10 p-2 rounded cursor-pointer">
                        <AiOutlineDownload className="text-lg" />
                        Downloads
                    </li>
                </ul>
            </div>

            {/* Main Panel */}
            <div className="flex-1 flex flex-col p-4 text-white overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center gap-2 mb-4">
                    <button
                        onClick={handleBackClick}
                        className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition"
                        title="Go back"
                    >
                        <IoMdArrowBack className="text-xl text-white" />
                    </button>
                    <input
                        type="text"
                        className="flex-1 px-3 py-2 bg-white/10 text-white placeholder-white/50 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Search files..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Path */}
                <div className="text-xs font-mono text-white/60 mb-3 px-1">{currentPath}</div>

                {/* File Grid */}
                <div
                    className="grid [grid-template-columns:repeat(auto-fit,minmax(8rem,8rem))] justify-start gap-4 pb-4">
                    {filteredFiles.length > 0 ? (
                        filteredFiles.map((file) => (
                            <div
                                key={file.path}
                                onClick={() =>
                                    file.type === "folder" ? handleFolderClick(file) : handleFileClick(file)
                                }
                                className="group cursor-pointer p-4 rounded-lg bg-white/10 hover:bg-white/20 transition flex flex-col items-center text-center select-none"
                            >
                                {file.type === "folder" ? (
                                    <AiFillFolder
                                        className="text-4xl text-yellow-400 group-hover:text-yellow-300 mb-2" />
                                ) : (
                                    <AiFillFile className="text-4xl text-blue-400 group-hover:text-blue-300 mb-2" />
                                )}
                                <span className="text-sm text-white/90 break-all">{file.name}</span>
                            </div>
                        ))
                    ) : (
                        <p className="col-span-full text-white/50 text-center">No files found.</p>
                    )}
                </div>
            </div>
        </div>
    );
}