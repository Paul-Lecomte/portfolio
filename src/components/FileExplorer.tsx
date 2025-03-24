import { useState } from "react";

type File = {
    id: string;
    name: string;
    type: "file" | "folder";
    children?: File[];
};

const initialFiles: File[] = [
    {
        id: "1",
        name: "Documents",
        type: "folder",
        children: [
            { id: "1-1", name: "file1.txt", type: "file" },
            { id: "1-2", name: "file2.txt", type: "file" },
        ],
    },
    { id: "2", name: "Music", type: "folder" },
    { id: "3", name: "video.mp4", type: "file" },
];

export default function FileExplorer() {
    const [files, setFiles] = useState<File[]>(initialFiles); // Root files
    const [currentFolder, setCurrentFolder] = useState<File[]>(files); // Tracks current folder contents
    const [path, setPath] = useState<string>("Root"); // Tracks the current path
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });
    const [newFolderName, setNewFolderName] = useState("");
    const [openedFile, setOpenedFile] = useState<File | null>(null); // Tracks the opened file

    // Create a new folder in the current folder
    const createNewFolder = () => {
        const newFolder: File = {
            id: `${Date.now()}`, // Generate unique ID
            name: newFolderName || "Untitled Folder",
            type: "folder",
        };
        setCurrentFolder((prev) => [...prev, newFolder]);
        setNewFolderName(""); // Reset folder name input
    };

    // Handle folder click (navigate into a folder)
    const handleFolderClick = (folder: File) => {
        if (folder.type === "folder" && folder.children) {
            setCurrentFolder(folder.children);
            setPath((prevPath) => `${prevPath} > ${folder.name}`);
        }
    };

    // Handle file double-click (open file)
    const handleFileClick = (file: File) => {
        if (file.type === "file") {
            setOpenedFile(file); // Open the file
        }
    };

    // Navigate to the previous folder
    const handleBackClick = () => {
        const pathSegments = path.split(" > ");
        if (pathSegments.length > 1) {
            pathSegments.pop(); // Remove last folder
            const newPath = pathSegments.join(" > ");
            setPath(newPath);

            // Find the parent folder based on the path
            let parentFolder = files;
            pathSegments.forEach((segment) => {
                const folder = parentFolder.find((item) => item.name === segment);
                if (folder && folder.children) {
                    parentFolder = folder.children;
                }
            });
            setCurrentFolder(parentFolder);
        }
    };

    // Handle right-click for the context menu
    const handleRightClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            visible: true,
        });
    };

    // Close context menu
    const closeContextMenu = () => {
        setContextMenu({ x: 0, y: 0, visible: false });
    };

    return (
        <div className="file-explorer" onClick={closeContextMenu} onContextMenu={handleRightClick}>
            {/* Path Display */}
            <div className="path-display">
                <button onClick={handleBackClick} className="back-button">Back</button>
                <span>{path}</span>
            </div>

            {/* File Explorer content */}
            <div className="folders">
                {currentFolder.map((file) => (
                    <div
                        key={file.id}
                        className="file-item"
                        onClick={() => file.type === "folder" ? handleFolderClick(file) : handleFileClick(file)}
                        onDoubleClick={() => handleFileClick(file)} // Handle double-click to open file
                    >
                        {file.type === "folder" ? "📁" : "📄"} {file.name}
                    </div>
                ))}
            </div>

            {/* Right-click Context Menu */}
            {contextMenu.visible && (
                <div
                    className="context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button onClick={createNewFolder}>Create Folder</button>
                </div>
            )}

            {/* Opened File Modal (optional) */}
            {openedFile && (
                <div className="opened-file-modal">
                    <h2>{openedFile.name}</h2>
                    <p>File content preview will go here...</p>
                    <button onClick={() => setOpenedFile(null)}>Close</button>
                </div>
            )}
        </div>
    );
}