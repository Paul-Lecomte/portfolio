"use client";

import { useState } from "react";

const initialFiles = [
    { name: "Documents", type: "folder" },
    { name: "Pictures", type: "folder" },
    { name: "README.txt", type: "file" },
];

export default function FileExplorer() {
    const [files] = useState(initialFiles);

    return (
        <div className="w-96 h-64 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-2">File Explorer</h2>
            <ul className="space-y-1">
                {files.map((file, index) => (
                    <li key={index} className="flex items-center space-x-2 p-2 hover:bg-gray-800 rounded-md cursor-pointer">
                        <span>{file.type === "folder" ? "📁" : "📄"}</span>
                        <span>{file.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}