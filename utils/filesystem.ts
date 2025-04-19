export type FileItem = {
    name: string;
    type: "file" | "folder";
    path: string;
    url?: string;
    app?: string;
};

const baseUrl = "/filesystem";

const mockFilesystem: Record<string, FileItem[]> = {
    "/C": [
        { name: "Users", type: "folder", path: "/C/Users" },
        { name: "Program Files", type: "folder", path: "/C/Program Files" },
        { name: "Windows", type: "folder", path: "/C/Windows" },
        { name: "System32", type: "folder", path: "/C/System32" },
    ],
    "/C/Users": [
        { name: "Paul", type: "folder", path: "/C/Users/Paul" },
        { name: "Public", type: "folder", path: "/C/Users/Public" },
    ],
    "/C/Users/Paul": [
        { name: "Documents", type: "folder", path: "/C/Users/Paul/Documents" },
        { name: "Pictures", type: "folder", path: "/C/Users/Paul/Pictures" },
        { name: "Downloads", type: "folder", path: "/C/Users/Paul/Downloads" },
        { name: "Desktop", type: "folder", path: "/C/Users/Paul/Desktop" },
        { name: "AppData", type: "folder", path: "/C/Users/Paul/AppData" },
        { name: "OneDrive", type: "folder", path: "/C/Users/Paul/OneDrive" },
    ],
    "/C/Users/Paul/Documents": [
        {
            name: "notes.txt",
            type: "file",
            path: "/C/Users/Paul/Documents/notes.txt",
            url: `/filesystem/C/Users/Paul/Documents/notes.txt`,
            app: "Notepad",
        },
        {
            name: "resume.docx",
            type: "file",
            path: "/C/Users/Paul/Documents/resume.docx",
            url: `/filesystem/C/Users/Paul/Documents/resume.docx`,
            app: "Word",
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
        {
            name: "vacation.jpg",
            type: "file",
            path: "/C/Users/Paul/Pictures/vacation.jpg",
            url: `/filesystem/C/Users/Paul/Pictures/vacation.jpg`,
            app: "Image Viewer",
        },
    ],
    "/C/Users/Paul/Downloads": [
        {
            name: "installer.exe",
            type: "file",
            path: "/C/Users/Paul/Downloads/installer.exe",
            url: `/filesystem/C/Users/Paul/Downloads/installer.exe`,
            app: "Installer",
        },
    ],
    "/C/Users/Paul/Desktop": [
        { name: "My Documents", type: "folder", path: "/C/Users/Paul/Documents" },
        { name: "This PC", type: "folder", path: "/C" },
        {
            name: "projects",
            type: "folder",
            path: "/C/Users/Paul/Desktop/projects",
        },
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
    "/C/Program Files": [
        { name: "Google", type: "folder", path: "/C/Program Files/Google" },
        { name: "Microsoft Office", type: "folder", path: "/C/Program Files/Microsoft Office" },
    ],
    "/C/Program Files/Google": [
        {
            name: "Chrome.exe",
            type: "file",
            path: "/C/Program Files/Google/Chrome.exe",
            url: `/filesystem/C/Program Files/Google/Chrome.exe`,
            app: "Installer",
        },
    ],
    "/C/Windows": [
        {
            name: "explorer.exe",
            type: "file",
            path: "/C/Windows/explorer.exe",
            url: `/filesystem/C/Windows/explorer.exe`,
            app: "System",
        },
    ],
    "/C/System32": [
        {
            name: "cmd.exe",
            type: "file",
            path: "/C/System32/cmd.exe",
            url: `/filesystem/C/System32/cmd.exe`,
            app: "Terminal",
        },
        {
            name: "notepad.exe",
            type: "file",
            path: "/C/System32/notepad.exe",
            url: `/filesystem/C/System32/notepad.exe`,
            app: "Notepad",
        },
    ],
    "/C/Users/Paul/AppData": [],
    "/C/Users/Paul/OneDrive": [],
    "/C/Users/Public": [],
};

export async function fetchFiles(path: string): Promise<FileItem[]> {
    return mockFilesystem[path] || [];
}