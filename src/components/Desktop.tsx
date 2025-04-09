"use client";

import { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import Window from "@/components/Window";
import Terminal from "@/components/Terminal";
import FileExplorer from "@/components/FileExplorer";
import FileEditor from "@/components/FileEditor";
import Notepad from "@/components/Notepad";
import MediaPlayer from "@/components/MediaPlayer";
import ImageViewer from "@/components/ImageViewer";
import WebBrowser from "@/components/WebBrowser";
import CodeEditor from "@/components/CodeEditor";
import Paint from "@/components/Paint";
import SystemTray from './SystemTray';
import AnimatedWallpaper from "@/components/wallpaper/TestWallpaper";
import ClusterWallpaper from "@/components/wallpaper/ClusterWallpaper";
import ParticleEffect from "@/components/wallpaper/ParticlesWallpaper";
import SublimeWallpaper from "@/components/wallpaper/SolarSystemWallpaper";
import { FaFileAlt, FaLaptop, FaRegFileImage, FaVideo, FaChrome, FaMarkdown, FaCode, FaPaintBrush, FaWindows, FaTimes } from 'react-icons/fa';


// Default icons for the start menu (without showing on the desktop)
const defaultIcons = [
    { id: 1, title: "File Explorer", icon: <FaFileAlt size={24} /> },
    { id: 2, title: "Terminal", icon: <FaLaptop size={24} /> },
    { id: 3, title: "Notepad", icon: <FaRegFileImage size={24} /> },
    { id: 4, title: "Image Viewer", icon: <FaRegFileImage size={24} /> },
    { id: 5, title: "Media Player", icon: <FaVideo size={24} /> },
    { id: 6, title: "Web Browser", icon: <FaChrome size={24} /> },
    { id: 7, title: "Markdown Editor", icon: <FaMarkdown size={24} /> },
    { id: 8, title: "Code Editor", icon: <FaCode size={24} /> },
    { id: 9, title: "Paint", icon: <FaPaintBrush size={24} /> },
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
    const [wallpaperType, setWallpaperType] = useState<string>("static");

    //------------------------------------------------------------------------------------------------------------------------------
    // WALLPAPER LOGIC

    // Change wallpaper based on type
    const handleWallpaperChange = (type: string) => {
        setWallpaperType(type);
        setContextMenu((prevState: any) => ({
            ...prevState,
            isAnimatedWallpaper: type === "animated",
        }));
    };

    // Static Wallpaper Component
    const StaticWallpaper = () => (
        <div className="w-full h-full bg-cover bg-center">
            <img src="/background/10462.svg" alt="Static Wallpaper"
                 className="w-full h-full object-cover"/>
        </div>
    );

    const getTaskbarIcon = (title: string) => {
        const icons: Record<string, JSX.Element> = {
            "File Explorer": <FaFileAlt size={24} />,
            "Terminal": <FaLaptop size={24} />,
            "Notepad": <FaRegFileImage size={24} />,
            "Image Viewer": <FaRegFileImage size={24} />,
            "Media Player": <FaVideo size={24} />,
            "Web Browser": <FaChrome size={24} />,
            "Markdown Editor": <FaMarkdown size={24} />,
            "Code Editor": <FaCode size={24} />,
            "Paint": <FaPaintBrush size={24} />,
        };
        return icons[title] || <FaLaptop size={24} />;
    };

    //------------------------------------------------------------------------------------------------------------------------------

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
            {/* Render the selected wallpaper */}
            <div className="absolute w-full h-full">
                {wallpaperType === "animated" ? (
                    <AnimatedWallpaper />
                ) : wallpaperType === "solar system" ? (
                    <SublimeWallpaper />
                ) : wallpaperType === "particle" ? (
                    <ParticleEffect />
                ) : wallpaperType === "cluster" ? (
                    <ClusterWallpaper />
                ) : (
                    <StaticWallpaper />
                )}
            </div>
            {/* Windows */}
            {openWindows.map((windowTitle) => {
                const file = userFiles.find((f) => f.title === windowTitle);
                return (
                    <Window key={windowTitle} title={windowTitle} onClose={() => closeWindow(windowTitle)}>
                        {file && file.title.endsWith(".md") && (
                            <FileEditor file={file} onClose={() => closeWindow(windowTitle)} onSave={saveFileContent}/>
                        )}
                        {windowTitle === "File Explorer" && <FileExplorer onOpenFile={openWindow}/>}
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
            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[100%] h-14
                            bg-white/10 backdrop-blur-md border border-white/20
                             shadow-xl flex items-center justify-between
                             px-4 z-50">
                {/* Start Button */}
                <div className="relative">
                    <button
                        onClick={() => setStartMenuOpen(!startMenuOpen)}
                        className="w-10 h-10 bg-white/10 border border-white/20
                                   rounded-xl flex items-center justify-center
                                   hover:bg-white/20 transition"
                    >
                        <FaWindows size={24} className="text-white" />
                    </button>

                    {/* Start Menu */}
                    {startMenuOpen && (
                        <div className="absolute bottom-16 left-0 w-[480px] bg-white/10 backdrop-blur-xl
                                        rounded-2xl border border-white/20 shadow-2xl p-6 z-50 animate-fade-in">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-white text-xl font-semibold">Start</p>
                                <button
                                    onClick={() => setStartMenuOpen(false)}
                                    className="text-white/50 hover:text-white text-xl"
                                >
                                    <FaTimes size={24} className="text-white" />
                                </button>
                            </div>

                            {/* Pinned Apps */}
                            <div className="grid grid-cols-6 gap-4 mb-4">
                                {defaultIcons.map((icon: any) => (
                                    <button
                                        key={icon.id}
                                        className="flex flex-col items-center text-white/80 hover:text-white
                                                   bg-white/5 hover:bg-white/10 p-2 rounded-xl transition"
                                        onClick={() => openWindow(icon.title)}
                                    >
                                        <div className="text-2xl">{icon.icon}</div>
                                        <span className="text-xs mt-1 text-center">{icon.title}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Search Bar */}
                            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-xl">
                                <span className="text-white/50 text-lg">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Type here to search"
                                    className="flex-1 bg-transparent outline-none text-white placeholder-white/50"
                                />
                            </div>

                            {/* User Profile */}
                            <div className="mt-4 flex items-center gap-3">
                                <img src="/user.png" alt="User Avatar" className="h-8 w-8 rounded-full" />
                                <span className="text-white font-medium">Admin</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Centered Taskbar Icons */}
                <div className="flex gap-4 items-center">
                    {openWindows.map((windowTitle: string) => (
                        <button
                            key={windowTitle}
                            onClick={() => openWindow(windowTitle)}
                            className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20
                                       text-white rounded-xl transition text-sm"
                        >
                            {getTaskbarIcon(windowTitle)}
                            <span className="hidden md:inline">{windowTitle}</span>
                        </button>
                    ))}
                </div>

                {/* System Tray */}
                <div className="system-tray">
                    <SystemTray/>
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
                        position={{top: 50 + row * spacing, left: 50 + col * spacing}}
                        openWindow={openWindow}
                        onContextMenu={handleContextMenu}
                    />
                );
            })}

            {/* Context menu */}
            {contextMenu.visible && (
                <div
                    ref={menuRef}
                    className="absolute z-50 rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-xl transition-opacity animate-fade-in"
                    style={{
                        top: contextMenu.y,
                        left: contextMenu.x,
                        minWidth: "220px",
                    }}
                >
                    <div className="flex flex-col py-2">
                        {/* Menu Item */}
                        <button
                            className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-white/20 transition rounded-md"
                            onClick={handleShowCreateModal}
                        >
                            <img src="/contextmenu/create.png" alt="" className="h-5 w-5" />
                            Create a file
                        </button>

                        <button
                            className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-white/20 transition rounded-md"
                            onClick={() => renameFile(contextMenu.iconTitle!)}
                        >
                            <img src="/contextmenu/edit.png" alt="" className="h-5 w-5" />
                            Rename
                        </button>

                        <button
                            className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-white/20 transition rounded-md"
                            onClick={handleFileUpload}
                        >
                            <img src="/contextmenu/upload.png" alt="" className="h-5 w-5" />
                            Upload File
                        </button>

                        <button
                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-white/20 transition rounded-md"
                            onClick={() => contextMenu.iconTitle && deleteFile(contextMenu.iconTitle!)}
                        >
                            <img src="/contextmenu/delete.png" alt="" className="h-5 w-5" />
                            Delete
                        </button>

                        {/* Divider */}
                        <div className="h-px bg-white/10 my-2"></div>

                        {/* More options */}
                        <div className="relative">
                            <button
                                className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-white/20 transition rounded-md w-full"
                                onClick={toggleMoreOptions}
                            >
                                <img src="/contextmenu/more.png" alt="" className="h-5 w-5" />
                                More
                            </button>

                            {contextMenu.showMoreOptions && (
                                <div className="absolute left-full top-0 ml-1 bg-white/10 border border-white/20 rounded-xl shadow-xl backdrop-blur-xl z-50 w-48 p-2">
                                    {["Default", "Solar system", "Particle", "Cluster"].map((label) => (
                                        <button
                                            key={label}
                                            className="text-white text-sm w-full text-left px-3 py-2 hover:bg-white/20 rounded-md transition"
                                            onClick={() => handleWallpaperChange(label.toLowerCase())}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


            {/* Modal for creating new file/folder */}
            {creatingFile && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                    bg-white/10 backdrop-blur-xl border border-white/20
                    p-6 rounded-2xl shadow-2xl z-50 w-80 animate-fade-in">
                    <h2 className="text-white text-lg font-semibold mb-4">
                        Enter name for the {creatingFile}
                    </h2>

                    <input
                        type="text"
                        value={newFileName}
                        onChange={handleCreateFileNameChange}
                        className="w-full px-3 py-2 mb-3 bg-white/10 border border-white/20
                       text-white rounded-lg placeholder-white/50
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter file name"
                    />

                    <select
                        value={selectedExtension}
                        onChange={(e) => setSelectedExtension(e.target.value)}
                        className="w-full px-3 py-2 mb-4 bg-white/10 border border-white/20
                       text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {fileExtensions.map((ext) => (
                            <option key={ext} value={ext} className="text-black">
                                {ext}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleCreateFile}
                        className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white
                       rounded-lg font-medium transition"
                    >
                        Create
                    </button>
                </div>
            )}
        </div>
    );
}