"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

// GitHub-style Markdown CSS
import "github-markdown-css/github-markdown.css";
import "../../public/simplemde.min.css";

interface FileEditorProps {
    file: any;
    onClose: () => void;
    onSave: (fileId: number, content: string) => void;
}

const FileEditor: React.FC<FileEditorProps> = ({ file, onClose, onSave }) => {
    const [content, setContent] = useState("");
    const [isPreview, setIsPreview] = useState(false);

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
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsPreview(!isPreview)}
                        className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded"
                    >
                        {isPreview ? "Edit" : "Preview"}
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
            <div className="flex-1 overflow-auto rounded">
                {isPreview ? (
                    <div className="markdown-body p-4 bg-white text-black rounded overflow-auto max-h-[90%]">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content}
                        </ReactMarkdown>
                    </div>
                ) : (
                    <SimpleMDE value={content} onChange={setContent} options={{ maxHeight: "80%" }} />
                )}
            </div>
        </div>
    );
};

export default FileEditor;