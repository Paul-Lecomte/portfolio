import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

export default function Paint() {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [brushColor, setBrushColor] = useState("#000000");
    const [brushWidth, setBrushWidth] = useState(5);
    const [activeTool, setActiveTool] = useState("pen");
    const [history, setHistory] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Initialize fabric canvas
    useEffect(() => {
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
            backgroundColor: '#ffffff',
            isDrawingMode: true,
            selection: false,
        });

        fabricCanvas.setWidth(800); // Canvas Width
        fabricCanvas.setHeight(600); // Canvas Height

        fabricCanvas.on('object:modified', () => {
            saveState();
        });

        setCanvas(fabricCanvas);

        const handleResize = () => {
            fabricCanvas.setWidth(window.innerWidth - 40);
            fabricCanvas.setHeight(window.innerHeight - 100);
            fabricCanvas.renderAll();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            fabricCanvas.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Save state for undo/redo
    const saveState = () => {
        if (canvas) {
            const canvasState = canvas.toJSON();
            const newHistory = history.slice(0, currentIndex + 1);
            newHistory.push(canvasState);
            setHistory(newHistory);
            setCurrentIndex(newHistory.length - 1);
        }
    };

    // Undo action
    const undo = () => {
        if (currentIndex > 0) {
            const prevState = history[currentIndex - 1];
            canvas?.loadFromJSON(prevState, () => canvas?.renderAll());
            setCurrentIndex(currentIndex - 1);
        }
    };

    // Redo action
    const redo = () => {
        if (currentIndex < history.length - 1) {
            const nextState = history[currentIndex + 1];
            canvas?.loadFromJSON(nextState, () => canvas?.renderAll());
            setCurrentIndex(currentIndex + 1);
        }
    };

    // Clear the canvas
    const clearCanvas = () => {
        if (canvas) {
            canvas.clear();
            canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
        }
    };

    // Change the active tool (Pen, Eraser, Shapes)
    const changeTool = (tool: string) => {
        setActiveTool(tool);
        if (canvas) {
            const brush = canvas.freeDrawingBrush;
            if (tool === 'pen') {
                canvas.isDrawingMode = true;
                brush.color = brushColor;
                brush.width = brushWidth;
            } else if (tool === 'eraser') {
                canvas.isDrawingMode = true;
                brush.color = '#ffffff'; // Eraser is white
                brush.width = 20; // Eraser size
            } else {
                canvas.isDrawingMode = false;
            }
        }
    };

    // Change brush color
    const changeColor = (color: string) => {
        setBrushColor(color);
        if (canvas && canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = color;
        }
    };

    // Change brush width
    const changeBrushWidth = (width: number) => {
        setBrushWidth(width);
        if (canvas && canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.width = width;
        }
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
                        onClick={() => changeTool("fill")}
                        className={`p-3 text-black ${activeTool === "fill" ? "bg-[#f1f1f1]" : "bg-[#e0e0e0]"} rounded-lg`}
                    >
                        Fill
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
                    {/* Undo/Redo Buttons */}
                    <button onClick={undo} className="px-4 py-2 bg-[#f0f0f0] text-black rounded-lg">Undo</button>
                    <button onClick={redo} className="px-4 py-2 bg-[#f0f0f0] text-black rounded-lg">Redo</button>
                    <button onClick={clearCanvas} className="px-4 py-2 bg-[#ff0000] text-white rounded-lg">Clear</button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex justify-center mt-4">
                <canvas ref={canvasRef} className="border bg-white w-full h-full rounded-lg" />
            </div>
        </div>
    );
}