import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Line, Rect, Ellipse } from 'react-konva';

export default function Paint() {
    const [lines, setLines] = useState<any[]>([]);
    const [currentLine, setCurrentLine] = useState<any[]>([]);
    const [brushColor, setBrushColor] = useState("#000000");
    const [brushWidth, setBrushWidth] = useState(5);
    const [activeTool, setActiveTool] = useState("pen");
    const [isDrawing, setIsDrawing] = useState(false);
    const [shapes, setShapes] = useState<any[]>([]);
    const stageRef = useRef<any>(null);
    const layerRef = useRef<any>(null);

    // Handle mouse events
    const handleMouseDown = (e: any) => {
        const pos = e.target.getStage().getPointerPosition();

        if (activeTool === "pen" || activeTool === "eraser") {
            // Start drawing a new line with the current color and width
            setCurrentLine([{ x: pos.x, y: pos.y, color: brushColor, width: brushWidth }]);
            setIsDrawing(true);
        } else if (activeTool === "rectangle") {
            setShapes([...shapes, { type: "rect", x: pos.x, y: pos.y, width: 0, height: 0, color: brushColor, strokeWidth: brushWidth }]);
        } else if (activeTool === "ellipse") {
            setShapes([...shapes, { type: "ellipse", x: pos.x, y: pos.y, radiusX: 0, radiusY: 0, color: brushColor, strokeWidth: brushWidth }]);
        } else if (activeTool === "line") {
            setShapes([...shapes, { type: "line", points: [pos.x, pos.y], color: brushColor, strokeWidth: brushWidth }]);
        }
    };

    const handleMouseMove = (e: any) => {
        const pos = e.target.getStage().getPointerPosition();

        if (isDrawing) {
            if (activeTool === "eraser") {
                // When eraser is active, check if we intersect with any line and remove it
                const updatedLines = lines.filter((line: any) => {
                    return !line.some((point: any) => {
                        // Simple collision check, check if point is near the current mouse position
                        return Math.abs(point.x - pos.x) < brushWidth && Math.abs(point.y - pos.y) < brushWidth;
                    });
                });
                setLines(updatedLines);
            } else {
                // Update current line with the new mouse position if pen is active
                setCurrentLine((prevLine: any[]) => [...prevLine, { x: pos.x, y: pos.y, color: brushColor, width: brushWidth }]);
            }
        } else if (activeTool === "rectangle" || activeTool === "ellipse" || activeTool === "line") {
            const lastShape = shapes[shapes.length - 1];

            if (activeTool === "rectangle") {
                const updatedRect = { ...lastShape, width: pos.x - lastShape.x, height: pos.y - lastShape.y };
                setShapes([...shapes.slice(0, -1), updatedRect]);
            } else if (activeTool === "ellipse") {
                const updatedEllipse = { ...lastShape, radiusX: Math.abs(pos.x - lastShape.x), radiusY: Math.abs(pos.y - lastShape.y) };
                setShapes([...shapes.slice(0, -1), updatedEllipse]);
            } else if (activeTool === "line") {
                const updatedLine = { ...lastShape, points: [lastShape.points[0], lastShape.points[1], pos.x, pos.y] };
                setShapes([...shapes.slice(0, -1), updatedLine]);
            }
        }
    };

    const handleMouseUp = () => {
        if (isDrawing) {
            if (activeTool === "eraser") {
                // Don't save any new "eraser" lines
                setIsDrawing(false);
            } else {
                setLines([...lines, currentLine]);
                setCurrentLine([]);
                setIsDrawing(false);
            }
        }
    };

    // Change the active tool
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

    // Undo action
    const undo = () => {
        setLines(lines.slice(0, -1));
    };

    // Clear the canvas
    const clearCanvas = () => {
        setLines([]);
        setShapes([]);
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
                    <button
                        onClick={() => changeTool("rectangle")}
                        className={`p-3 text-black ${activeTool === "rectangle" ? "bg-[#f1f1f1]" : "bg-[#e0e0e0]"} rounded-lg`}
                    >
                        Rectangle
                    </button>
                    <button
                        onClick={() => changeTool("ellipse")}
                        className={`p-3 text-black ${activeTool === "ellipse" ? "bg-[#f1f1f1]" : "bg-[#e0e0e0]"} rounded-lg`}
                    >
                        Ellipse
                    </button>
                    <button
                        onClick={() => changeTool("line")}
                        className={`p-3 text-black ${activeTool === "line" ? "bg-[#f1f1f1]" : "bg-[#e0e0e0]"} rounded-lg`}
                    >
                        Line
                    </button>
                    <input
                        type="color"
                        value={brushColor}
                        onChange={(e) => changeColor(e.target.value)}
                        className="w-10 h-10 border-none rounded-full"
                    />
                </div>
                <div className="flex gap-4">
                    <input
                        type="range"
                        min="1"
                        max="50"
                        value={brushWidth}
                        onChange={(e) => changeBrushWidth(Number(e.target.value))}
                        className="w-40"
                    />
                    <button onClick={undo} className="px-4 py-2 bg-[#f0f0f0] text-black rounded-lg">Undo</button>
                    <button onClick={clearCanvas} className="px-4 py-2 bg-[#ff0000] text-white rounded-lg">Clear</button>
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
                    <Layer ref={layerRef}>
                        {/* Draw Lines */}
                        {lines.map((line, index) => (
                            <Line
                                key={index}
                                points={line.flatMap((p) => [p.x, p.y])}
                                stroke={line[0].color}
                                strokeWidth={line[0].width}
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                            />
                        ))}
                        {/* Draw Shapes */}
                        {shapes.map((shape, index) => {
                            if (shape.type === "rect") {
                                return (
                                    <Rect
                                        key={index}
                                        {...shape}
                                        fill="transparent"
                                        stroke={shape.color}
                                        strokeWidth={shape.strokeWidth}
                                    />
                                );
                            }
                            if (shape.type === "ellipse") {
                                return (
                                    <Ellipse
                                        key={index}
                                        {...shape}
                                        fill="transparent"
                                        stroke={shape.color}
                                        strokeWidth={shape.strokeWidth}
                                    />
                                );
                            }
                            if (shape.type === "line") {
                                return (
                                    <Line
                                        key={index}
                                        {...shape}
                                        stroke={shape.color}
                                        strokeWidth={shape.strokeWidth}
                                        tension={0.5}
                                        lineCap="round"
                                        lineJoin="round"
                                    />
                                );
                            }
                            return null;
                        })}
                    </Layer>
                </Stage>
            </div>
        </div>
    );
}