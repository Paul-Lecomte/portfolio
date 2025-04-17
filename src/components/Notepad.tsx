import { useState, useEffect } from "react";

const Notepad = ({ onClose }: { onClose: () => void }) => {
    const [content, setContent] = useState<string>("");

    // Load from localStorage when the app mounts
    useEffect(() => {
        const savedFile = localStorage.getItem("currentFile");
        if (savedFile) {
            const { fileContent } = JSON.parse(savedFile);
            console.log("Loaded fileContent from localStorage:", fileContent);
            setContent(fileContent);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const updatedContent = e.target.value;
        setContent(updatedContent);

        // Update content in localStorage too (optional live sync)
        const savedFile = localStorage.getItem("currentFile");
        if (savedFile) {
            const fileData = JSON.parse(savedFile);
            localStorage.setItem(
                "currentFile",
                JSON.stringify({ ...fileData, fileContent: updatedContent })
            );
        }
    };

    const handleSave = () => {
        const blob = new Blob([content], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "notepad.txt";
        link.click();
    };

    return (
        <div className="w-full h-full bg-gray-800 rounded-lg">
            <textarea
                className="w-full h-full bg-gray-700 text-white p-2"
                value={content}
                onChange={handleChange}
                placeholder="Start typing here..."
            />
            <div className="mt-2 flex justify-end space-x-2">
                <button onClick={handleSave} className="bg-green-500 p-2 rounded-md text-white">Save</button>
                <button onClick={onClose} className="bg-red-500 p-2 rounded-md text-white">Close</button>
            </div>
        </div>
    );
};

export default Notepad;