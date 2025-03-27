"use client";

import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import Window from "@/components/Window";
import Terminal from "@/components/Terminal";
import FileExplorer from "@/components/FileExplorer";
import FileEditor from "@/components/FileEditor";
import UniversalFileViewer from "@/components/FileReader";
import Notepad from "@/components/Notepad";
import MediaPlayer from "@/components/MediaPlayer";
import ImageViewer from "@/components/ImageViewer";
import WebBrowser from "@/components/WebBrowser";

// Default icons for the start menu (without showing on the desktop)
const defaultIcons = [
    { id: 1, title: "File Explorer", icon: "📁" },
    { id: 2, title: "Terminal", icon: "💻" },
    { id: 3, title: "Notepad", icon: "📝" },
    { id: 4, title: "Image Viewer", icon: "🖼️" },
    { id: 5, title: "Media Player", icon: "🎥" },
    { id: 6, title: "Web Browser", icon: "🌐" },
    { id: 7, title: "Markdown Editor", icon: "📄" }
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
                onContextMenu={(e) => {
                    e.stopPropagation(); // Stop the event from bubbling to the desktop
                    onContextMenu(e, icon.title);
                }}
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
    const [userFiles, setUserFiles] = useState<any[]>([]);
    const [newFileName, setNewFileName] = useState<string>("");
    const [creatingFile, setCreatingFile] = useState<"file" | "folder" | null>(null);

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

    const openWindow = (fileName: string) => {
        setOpenWindows((prev) => (prev.includes(fileName) ? prev : [...prev, fileName]));
    };

    const closeWindow = (windowTitle: string) => {
        setOpenWindows((prev) => prev.filter((title) => title !== windowTitle));
    };

    const deleteFile = (title: string) => {
        setUserFiles((prevFiles) => prevFiles.filter((file) => file.title.trim() !== title.trim()));
    };

    const renameFile = (title: string) => {
        const newName = prompt("Enter a new name:", title);
        if (newName && newName.trim() !== "" && newName !== title) {
            setUserFiles((prevFiles) =>
                prevFiles.map((file) =>
                    file.title === title ? { ...file, title: newName.trim() } : file
                )
            );
        }
    };

    const createFileOrFolder = (type: string) => {
        setCreatingFile(type as "file" | "folder");
        setNewFileName("");
    };

    const handleCreateFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewFileName(e.target.value);
    };

    const handleCreateFile = () => {
        if (newFileName.trim() === "") {
            alert("Please enter a name for the file/folder.");
            return;
        }

        const fileNameWithExtension = newFileName.trim().endsWith(".md")
            ? newFileName.trim()
            : `${newFileName.trim()}.md`;

        const newFileOrFolder = {
            id: userFiles.length + 1 + defaultIcons.length,
            title: fileNameWithExtension,
            type: creatingFile,
            icon: creatingFile === "file" ? "📄" : "📁",
            content: creatingFile === "file" && fileNameWithExtension.endsWith(".md") ? "" : null,
        };

        setUserFiles((prevFiles) => [...prevFiles, newFileOrFolder]);
        setCreatingFile(null);
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

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
                            <FileEditor file={file} onClose={() => closeWindow(windowTitle)} onSave={saveFileContent} />
                        )}
                        {windowTitle === "File Explorer" && <FileExplorer onOpenFile={openWindow} />}
                        {windowTitle === "Terminal" && <Terminal />}
                        {/* Add the new apps here */}
                        {windowTitle === "Notepad" && <Notepad file={file} onClose={() => closeWindow(windowTitle)} />}
                        {windowTitle === "Image Viewer" && <ImageViewer file={file} onClose={() => closeWindow(windowTitle)} />}
                        {windowTitle === "Media Player" && <MediaPlayer file={file} onClose={() => closeWindow(windowTitle)} />}
                        {windowTitle === "Web Browser" && <WebBrowser file={file} onClose={() => closeWindow(windowTitle)} />}
                        {windowTitle === "Markdown Editor" && <FileEditor file={null} onClose={() => closeWindow(windowTitle)} onSave={() => {}} />}
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
                            <div className="space-y-2">
                                {defaultIcons.map((icon) => (
                                    <button
                                        key={icon.id}
                                        className="text-white"
                                        onClick={() => openWindow(icon.title)}
                                    >
                                        {icon.icon} {icon.title}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Taskbar Icons (currently open apps) */}
                <div className="flex space-x-4">
                    {openWindows.map((windowTitle) => (
                        <div
                            key={windowTitle}
                            className="bg-gray-600 text-white p-2 rounded-md cursor-pointer"
                            onClick={() => openWindow(windowTitle)}
                        >
                            {windowTitle === "File Explorer" ? "📁" : "💻"} {windowTitle}
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

            {/* Desktop Icons */}
            {[...userFiles].map((icon, index) => {
                const row = Math.floor(index / 3);
                const col = index % 3;
                const spacing = 100;

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
                    className="absolute bg-gray-800 text-white p-2 border border-gray-700 rounded-md shadow-lg"
                    style={{top: contextMenu.y, left: contextMenu.x}}
                >
                    <button className="block w-full text-left px-3 py-1 hover:bg-gray-700">Open</button>
                    <button
                        className="block w-full text-left px-3 py-1 hover:bg-gray-700"
                        onClick={() => renameFile(contextMenu.iconTitle!)}
                    >
                        Rename
                    </button>
                    <button className="block w-full text-left px-3 py-1 hover:bg-gray-700"
                            onClick={() => createFileOrFolder("file")}>Create File
                    </button>
                    <button
                        className="block w-full text-left px-3 py-1 hover:bg-gray-700 text-red-500"
                        onClick={() => {
                            contextMenu.iconTitle && deleteFile(contextMenu.iconTitle!);
                        }}
                    >
                        Delete
                    </button>
                </div>
            )}

            {/* Modal for creating new file/folder */}
            {creatingFile && (
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-5 rounded-lg shadow-xl z-2">
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