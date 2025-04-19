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
    "/C/Users": [{ name: "Paul", type: "folder", path: "/C/Users/Paul" }],
    "/C/Users/Paul": [
        { name: "Documents", type: "folder", path: "/C/Users/Paul/Documents" },
        { name: "Pictures", type: "folder", path: "/C/Users/Paul/Pictures" },
        { name: "Downloads", type: "folder", path: "/C/Users/Paul/Downloads" },
        { name: "Desktop", type: "folder", path: "/C/Users/Paul/Desktop" },
    ],
    "/C/Users/Paul/Documents": [
        {
            name: "notes.txt",
            type: "file",
            path: "/C/Users/admin/Documents/notes.txt",
            url: `/filesystem/C/Users/admin/Documents/notes.txt`,
            app: "Notepad",
        },
    ],
    "/C/Users/Paul/Pictures": [
        {
            name: "image2.png",
            type: "file",
            path: "/C/Users/Paul/Pictures/image2.png",
            url: `/filesystem/C/Users/Paul/Pictures/image2.png`,
            app: "Image Viewer",
        },
    ],
    "/C/Users/Paul/Desktop": [
        { name: "projects", type: "folder", path: "/C/Users/Paul/Desktop/projects" },
    ],
    "/C/Users/Paul/Desktop/projects": [
        {
            name: "stocker.html",
            type: "file",
            path: "/C/Users/Paul/Desktop/projects/stocker.html",
            url: `/filesystem/C/Users/Paul/Desktop/projects/stocker.html`,
            app: "Web Browser",
        },
        {
            name: "Arma_Reforger_Artillery_calculator.html",
            type: "file",
            path: "/C/Users/Paul/Desktop/projects/Arma_Reforger_Artillery_calculator.html",
            url: `/filesystem/C/Users/Paul/Desktop/projects/Arma_Reforger_Artillery_calculator.html`,
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