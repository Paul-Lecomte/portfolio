import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

export default function Paint() {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const [isDrawing, setIsDrawing] = useState(true);

    useEffect(() => {
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
            isDrawingMode: true,
            backgroundColor: "#fff",
        });
        setCanvas(fabricCanvas);

        return () => fabricCanvas.dispose();
    }, []);

    const toggleDrawMode = () => {
        if (canvas) {
            canvas.isDrawingMode = !canvas.isDrawingMode;
            setIsDrawing(canvas.isDrawingMode);
        }
    };

    const clearCanvas = () => {
        if (canvas) {
            canvas.clear();
            canvas.backgroundColor = "#fff";
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-4 bg-gray-100">
            <div className="flex gap-2 mb-2">
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
            <canvas ref={canvasRef} className="border w-full h-[500px]" />
        </div>
    );
}