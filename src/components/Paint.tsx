import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Button } from "@/components/ui/button";

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
                <Button onClick={toggleDrawMode}>
                    {isDrawing ? "Disable Draw Mode" : "Enable Draw Mode"}
                </Button>
                <Button onClick={clearCanvas} variant="destructive">
                    Clear Canvas
                </Button>
            </div>
            <canvas ref={canvasRef} className="border w-full h-[500px]" />
        </div>
    );
}
