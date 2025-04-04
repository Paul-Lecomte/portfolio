"use client";

import { useState, useEffect, useRef } from "react";
import { fetchFiles, FileItem } from "../../utils/filesystem";

export default function Terminal() {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const [currentPath, setCurrentPath] = useState<string>("/C");
    const [currentFiles, setCurrentFiles] = useState<FileItem[]>([]);
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Auto-scroll to bottom when output updates
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [output]);

    useEffect(() => {
        // Fetch files when changing directories
        fetchFiles(currentPath).then(setCurrentFiles);
    }, [currentPath]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (input.trim()) {
                executeCommand(input);
                setHistory((prev) => [...prev, input]);
                setHistoryIndex(null);
            }
            setInput("");
        } else if (e.key === "ArrowUp") {
            if (history.length > 0) {
                setHistoryIndex((prev) => (prev === null ? history.length - 1 : Math.max(0, prev - 1)));
                setInput(history[historyIndex ?? history.length - 1] || "");
            }
        } else if (e.key === "ArrowDown") {
            if (historyIndex !== null) {
                setHistoryIndex((prev) => (prev === history.length - 1 ? null : (prev ?? 0) + 1));
                setInput(history[historyIndex ?? 0] || "");
            }
        }
    };

    const executeCommand = (command: string) => {
        let result = "";
        const args = command.trim().split(" ");
        const cmd = args[0];

        switch (cmd) {
            case "ls":
                result = currentFiles.map((file) => file.name).join("  ") || "No files found";
                break;

            case "pwd":
                result = currentPath;
                break;

            case "cd":
                if (args[1]) {
                    const target = args[1] === ".." ? "/C" : `${currentPath}/${args[1]}`;
                    if (currentFiles.some((file) => file.name === args[1] && file.type === "folder")) {
                        setCurrentPath(target);
                        result = `Changed directory to ${target}`;
                    } else {
                        result = `No such directory: ${args[1]}`;
                    }
                } else {
                    result = "Usage: cd <directory>";
                }
                break;

            case "cat":
                const file = currentFiles.find((f) => f.name === args[1] && f.type === "file");
                if (file && file.url) {
                    fetch(file.url)
                        .then((res) => res.text())
                        .then((text) => setOutput((prev) => [...prev, `~$ ${command}`, text]))
                        .catch(() => setOutput((prev) => [...prev, `~$ ${command}`, "Error reading file"]));
                    return;
                } else {
                    result = `No such file: ${args[1]}`;
                }
                break;

            case "echo":
                result = args.slice(1).join(" ");
                break;

            case "clear":
                setOutput([]);
                return;

            default:
                result = `Command not found: ${command}`;
                break;
        }

        setOutput((prev) => [...prev, `~$ ${command}`, result]);
    };

    return (
        <div className="w-full h-full bg-black text-white p-4 font-mono">
            <div ref={terminalRef} className="overflow-auto max-h-[90%]">
                {output.map((line, index) => (
                    <div key={index}>{line}</div>
                ))}
            </div>

            <div className="flex items-center mt-2">
                <span className="text-green-500">~$</span>
                <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    className="ml-2 bg-transparent border-none outline-none text-white w-full"
                    autoFocus
                    placeholder="Type a command"
                />
            </div>
        </div>
    );
}