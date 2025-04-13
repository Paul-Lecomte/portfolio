import { useState, useEffect } from "react";

const Notepad = ({ fileContent, onClose }: { fileContent: string; onClose: () => void }) => {
    const [content, setContent] = useState(fileContent || ""); // Initialize with fileContent prop

    // Log the content whenever it changes
    useEffect(() => {
        console.log("Received content in Notepad:", fileContent); // Log fileContent
        if (fileContent) {
            setContent(fileContent);
        }
    }, [fileContent]); // Log whenever fileContent changes

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
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