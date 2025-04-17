import { useState, useEffect } from "react";

const ImageViewer = ({ onClose }: any) => {
    const [zoom, setZoom] = useState(1);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fetch the fileUrl from localStorage
    const fileUrl = JSON.parse(localStorage.getItem("currentFile") || '{}')?.fileUrl;

    const handleZoomIn = () => setZoom((prev) => prev + 0.1);
    const handleZoomOut = () => setZoom((prev) => Math.max(0.1, prev - 0.1));

    // Function to handle fetching binary image data
    useEffect(() => {
        const fetchImage = async () => {
            if (!fileUrl) {
                setError("No file URL provided.");
                return;
            }
            try {
                // Fetch the image file content as binary data (blob)
                const response = await fetch(fileUrl);
                if (!response.ok) {
                    throw new Error("Failed to load image");
                }

                // Convert the response to a blob (binary data)
                const blob = await response.blob();

                // Create a URL from the blob
                const url = URL.createObjectURL(blob);
                setImageSrc(url);
            } catch (error) {
                setError(`Error fetching image: ${error.message}`);
                console.error("Error fetching image:", error);
            }
        };

        fetchImage();
    }, [fileUrl]);

    // Modify onClose function to clear localStorage
    const handleClose = () => {
        localStorage.clear();
        onClose();
    };

    return (
        <div className="w-full h-full bg-gray-800 p-4 rounded-lg flex items-center justify-center">
            <div className="relative">
                {error ? (
                    <p className="text-red-500">{error}</p>
                ) : imageSrc ? (
                    <img
                        src={imageSrc}
                        alt="Image Viewer"
                        style={{ transform: `scale(${zoom})` }}
                        className="rounded-lg"
                    />
                ) : (
                    <p className="text-white">Loading image...</p>
                )}
                <div className="absolute top-2 right-2 flex space-x-2">
                    <button onClick={handleZoomIn} className="bg-gray-700 text-white p-2 rounded-full">+</button>
                    <button onClick={handleZoomOut} className="bg-gray-700 text-white p-2 rounded-full">-</button>
                </div>
                <div className="absolute top-2 left-2">
                    <button
                        onClick={handleClose}
                        className="bg-red-600 text-white p-2 rounded-full"
                    >
                        ✖
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageViewer;