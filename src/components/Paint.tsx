import React, { useRef, useState } from 'react';
import { Stage, Layer, Line, Rect, Ellipse } from 'react-konva';

// Types pour les points et les formes
type Point = {
    x: number;
    y: number;
    color: string;
    width: number;
};

type Shape =
    | { type: 'rect'; x: number; y: number; width: number; height: number; color: string; strokeWidth: number }
    | { type: 'ellipse'; x: number; y: number; radiusX: number; radiusY: number; color: string; strokeWidth: number }
    | { type: 'line'; points: number[]; color: string; strokeWidth: number };

export default function Paint() {
    const [lines, setLines] = useState<Point[][]>([]);
    const [currentLine, setCurrentLine] = useState<Point[]>([]);
    const [brushColor, setBrushColor] = useState("#000000");
    const [brushWidth, setBrushWidth] = useState(5);
    const [activeTool, setActiveTool] = useState<"pen" | "rectangle" | "ellipse" | "line">("pen");
    const [isDrawing, setIsDrawing] = useState(false);
    const [shapes, setShapes] = useState<Shape[]>([]);
    const stageRef = useRef<any>(null);
    const layerRef = useRef<any>(null);

    const handleMouseDown = (e: any) => {
        const pos = e.target.getStage().getPointerPosition();
        if (!pos) return;

        if (activeTool === "pen") {
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
        if (!pos) return;

        if (isDrawing && activeTool === "pen") {
            setCurrentLine((prevLine) => [...prevLine, { x: pos.x, y: pos.y, color: brushColor, width: brushWidth }]);
        } else if (activeTool === "rectangle" || activeTool === "ellipse" || activeTool === "line") {
            const lastShape = shapes[shapes.length - 1];
            if (!lastShape) return;

            if (activeTool === "rectangle" && lastShape.type === "rect") {
                const updatedRect = { ...lastShape, width: pos.x - lastShape.x, height: pos.y - lastShape.y };
                setShapes([...shapes.slice(0, -1), updatedRect]);
            } else if (activeTool === "ellipse" && lastShape.type === "ellipse") {
                const updatedEllipse = { ...lastShape, radiusX: Math.abs(pos.x - lastShape.x), radiusY: Math.abs(pos.y - lastShape.y) };
                setShapes([...shapes.slice(0, -1), updatedEllipse]);
            } else if (activeTool === "line" && lastShape.type === "line") {
                const updatedLine = { ...lastShape, points: [lastShape.points[0], lastShape.points[1], pos.x, pos.y] };
                setShapes([...shapes.slice(0, -1), updatedLine]);
            }
        }
    };

    const handleMouseUp = () => {
        if (isDrawing) {
            setLines([...lines, currentLine]);
            setCurrentLine([]);
            setIsDrawing(false);
        }
    };

    const changeTool = (tool: "pen" | "rectangle" | "ellipse" | "line") => {
        setActiveTool(tool);
    };

    const changeColor = (color: string) => {
        setBrushColor(color);
    };

    const changeBrushWidth = (width: number) => {
        setBrushWidth(width);
    };

    const undo = () => {
        setLines(lines.slice(0, -1));
    };

    const clearCanvas = () => {
        setLines([]);
        setShapes([]);
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-4 bg-gray-100">
            {/* Toolbar */}
            <div className="w-full bg-[#e4e4e4] p-4 flex justify-between items-center rounded-t-xl shadow-lg">
                <div className="flex gap-4">
                    <button onClick={() => changeTool("pen")} className={`p-3 text-black ${activeTool === "pen" ? "bg-[#f1f1f1]" : "bg-[#e0e0e0]"} rounded-lg`}>
                        Pen
                    </button>
                    <button onClick={() => changeTool("rectangle")} className={`p-3 text-black ${activeTool === "rectangle" ? "bg-[#f1f1f1]" : "bg-[#e0e0e0]"} rounded-lg`}>
                        Rectangle
                    </button>
                    <button onClick={() => changeTool("ellipse")} className={`p-3 text-black ${activeTool === "ellipse" ? "bg-[#f1f1f1]" : "bg-[#e0e0e0]"} rounded-lg`}>
                        Ellipse
                    </button>
                    <button onClick={() => changeTool("line")} className={`p-3 text-black ${activeTool === "line" ? "bg-[#f1f1f1]" : "bg-[#e0e0e0]"} rounded-lg`}>
                        Line
                    </button>
                    <input type="color" value={brushColor} onChange={(e) => changeColor(e.target.value)} className="w-10 h-10 border-none rounded-full" />
                </div>
                <div className="flex gap-4">
                    <input type="range" min={1} max={50} value={brushWidth} onChange={(e) => changeBrushWidth(Number(e.target.value))} className="w-40" />
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
                                        x={shape.x}
                                        y={shape.y}
                                        width={shape.width}
                                        height={shape.height}
                                        stroke={shape.color}
                                        strokeWidth={shape.strokeWidth}
                                    />
                                );
                            } else if (shape.type === "ellipse") {
                                return (
                                    <Ellipse
                                        key={index}
                                        x={shape.x}
                                        y={shape.y}
                                        radiusX={shape.radiusX}
                                        radiusY={shape.radiusY}
                                        stroke={shape.color}
                                        strokeWidth={shape.strokeWidth}
                                    />
                                );
                            } else if (shape.type === "line") {
                                return (
                                    <Line
                                        key={index}
                                        points={shape.points}
                                        stroke={shape.color}
                                        strokeWidth={shape.strokeWidth}
                                    />
                                );
                            }
                        })}

                        {/* Draw the current line while it's being drawn */}
                        {isDrawing && currentLine.length > 0 && (
                            <Line
                                points={currentLine.flatMap((p) => [p.x, p.y])}
                                stroke={currentLine[0].color}
                                strokeWidth={currentLine[0].width}
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