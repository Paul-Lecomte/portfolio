import { useState, useEffect } from "react";

const Notepad = ({ fileContent, onClose }: { fileContent: string; onClose: () => void }) => {
    const [content, setContent] = useState<string | undefined>(undefined); // Start with undefined

    // Log the content whenever it changes
    useEffect(() => {
        console.log("Received content in Notepad:", fileContent); // Log fileContent
        if (fileContent !== undefined) { // Check if fileContent is not undefined
            setContent(fileContent);
        }
    }, [fileContent]); // Only run when fileContent changes

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
    };

    const handleSave = () => {
        if (content !== undefined) { // Check if content is defined before saving
            const blob = new Blob([content], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "notepad.txt";
            link.click();
        }
    };

    // If content is undefined, render a loading message
    if (content === undefined) {
        return <div>Loading...</div>;
    }

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