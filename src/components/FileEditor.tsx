"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });
import "../../public/simplemde.min.css";

interface FileEditorProps {
    file: any;
    onClose: () => void;
    onSave: (fileId: number, content: string) => void;
}

const FileEditor: React.FC<FileEditorProps> = ({ file, onClose, onSave }) => {
    const [content, setContent] = useState("");

    useEffect(() => {
        const savedFile = localStorage.getItem("currentFile");
        if (savedFile) {
            const { fileUrl } = JSON.parse(savedFile);
            if (fileUrl) {
                fetch(fileUrl)
                    .then((res) => res.text())
                    .then((text) => setContent(text))
                    .catch((err) => {
                        console.error("Error loading file content:", err);
                        setContent(file.content || "");
                    });
            } else {
                setContent(file.content || "");
            }
        } else {
            setContent(file.content || "");
        }
    }, [file]);

    const handleSave = () => {
        onSave(file.id, content);
        onClose();
    };

    return (
        <div className="p-5 bg-gray-800 text-white h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{file.title}</h2>
                <button
                    onClick={handleSave}
                    className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded"
                >
                    Save
                </button>
            </div>
            <div className="flex-1 overflow-auto">
                <SimpleMDE value={content} onChange={setContent} />
            </div>
        </div>
    );
};

export default FileEditor;