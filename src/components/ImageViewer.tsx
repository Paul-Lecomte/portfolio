import { useState } from "react";

const ImageViewer = ({ imageUrl, onClose }: any) => {
    const [zoom, setZoom] = useState(1);

    const handleZoomIn = () => setZoom((prev) => prev + 0.1);
    const handleZoomOut = () => setZoom((prev) => Math.max(0.1, prev - 0.1));

    return (
        <div className="w-full h-full bg-gray-800 p-4 rounded-lg flex items-center justify-center">
            <div className="relative">
                <img
                    src={imageUrl}
                    alt="Image Viewer"
                    style={{ transform: `scale(${zoom})` }}
                    className="rounded-lg"
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                    <button onClick={handleZoomIn} className="bg-gray-700 text-white p-2 rounded-full">+</button>
                    <button onClick={handleZoomOut} className="bg-gray-700 text-white p-2 rounded-full">-</button>
                </div>
                <button onClick={onClose} className="absolute top-2 left-2 bg-red-500 text-white p-2 rounded-full">X</button>
            </div>
        </div>
    );
};

export default ImageViewer;
