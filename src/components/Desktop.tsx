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
import CodeEditor from "@/components/CodeEditor";
import Paint from "@/components/Paint";
import SystemTray from './SystemTray';

// Default icons for the start menu (without showing on the desktop)
const defaultIcons = [
    { id: 1, title: "File Explorer", icon: "📁" },
    { id: 2, title: "Terminal", icon: "💻" },
    { id: 3, title: "Notepad", icon: "📝" },
    { id: 4, title: "Image Viewer", icon: "🖼️" },
    { id: 5, title: "Media Player", icon: "🎥" },
    { id: 6, title: "Web Browser", icon: "🌐" },
    { id: 7, title: "Markdown Editor", icon: "📄" },
    { id: 8, title: "Code Editor", icon: "🖥️" },
    { id: 9, title: "Paint", icon: "🎨" },
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
                    e.stopPropagation();
                    onContextMenu(e, icon.title);
                }}
            >
                <div className="w-12 h-12 flex items-center justify-center bg-gray-700 rounded-lg text-xl">
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
        showMoreOptions: boolean;  // Added flag for "More Options"
    }>({
        x: 0,
        y: 0,
        visible: false,
        iconTitle: null,
        showMoreOptions: false,  // Initially set to false
    });
    const [startMenuOpen, setStartMenuOpen] = useState(false);
    const [time, setTime] = useState<string>("");
    const [openWindows, setOpenWindows] = useState<string[]>([]);
    const [userFiles, setUserFiles] = useState<any[]>([]);
    const [newFileName, setNewFileName] = useState<string>("");
    const [creatingFile, setCreatingFile] = useState<"file" | "folder" | null>(null);
    const fileExtensions = [".txt", ".md", ".json", ".js", ".html", ".css", ".mp4", ".jpg", ".png"];
    const [selectedExtension, setSelectedExtension] = useState(fileExtensions[0]);


    const contextMenuRef = useRef(contextMenu);
    const menuRef = useRef<HTMLDivElement | null>(null);

    // Clear local storage on page reload
    useEffect(() => {
        localStorage.clear();
    }, []);  // Empty dependency array ensures this effect runs only once when the component is mounted

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    const toggleMoreOptions = () => {
        setContextMenu((prevState) => ({
            ...prevState,
            showMoreOptions: !prevState.showMoreOptions,
        }));
    };

    const handleContextMenu = (e: React.MouseEvent, iconTitle: string) => {
        e.preventDefault();
        const file = userFiles.find((f) => f.title === iconTitle);
        const extension = file ? file.title.split('.').pop() : "";

        setContextMenu({
            showMoreOptions: false,
            x: e.clientX,
            y: e.clientY,
            visible: true,
            iconTitle,
            fileExtension: extension,
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
        const file = userFiles.find((f) => f.title === fileName);

        if (file) {
            if (file.title.endsWith(".txt")) {
                setOpenWindows((prev) => (prev.includes("Notepad") ? prev : [...prev, "Notepad"]));
            } else if (file.title.match(/\.(mp4|mkv|avi|mov)$/)) {
                setOpenWindows((prev) => (prev.includes("Media Player") ? prev : [...prev, "Media Player"]));
            } else if (file.title.match(/\.(jpg|jpeg|png|gif)$/)) {
                setOpenWindows((prev) => (prev.includes("Image Viewer") ? prev : [...prev, "Image Viewer"]));
            } else if (file.title.endsWith(".md")) {
                setOpenWindows((prev) => (prev.includes("Markdown Editor") ? prev : [...prev, "Markdown Editor"]));
            } else if (file.title.match(/\.(js|jsx|ts|tsx|py|html|css|json)$/)) {
                setOpenWindows((prev) => (prev.includes("Code Editor") ? prev : [...prev, "Code Editor"]));
            } else if (file.title.startsWith("http")) {
                setOpenWindows((prev) => (prev.includes("Web Browser") ? prev : [...prev, "Web Browser"]));
            } else {
                // Open with a universal file viewer if no specific app is found
                setOpenWindows((prev) => (prev.includes("UniversalFileViewer") ? prev : [...prev, "UniversalFileViewer"]));
            }
        } else {
            setOpenWindows((prev) => (prev.includes(fileName) ? prev : [...prev, fileName]));
        }
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

    const handleShowCreateModal = () => {
        setCreatingFile("file"); // Show the modal for creating a file
    };


    const handleCreateFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewFileName(e.target.value);
    };

    const handleCreateFile = () => {
        if (newFileName.trim() === "") {
            alert("Please enter a name for the file.");
            return;
        }

        const fileNameWithExtension = `${newFileName.trim()}${selectedExtension}`;

        const newFile = {
            id: userFiles.length + 1 + defaultIcons.length,
            title: fileNameWithExtension,
            type: "file",
            icon: "📄",
            content: "",
        };

        setUserFiles((prevFiles) => [...prevFiles, newFile]);
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

    const handleFileUpload = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "*";
        input.multiple = true;

        input.click(); // Trigger the file input

        input.onchange = (e) => {
            const files = e.target?.files;
            if (files) {
                const newFiles = Array.from(files).map((file) => {
                    return new Promise((resolve, reject) => {
                        // Limit file size to 2MB (2 * 1024 * 1024 bytes)
                        const maxFileSize = 2 * 1024 * 1024;
                        if (file.size > maxFileSize) {
                            alert(`File ${file.name} exceeds the size limit of 2MB.`);
                            return;
                        }

                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const fileContent = reader.result as string; // Base64 content
                            resolve({
                                id: Date.now(),
                                title: file.name,
                                type: "file",
                                icon: "📄",
                                content: fileContent, // Store file content as Base64
                            });
                        };

                        reader.onerror = (error) => reject(error);
                        reader.readAsDataURL(file); // Read file as Base64
                    });
                });

                Promise.all(newFiles)
                    .then((processedFiles) => {
                        // Retrieve existing files from localStorage or use an empty array
                        const existingFiles = JSON.parse(localStorage.getItem("userFiles") || "[]");
                        const updatedFiles = [...existingFiles, ...processedFiles];

                        // Save files to localStorage as Base64
                        localStorage.setItem("userFiles", JSON.stringify(updatedFiles));
                        setUserFiles(updatedFiles); // Update state to reflect new files
                    })
                    .catch((error) => console.error("Error reading file:", error));
            }
        };
    };


    return (
        <div className="w-full h-screen relative desktop-body" onContextMenu={(e) => handleContextMenu(e, "")}>
            {/* Windows */}
            {openWindows.map((windowTitle) => {
                const file = userFiles.find((f) => f.title === windowTitle);
                return (
                    <Window key={windowTitle} title={windowTitle} onClose={() => closeWindow(windowTitle)}>
                        {file && file.title.endsWith(".md") && (
                            <FileEditor file={file} onClose={() => closeWindow(windowTitle)} onSave={saveFileContent}/>
                        )}
                        {windowTitle === "File Explorer" && <FileExplorer onOpenFile={openWindow} />}
                        {windowTitle === "Terminal" && <Terminal/>}
                        {/* Add new apps */}
                        {windowTitle === "Notepad" && <Notepad file={file} onClose={() => closeWindow(windowTitle)}/>}
                        {windowTitle === "Image Viewer" &&
                            <ImageViewer file={file} onClose={() => closeWindow(windowTitle)}/>}
                        {windowTitle === "Media Player" &&
                            <MediaPlayer file={file} onClose={() => closeWindow(windowTitle)}/>}
                        {windowTitle === "Web Browser" &&
                            <WebBrowser file={file} onClose={() => closeWindow(windowTitle)}/>}
                        {windowTitle === "Markdown Editor" &&
                            <FileEditor file={""} onClose={() => closeWindow(windowTitle)} onSave={() => {
                            }}/>
                        }
                        {windowTitle === "Code Editor" && <CodeEditor onClose={() => closeWindow(windowTitle)}/>}
                        {windowTitle === "Paint" && <Paint onClose={() => closeWindow(windowTitle)}/>}
                    </Window>
                );
            })}

            {/* Taskbar */}
            <div className="taskbar">
                {/* Start Menu Button */}
                <div className="relative">
                    <button onClick={() => setStartMenuOpen(!startMenuOpen)} className="start-button">
                        🏁
                    </button>
                    {startMenuOpen && (
                        <div className="start-menu">
                            <div className="start-menu-header">
                                <p className="text-white text-lg font-semibold">Start</p>
                                <button onClick={() => setStartMenuOpen(false)} className="text-gray-400 hover:text-white">✖️</button>
                            </div>

                            {/* Pinned Apps */}
                            <div className="pinned-apps">
                                {defaultIcons.map((icon) => (
                                    <button key={icon.id} className="pinned-app" onClick={() => openWindow(icon.title)}>
                                        {icon.icon}
                                        <span className="app-title">{icon.title}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Search Bar */}
                            <div className="search-bar">
                                🔍 <input type="text" placeholder="Type here to search" className="search-input" />
                            </div>

                            {/* User Profile Section (Optional) */}
                            <div className="user-profile">
                                <img src="/user.png" alt="User Avatar" className="user-avatar"/>
                                <span className="user-name">Admin</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Taskbar Icons */}
                <div className="taskbar-icons">
                    {openWindows.map((windowTitle) => (
                        <div
                            key={windowTitle}
                            className="taskbar-icon"
                            onClick={() => openWindow(windowTitle)}
                        >
                            {windowTitle === "File Explorer" && (
                                <>📁 {windowTitle}</>
                            )}
                            {windowTitle === "Terminal" && (
                                <>💻 {windowTitle}</>
                            )}
                            {windowTitle === "Notepad" && (
                                <>📝 {windowTitle}</>
                            )}
                            {windowTitle === "Image Viewer" && (
                                <>🖼️ {windowTitle}</>
                            )}
                            {windowTitle === "Media Player" && (
                                <>🎥 {windowTitle}</>
                            )}
                            {windowTitle === "Web Browser" && (
                                <>🌐 {windowTitle}</>
                            )}
                            {windowTitle === "Markdown Editor" && (
                                <>📄 {windowTitle}</>
                            )}
                            {windowTitle === "Code Editor" && (
                                <>🖥️ {windowTitle}</>
                            )}
                            {windowTitle === "Paint" && (
                                <>🎨 {windowTitle}</>
                            )}
                            {/* Default case */}
                            {windowTitle !== "File Explorer" &&
                                windowTitle !== "Terminal" &&
                                windowTitle !== "Notepad" &&
                                windowTitle !== "Image Viewer" &&
                                windowTitle !== "Media Player" &&
                                windowTitle !== "Web Browser" &&
                                windowTitle !== "Markdown Editor" &&
                                windowTitle !== "Code Editor" &&
                                windowTitle !== "Paint" && (
                                    <>💻 {windowTitle}</>
                                )}
                        </div>
                    ))}
                </div>

                {/* System Tray */}
                <div className="system-tray">
                    <SystemTray />
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

            {/* context menu */}
            {contextMenu.visible && (
                <div
                    ref={menuRef}
                    className="absolute p-4 rounded-lg shadow-lg grid gap-4 main-menu z-40"
                    style={{
                        top: contextMenu.y,
                        left: contextMenu.x,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",  // Acrylic/Mica Effect
                        backdropFilter: "blur(10px)",  // Blur effect
                        minWidth: "200px",
                    }}
                >
                    {/* Open Button */}
                    <button
                        className="context-menu-item flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 hover:text-white"
                        onClick={handleShowCreateModal}>
                        <img src="/contextmenu/create.png" alt="" className="h-6 w-6"/>
                        <span>Create a file</span>
                    </button>

                    {/* Rename Button */}
                    <button
                        className="context-menu-item flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 hover:text-white"
                        onClick={() => renameFile(contextMenu.iconTitle!)}
                    >
                        <img src="/contextmenu/edit.png" alt="" className="h-6 w-6"/>
                        <span>Rename</span>
                    </button>

                    {/* Upload File Button */}
                    <button
                        className="context-menu-item flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 hover:text-white"
                        onClick={handleFileUpload}
                    >
                        <img src="/contextmenu/upload.png" alt="" className="h-6 w-6"/>
                        <span>Upload File</span>
                    </button>

                    {/* Delete Button */}
                    <button
                        className="context-menu-item flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 hover:text-white text-red-500"
                        onClick={() => contextMenu.iconTitle && deleteFile(contextMenu.iconTitle!)}
                    >
                        <img src="/contextmenu/delete.png" alt="" className="h-6 w-6"/>
                        <span>Delete</span>
                    </button>

                    {/* More Options Button */}
                    <div className="menu-item relative">
                        <button
                            className="flex items-center rounded-lg hover:bg-gray-700 hover:text-white"
                            onClick={toggleMoreOptions}
                        >
                            <img src="/contextmenu/more.png" alt="" className="h-6 w-6"/>
                            <span>More</span>
                        </button>

                        {/* Additional Options */}
                        {contextMenu.showMoreOptions && (
                            <div className="more-options absolute left-0 top-full mt-2 p-2 bg-gray-800 rounded-lg">
                                <button className="p-2 text-white hover:bg-gray-700">Option 1</button>
                                <button className="p-2 text-white hover:bg-gray-700">Option 2</button>
                                <button className="p-2 text-white hover:bg-gray-700">Option 3</button>
                            </div>
                        )}
                    </div>
                </div>
            )}


            {/* Modal for creating new file/folder */}
            {creatingFile && (
                <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-5 rounded-lg shadow-xl z-2"
                >
                    <h2 className="text-white text-lg mb-3">Enter name for the {creatingFile}</h2>
                    <input
                        type="text"
                        value={newFileName}
                        onChange={handleCreateFileNameChange}
                        className="w-full p-2 bg-gray-700 text-white rounded-md"
                        placeholder="Enter file name"
                    />
                    <select
                        value={selectedExtension}
                        onChange={(e) => setSelectedExtension(e.target.value)}
                        className="w-full p-2 mt-2 bg-gray-700 text-white rounded-md"
                    >
                        {fileExtensions.map((ext) => (
                            <option key={ext} value={ext}>
                                {ext}
                            </option>
                        ))}
                    </select>
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