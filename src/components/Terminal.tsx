"use client";

import { useState, useEffect, useRef } from "react";

export default function Terminal() {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const [currentPath, setCurrentPath] = useState<string>("~"); // Simulated filesystem
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Auto-scroll to bottom when output updates
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [output]);

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
            setInput(""); // Clear input
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
                result = "Desktop  Documents  Downloads  Pictures"; // Simulated directory listing
                break;
            case "pwd":
                result = currentPath;
                break;
            case "cd":
                if (args[1]) {
                    setCurrentPath(args[1] === ".." ? "~" : `${currentPath}/${args[1]}`);
                    result = `Changed directory to ${currentPath}`;
                } else {
                    result = "Usage: cd <directory>";
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