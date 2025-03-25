export async function fetchFiles(path: string): Promise<File[]> {
    const mockFilesystem = {
        "/C": [
            { name: "Users", type: "folder", path: "/C/Users" },
            { name: "Program Files", type: "folder", path: "/C/Program Files" },
            { name: "Windows", type: "folder", path: "/C/Windows" },
            { name: "System32", type: "folder", path: "/C/System32" },
        ],
        "/C/Users": [
            { name: "admin", type: "folder", path: "/C/Users/admin" },
        ],
        "/C/Users/admin": [
            { name: "Documents", type: "folder", path: "/C/Users/admin/Documents" },
            { name: "Pictures", type: "folder", path: "/C/Users/admin/Pictures" },
            { name: "Downloads", type: "folder", path: "/C/Users/admin/Downloads" },
            { name: "Desktop", type: "folder", path: "/C/Users/admin/Desktop" },
        ],
        "/C/Users/admin/Documents": [
            { name: "notes.txt", type: "file", path: "/C/Users/admin/Documents/notes.txt", url: "../filesystem/C/users/admin/Documents/notes.txt" },
        ],
        "/C/Users/admin/Pictures": [
            { name: "image1.png", type: "file", path: "/C/Users/admin/Pictures/image1.png" },
        ],
        "/C/Users/admin/Downloads": [],
        "/C/Users/admin/Desktop": [],
        "/C/Program Files": [],
        "/C/Windows": [],
        "/C/System32": [],
    };

    return mockFilesystem[path] || [];
}