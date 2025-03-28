import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

export default function Paint() {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const [isDrawing, setIsDrawing] = useState(true);
    const [lineColor, setLineColor] = useState("#000000");
    const [lineWidth, setLineWidth] = useState(5);

    useEffect(() => {
        if (!canvasRef.current) return; // Ensure canvasRef is assigned

        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
            isDrawingMode: true,
            backgroundColor: "#fff",
        });

        // Enable drawing mode after canvas initialization
        fabricCanvas.isDrawingMode = true;

        // Set canvas size to full window size
        fabricCanvas.setWidth(window.innerWidth);
        fabricCanvas.setHeight(window.innerHeight);

        // Access the freeDrawingBrush after canvas is ready
        const brush = fabricCanvas.freeDrawingBrush;
        if (brush) {
            brush.color = lineColor;
            brush.width = lineWidth;
        }

        setCanvas(fabricCanvas);

        // Resize canvas when window size changes
        const handleResize = () => {
            fabricCanvas.setWidth(window.innerWidth);
            fabricCanvas.setHeight(window.innerHeight);
            fabricCanvas.renderAll();
        };

        window.addEventListener("resize", handleResize);

        return () => {
            fabricCanvas.dispose(); // Cleanup on unmount
            window.removeEventListener("resize", handleResize); // Remove resize listener
        };
    }, []); // Only run once when component mounts

    const toggleDrawMode = () => {
        if (canvas) {
            canvas.isDrawingMode = !canvas.isDrawingMode;
            setIsDrawing(canvas.isDrawingMode);
        }
    };

    const clearCanvas = () => {
        if (canvas) {
            canvas.clear();
            canvas.setBackgroundColor("#fff", canvas.renderAll.bind(canvas)); // Ensure background remains white
        }
    };

    const changeColor = (color: string) => {
        if (canvas && canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = color;
            setLineColor(color);
        }
    };

    const changeLineWidth = (width: number) => {
        if (canvas && canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.width = width;
            setLineWidth(width);
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-4 bg-gray-100">
            <div className="flex gap-2 mb-4">
                <button
                    onClick={toggleDrawMode}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {isDrawing ? "Disable Draw Mode" : "Enable Draw Mode"}
                </button>
                <button
                    onClick={clearCanvas}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Clear Canvas
                </button>
            </div>

            {/* Drawing Options */}
            <div className="flex gap-4 mb-4">
                <div>
                    <label htmlFor="colorPicker" className="block mb-2">Line Color</label>
                    <input
                        id="colorPicker"
                        type="color"
                        value={lineColor}
                        onChange={(e) => changeColor(e.target.value)}
                        className="w-12 h-12 border-2 border-gray-300 rounded"
                    />
                </div>

                <div>
                    <label htmlFor="lineWidth" className="block mb-2">Line Width</label>
                    <input
                        id="lineWidth"
                        type="range"
                        min="1"
                        max="20"
                        value={lineWidth}
                        onChange={(e) => changeLineWidth(parseInt(e.target.value))}
                        className="w-32"
                    />
                </div>
            </div>

            {/* Canvas will now fill the entire window */}
            <canvas ref={canvasRef} className="border w-full h-full" />
        </div>
    );
}