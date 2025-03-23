"use client";

import { useState } from "react";

export default function Terminal() {
    const [output, setOutput] = useState<string[]>([]);
    const [command, setCommand] = useState("");

    const handleCommand = (e: React.FormEvent) => {
        e.preventDefault();
        setOutput((prev) => [...prev, `> ${command}`]);
        setCommand("");
    };

    return (
        <div className="w-96 h-64 bg-black text-green-400 p-4 rounded-lg shadow-lg font-mono">
            <h2 className="text-lg font-semibold">Terminal</h2>
            <div className="overflow-y-auto h-40 mb-2">
                {output.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
            <form onSubmit={handleCommand}>
                <span className="text-green-400">></span>
                <input
                    type="text"
                    className="bg-transparent outline-none border-none ml-2 w-3/4"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                />
            </form>
        </div>
    );
}