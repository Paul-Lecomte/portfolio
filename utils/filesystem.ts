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
        },
        {
            name: "resume.docx",
            type: "file",
            path: "/C/Users/Paul/Documents/resume.docx",
            url: `${baseUrl}/C/Users/Paul/Documents/resume.docx`,
            app: "Word",
        },
        {
            name: "budget.xlsx",
            type: "file",
            path: "/C/Users/Paul/Documents/budget.xlsx",
            url: `${baseUrl}/C/Users/Paul/Documents/budget.xlsx`,
            app: "Excel",
        },
    ],
    "/C/Users/Paul/Pictures": [
        {
            name: "image2.png",
            type: "file",
            path: "/C/Users/Paul/Pictures/image2.png",
            url: `${baseUrl}/C/Users/Paul/Pictures/image2.png`,
            app: "Image Viewer",
        },
        {
            name: "vacation.jpg",
            type: "file",
            path: "/C/Users/Paul/Pictures/vacation.jpg",
            url: `${baseUrl}/C/Users/Paul/Pictures/vacation.jpg`,
            app: "Image Viewer",
        },
        {
            name: "profile_pic.jpeg",
            type: "file",
            path: "/C/Users/Paul/Pictures/profile_pic.jpeg",
            url: `${baseUrl}/C/Users/Paul/Pictures/profile_pic.jpeg`,
            app: "Image Viewer",
        },
    ],
    "/C/Users/Paul/Downloads": [
        {
            name: "stocker-report.pdf",
            type: "file",
            path: "/C/Users/Paul/Downloads/stocker-report.pdf",
            url: `${baseUrl}/C/Users/Paul/Downloads/stocker-report.pdf`,
            app: "PDF Viewer",
        },
        {
            name: "ArmaCalcManual.pdf",
            type: "file",
            path: "/C/Users/Paul/Downloads/ArmaCalcManual.pdf",
            url: `${baseUrl}/C/Users/Paul/Downloads/ArmaCalcManual.pdf`,
            app: "PDF Viewer",
        },
    ],
    "/C/Users/Paul/Desktop": [
        {
            name: "projects",
            type: "folder",
            path: "/C/Users/Paul/Desktop/projects",
        },
        {
            name: "ReadMe.txt",
            type: "file",
            path: "/C/Users/Paul/Desktop/ReadMe.txt",
            url: `${baseUrl}/C/Users/Paul/Desktop/ReadMe.txt`,
            app: "Notepad",
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
        },
        {
            name: "index.js",
            type: "file",
            path: "/C/Users/Paul/Desktop/projects/index.js",
            url: `${baseUrl}/C/Users/Paul/Desktop/projects/index.js`,
            app: "Code Editor",
        },
    ],
    "/C/Users/Paul/Music": [
        {
            name: "lo-fi.mp3",
            type: "file",
            path: "/C/Users/Paul/Music/lo-fi.mp3",
            url: `${baseUrl}/C/Users/Paul/Music/lo-fi.mp3`,
            app: "Music Player",
        },
        {
            name: "theme.wav",
            type: "file",
            path: "/C/Users/Paul/Music/theme.wav",
            url: `${baseUrl}/C/Users/Paul/Music/theme.wav`,
            app: "Music Player",
        },
    ],
    "/C/Users/Paul/Videos": [
        {
            name: "demo.mp4",
            type: "file",
            path: "/C/Users/Paul/Videos/demo.mp4",
            url: `${baseUrl}/C/Users/Paul/Videos/demo.mp4`,
            app: "Video Player",
        },
        {
            name: "tutorial.mov",
            type: "file",
            path: "/C/Users/Paul/Videos/tutorial.mov",
            url: `${baseUrl}/C/Users/Paul/Videos/tutorial.mov`,
            app: "Video Player",
        },
    ],
    "/C/Users/Public": [
        {
            name: "family-photo.jpg",
            type: "file",
            path: "/C/Users/Public/family-photo.jpg",
            url: `${baseUrl}/C/Users/Public/family-photo.jpg`,
            app: "Image Viewer",
        },
    ],
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
            url: `${baseUrl}/C/Program Files/ExampleApp/config.json`,
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
    "/C/Windows/Fonts": [
        {
            name: "arial.ttf",
            type: "file",
            path: "/C/Windows/Fonts/arial.ttf",
            url: `${baseUrl}/C/Windows/Fonts/arial.ttf`,
            app: "Font Viewer",
        },
    ],
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
    "/C/System32/drivers": [
        {
            name: "audio.sys",
            type: "file",
            path: "/C/System32/drivers/audio.sys",
            url: `${baseUrl}/C/System32/drivers/audio.sys`,
            app: "System",
        },
    ],
};

export async function fetchFiles(path: string): Promise<FileItem[]> {
    return mockFilesystem[path] || [];
}