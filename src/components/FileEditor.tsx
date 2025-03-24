import React, { useState, useEffect } from "react";
import SimpleMDE from "react-simplemde-editor";
import "react-simplemde-editor/dist/simplemde.min.css"; // Styling for the markdown editor

interface FileEditorProps {
    file: any; // The file to be edited
    onClose: () => void; // Function to close the editor window
    onSave: (fileId: number, content: string) => void; // Function to save the content of the file
}

const FileEditor: React.FC<FileEditorProps> = ({ file, onClose, onSave }) => {
    const [content, setContent] = useState(file.content);

    useEffect(() => {
        setContent(file.content); // Initialize with the file's content
    }, [file]);

    const handleSave = () => {
        onSave(file.id, content); // Save the content when the user clicks save
        onClose(); // Close the editor after saving
    };

    return (
        <div className="p-5 bg-gray-800 text-white">
            <div className="flex justify-between items-center">
                <h2 className="text-xl">{file.title}</h2>
                <button onClick={handleSave} className="bg-blue-500 p-2 rounded">Save</button>
            </div>
            <SimpleMDE value={content} onChange={setContent} />
        </div>
    );
};

export default FileEditor;