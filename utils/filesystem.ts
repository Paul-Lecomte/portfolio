// src/utils/filesystem.ts
export type FileItem = {
    name: string;
    type: "file" | "folder";
    path: string;
    url?: string;
    app?: string;
};

const baseUrl = "/filesystem"; // Base URL for file retrieval

const mockFilesystem: Record<string, FileItem[]> = {
    "/C": [
        { name: "Users", type: "folder", path: "/C/Users" },
        { name: "Program Files", type: "folder", path: "/C/Program Files" },
        { name: "Windows", type: "folder", path: "/C/Windows" },
        { name: "System32", type: "folder", path: "/C/System32" },
    ],
    "/C/Users": [{ name: "admin", type: "folder", path: "/C/Users/admin" }],
    "/C/Users/admin": [
        { name: "Documents", type: "folder", path: "/C/Users/admin/Documents" },
        { name: "Pictures", type: "folder", path: "/C/Users/admin/Pictures" },
        { name: "Downloads", type: "folder", path: "/C/Users/admin/Downloads" },
        { name: "Desktop", type: "folder", path: "/C/Users/admin/Desktop" },
    ],
    "/C/Users/admin/Documents": [
        {
            name: "notes.txt",
            type: "file",
            path: "/C/Users/admin/Documents/notes.txt",
            url: `${baseUrl}/C/Users/admin/Documents/notes.txt`,
            app: "Notepad",
        },
    ],
    "/C/Users/admin/Pictures": [
        {
            name: "image2.png",
            type: "file",
            path: "/C/Users/admin/Pictures/image2.png",
            url: `${baseUrl}/C/Users/admin/Pictures/image2.png`,
            app: "Image Viewer",
        },
    ],
    "/C/Users/admin/Desktop": [
        { name: "projects", type: "folder", path: "/C/Users/admin/Desktop/projects" },
    ],
    "/C/Users/admin/Desktop/projects": [
        {
            name: "stocker.html",
            type: "file",
            path: "/C/Users/admin/Desktop/projects/stocker.html",
            url: `/C/Users/admin/Desktop/projects/stocker.html`,
            app: "Web Browser",
        },
    ],
    "/C/Users/admin/Downloads": [],
    "/C/Program Files": [],
    "/C/Windows": [],
    "/C/System32": [],
};

export async function fetchFiles(path: string): Promise<FileItem[]> {
    return mockFilesystem[path] || [];
}