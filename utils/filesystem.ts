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
        { name: "Music", type: "folder", path: "/C/Users/Paul/Music" },
        { name: "Videos", type: "folder", path: "/C/Users/Paul/Videos" },
    ],
    "/C/Users/Paul/Documents": [
        {
            name: "notes.txt",
            type: "file",
            path: "/C/Users/Paul/Documents/notes.txt",
            url: `${baseUrl}/C/Users/Paul/Documents/notes.txt`,
            app: "Notepad",
        }
    ],
    "/C/Users/Paul/Pictures": [
        {
            name: "image2.png",
            type: "file",
            path: "/C/Users/Paul/Pictures/image2.png",
            url: `${baseUrl}/C/Users/Paul/Pictures/image2.png`,
            app: "Image Viewer",
        }
    ],
    "/C/Users/Paul/Downloads": [],
    "/C/Users/Paul/Desktop": [
        {
            name: "projects",
            type: "folder",
            path: "/C/Users/Paul/Desktop/projects",
        },
        {
            name: "README.md",
            type: "file",
            path: "/C/Users/Paul/Desktop/README.md",
            url: `${baseUrl}/C/Users/Paul/Desktop/README.md`,
            app: "Markdown Editor",
        },
    ],
    "/C/Users/Paul/Desktop/projects": [
        {
            name: "stocker.html",
            type: "file",
            path: "/C/Users/Paul/Desktop/projects/stocker.html",
            url: `${baseUrl}/C/Users/Paul/Desktop/projects/stocker.html`,
            app: "Web Browser",
        },
        {
            name: "Arma_Reforger_Artillery_calculator.html",
            type: "file",
            path: "/C/Users/Paul/Desktop/projects/Arma_Reforger_Artillery_calculator.html",
            url: `${baseUrl}/C/Users/Paul/Desktop/projects/Arma_Reforger_Artillery_calculator.html`,
            app: "Web Browser",
        }
    ],
    "/C/Users/Paul/Music": [],
    "/C/Users/Paul/Videos": [],
    "/C/Users/Public": [],
    "/C/Program Files": [
        {
            name: "Common Files",
            type: "folder",
            path: "/C/Program Files/Common Files",
        },
        {
            name: "ExampleApp",
            type: "folder",
            path: "/C/Program Files/ExampleApp",
        },
    ],
    "/C/Program Files/ExampleApp": [
        {
            name: "config.json",
            type: "file",
            path: "/C/Program Files/ExampleApp/config.json",
            url: `${baseUrl}/C/programfiles/ExampleApp/config.json`,
            app: "Code Editor",
        },
    ],
    "/C/Windows": [
        {
            name: "Fonts",
            type: "folder",
            path: "/C/Windows/Fonts",
        },
        {
            name: "Logs",
            type: "folder",
            path: "/C/Windows/Logs",
        },
    ],
    "/C/Windows/Fonts": [],
    "/C/Windows/Logs": [
        {
            name: "system.log",
            type: "file",
            path: "/C/Windows/Logs/system.log",
            url: `${baseUrl}/C/Windows/Logs/system.log`,
            app: "Notepad",
        },
    ],
    "/C/System32": [
        {
            name: "drivers",
            type: "folder",
            path: "/C/System32/drivers",
        },
    ],
    "/C/System32/drivers": [],
};

export async function fetchFiles(path: string): Promise<FileItem[]> {
    return mockFilesystem[path] || [];
}