import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line } from 'react-konva';

export default function Paint() {
    const [lines, setLines] = useState<any[]>([]);
    const [currentLine, setCurrentLine] = useState<any[]>([]);
    const [brushColor, setBrushColor] = useState("#000000");
    const [brushWidth, setBrushWidth] = useState(5);
    const [activeTool, setActiveTool] = useState("pen");
    const stageRef = useRef<any>(null);

    // Handle mouse events
    const handleMouseDown = (e: any) => {
        if (activeTool === "pen" || activeTool === "eraser") {
            const pos = e.target.getStage().getPointerPosition();
            setCurrentLine([{ x: pos.x, y: pos.y }]);
        }
    };

    const handleMouseMove = (e: any) => {
        if (currentLine.length === 0) return;
        const pos = e.target.getStage().getPointerPosition();
        setCurrentLine((prevLine: any[]) => [...prevLine, { x: pos.x, y: pos.y }]);
    };

    const handleMouseUp = () => {
        if (currentLine.length > 0) {
            setLines((prevLines: any[]) => [...prevLines, currentLine]);
            setCurrentLine([]);
        }
    };

    // Change the active tool (Pen, Eraser)
    const changeTool = (tool: string) => {
        setActiveTool(tool);
    };

    // Change brush color
    const changeColor = (color: string) => {
        setBrushColor(color);
    };

    // Change brush width
    const changeBrushWidth = (width: number) => {
        setBrushWidth(width);
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-4 bg-gray-100">
            {/* Toolbar */}
            <div className="w-full bg-[#e4e4e4] p-4 flex justify-between items-center rounded-t-xl shadow-lg">
                <div className="flex gap-4">
                    <button
                        onClick={() => changeTool("pen")}
                        className={`p-3 text-black ${activeTool === "pen" ? "bg-[#f1f1f1]" : "bg-[#e0e0e0]"} rounded-lg`}
                    >
                        Pen
                    </button>
                    <button
                        onClick={() => changeTool("eraser")}
                        className={`p-3 text-black ${activeTool === "eraser" ? "bg-[#f1f1f1]" : "bg-[#e0e0e0]"} rounded-lg`}
                    >
                        Eraser
                    </button>
                    {/* Color Picker */}
                    <input
                        type="color"
                        value={brushColor}
                        onChange={(e) => changeColor(e.target.value)}
                        className="w-10 h-10 border-none rounded-full"
                    />
                </div>

                <div className="flex gap-4">
                    {/* Brush Width */}
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={brushWidth}
                        onChange={(e) => changeBrushWidth(Number(e.target.value))}
                        className="w-40"
                    />
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex justify-center mt-4">
                <Stage
                    width={window.innerWidth - 40}
                    height={window.innerHeight - 100}
                    ref={stageRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                >
                    <Layer>
                        {lines.map((line, index) => (
                            <Line
                                key={index}
                                points={line.flatMap(p => [p.x, p.y])}
                                stroke={activeTool === "eraser" ? "#ffffff" : brushColor}
                                strokeWidth={brushWidth}
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                            />
                        ))}
                        {currentLine.length > 0 && (
                            <Line
                                points={currentLine.flatMap(p => [p.x, p.y])}
                                stroke={activeTool === "eraser" ? "#ffffff" : brushColor}
                                strokeWidth={brushWidth}
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                            />
                        )}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
}