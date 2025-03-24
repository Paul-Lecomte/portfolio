"use client";

export default function FileExplorer() {
    const files = [
        { id: 1, name: "Documents", type: "folder" },
        { id: 2, name: "Downloads", type: "folder" },
        { id: 3, name: "Pictures", type: "folder" },
        { id: 4, name: "example.txt", type: "file" },
        { id: 5, name: "notes.pdf", type: "file" },
    ];

    return (
        <div className="w-full h-full bg-gray-900 text-white p-4">
            <h2 className="text-lg mb-4">File Explorer</h2>
            <div className="grid grid-cols-3 gap-4">
                {files.map((file) => (
                    <div
                        key={file.id}
                        className="flex flex-col items-center bg-gray-800 p-4 rounded-md cursor-pointer hover:bg-gray-700"
                    >
                        {file.type === "folder" ? (
                            <div className="text-xl">📁</div>
                        ) : (
                            <div className="text-xl">📄</div>
                        )}
                        <span className="mt-2 text-sm">{file.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
