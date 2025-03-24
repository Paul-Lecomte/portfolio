"use client";

import { useState } from "react";

export default function Terminal() {
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleCommand(input);
            setInput(""); // Clear input after command is executed
        }
    };

    const handleCommand = (command: string) => {
        let result = "";
        if (command === "ls") {
            result = "Desktop\nDocuments\nDownloads\nPictures"; // Simulating file list
        } else if (command.startsWith("echo ")) {
            result = command.slice(5); // Echos the text after "echo"
        } else {
            result = `Command not found: ${command}`;
        }

        // Update the output with the result
        setOutput([...output, `$ ${command}`, result]);
    };

    return (
        <div className="w-full h-full bg-gray-900 text-white p-4">
            {/* Terminal output */}
            <div className="overflow-auto max-h-96">
                {output.map((line, index) => (
                    <div key={index} className="whitespace-pre-wrap">
                        {line}
                    </div>
                ))}
            </div>

            {/* Command input */}
            <div className="flex items-center">
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