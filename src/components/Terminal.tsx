"use client";

import { useState, useEffect, useRef } from "react";
import { fetchFiles, FileItem } from "../../utils/filesystem";

const COLORS = [
    "black", "red", "green", "yellow", "blue", "magenta", "cyan", "white",
    "gray", "brightred", "brightgreen", "brightyellow", "brightblue", "brightmagenta", "brightcyan", "brightwhite"
];

export default function Terminal() {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const [currentPath, setCurrentPath] = useState<string>("/C");
    const [currentFiles, setCurrentFiles] = useState<FileItem[]>([]);
    const [foregroundColor, setForegroundColor] = useState<string>("white");
    const [backgroundColor, setBackgroundColor] = useState<string>("black");
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

            // New Commands
            case "help":
                result = "Available commands: ls, cd, pwd, cat, echo, clear, help, whoami, date, fortune, matrix, neofetch, sudo, ping, color";
                break;

            case "whoami":
                result = "guest";
                break;

            case "date":
                result = new Date().toLocaleString();
                break;

            case "fortune":
                const fortunes = [
                    "You will find a bug today.",
                    "Code is like humor. When you have to explain it, it’s bad.",
                    "There is no cloud. It's just someone else's computer."
                ];
                result = fortunes[Math.floor(Math.random() * fortunes.length)];
                break;

            case "sudo":
                result = "You have no power here.";
                break;

            case "neofetch":
                result = `
                    OS: MyCoolOS 1.0
                    Host: Virtual Terminal
                    Uptime: 42 days
                    Memory: 8GB / 16GB
                    Shell: SpleetShell v0.1
                `;
                break;

            case "matrix":
                const matrixLines = Array.from({ length: 20 }, () =>
                    Array.from({ length: 40 }, () => (Math.random() > 0.5 ? "1" : "0")).join("")
                );
                setOutput((prev) => [...prev, `~$ ${command}`, ...matrixLines]);
                return;

            // Easter Eggs
            case "sudo make me a sandwich":
                result = "Okay. 🥪";
                break;

            case "cow":
                result = `
                   ____
                  < Moo >
                   ----
                         \   ^__^
                          \  (oo)\_______
                             (__)\       )\\/\\
                                 ||----w |
                                 ||     ||
                `;
                break;

            case "rickroll":
                result = "Never gonna give you up, never gonna let you down, never gonna run around and desert you...";
                break;

            case "easteregg.txt":
                result = "You found the secret Easter Egg! 🎉";
                break;

            // New Commands
            case "ping":
                if (args[1]) {
                    result = simulatePing(args[1]);
                } else {
                    result = "Usage: ping <host>";
                }
                break;

            case "color":
                if (args[1] && COLORS.includes(args[1]) && args[2] && COLORS.includes(args[2])) {
                    setForegroundColor(args[1]);
                    setBackgroundColor(args[2]);
                    result = `Color changed: ${args[1]} (foreground), ${args[2]} (background)`;
                } else {
                    result = "Usage: color <foreground> <background> (valid colors: black, red, green, yellow, blue, magenta, cyan, white, gray, brightred, brightgreen, brightyellow, brightblue, brightmagenta, brightcyan, brightwhite)";
                }
                break;

            default:
                result = `Command not found: ${command}`;
                break;
        }

        setOutput((prev) => [...prev, `~$ ${command}`, result]);
    };

    const simulatePing = (host: string) => {
        const time = Math.floor(Math.random() * 100) + 1;
        return `Pinging ${host} with 32 bytes of data:\nReply from ${host}: bytes=32 time=${time}ms\nReply from ${host}: bytes=32 time=${time}ms\nReply from ${host}: bytes=32 time=${time}ms\nReply from ${host}: bytes=32 time=${time}ms\n\nPing statistics for ${host}: 4 packets transmitted, 4 received, 0% packet loss, time ${time * 4}ms`;
    };

    return (
        <div
            className="w-full h-full p-4 font-mono"
            style={{
                backgroundColor: backgroundColor,
                color: foregroundColor,
            }}
        >
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