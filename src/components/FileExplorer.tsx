// In FileExplorer.tsx
import { useState } from "react";

type File = {
    id: string;
    name: string;
    type: "file" | "folder";
    children?: File[]; // Only folders will have children
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
    const [files, setFiles] = useState<File[]>(initialFiles);
    const [currentFolder, setCurrentFolder] = useState<File[]>(files); // Tracks current folder contents

    const handleFolderClick = (folder: File) => {
        if (folder.type === "folder" && folder.children) {
            setCurrentFolder(folder.children);
        }
    };

    return (
        <div className="file-explorer">
            <div className="folders">
                {currentFolder.map((file) => (
                    <div
                        key={file.id}
                        className="file-item"
                        onClick={() => handleFolderClick(file)}
                    >
                        {file.type === "folder" ? "📁" : "📄"} {file.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
