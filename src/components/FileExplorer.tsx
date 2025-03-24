import { useState } from "react";

const initialFileStructure = {
    "Documents": [
        { name: "File1.txt", type: "file" },
        { name: "File2.pdf", type: "file" },
        { name: "Folder1", type: "folder" },
    ],
    "Pictures": [
        { name: "Image1.jpg", type: "file" },
        { name: "Folder2", type: "folder" },
    ],
    "Videos": [
        { name: "Video1.mp4", type: "file" },
    ],
};

export default function FileExplorer() {
    const [currentFolder, setCurrentFolder] = useState<string>("");

    const navigateToFolder = (folderName: string) => {
        setCurrentFolder(folderName);
    };

    const getFolderContents = (folderName: string) => {
        return initialFileStructure[folderName] || [];
    };

    return (
        <div className="p-4 w-full h-full bg-gray-900 text-white">
            <h2 className="text-xl mb-4">File Explorer</h2>

            {/* Display current folder contents */}
            <div>
                {currentFolder ? (
                    <div>
                        <h3 className="text-lg mb-2">Contents of {currentFolder}</h3>
                        <button onClick={() => setCurrentFolder("")} className="text-blue-500 mb-4">
                            Back to Desktop
                        </button>
                        <div className="grid grid-cols-3 gap-4">
                            {getFolderContents(currentFolder).map((item, index) => (
                                <div
                                    key={index}
                                    className="cursor-pointer p-2 bg-gray-700 rounded-md text-center hover:bg-gray-600"
                                    onClick={() => item.type === "folder" && navigateToFolder(item.name)}
                                >
                                    <div className="text-xl">
                                        {item.type === "folder" ? "📁" : "📄"}
                                    </div>
                                    <span className="text-sm">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {/* Display the root folders */}
                        {Object.keys(initialFileStructure).map((folder, index) => (
                            <div
                                key={index}
                                className="cursor-pointer p-2 bg-gray-700 rounded-md text-center hover:bg-gray-600"
                                onClick={() => navigateToFolder(folder)}
                            >
                                <div className="text-xl">📁</div>
                                <span className="text-sm">{folder}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}