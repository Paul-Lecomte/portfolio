"use client"

import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import Window from "@/components/Window";
import Terminal from "@/components/Terminal";
import FileExplorer from "@/components/FileExplorer";
import FileEditor from "@/components/FileEditor";

// Default icons on the desktop
const defaultIcons = [
    { id: 1, title: "File Explorer", icon: "📁" },
    { id: 2, title: "Terminal", icon: "💻" },
];

const DesktopIcon = ({ icon, position, openWindow, onContextMenu }: any) => {
    const iconRef = useRef(null);

    return (
        <Draggable nodeRef={iconRef}>
            <div
                ref={iconRef}
                className="absolute w-16 h-16 flex flex-col items-center text-white cursor-pointer"
                style={{ top: position.top, left: position.left }}
                onDoubleClick={() => openWindow(icon.title)}
                onContextMenu={(e) => onContextMenu(e, icon.title)}
            >
                <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-md text-xl">
                    {icon.icon}
                </div>
                <span className="text-sm mt-1">{icon.title}</span>
            </div>
        </Draggable>
    );
};

export default function Desktop() {
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        visible: boolean;
        iconTitle: string | null;
    }>({
        x: 0,
        y: 0,
        visible: false,
        iconTitle: null,
    });
    const [startMenuOpen, setStartMenuOpen] = useState(false);
    const [time, setTime] = useState<string>("");
    const [openWindows, setOpenWindows] = useState<string[]>([]);
    const [userFiles, setUserFiles] = useState<any[]>([]); // Track files created by the user
    const [newFileName, setNewFileName] = useState<string>(""); // Track the new file/folder name
    const [creatingFile, setCreatingFile] = useState<"file" | "folder" | null>(null); // Track creation type

    const contextMenuRef = useRef(contextMenu);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const handleContextMenu = (e: React.MouseEvent, iconTitle: string) => {
        e.preventDefault();
        console.log(`Context menu triggered for: ${iconTitle}`);

        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            visible: true,
            iconTitle,
        });
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
            setContextMenu((prevState) => ({
                ...prevState,
                visible: false,
            }));
        }
    };

    const openWindow = (windowTitle: string) => {
        setOpenWindows((prev) => (prev.includes(windowTitle) ? prev : [...prev, windowTitle]));
    };

    const closeWindow = (windowTitle: string) => {
        setOpenWindows((prev) => prev.filter((title) => title !== windowTitle));
    };

    const deleteFile = (title: string) => {
        console.log(`Deleting file with title: ${title}`);
        setUserFiles((prevFiles) => prevFiles.filter((file) => file.title.trim() !== title.trim()));
        // Only close the context menu after deleting
    };

    const renameFile = (title: string) => {
        const newName = prompt("Enter a new name:", title);
        if (newName && newName.trim() !== "" && newName !== title) {
            setUserFiles((prevFiles) =>
                prevFiles.map((file) =>
                    file.title === title ? { ...file, title: newName.trim() } : file
                )
            );
        } else if (newName === title) {
            alert("The name is the same. Please choose a new one.");
        }
        // Close context menu only after rename is done
    };

    const createFileOrFolder = (type: string) => {
        setCreatingFile(type as "file" | "folder");
        setNewFileName(""); // Reset name input when starting new creation
    };

    const handleCreateFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewFileName(e.target.value);
    };

    const handleCreateFile = () => {
        if (newFileName.trim() === "") {
            alert("Please enter a name for the file/folder.");
            return;
        }

        // Append '.md' if no extension is provided
        const fileNameWithExtension = newFileName.trim().endsWith(".md")
            ? newFileName.trim()
            : `${newFileName.trim()}.md`;

        const newFileOrFolder = {
            id: userFiles.length + 1 + defaultIcons.length, // Unique ID
            title: fileNameWithExtension, // Use the file name with .md extension
            type: creatingFile,
            icon: creatingFile === "file" ? "📄" : "📁",
            content: creatingFile === "file" && fileNameWithExtension.endsWith(".md") ? "" : null, // Initialize content for .md files
        };

        setUserFiles((prevFiles) => [...prevFiles, newFileOrFolder]);
        setCreatingFile(null); // Reset creation type after creation
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Function to save the content of a file
    const saveFileContent = (fileId: number, content: string) => {
        setUserFiles((prevFiles) =>
            prevFiles.map((file) => (file.id === fileId ? { ...file, content } : file))
        );
    };

    return (
        <div className="w-full h-screen bg-gray-950 relative" onContextMenu={(e) => handleContextMenu(e, "")}>
            {/* Windows */}
            {openWindows.map((windowTitle) => {
                const file = userFiles.find((f) => f.title === windowTitle);
                return (
                    <Window key={windowTitle} title={windowTitle} onClose={() => closeWindow(windowTitle)}>
                        {file && file.title.endsWith(".md") && (
                            <FileEditor
                                file={file}
                                onClose={() => closeWindow(windowTitle)}
                                onSave={saveFileContent}
                            />
                        )}
                        {windowTitle === "File Explorer" && <FileExplorer />}
                        {windowTitle === "Terminal" && <Terminal />}
                    </Window>
                );
            })}

            {/* Taskbar */}
            <div className="absolute bottom-0 w-full bg-gray-800 p-2 flex items-center justify-between rounded-t-xl shadow-lg">
                {/* Start Menu Button */}
                <div className="relative">
                    <button
                        onClick={() => setStartMenuOpen(!startMenuOpen)}
                        className="w-10 h-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600"
                    >
                        🏁
                    </button>
                    {startMenuOpen && (
                        <div className="absolute bottom-12 left-0 w-64 bg-gray-900 p-3 rounded-lg shadow-xl">
                            <p className="text-white">Start Menu</p>
                        </div>
                    )}
                </div>

                {/* Task Icons */}
                <div className="flex space-x-4">
                    {defaultIcons.map((icon) => (
                        <div
                            key={icon.id}
                            className="bg-gray-600 text-white p-2 rounded-md cursor-pointer"
                            onDoubleClick={() => openWindow(icon.title)}
                        >
                            {icon.icon}
                        </div>
                    ))}
                </div>

                {/* System Tray */}
                <div className="flex space-x-3 text-white">
                    <span>🔊</span>
                    <span>📶</span>
                    <span>⚡</span>
                    <span>{time}</span>
                </div>
            </div>

            {/* Desktop Icons - Merging default and user files */}
            {[...defaultIcons, ...userFiles].map((icon, index) => {
                const row = Math.floor(index / 3);
                const col = index % 3;
                const spacing = 100; // Distance between icons

                return (
                    <DesktopIcon
                        key={icon.id}
                        icon={icon}
                        position={{ top: 50 + row * spacing, left: 50 + col * spacing }}
                        openWindow={openWindow}
                        onContextMenu={handleContextMenu}
                    />
                );
            })}

            {/* Context Menu */}
            {contextMenu.visible && (
                <div
                    ref={menuRef}
                    className="absolute bg-gray-800 text-white p-2 border border-gray-700 rounded-md shadow-lg context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button className="block w-full text-left px-3 py-1 hover:bg-gray-700">Open</button>
                    <button
                        className="block w-full text-left px-3 py-1 hover:bg-gray-700"
                        onClick={() => renameFile(contextMenu.iconTitle!)}
                    >
                        Rename
                    </button>
                    <button
                        className="block w-full text-left px-3 py-1 hover:bg-gray-700 text-red-500"
                        onClick={() => {
                            console.log(`Delete button clicked for: ${contextMenu.iconTitle}`);
                            contextMenu.iconTitle && deleteFile(contextMenu.iconTitle!);
                        }}
                    >
                        Delete
                    </button>
                    <button
                        className="block w-full text-left px-3 py-1 hover:bg-gray-700 text-green-500"
                        onClick={() => createFileOrFolder("file")}
                    >
                        Create File
                    </button>
                    <button
                        className="block w-full text-left px-3 py-1 hover:bg-gray-700 text-blue-500"
                        onClick={() => createFileOrFolder("folder")}
                    >
                        Create Folder
                    </button>
                </div>
            )}

            {/* Modal for naming new file/folder */}
            {creatingFile && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-5 rounded-lg shadow-xl z-2">
                    <h2 className="text-white text-lg mb-3">Enter name for the {creatingFile}</h2>
                    <input
                        type="text"
                        value={newFileName}
                        onChange={handleCreateFileNameChange}
                        className="w-full p-2 bg-gray-700 text-white rounded-md"
                        placeholder={`New ${creatingFile}`}
                    />
                    <button
                        onClick={handleCreateFile}
                        className="mt-3 w-full bg-green-500 p-2 rounded-md text-white"
                    >
                        Create
                    </button>
                </div>
            )}
        </div>
    );
}