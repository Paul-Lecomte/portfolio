import { useEffect, useRef, useState } from 'react';
import * as fabric from 'fabric';

export default function Paint() {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushColor, setBrushColor] = useState("#000000");
    const [brushWidth, setBrushWidth] = useState(5);
    const [activeTool, setActiveTool] = useState("pen"); // Active tool (pen, eraser)

    // Initialize the fabric canvas
    useEffect(() => {
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
            backgroundColor: '#ffffff',
            isDrawingMode: true, // Set drawing mode initially
        });

        fabricCanvas.setWidth(800);  // Set a fixed width (adjust as needed)
        fabricCanvas.setHeight(600); // Set a fixed height (adjust as needed)

        // Set the default brush
        const brush = fabricCanvas.freeDrawingBrush;
        if (brush) {
            brush.color = brushColor;
            brush.width = brushWidth;
        }

        setCanvas(fabricCanvas);

        // Handle resize
        const handleResize = () => {
            fabricCanvas.setWidth(window.innerWidth - 40); // Allow space for toolbar
            fabricCanvas.setHeight(window.innerHeight - 100); // Allow space for toolbar
            fabricCanvas.renderAll();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            fabricCanvas.dispose();
            window.removeEventListener('resize', handleResize);
        };
    }, [brushColor, brushWidth]);

    // Toggle Drawing Mode
    const toggleDrawingMode = () => {
        if (canvas) {
            canvas.isDrawingMode = !canvas.isDrawingMode;
            setIsDrawing(canvas.isDrawingMode);
        }
    };

    // Change the active tool (pen or eraser)
    const changeTool = (tool: string) => {
        setActiveTool(tool);
        if (canvas) {
            if (tool === 'pen') {
                canvas.isDrawingMode = true;
                const brush = canvas.freeDrawingBrush;
                if (brush) {
                    brush.color = brushColor;
                    brush.width = brushWidth;
                }
            } else if (tool === 'eraser') {
                canvas.isDrawingMode = true;
                const brush = canvas.freeDrawingBrush;
                if (brush) {
                    brush.color = '#ffffff'; // Eraser is white
                    brush.width = 20; // Eraser size
                }
            }
        }
    };

    // Clear the canvas
    const clearCanvas = () => {
        if (canvas) {
            canvas.clear();
            canvas.setBackgroundColor('#ffffff', canvas.renderAll.bind(canvas));
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
            {/* Toolbar Section */}
            <div className="w-full bg-gray-800 p-4 flex justify-between items-center">
                <div className="flex gap-4">
                    {/* Pen Tool */}
                    <button
                        onClick={() => changeTool("pen")}
                        className={`px-4 py-2 text-white ${activeTool === "pen" ? "bg-blue-600" : "bg-gray-500"} rounded`}
                    >
                        Pen
                    </button>

                    {/* Eraser Tool */}
                    <button
                        onClick={() => changeTool("eraser")}
                        className={`px-4 py-2 text-white ${activeTool === "eraser" ? "bg-blue-600" : "bg-gray-500"} rounded`}
                    >
                        Eraser
                    </button>

                    {/* Color Picker */}
                    <input
                        type="color"
                        value={brushColor}
                        onChange={(e) => changeColor(e.target.value)}
                        className="w-12 h-12 border-2 border-gray-300 rounded"
                    />
                </div>

                <div className="flex gap-4">
                    {/* Brush Width Slider */}
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={brushWidth}
                        onChange={(e) => changeBrushWidth(Number(e.target.value))}
                        className="w-32"
                    />

                    {/* Clear Canvas Button */}
                    <button
                        onClick={clearCanvas}
                        className="px-4 py-2 bg-red-500 text-white rounded"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div className="flex justify-center mt-6">
                <canvas ref={canvasRef} className="border w-full h-full" />
            </div>
        </div>
    );
}