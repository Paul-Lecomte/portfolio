"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
    file?: any;
    onSave: (id: number, content: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ file, onSave }) => {
    const [content, setContent] = useState<string>("");
    const [language, setLanguage] = useState<string>("plaintext");

    useEffect(() => {
        const loadFile = async () => {
            let loadedFile = file;

            // Try to get the file from localStorage if not provided
            if (!loadedFile) {
                const saved = localStorage.getItem("currentFile");
                if (saved) {
                    loadedFile = JSON.parse(saved);
                }
            }

            if (!loadedFile?.fileUrl) return;

            // Guess language based on extension
            const extension = loadedFile.title?.split('.').pop()?.toLowerCase();
            switch (extension) {
                case "js": setLanguage("javascript"); break;
                case "ts": setLanguage("typescript"); break;
                case "html": setLanguage("html"); break;
                case "css": setLanguage("css"); break;
                case "json": setLanguage("json"); break;
                case "py": setLanguage("python"); break;
                case "java": setLanguage("java"); break;
                case "cpp": setLanguage("cpp"); break;
                case "c": setLanguage("c"); break;
                default: setLanguage("plaintext");
            }

            try {
                const response = await fetch(loadedFile.fileUrl);
                if (response.ok) {
                    const text = await response.text();
                    setContent(text);
                } else {
                    setContent("// Failed to load file content.");
                }
            } catch (error) {
                setContent("// Error loading file.");
            }
        };

        loadFile();
    }, [file]);

    const handleEditorChange = (value: string | undefined) => {
        if (file) {
            onSave(file.id, value || "");
        }
    };

    return (
        <div className="w-full h-full">
            <Editor
                height="100%"
                language={language}
                defaultValue={content}
                theme="vs-dark"
                onChange={handleEditorChange}
            />
        </div>
    );
};

export default CodeEditor;